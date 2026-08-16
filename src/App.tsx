import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  DogAnswers,
  DogProfile,
  DogMemories,
  DogStory,
  DogDayKeepsake,
  ExperienceStep,
  BlockchainPreservation,
} from './types';
import { PRESET_DOGS, PresetDog } from './data/presets';
import { sound } from './utils/audio';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { UploadDog } from './components/UploadDog';
import { PersonalityQuestions } from './components/PersonalityQuestions';
import { AIAnalyzing } from './components/AIAnalyzing';
import { DogProfileView } from './components/DogProfileView';
import { DogConversation } from './components/DogConversation';
import { MemoryCollection } from './components/MemoryCollection';
import { DogStoryView } from './components/DogStoryView';
import { KeepsakeCard } from './components/KeepsakeCard';
import { SolanaPreservationModal } from './components/SolanaPreservationModal';
import { DogKingdomModal } from './components/DogKingdomModal';
import { VideoDemoStudio } from './components/VideoDemoStudio';

export default function App() {
  const [currentStep, setCurrentStep] = useState<ExperienceStep>('landing');
  const [dogName, setDogName] = useState('');
  const [dogImage, setDogImage] = useState('');
  const [answers, setAnswers] = useState<DogAnswers>({
    happiness: '',
    crime: '',
    energy: '',
    socialStyle: '',
    secret: '',
  });
  const [profile, setProfile] = useState<DogProfile | null>(null);
  const [memories, setMemories] = useState<DogMemories>({
    meeting: '',
    favourite: '',
    funny: '',
    message: '',
  });
  const [story, setStory] = useState<DogStory | null>(null);
  const [keepsake, setKeepsake] = useState<DogDayKeepsake | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isKingdomStatsOpen, setIsKingdomStatsOpen] = useState(false);
  const [isSolanaModalOpen, setIsSolanaModalOpen] = useState(false);
  const [isVideoStudioOpen, setIsVideoStudioOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  const handleReset = () => {
    sound.playChime('pop');
    setCurrentStep('landing');
    setDogName('');
    setDogImage('');
    setAnswers({
      happiness: '',
      crime: '',
      energy: '',
      socialStyle: '',
      secret: '',
    });
    setProfile(null);
    setMemories({
      meeting: '',
      favourite: '',
      funny: '',
      message: '',
    });
    setStory(null);
    setKeepsake(null);
  };

  const handleSelectPreset = (preset: PresetDog) => {
    setDogName(preset.name);
    setDogImage(preset.image);
    setAnswers(preset.answers);
    setMemories(preset.memories);
    setCurrentStep('questions');
  };

  // 1. Analyze Dog via Google AI
  const handleAnalyzeDog = async () => {
    setIsAnalyzing(true);
    setCurrentStep('analyzing');

    try {
      const res = await fetch('/api/analyse-dog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: dogName,
          image: dogImage,
          answers,
        }),
      });

      const data = await res.json();
      if (data.success && data.dog) {
        setProfile(data.dog);
        setTimeout(() => {
          setIsAnalyzing(false);
          setCurrentStep('profile');
          sound.playChime('success');
        }, 1500);
      } else {
        throw new Error(data.error || 'Failed to analyze dog');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      // Construct fallback profile
      const fallbackDog: DogProfile = {
        id: `dog-${Date.now()}`,
        name: dogName,
        image: dogImage,
        personality: {
          traits: ['Affectionate', 'Curious', 'Mischievous', 'Food-motivated'],
          energy: answers.energy || 'Always ready for an adventure',
          socialStyle: answers.socialStyle || 'Thinks everyone is their best friend',
          signatureTrait: 'Executive Snack Strategist',
        },
        funnyDescription: `${dogName} has mastered the art of looking deeply innocent two seconds after committing the most audacious living-room crimes.`,
        conversationStyle: {
          tone: 'Playful & Loyal',
          confidence: 'Supreme',
          humour: 'Sweetly cheeky',
        },
        storySeed: `A devoted companion whose tail never lies and whose heart is twice as big as their appetite.`,
        greetingMessage: `Hey! I knew you were coming! I was just keeping the sofa warm for us.`,
        ownerSecret: answers.secret,
        createdAt: new Date().toISOString(),
      };

      setProfile(fallbackDog);
      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentStep('profile');
        sound.playChime('success');
      }, 1200);
    }
  };

  // 2. Generate Story via Google AI
  const handleGenerateStory = async () => {
    if (!profile) return;
    setIsGeneratingStory(true);
    setCurrentStep('generating-story');

    try {
      const res = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dog: profile,
          memories,
        }),
      });

      const data = await res.json();
      if (data.success && data.story) {
        setStory(data.story);
        const randId = Math.random().toString(36).substring(2, 6).toUpperCase();
        const memoryId = `DOGDAY-2026-${profile.name.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${randId}`;

        const newKeepsake: DogDayKeepsake = {
          id: `keepsake-${Date.now()}`,
          memoryId,
          dogName: profile.name,
          dogImage: profile.image,
          signatureTrait: profile.personality.signatureTrait,
          tagline: `${profile.personality.signatureTrait} • Full-Time Good Dog`,
          memorableLine: data.story.pullQuote || 'Somehow, ordinary days became my favourite days.',
          ownerMessage: data.story.closing || `To ${profile.name}: Thank you for being my best friend.`,
          traits: profile.personality.traits,
          createdDate: '26 August 2026',
          occasion: 'International Dog Day — August 26, 2026',
        };

        setKeepsake(newKeepsake);
        setTimeout(() => {
          setIsGeneratingStory(false);
          setCurrentStep('story');
          sound.playChime('success');
        }, 1200);
      } else {
        throw new Error(data.error || 'Failed to generate story');
      }
    } catch (err) {
      console.error('Story generation error:', err);
      const fallbackStory: DogStory = {
        title: `${profile.name} and the Ordinary Miracles`,
        subtitle: `A celebration of muddy paws, quiet mornings, and an unbreakable bond.`,
        paragraphs: [
          `Every great friendship has a quiet beginning. When ${profile.name} first arrived into the world of their human, ${memories.meeting || 'an ordinary day instantly turned extraordinary'}. There was no grand ceremony—just a moment where two lives locked into sync, and the air in the house suddenly felt warmer.`,
          `Over the seasons, ${profile.name} grew into a creature of delightful habits and legendary charm. There was the side of them that brought endless laughter—${memories.funny || 'the little victory dance before dinner'}. But beyond the daily comedy, there were the moments etched deep into memory: ${memories.favourite || 'the quiet afternoons in the autumn breeze'}. In those quiet spaces between sunset and sunrise, companionship wasn't a concept; it was a warm presence resting faithfully near the door.`,
          `If dogs carry an unspoken wisdom, it is the simple truth that presence is the greatest gift of all. ${profile.name} never needed words to say what mattered; every wag, head tilt, and joyful greeting spoke the language of unconditional loyalty.`,
        ],
        pullQuote: `Somehow, through muddy paws and quiet evenings, ordinary days became my favourite days.`,
        closing: `To ${profile.name}: ${memories.message || 'You made our house a home.'}`,
      };

      setStory(fallbackStory);
      const randId = Math.random().toString(36).substring(2, 6).toUpperCase();
      const memoryId = `DOGDAY-2026-${profile.name.toUpperCase().replace(/[^A-Z0-9]/g, '')}-${randId}`;

      setKeepsake({
        id: `keepsake-${Date.now()}`,
        memoryId,
        dogName: profile.name,
        dogImage: profile.image,
        signatureTrait: profile.personality.signatureTrait,
        tagline: `${profile.personality.signatureTrait} • Full-Time Good Dog`,
        memorableLine: fallbackStory.pullQuote,
        ownerMessage: fallbackStory.closing,
        traits: profile.personality.traits,
        createdDate: '26 August 2026',
        occasion: 'International Dog Day — August 26, 2026',
      });

      setTimeout(() => {
        setIsGeneratingStory(false);
        setCurrentStep('story');
        sound.playChime('success');
      }, 1200);
    }
  };

  const handlePreservedOnSolana = (preservation: BlockchainPreservation) => {
    if (keepsake) {
      setKeepsake({
        ...keepsake,
        blockchainPreservation: preservation,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf6ee] text-[#1c2921] storybook-bg flex flex-col justify-between selection:bg-[#e5a93c]/30 selection:text-[#1b382b]">
      {/* Sticky Top Navigation */}
      <Navigation
        currentStep={currentStep}
        onNavigate={(step) => setCurrentStep(step)}
        onOpenKingdomStats={() => setIsKingdomStatsOpen(true)}
        onOpenVideoStudio={() => setIsVideoStudioOpen(true)}
        dogName={profile?.name || dogName}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onReset={handleReset}
      />

      {/* Main View Area */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentStep === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage
                onStart={() => setCurrentStep('upload')}
                onSelectPreset={handleSelectPreset}
                onOpenKingdomStats={() => setIsKingdomStatsOpen(true)}
                onOpenVideoStudio={() => setIsVideoStudioOpen(true)}
              />
            </motion.div>
          )}

          {currentStep === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <UploadDog
                dogName={dogName}
                setDogName={setDogName}
                dogImage={dogImage}
                setDogImage={setDogImage}
                onNext={() => setCurrentStep('questions')}
                onSelectPreset={handleSelectPreset}
              />
            </motion.div>
          )}

          {currentStep === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PersonalityQuestions
                dogName={dogName || 'Your Dog'}
                answers={answers}
                setAnswers={setAnswers}
                onBack={() => setCurrentStep('upload')}
                onSubmit={handleAnalyzeDog}
                isAnalyzing={isAnalyzing}
              />
            </motion.div>
          )}

          {currentStep === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AIAnalyzing dogName={dogName} dogImage={dogImage} />
            </motion.div>
          )}

          {currentStep === 'profile' && profile && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <DogProfileView
                profile={profile}
                onTalk={() => setCurrentStep('conversation')}
                onStartStory={() => setCurrentStep('memories')}
              />
            </motion.div>
          )}

          {currentStep === 'conversation' && profile && (
            <motion.div
              key="conversation"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <DogConversation
                profile={profile}
                onProceedToStory={() => setCurrentStep('memories')}
              />
            </motion.div>
          )}

          {currentStep === 'memories' && profile && (
            <motion.div
              key="memories"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MemoryCollection
                profile={profile}
                memories={memories}
                setMemories={setMemories}
                onBack={() => setCurrentStep('profile')}
                onSubmit={handleGenerateStory}
                isGenerating={isGeneratingStory}
              />
            </motion.div>
          )}

          {currentStep === 'generating-story' && (
            <motion.div
              key="generating-story"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6"
            >
              <div className="w-16 h-16 rounded-full bg-[#1b382b] text-[#f59e0b] flex items-center justify-center text-2xl animate-spin mb-4">
                📖
              </div>
              <h2 className="font-display font-bold text-2xl text-[#1b382b] mb-1">
                Gathering the good bits…
              </h2>
              <p className="text-sm text-[#736858] max-w-sm">
                Google AI is weaving your memories of {profile?.name || dogName} into a Dog Day story.
              </p>
            </motion.div>
          )}

          {currentStep === 'story' && profile && story && (
            <motion.div
              key="story"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <DogStoryView
                profile={profile}
                story={story}
                onProceedToKeepsake={() => setCurrentStep('keepsake')}
              />
            </motion.div>
          )}

          {currentStep === 'keepsake' && profile && story && keepsake && (
            <motion.div
              key="keepsake"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <KeepsakeCard
                profile={profile}
                story={story}
                keepsake={keepsake}
                onOpenSolanaPreservation={() => setIsSolanaModalOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Dog Kingdom Community Stats Modal */}
      <DogKingdomModal
        isOpen={isKingdomStatsOpen}
        onClose={() => setIsKingdomStatsOpen(false)}
      />

      {/* Solana Blockchain Preservation Modal */}
      {profile && story && keepsake && (
        <SolanaPreservationModal
          isOpen={isSolanaModalOpen}
          onClose={() => setIsSolanaModalOpen(false)}
          profile={profile}
          story={story}
          keepsake={keepsake}
          onPreserved={handlePreservedOnSolana}
        />
      )}

      {/* Interactive Video Demo Studio & Recorder Modal */}
      {isVideoStudioOpen && (
        <VideoDemoStudio onClose={() => setIsVideoStudioOpen(false)} />
      )}
    </div>
  );
}
