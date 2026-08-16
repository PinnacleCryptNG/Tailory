import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft, Sparkles, Smile, ShieldAlert, Zap, Users, KeyRound } from 'lucide-react';
import { DogAnswers } from '../types';
import { HAPPINESS_OPTIONS, CRIME_OPTIONS, ENERGY_OPTIONS, SOCIAL_OPTIONS } from '../data/presets';
import { sound } from '../utils/audio';

interface PersonalityQuestionsProps {
  dogName: string;
  answers: DogAnswers;
  setAnswers: React.Dispatch<React.SetStateAction<DogAnswers>>;
  onBack: () => void;
  onSubmit: () => void;
  isAnalyzing: boolean;
}

export const PersonalityQuestions: React.FC<PersonalityQuestionsProps> = ({
  dogName,
  answers,
  setAnswers,
  onBack,
  onSubmit,
  isAnalyzing,
}) => {
  const [customCrime, setCustomCrime] = useState('');
  const [showCustomCrime, setShowCustomCrime] = useState(false);

  const updateAnswer = (key: keyof DogAnswers, value: string) => {
    sound.playChime('pop');
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const isComplete =
    answers.happiness &&
    answers.crime &&
    answers.energy &&
    answers.socialStyle &&
    answers.secret.trim().length > 3;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#eef5f0] text-[#1b382b] border border-[#c6dfd1] mb-3">
          Step 2 of 4 • Personality Clues
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#1b382b] mb-2">
          Oh, hello {dogName}!
        </h1>
        <p className="text-base text-[#695f50]">
          Tell us a little about them. There are no wrong answers — only very good dogs.
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Question 1: Happiest */}
        <div className="bg-[#fffdf9] p-5 sm:p-7 rounded-3xl border border-[#e5dcce] shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center font-bold text-sm">
              <Smile className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#1b382b]">
              1. What makes {dogName} happiest?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {HAPPINESS_OPTIONS.map((opt) => {
              const isSelected = answers.happiness === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateAnswer('happiness', opt)}
                  className={`p-3 rounded-2xl text-left text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#1b382b] text-[#faf6ee] border-[#1b382b] shadow-xs'
                      : 'bg-[#faf6ee]/70 hover:bg-[#f3ece0] text-[#3d3429] border-[#e2d5c0]'
                  }`}
                  id={`happiness-opt-${opt.slice(0, 10).toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 2: Greatest Crime */}
        <div className="bg-[#fffdf9] p-5 sm:p-7 rounded-3xl border border-[#e5dcce] shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#fee2e2] text-[#dc2626] flex items-center justify-center font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#1b382b]">
                2. What’s {dogName}’s greatest crime?
              </h2>
              <p className="text-xs text-[#7d7160]">The household transgression they pretend never happened.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
            {CRIME_OPTIONS.map((opt) => {
              const isSelected = answers.crime === opt && !showCustomCrime;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setShowCustomCrime(false);
                    updateAnswer('crime', opt);
                  }}
                  className={`p-3 rounded-2xl text-left text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#1b382b] text-[#faf6ee] border-[#1b382b] shadow-xs'
                      : 'bg-[#faf6ee]/70 hover:bg-[#f3ece0] text-[#3d3429] border-[#e2d5c0]'
                  }`}
                  id={`crime-opt-${opt.slice(0, 10).toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Or custom crime */}
          {!showCustomCrime ? (
            <button
              type="button"
              onClick={() => setShowCustomCrime(true)}
              className="text-xs font-semibold text-[#8c7457] hover:text-[#1b382b] underline cursor-pointer"
            >
              + Enter a different specific crime
            </button>
          ) : (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={customCrime}
                onChange={(e) => {
                  setCustomCrime(e.target.value);
                  setAnswers((p) => ({ ...p, crime: e.target.value }));
                }}
                placeholder="e.g. Unrolling all the toilet paper across the hallway..."
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#d6c9b5] bg-white focus:outline-none focus:ring-1 focus:ring-[#1b382b]"
              />
              <button
                type="button"
                onClick={() => setShowCustomCrime(false)}
                className="px-3 py-2 text-xs text-[#6e6354] hover:bg-[#eee5d5] rounded-xl"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Question 3: Energy Level */}
        <div className="bg-[#fffdf9] p-5 sm:p-7 rounded-3xl border border-[#e5dcce] shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#e0e7ff] text-[#4f46e5] flex items-center justify-center font-bold text-sm">
              <Zap className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#1b382b]">
              3. What’s {dogName}’s energy level?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ENERGY_OPTIONS.map((opt) => {
              const isSelected = answers.energy === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateAnswer('energy', opt)}
                  className={`p-3 rounded-2xl text-left text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#1b382b] text-[#faf6ee] border-[#1b382b] shadow-xs'
                      : 'bg-[#faf6ee]/70 hover:bg-[#f3ece0] text-[#3d3429] border-[#e2d5c0]'
                  }`}
                  id={`energy-opt-${opt.slice(0, 10).toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 4: Social Style */}
        <div className="bg-[#fffdf9] p-5 sm:p-7 rounded-3xl border border-[#e5dcce] shadow-xs">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center font-bold text-sm">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#1b382b]">
              4. How is {dogName} with people?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {SOCIAL_OPTIONS.map((opt) => {
              const isSelected = answers.socialStyle === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => updateAnswer('socialStyle', opt)}
                  className={`p-3 rounded-2xl text-left text-xs sm:text-sm font-medium transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#1b382b] text-[#faf6ee] border-[#1b382b] shadow-xs'
                      : 'bg-[#faf6ee]/70 hover:bg-[#f3ece0] text-[#3d3429] border-[#e2d5c0]'
                  }`}
                  id={`social-opt-${opt.slice(0, 10).toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 5: Private Secret */}
        <div className="bg-[#fffdf9] p-5 sm:p-7 rounded-3xl border border-[#e5dcce] shadow-xs">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#fdf2f8] text-[#db2777] flex items-center justify-center font-bold text-sm">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#1b382b]">
                5. Tell us one thing only you know about {dogName}.
              </h2>
              <p className="text-xs text-[#7d7160]">
                A peculiar quirk, funny sleeping habit, or special ritual that makes them uniquely yours.
              </p>
            </div>
          </div>

          <textarea
            value={answers.secret}
            onChange={(e) => setAnswers((p) => ({ ...p, secret: e.target.value }))}
            placeholder={`e.g. ${dogName} refuses to start dinner unless someone taps their food bowl twice, or always buries their nose under the couch cushion when it thunders...`}
            rows={3}
            maxLength={1000}
            className="w-full mt-2 p-3.5 rounded-xl border border-[#d6c9b5] bg-[#faf6ee]/60 text-sm text-[#1b382b] placeholder-[#a89b88] focus:outline-none focus:ring-2 focus:ring-[#1b382b]/30 focus:border-[#1b382b] transition-all"
            id="secret-textarea"
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
            id="questions-back-btn"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            disabled={!isComplete || isAnalyzing}
            onClick={() => {
              sound.playChime('sparkle');
              onSubmit();
            }}
            className={`px-8 py-4 rounded-2xl font-bold text-base flex items-center gap-3 transition-all cursor-pointer ${
              isComplete && !isAnalyzing
                ? 'bg-[#1b382b] hover:bg-[#254d3c] text-[#faf6ee] shadow-md hover:shadow-lg'
                : 'bg-[#e4dbca] text-[#938776] cursor-not-allowed'
            }`}
            id="questions-submit-btn"
          >
            <Sparkles className="w-5 h-5 text-[#e5a93c]" />
            <span>{isAnalyzing ? 'Consulting Google AI...' : `Discover ${dogName}’s Personality`}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
