import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Volume2, Sparkles, Award, ArrowRight, Share2, Copy, Check } from 'lucide-react';
import { DogProfile, DogStory } from '../types';
import { sound } from '../utils/audio';

interface DogStoryViewProps {
  profile: DogProfile;
  story: DogStory;
  onProceedToKeepsake: () => void;
}

export const DogStoryView: React.FC<DogStoryViewProps> = ({
  profile,
  story,
  onProceedToKeepsake,
}) => {
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReadAloud = () => {
    if (isReadingAloud) {
      sound.stopCurrent();
      setIsReadingAloud(false);
      return;
    }

    const fullNarrative = `${story.title}. ${story.subtitle}. ${story.paragraphs.join(' ')} ${story.closing}`;
    sound.playChime('pop');
    sound.speakText(
      fullNarrative,
      undefined,
      () => setIsReadingAloud(true),
      () => setIsReadingAloud(false)
    );
  };

  const handleCopyStory = () => {
    const text = `${story.title}\n${story.subtitle}\n\n${story.paragraphs.join('\n\n')}\n\n"${story.pullQuote}"\n\n${story.closing}\n\n— A TAILORY Dog Day Story`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    sound.playChime('success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#eef5f0] text-[#1b382b] border border-[#bedecb] mb-3">
          International Dog Day Story
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-[#1b382b] tracking-tight mb-2">
          {story.title}
        </h1>
        <p className="text-base sm:text-lg text-[#695c4c] italic max-w-xl mx-auto">
          {story.subtitle}
        </p>
      </div>

      {/* Storybook Paper Container */}
      <motion.article
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#fffdf9] p-6 sm:p-10 rounded-3xl border border-[#e5dcce] shadow-sm relative space-y-6"
      >
        {/* Story Controls Toolbar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#eee5d5] text-xs">
          <div className="flex items-center gap-2 font-medium text-[#7d705f]">
            <span>🐾 Dedicated to {profile.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReadAloud}
              className={`px-3 py-1.5 rounded-full font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isReadingAloud
                  ? 'bg-[#e5a93c] text-[#1b382b] animate-pulse'
                  : 'bg-[#faf6ee] hover:bg-[#f0e8d5] text-[#1b382b] border border-[#e0d5bf]'
              }`}
              id="story-read-aloud-btn"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isReadingAloud ? 'Reading Story…' : 'Listen Aloud'}</span>
            </button>

            <button
              onClick={handleCopyStory}
              className="p-1.5 rounded-full bg-[#faf6ee] hover:bg-[#f0e8d5] text-[#736554] border border-[#e0d5bf] transition-colors cursor-pointer"
              title="Copy story text"
              id="story-copy-btn"
            >
              {copied ? <Check className="w-4 h-4 text-[#10b981]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Narrative Paragraphs with Drop-Cap Styling */}
        <div className="space-y-5 text-[#2c2419] text-base sm:text-lg leading-relaxed font-normal">
          {story.paragraphs.map((para, idx) => (
            <p key={idx} className={idx === 0 ? 'first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:text-[#1b382b] first-letter:mr-2 first-letter:float-left' : ''}>
              {para}
            </p>
          ))}
        </div>

        {/* Pull Quote Callout */}
        {story.pullQuote && (
          <div className="my-8 p-6 rounded-2xl bg-[#faf6ee] border-l-4 border-[#1b382b] shadow-xs text-center">
            <p className="font-display text-lg sm:text-xl font-bold text-[#1b382b] italic">
              “{story.pullQuote}”
            </p>
          </div>
        )}

        {/* Heartfelt Closing Note */}
        {story.closing && (
          <div className="pt-4 border-t border-[#eee5d5] text-center">
            <p className="text-sm sm:text-base font-semibold text-[#8c7457] italic">
              {story.closing}
            </p>
          </div>
        )}
      </motion.article>

      {/* Primary Bottom Action */}
      <div className="mt-8 text-center">
        <button
          onClick={() => {
            sound.playChime('sparkle');
            onProceedToKeepsake();
          }}
          className="w-full sm:w-auto px-10 py-4 bg-[#1b382b] hover:bg-[#254d3c] text-[#faf6ee] font-bold text-base sm:text-lg rounded-2xl shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center gap-3 cursor-pointer"
          id="create-keepsake-btn"
        >
          <Award className="w-5 h-5 text-[#f59e0b]" />
          <span>Create {profile.name}’s Dog Day Keepsake Card</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
