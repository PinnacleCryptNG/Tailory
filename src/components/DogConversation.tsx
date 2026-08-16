import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Volume2, Sparkles, BookOpen, VolumeX, MessageSquareQuote, ArrowRight, RotateCcw } from 'lucide-react';
import { DogProfile, ChatMessage } from '../types';
import { sound } from '../utils/audio';
import { generateCanineResponse } from '../utils/conversationEngine';

interface DogConversationProps {
  profile: DogProfile;
  onProceedToStory: () => void;
}

const SUGGESTED_PROMPTS = [
  "Why did you steal my socks?",
  "What do you do when I leave for work?",
  "Who is the goodest boy in the world?",
  "What are you dreaming about when your paws twitch?",
  "Why do you bark at the mail carrier?"
];

export const DogConversation: React.FC<DogConversationProps> = ({
  profile,
  onProceedToStory,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      role: 'dog',
      content: profile.greetingMessage || `Hello my human! Ask me anything—though I make zero legal guarantees about slipper accusations.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [dogReaction, setDogReaction] = useState<'idle' | 'talking' | 'listening' | 'happy'>('idle');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSpeakMessage = async (msg: ChatMessage) => {
    if (speakingMsgId === msg.id) {
      sound.stopCurrent();
      setSpeakingMsgId(null);
      setDogReaction('idle');
      return;
    }

    setSpeakingMsgId(msg.id);
    setDogReaction('talking');
    sound.playChime('pop');

    // Try fetching ElevenLabs voice audio from server
    let audioUrl = msg.audioUrl;
    if (!audioUrl) {
      try {
        const res = await fetch('/api/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: msg.content }),
        });
        const data = await res.json();
        if (data.audioUrl) {
          audioUrl = data.audioUrl;
          msg.audioUrl = audioUrl;
        }
      } catch (e) {
        console.warn('Voice API request error, falling back to speech synthesis:', e);
      }
    }

    await sound.speakText(
      msg.content,
      audioUrl,
      () => {
        setSpeakingMsgId(msg.id);
        setDogReaction('talking');
      },
      () => {
        setSpeakingMsgId(null);
        setDogReaction('happy');
        setTimeout(() => setDogReaction('idle'), 1500);
      }
    );
  };

  const handleSend = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isThinking) return;

    sound.playChime('pop');
    setInput('');
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    setDogReaction('listening');

    try {
      let reply = '';
      try {
        const response = await fetch('/api/conversation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dog: profile,
            message: messageText,
            history: messages,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.reply) {
            reply = data.reply;
          }
        }
      } catch (netErr) {
        console.warn('Backend API unavailable, using client canine response engine:', netErr);
      }

      if (!reply) {
        reply = generateCanineResponse({
          dog: profile,
          message: messageText,
          history: messages,
        });
      }

      const dogMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'dog',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, dogMsg]);
      setIsThinking(false);
      setDogReaction('happy');

      // Auto play speech for an immersive canine voice experience
      setTimeout(() => {
        handleSpeakMessage(dogMsg);
      }, 300);
    } catch (err) {
      console.error('Conversation error:', err);
      const fallbackReply = generateCanineResponse({
        dog: profile,
        message: messageText,
        history: messages,
      });
      setIsThinking(false);
      setDogReaction('happy');
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'dog',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setTimeout(() => {
        handleSpeakMessage(fallbackMsg);
      }, 300);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#eef5f0] text-[#1b382b] border border-[#c6dfd1] mb-2">
          Step 4 of 5 • Spoken Companion
        </span>
        <h1 className="text-2xl sm:text-4xl font-display font-bold text-[#1b382b]">
          Go on. Ask {profile.name} something.
        </h1>
        <p className="text-xs sm:text-sm text-[#736857] mt-1">
          We can’t promise they’ll tell the whole truth.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Interactive Dog Companion Stage */}
        <div className="lg:col-span-5 bg-[#fffdf9] p-5 rounded-3xl border border-[#e5dcce] shadow-xs flex flex-col items-center text-center">
          {/* Animated Avatar */}
          <div className="relative mb-4">
            <motion.div
              animate={
                dogReaction === 'talking'
                  ? { y: [0, -6, 0], rotate: [0, -1, 1, 0] }
                  : dogReaction === 'happy'
                  ? { rotate: [0, -3, 3, 0], scale: [1, 1.03, 1] }
                  : { y: [0, -2, 0] }
              }
              transition={{ duration: dogReaction === 'talking' ? 0.4 : 2, repeat: Infinity }}
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-[#1b382b] shadow-md relative"
            >
              <img
                src={profile.image}
                alt={profile.name}
                className="w-full h-full object-cover"
              />

              {/* Soundwaves overlay if speaking */}
              {dogReaction === 'talking' && (
                <div className="absolute inset-0 bg-[#1b382b]/30 backdrop-blur-xs flex items-center justify-center">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-6 bg-[#f59e0b] rounded-full animate-bounce" />
                    <span className="w-1.5 h-10 bg-[#faf6ee] rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-7 bg-[#f59e0b] rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Trait Pill */}
            <div className="mt-2 text-xs font-bold text-[#1b382b] bg-[#eef5f0] border border-[#c4ded0] px-3 py-1 rounded-full inline-block">
              {profile.personality.signatureTrait}
            </div>
          </div>

          <h3 className="font-display font-bold text-lg text-[#1b382b]">{profile.name}</h3>
          <p className="text-xs text-[#7d7160] max-w-xs mb-4">
            Powered by Google AI personality & ElevenLabs voice engine.
          </p>

          {/* Quick Starters */}
          <div className="w-full text-left pt-3 border-t border-[#eee5d5]">
            <span className="text-[11px] font-bold text-[#8c7f6e] uppercase tracking-wider block mb-2">
              Suggested Questions:
            </span>
            <div className="flex flex-col gap-1.5">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  disabled={isThinking}
                  className="text-left text-xs p-2 rounded-xl bg-[#faf6ee] hover:bg-[#f0e7d5] text-[#332b20] border border-[#e8ded0] transition-colors cursor-pointer"
                  id={`suggested-prompt-${prompt.slice(0, 10).toLowerCase().replace(/\s+/g, '-')}`}
                >
                  💬 {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Conversation Flow */}
        <div className="lg:col-span-7 flex flex-col h-[520px] bg-[#fffdf9] rounded-3xl border border-[#e5dcce] shadow-xs overflow-hidden">
          {/* Messages list */}
          <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5">
            {messages.map((msg) => {
              const isDog = msg.role === 'dog';
              const isSpeaking = speakingMsgId === msg.id;

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${isDog ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 shadow-xs text-sm ${
                      isDog
                        ? 'bg-[#faf6ee] text-[#1b382b] border border-[#e6dbc8] rounded-tl-xs'
                        : 'bg-[#1b382b] text-[#faf6ee] rounded-tr-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="font-bold text-xs opacity-75">
                        {isDog ? profile.name : 'You'}
                      </span>
                      <span className="text-[10px] opacity-60">{msg.timestamp}</span>
                    </div>

                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                    {/* Dog Voice Play Button */}
                    {isDog && (
                      <div className="mt-2.5 pt-2 border-t border-[#e8dfcf] flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleSpeakMessage(msg)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                            isSpeaking
                              ? 'bg-[#f59e0b] text-[#1b382b]'
                              : 'bg-[#1b382b] hover:bg-[#254d3c] text-[#faf6ee]'
                          }`}
                          id={`hear-msg-${msg.id}`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isSpeaking ? `${profile.name} is talking…` : `Hear ${profile.name}`}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Thinking indicator */}
            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-[#786b59] p-3 bg-[#faf6ee] rounded-2xl max-w-xs border border-[#e8dfcf]">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#1b382b] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#1b382b] animate-bounce [animation-delay:0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-[#1b382b] animate-bounce [animation-delay:0.3s]" />
                </div>
                <span>{profile.name} is thinking of a very good answer…</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#f8f4ec] border-t border-[#e8ded0]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask ${profile.name} something...`}
                maxLength={1000}
                className="flex-1 px-4 py-3 text-sm rounded-xl border border-[#d8ccb9] bg-white text-[#1b382b] placeholder-[#a69986] focus:outline-none focus:ring-2 focus:ring-[#1b382b]/30"
                id="conversation-input"
              />
              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                className="px-4 py-3 bg-[#1b382b] hover:bg-[#254d3c] text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                id="conversation-send-btn"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Ask</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom CTA to move to Story */}
      <div className="mt-8 pt-6 border-t border-[#e8ded0] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#7a6d5c]">
          Ready to capture {profile.name}’s memorable moments forever?
        </div>

        <button
          onClick={() => {
            sound.playChime('sparkle');
            onProceedToStory();
          }}
          className="w-full sm:w-auto px-7 py-3.5 bg-[#1b382b] hover:bg-[#254d3c] text-[#faf6ee] font-bold text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          id="proceed-to-story-btn"
        >
          <BookOpen className="w-4 h-4 text-[#f59e0b]" />
          <span>Write {profile.name}’s Dog Day Story</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
