import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Heart, Volume2, ShieldCheck, BookOpen, Compass, ChevronRight, Download, Image as ImageIcon, Video } from 'lucide-react';
import { PRESET_DOGS, PresetDog } from '../data/presets';
import { sound } from '../utils/audio';
import { generateDevToCoverImage } from '../utils/bannerExport';

interface LandingPageProps {
  onStart: () => void;
  onSelectPreset: (preset: PresetDog) => void;
  onOpenKingdomStats: () => void;
  onOpenVideoStudio?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onSelectPreset,
  onOpenKingdomStats,
  onOpenVideoStudio,
}) => {
  const [isWagging, setIsWagging] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'how-it-works'>('overview');

  const triggerDogReaction = () => {
    setIsWagging(true);
    sound.playChime('bark-tone');
    setTimeout(() => setIsWagging(false), 1200);
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] flex flex-col justify-between overflow-hidden">
      {/* Whimsical Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft sun / warm halo */}
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#fde68a]/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-[#bae6fd]/25 rounded-full blur-3xl" />

        {/* Floating animated clouds */}
        <motion.div
          animate={{ x: [0, 25, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-12 left-10 text-4xl opacity-40 select-none"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: [0, -35, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-16 text-3xl opacity-35 select-none"
        >
          ☁️
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 pb-12 w-full relative z-10">
        {/* Top Occasion Pill */}
        <div className="flex justify-center mb-6">
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => {
              sound.playChime('sparkle');
              onOpenKingdomStats();
            }}
           className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e8f3ec] dark:bg-[#193828] border border-[#bedecb] dark:border-[#2d5945] text-[#1b382b] dark:text-[#f3eee3] text-xs sm:text-sm font-medium shadow-xs hover:bg-[#d8ecdf] dark:hover:bg-[#254d3c] transition-all cursor-pointer"
           id="landing-occasion-pill"
          >
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span>International Dog Day — August 26, 2026</span>
           <ChevronRight className="w-3.5 h-3.5 text-[#5c5244] dark:text-[#f3eee3] group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-[#1b382b] tracking-tight leading-[1.1] mb-5"
          >
            Every dog has a story.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-2xl text-[#635a4d] font-normal leading-relaxed max-w-2xl mx-auto mb-3"
          >
            We just help you tell it.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm sm:text-base text-[#7c7162] max-w-xl mx-auto mb-8 leading-normal"
          >
            Bring your best friend in. We’ll turn a photo, a few little secrets and your favourite memories into an interactive companion and a Dog Day keepsake worth keeping.
          </motion.p>

          {/* Primary CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-8"
          >
            <button
              onClick={() => {
                sound.playChime('pop');
                onStart();
              }}
              className="w-full sm:w-auto px-8 py-4 bg-[#1b382b] hover:bg-[#254d3c] text-[#faf6ee] text-base sm:text-lg font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 group cursor-pointer"
              id="landing-meet-dog-btn"
            >
              <span>Meet my dog</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                sound.playChime('pop');
                setActiveTab(activeTab === 'how-it-works' ? 'overview' : 'how-it-works');
              }}
              className="w-full sm:w-auto px-6 py-4 bg-[#f0e7d5]/80 hover:bg-[#e7dcbf] text-[#1b382b] text-base font-medium rounded-2xl border border-[#ded1b9] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              id="landing-see-works-btn"
            >
              <BookOpen className="w-4 h-4 text-[#8c7a60]" />
              <span>{activeTab === 'how-it-works' ? 'Close Guide' : 'See how it works'}</span>
            </button>
          </motion.div>
        </div>

        {/* How It Works Drawer (If active) */}
        {activeTab === 'how-it-works' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-12 bg-[#fffdf9] p-6 sm:p-8 rounded-3xl border border-[#e5dcce] shadow-xs"
          >
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="font-display text-2xl font-bold text-[#1b382b]">The TAILORY Experience</h3>
                <p className="text-sm text-[#736858]">A warm, emotional journey in 5 simple steps</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-[#faf6ee] border border-[#eae1d0]">
                  <div className="text-2xl mb-1">📸</div>
                  <div className="font-bold text-xs text-[#1b382b] mb-0.5">1. Introduce</div>
                  <p className="text-[11px] text-[#786e60]">Upload a photo and answer 5 playful questions.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#faf6ee] border border-[#eae1d0]">
                  <div className="text-2xl mb-1">✨</div>
                  <div className="font-bold text-xs text-[#1b382b] mb-0.5">2. Google AI</div>
                  <p className="text-[11px] text-[#786e60]">Interprets personality traits and unique quirks.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#faf6ee] border border-[#eae1d0]">
                  <div className="text-2xl mb-1">🎙️</div>
                  <div className="font-bold text-xs text-[#1b382b] mb-0.5">3. ElevenLabs</div>
                  <p className="text-[11px] text-[#786e60]">Chat with your dog and hear their spoken voice.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#faf6ee] border border-[#eae1d0]">
                  <div className="text-2xl mb-1">📖</div>
                  <div className="font-bold text-xs text-[#1b382b] mb-0.5">4. Story</div>
                  <p className="text-[11px] text-[#786e60]">Your favourite memories woven into a short story.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#faf6ee] border border-[#eae1d0]">
                  <div className="text-2xl mb-1">🔗</div>
                  <div className="font-bold text-xs text-[#1b382b] mb-0.5">5. Solana</div>
                  <p className="text-[11px] text-[#786e60]">Preserve your Dog Day memory forever on-chain.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Interactive Storybook Scene & Dog Character */}
        <div className="relative mb-12">
          {/* Main Illustration Stage */}
          <div className="bg-gradient-to-b from-[#eaf4ed] to-[#d7ebd9] rounded-3xl p-6 sm:p-10 border border-[#bedecb] shadow-xs relative overflow-hidden">
            {/* Scenery details */}
            <div className="absolute top-4 left-6 flex items-center gap-2 text-xs font-semibold text-[#1b382b]/70 bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full">
              <span>🏡 The Dog Kingdom</span>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
              {/* Left text highlight */}
              <div className="max-w-md text-left space-y-3">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#b45309] bg-[#fef3c7] px-2.5 py-1 rounded-lg">
                  <Heart className="w-3.5 h-3.5 fill-[#d97706] text-[#d97706]" />
                  A Place for Dog Memories
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#1b382b]">
                  “This isn’t another AI tool. You brought your dog here.”
                </h2>
                <p className="text-sm text-[#4d5c52] leading-relaxed">
                  Most apps measure calories, steps, or breeds. TAILORY celebrates the goofy habits, midnight secrets, and unforgettable moments that make your dog an irreplaceable part of your family.
                </p>
                <div className="flex items-center gap-3 pt-2 text-xs text-[#3b5946]">
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-4 h-4 text-[#1b382b]" /> Safe AI Companion
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Volume2 className="w-4 h-4 text-[#1b382b]" /> Voice Synthesis
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Sparkles className="w-4 h-4 text-[#e5a93c]" /> Digital Keepsake
                  </span>
                </div>
              </div>

              {/* Right interactive character */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={triggerDogReaction}
                  className="relative cursor-pointer group"
                  id="landing-dog-avatar"
                >
                  {/* Glowing halo on hover */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#e5a93c]/40 to-[#10b981]/30 rounded-3xl blur-md opacity-60 group-hover:opacity-100 transition-opacity" />

                  {/* Character Card */}
                  <div className="relative w-56 sm:w-64 h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg border-3 border-white bg-white">
                    <img
                      src={PRESET_DOGS[0].image}
                      alt="Bruno the Dog"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge */}
                    <div className="absolute bottom-3 left-3 right-3 bg-[#1b382b]/85 backdrop-blur-md text-white p-2.5 rounded-xl text-center">
                      <div className="font-bold text-sm flex items-center justify-center gap-1.5">
                        <span>Bruno</span>
                        <span className="text-[11px] text-[#fcd34d]">★ Good Boy</span>
                      </div>
                      <p className="text-[11px] text-[#e0e7e2]">Tap me to say hello!</p>
                    </div>
                  </div>

                  {/* Tail wag animation element */}
                  <motion.div
                    animate={isWagging ? { rotate: [0, -25, 25, -20, 20, 0] } : { rotate: [0, -5, 5, 0] }}
                    transition={{ duration: isWagging ? 0.6 : 3, repeat: isWagging ? 2 : Infinity }}
                    className="absolute -bottom-2 -right-4 text-3xl select-none"
                  >
                    🐾
                  </motion.div>
                </motion.div>

                <p className="text-xs text-[#526357] mt-3 italic text-center">
                  {isWagging ? '✨ Bruno is wagging his tail happily!' : 'Click Bruno to interact with the sound engine'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Demo with Sample Dogs */}
        <div className="mt-8 pt-6 border-t border-[#e8ded0]">
          <div className="text-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#827461]">
              Try a Quick Demo or Meet Our Friends
            </h3>
            <p className="text-xs text-[#968772] mt-1">
              Don’t have a dog photo on hand? Choose a friendly pup to explore instantly:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {PRESET_DOGS.map((preset) => (
              <motion.button
                key={preset.id}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  sound.playChime('pop');
                  onSelectPreset(preset);
                }}
                className="flex items-center gap-3 p-3.5 bg-[#ffffff] hover:bg-[#faf7f2] border border-[#e8ded0] hover:border-[#1b382b]/40 rounded-2xl text-left shadow-xs hover:shadow-md transition-all cursor-pointer group"
                id={`preset-btn-${preset.id}`}
              >
                <img
                  src={preset.image}
                  alt={preset.name}
                  className="w-14 h-14 rounded-xl object-cover border border-[#e0d6c4] group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-base text-[#1b382b]">{preset.name}</span>
                    <span className="text-[11px] font-semibold text-[#b45309] bg-[#fef3c7] px-2 py-0.5 rounded-full">
                      Demo
                    </span>
                  </div>
                  <p className="text-xs text-[#736858] truncate">{preset.breed}</p>
                  <p className="text-[11px] text-[#9c8f7e] mt-0.5 truncate italic">
                    “{preset.answers.crime}”
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer copyright and contest note */}
      <footer className="border-t border-[#e8decb] py-6 px-4 text-center text-xs text-[#877b6a] bg-[#f5efe2]/60">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1b382b]">TAILORY</span>
            <span>—</span>
            <span>Crafted for International Dog Day 2026</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            {onOpenVideoStudio && (
              <button
                onClick={() => {
                  sound.playChime('pop');
                  onOpenVideoStudio();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fef3c7] text-[#1b382b] hover:bg-[#fde68a] border border-[#f59e0b]/40 rounded-full font-medium transition-colors cursor-pointer shadow-xs"
                title="Launch Interactive Video Demo & Presentation Studio"
                id="launch-video-studio-footer-btn"
              >
                <Video className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Video Demo Studio</span>
              </button>
            )}
            <button
              onClick={() => {
                sound.playChime('sparkle');
                generateDevToCoverImage();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1b382b] text-[#faf6ee] hover:bg-[#254d3c] rounded-full font-medium transition-colors cursor-pointer shadow-xs"
              title="Download 16:9 high-resolution cover image for DEV.to submission"
              id="download-cover-image-btn"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#e5a93c]" />
              <span>Download Cover Banner (16:9)</span>
            </button>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Google AI + ElevenLabs + Solana</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
