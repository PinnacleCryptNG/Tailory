import React from 'react';
import { Volume2, VolumeX, Sparkles, RotateCcw, Award, Video } from 'lucide-react';
import { ExperienceStep } from '../types';
import { sound } from '../utils/audio';

interface NavigationProps {
  currentStep: ExperienceStep;
  onNavigate: (step: ExperienceStep) => void;
  onOpenKingdomStats: () => void;
  onOpenVideoStudio?: () => void;
  dogName?: string;
  isMuted: boolean;
  onToggleMute: () => void;
  onReset: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentStep,
  onNavigate,
  onOpenKingdomStats,
  onOpenVideoStudio,
  dogName,
  isMuted,
  onToggleMute,
  onReset,
}) => {
  const steps: { id: ExperienceStep; label: string }[] = [
    { id: 'landing', label: 'Home' },
    { id: 'upload', label: 'Introduce' },
    { id: 'profile', label: 'Profile' },
    { id: 'conversation', label: 'Talk' },
    { id: 'story', label: 'Story' },
    { id: 'keepsake', label: 'Keepsake' },
  ];

  const getStepIndex = (step: ExperienceStep) => {
    switch (step) {
      case 'landing': return 0;
      case 'upload':
      case 'questions':
      case 'analyzing': return 1;
      case 'profile': return 2;
      case 'conversation': return 3;
      case 'memories':
      case 'generating-story':
      case 'story': return 4;
      case 'keepsake':
      case 'preserved': return 5;
      default: return 0;
    }
  };

  const activeIndex = getStepIndex(currentStep);

  return (
    <header className="sticky top-0 z-40 bg-[#faf6ee]/90 backdrop-blur-md border-b border-[#e7decb]/80 px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo & Tag */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
          id="nav-logo-btn"
        >
          <div className="w-9 h-9 rounded-xl bg-[#1b382b] text-[#faf6ee] flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-[#254d3c] transition-colors">
            🐾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl text-[#1b382b] tracking-tight">
                TAILORY
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e5a93c]/15 text-[#92400e] border border-[#e5a93c]/30">
                Dog Day ’26
              </span>
            </div>
            <p className="text-[11px] text-[#635a4d] -mt-0.5 hidden xs:block">
              Every dog has a story.
            </p>
          </div>
        </button>

        {/* Step Progress Tracker (Visible if past landing) */}
        {currentStep !== 'landing' && (
          <nav className="hidden md:flex items-center gap-1.5 bg-[#f0e7d5]/60 p-1 rounded-full border border-[#e2d6bf]">
            {steps.slice(1).map((s, idx) => {
              const stepIdx = idx + 1;
              const isPast = activeIndex > stepIdx;
              const isCurrent = activeIndex === stepIdx;

              return (
                <button
                  key={s.id}
                  disabled={!isPast && !isCurrent}
                  onClick={() => {
                    sound.playChime('pop');
                    onNavigate(s.id);
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
                    isCurrent
                      ? 'bg-[#1b382b] text-[#faf6ee] shadow-xs'
                      : isPast
                      ? 'text-[#1b382b] hover:bg-[#e4d8c2] cursor-pointer'
                      : 'text-[#9c907e] cursor-not-allowed opacity-60'
                  }`}
                  id={`nav-step-${s.id}`}
                >
                  {s.label}
                  {isCurrent && dogName && s.id !== 'upload' && ` (${dogName})`}
                </button>
              );
            })}
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Demo Video Studio */}
          {onOpenVideoStudio && (
            <button
              onClick={() => {
                sound.playChime('pop');
                onOpenVideoStudio();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1b382b] bg-[#fef3c7] hover:bg-[#fde68a] border border-[#f59e0b]/40 rounded-full transition-colors shadow-xs"
              title="Interactive Video Demo & Presentation Studio"
              id="nav-video-studio-btn"
            >
              <Video className="w-3.5 h-3.5 text-[#d97706]" />
              <span className="hidden sm:inline">Demo Video</span>
            </button>
          )}

          {/* Dog Kingdom Insights */}
          <button
            onClick={() => {
              sound.playChime('pop');
              onOpenKingdomStats();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1b382b] bg-[#eef5f0] hover:bg-[#dfeee3] border border-[#c4ded0] rounded-full transition-colors"
            title="Dog Kingdom Community Insights"
            id="nav-kingdom-stats-btn"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e5a93c]" />
            <span className="hidden sm:inline">Dog Kingdom</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 text-[#5c5244] hover:text-[#1b382b] hover:bg-[#f0e7d5] rounded-full transition-colors"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            id="nav-sound-toggle-btn"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#1b382b]" />}
          </button>

          {/* Reset / Start New */}
          {currentStep !== 'landing' && (
            <button
              onClick={() => {
                if (confirm('Start a fresh dog story?')) {
                  onReset();
                }
              }}
              className="p-2 text-[#8c7f6e] hover:text-[#991b1b] hover:bg-[#fee2e2]/60 rounded-full transition-colors"
              title="Start New Dog Experience"
              id="nav-reset-btn"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
