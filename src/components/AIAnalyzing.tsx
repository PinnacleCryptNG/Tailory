import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface AIAnalyzingProps {
  dogName: string;
  dogImage: string;
}

const MESSAGES = [
  "Looking closely…",
  "Checking the ears for optimal floppy geometry…",
  "Inspecting the serious snack-detecting face…",
  "Consulting the very important canine committee…",
  "Unlocking secret personality files…",
  "We think we’ve figured them out!"
];

export const AIAnalyzing: React.FC<AIAnalyzingProps> = ({ dogName, dogImage }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev < MESSAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const progress = ((index + 1) / MESSAGES.length) * 100;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated Inspection Lens over Dog Image */}
        <div className="relative w-48 h-48 mx-auto">
          {/* Pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#e5a93c] via-[#10b981] to-[#3b82f6] blur-xl opacity-50"
          />

          {/* Dog Image Circle */}
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl bg-[#1b382b]">
            <img
              src={dogImage}
              alt={dogName}
              className="w-full h-full object-cover"
            />

            {/* Scanning radar line */}
            <motion.div
              animate={{ y: [-192, 192] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-x-0 h-2 bg-gradient-to-r from-transparent via-[#10b981]/80 to-transparent shadow-[0_0_15px_#10b981]"
            />
          </div>

          {/* Floating Paw Sparkles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 pointer-events-none"
          >
            <span className="absolute top-0 left-1/2 -translate-x-1/2 text-xl">✨</span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xl">🐾</span>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-xl">🍖</span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xl">💛</span>
          </motion.div>
        </div>

        {/* Dynamic Context Message */}
        <div className="h-16 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-lg sm:text-xl font-display font-bold text-[#1b382b]"
            >
              {MESSAGES[index]}
            </motion.p>
          </AnimatePresence>
          <p className="text-xs text-[#756957] mt-1">
            Google AI is crafting {dogName}’s unique character profile
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#e8ded0] h-2 rounded-full overflow-hidden max-w-xs mx-auto">
          <motion.div
            className="h-full bg-[#1b382b] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};
