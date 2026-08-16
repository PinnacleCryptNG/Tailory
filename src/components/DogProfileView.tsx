import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, MessageCircle, BookOpen, Volume2, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';
import { DogProfile } from '../types';
import { sound } from '../utils/audio';

interface DogProfileViewProps {
  profile: DogProfile;
  onTalk: () => void;
  onStartStory: () => void;
}

export const DogProfileView: React.FC<DogProfileViewProps> = ({
  profile,
  onTalk,
  onStartStory,
}) => {
  const [isPlayingGreeting, setIsPlayingGreeting] = React.useState(false);

  const playGreeting = () => {
    sound.playChime('pop');
    sound.speakText(
      profile.greetingMessage || `Hello! I'm ${profile.name}. I'm ready to talk about snacks and adventures!`,
      undefined,
      () => setIsPlayingGreeting(true),
      () => setIsPlayingGreeting(false)
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Tag */}
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#eef5f0] text-[#1b382b] border border-[#c6dfd1] mb-2">
          Step 3 of 5 • Personality Unlocked
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-[#1b382b]">
          Meet {profile.name}.
        </h1>
        <p className="text-base sm:text-lg text-[#695d4d] mt-1 font-medium">
          {profile.personality.signatureTrait}. Full-time good dog.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Dog Avatar & Spoken Greeting */}
        <div className="md:col-span-5 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-md border-4 border-white bg-white"
          >
            <img
              src={profile.image}
              alt={profile.name}
              className="w-full h-80 object-cover"
            />

            {/* Trait Ribbon */}
            <div className="absolute top-3 left-3 bg-[#1b382b]/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#f59e0b]" />
              Official Dog Day Profile
            </div>
          </motion.div>

          {/* Spoken Greeting Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-sm mt-4 p-4 rounded-2xl bg-[#fffdf9] border border-[#e5dcce] shadow-xs text-center relative"
          >
            <div className="text-xs font-bold text-[#827461] uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5">
              <span>{profile.name}’s First Words</span>
            </div>
            <p className="text-sm text-[#1b382b] font-medium italic mb-3">
              “{profile.greetingMessage}”
            </p>
            <button
              onClick={playGreeting}
              disabled={isPlayingGreeting}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isPlayingGreeting
                  ? 'bg-[#e5a93c] text-[#1b382b] animate-pulse'
                  : 'bg-[#1b382b] hover:bg-[#254d3c] text-[#faf6ee]'
              }`}
              id="hear-greeting-btn"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingGreeting ? `${profile.name} is speaking…` : `Hear ${profile.name} speak`}</span>
            </button>
          </motion.div>
        </div>

        {/* Right Column: Traits & Funny Insights */}
        <div className="md:col-span-7 space-y-4">
          {/* Floating Personality Badges */}
          <div className="bg-[#fffdf9] p-6 rounded-3xl border border-[#e5dcce] shadow-xs">
            <h2 className="text-xs font-bold text-[#827461] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#e5a93c]" />
              Personality Archetype
            </h2>

            <div className="flex flex-wrap gap-2.5 mb-4">
              {profile.personality.traits.map((trait, idx) => (
                <motion.span
                  key={trait}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * idx }}
                  className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-[#1b382b] text-[#faf6ee] shadow-xs flex items-center gap-1.5"
                >
                  <span>🐾</span>
                  <span>{trait}</span>
                </motion.span>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#faf6ee] border border-[#ebdcc7]">
                <span className="text-[#877864] block font-medium">Energy Profile:</span>
                <span className="font-bold text-[#1b382b]">{profile.personality.energy}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#faf6ee] border border-[#ebdcc7]">
                <span className="text-[#877864] block font-medium">Social Style:</span>
                <span className="font-bold text-[#1b382b]">{profile.personality.socialStyle}</span>
              </div>
            </div>
          </div>

          {/* Signature Trait Card */}
          <div className="bg-[#fffdf9] p-6 rounded-3xl border border-[#e5dcce] shadow-xs">
            <h3 className="text-xs font-bold text-[#b45309] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-[#d97706]" />
              {profile.name}’s Signature Superpower
            </h3>
            <div className="text-lg font-display font-bold text-[#1b382b] mb-1">
              {profile.personality.signatureTrait}
            </div>
            <p className="text-sm text-[#574c3d] leading-relaxed">
              {profile.funnyDescription}
            </p>
          </div>

          {/* Owner Secret Observation */}
          {profile.ownerSecret && (
            <div className="bg-[#f7f3ea] p-4 rounded-2xl border border-[#e5dcce] text-xs text-[#6e6150]">
              <span className="font-bold text-[#1b382b] block mb-0.5">The Special Secret:</span>
              <p className="italic">“{profile.ownerSecret}”</p>
            </div>
          )}

          {/* Safety Boundary Disclaimer */}
          <div className="p-3 rounded-xl bg-[#f0eee6] border border-[#ded8cb] flex items-start gap-2 text-[11px] text-[#786c5c]">
            <ShieldCheck className="w-4 h-4 text-[#8c7e6c] shrink-0 mt-0.5" />
            <span>
              This is a playful AI interpretation based on the photo and information you shared — not a professional behavioural or veterinary assessment.
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                sound.playChime('pop');
                onTalk();
              }}
              className="flex-1 py-4 bg-[#1b382b] hover:bg-[#254d3c] text-[#faf6ee] font-bold text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              id="profile-talk-btn"
            >
              <MessageCircle className="w-5 h-5 text-[#f59e0b]" />
              <span>Talk to {profile.name}</span>
            </button>

            <button
              onClick={() => {
                sound.playChime('pop');
                onStartStory();
              }}
              className="py-4 px-6 bg-[#f0e7d5] hover:bg-[#e7dcbf] text-[#1b382b] font-semibold text-sm rounded-2xl border border-[#ded1b9] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              id="profile-skip-story-btn"
            >
              <BookOpen className="w-4 h-4 text-[#827461]" />
              <span>Skip to Story</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
