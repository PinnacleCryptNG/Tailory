import React from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, BookOpen, ArrowRight, ArrowLeft, MessageSquareHeart } from 'lucide-react';
import { DogProfile, DogMemories } from '../types';
import { sound } from '../utils/audio';

interface MemoryCollectionProps {
  profile: DogProfile;
  memories: DogMemories;
  setMemories: React.Dispatch<React.SetStateAction<DogMemories>>;
  onBack: () => void;
  onSubmit: () => void;
  isGenerating: boolean;
}

export const MemoryCollection: React.FC<MemoryCollectionProps> = ({
  profile,
  memories,
  setMemories,
  onBack,
  onSubmit,
  isGenerating,
}) => {
  const updateMemory = (key: keyof DogMemories, value: string) => {
    setMemories((prev) => ({ ...prev, [key]: value }));
  };

  const isReady =
    memories.meeting.trim().length > 5 &&
    memories.favourite.trim().length > 5 &&
    memories.funny.trim().length > 5 &&
    memories.message.trim().length > 3;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#fef3c7] text-[#92400e] border border-[#fde68a] mb-3">
          Step 4 of 5 • Storycraft
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#1b382b] mb-2">
          Every good dog deserves a story.
        </h1>
        <p className="text-base text-[#695d4d]">
          Tell us about the moments that made {profile.name} yours.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Question 1: How they met */}
        <div className="bg-[#fffdf9] p-5 sm:p-7 rounded-3xl border border-[#e5dcce] shadow-xs">
          <label className="block font-bold text-base text-[#1b382b] mb-1">
            1. How did you and {profile.name} first meet?
          </label>
          <p className="text-xs text-[#7d705f] mb-3">
            The adoption shelter, a rainy morning puppy pickup, or the first instant their eyes met yours.
          </p>
          <textarea
            value={memories.meeting}
            onChange={(e) => updateMemory('meeting', e.target.value)}
            placeholder={`e.g. We went to the rescue fair; ${profile.name} crawled out from under a wooden bench, rested their chin on my shoe, and refused to leave with anyone else.`}
            rows={3}
            maxLength={2000}
            className="w-full p-3.5 rounded-xl border border-[#d8ccba] bg-[#faf6ee]/70 text-sm text-[#1b382b] focus:outline-none focus:ring-2 focus:ring-[#1b382b]/30 focus:border-[#1b382b]"
            id="memory-meeting-textarea"
          />
        </div>

        {/* Question 2: Unforgettable moment */}
        <div className="bg-[#fffdf9] p-5 sm:p-7 rounded-3xl border border-[#e5dcce] shadow-xs">
          <label className="block font-bold text-base text-[#1b382b] mb-1">
            2. What’s a moment with {profile.name} you’ll never forget?
          </label>
          <p className="text-xs text-[#7d705f] mb-3">
            A road trip, a day at the beach, an afternoon in the snow, or a quiet sunset on the porch.
          </p>
          <textarea
            value={memories.favourite}
            onChange={(e) => updateMemory('favourite', e.target.value)}
            placeholder={`e.g. The autumn afternoon we walked around the lake and ${profile.name} discovered fallen leaves for the first time, leaping into every pile like a joyful gymnast.`}
            rows={3}
            maxLength={2000}
            className="w-full p-3.5 rounded-xl border border-[#d8ccba] bg-[#faf6ee]/70 text-sm text-[#1b382b] focus:outline-none focus:ring-2 focus:ring-[#1b382b]/30 focus:border-[#1b382b]"
            id="memory-favourite-textarea"
          />
        </div>

        {/* Question 3: What makes you laugh */}
        <div className="bg-[#fffdf9] p-5 sm:p-7 rounded-3xl border border-[#e5dcce] shadow-xs">
          <label className="block font-bold text-base text-[#1b382b] mb-1">
            3. What does {profile.name} do that always makes you laugh?
          </label>
          <p className="text-xs text-[#7d705f] mb-3">
            A bizarre sleeping contortion, dramatic grumbles, or the special dance before dinner.
          </p>
          <textarea
            value={memories.funny}
            onChange={(e) => updateMemory('funny', e.target.value)}
            placeholder={`e.g. Whenever someone crinkles the cheese wrapper in the kitchen, ${profile.name} teleports from a dead sleep in the other room in 0.3 seconds flat.`}
            rows={3}
            maxLength={2000}
            className="w-full p-3.5 rounded-xl border border-[#d8ccba] bg-[#faf6ee]/70 text-sm text-[#1b382b] focus:outline-none focus:ring-2 focus:ring-[#1b382b]/30 focus:border-[#1b382b]"
            id="memory-funny-textarea"
          />
        </div>

        {/* Question 4: One message */}
        <div className="bg-[#fffdf9] p-5 sm:p-7 rounded-3xl border border-[#e5dcce] shadow-xs">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquareHeart className="w-4 h-4 text-[#db2777]" />
            <label className="block font-bold text-base text-[#1b382b]">
              4. If {profile.name} could understand one thing you said, what would it be?
            </label>
          </div>
          <p className="text-xs text-[#7d705f] mb-3">
            A heartfelt sentence straight from your heart.
          </p>
          <textarea
            value={memories.message}
            onChange={(e) => updateMemory('message', e.target.value)}
            placeholder={`e.g. You made our house feel like a warm, happy home, and we love you more than words can say.`}
            rows={2}
            maxLength={1000}
            className="w-full p-3.5 rounded-xl border border-[#d8ccba] bg-[#faf6ee]/70 text-sm text-[#1b382b] focus:outline-none focus:ring-2 focus:ring-[#1b382b]/30 focus:border-[#1b382b]"
            id="memory-message-textarea"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => {
              sound.playChime('pop');
              onBack();
            }}
            className="px-5 py-3.5 rounded-2xl font-semibold text-sm text-[#615647] hover:bg-[#eae0cf] transition-colors flex items-center gap-2 cursor-pointer"
            id="memory-back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            disabled={!isReady || isGenerating}
            onClick={() => {
              sound.playChime('sparkle');
              onSubmit();
            }}
            className={`px-8 py-4 rounded-2xl font-bold text-base flex items-center gap-3 transition-all cursor-pointer ${
              isReady && !isGenerating
                ? 'bg-[#1b382b] hover:bg-[#254d3c] text-[#faf6ee] shadow-md hover:shadow-lg'
                : 'bg-[#e4dbca] text-[#938776] cursor-not-allowed'
            }`}
            id="generate-story-btn"
          >
            <Sparkles className="w-5 h-5 text-[#f59e0b]" />
            <span>{isGenerating ? 'Weaving Story with Google AI...' : `Create ${profile.name}’s Story`}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
