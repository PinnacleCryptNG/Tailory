import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Heart, ShieldAlert, Smile, Trophy } from 'lucide-react';
import { sound } from '../utils/audio';

interface DogKingdomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DogKingdomModal: React.FC<DogKingdomModalProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/kingdom-stats')
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#fffdf9] max-w-lg w-full rounded-3xl border border-[#e5dcce] shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playChime('pop');
            onClose();
          }}
          className="absolute top-5 right-5 p-2 text-[#7d705f] hover:text-[#1b382b] hover:bg-[#faf6ee] rounded-full transition-colors"
          id="kingdom-modal-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🏡</span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#b45309]">
            The Dog Kingdom
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#1b382b] mb-1">
          What are dogs getting up to?
        </h2>
        <p className="text-xs text-[#786b59] mb-6">
          Anonymised aggregate observations from the International Dog Day community.
        </p>

        {loading ? (
          <div className="py-12 text-center text-sm text-[#786b59]">
            Consulting the kingdom records…
          </div>
        ) : (
          <div className="space-y-6">
            {/* Counter */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1b382b] to-[#2b5945] text-white flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs text-[#d1e0d7] font-medium block">
                  Dogs Introduced in Kingdom:
                </span>
                <span className="text-3xl font-display font-bold text-[#fef08a]">
                  {stats?.totalDogs?.toLocaleString() || '2,843'}
                </span>
              </div>
              <div className="text-3xl">🐾</div>
            </div>

            {/* Top Crimes */}
            <div className="p-4 rounded-2xl bg-[#faf6ee] border border-[#e8ded0] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#991b1b] uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Top Household Crimes Reported</span>
              </div>

              <div className="space-y-2">
                {stats?.topCrimes?.map((c: any) => (
                  <div key={c.crime}>
                    <div className="flex justify-between text-xs font-medium text-[#2d2417] mb-1">
                      <span>{c.crime}</span>
                      <span className="font-bold">{c.percentage}%</span>
                    </div>
                    <div className="h-2 bg-[#ebdcc8] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#991b1b] rounded-full"
                        style={{ width: `${c.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Happiest Triggers */}
            <div className="p-4 rounded-2xl bg-[#faf6ee] border border-[#e8ded0] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#059669] uppercase tracking-wider">
                <Smile className="w-4 h-4" />
                <span>Top Happiness Triggers</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {stats?.happiestTriggers?.map((t: any) => (
                  <div key={t.trigger} className="p-2.5 rounded-xl bg-white border border-[#e2d5c0]">
                    <span className="text-[11px] text-[#736553] block truncate font-medium">
                      {t.trigger}
                    </span>
                    <span className="text-sm font-bold text-[#1b382b]">{t.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#eee5d5]">
          <button
            onClick={() => {
              sound.playChime('pop');
              onClose();
            }}
            className="w-full py-3 bg-[#1b382b] hover:bg-[#254d3c] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            id="kingdom-modal-ok-btn"
          >
            Close Kingdom Insights
          </button>
        </div>
      </motion.div>
    </div>
  );
};
