export interface DogAnswers {
  happiness: string;
  crime: string;
  energy: string;
  socialStyle: string;
  secret: string;
}

export interface DogPersonality {
  traits: string[];
  energy: string;
  socialStyle: string;
  signatureTrait: string;
}

export interface ConversationStyle {
  tone: string;
  confidence: string;
  humour: string;
}

export interface DogProfile {
  id: string;
  name: string;
  image: string;
  personality: DogPersonality;
  funnyDescription: string;
  conversationStyle: ConversationStyle;
  storySeed: string;
  ownerSecret: string;
  greetingMessage: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'dog';
  content: string;
  timestamp: string;
  audioUrl?: string;
}

export interface DogMemories {
  meeting: string;
  favourite: string;
  funny: string;
  message: string;
}

export interface DogStory {
  title: string;
  subtitle: string;
  paragraphs: string[];
  pullQuote: string;
  closing: string;
  wordCount?: number;
}

export interface BlockchainPreservation {
  preserved: boolean;
  network: string;
  txSignature: string;
  blockTime: string;
  explorerUrl: string;
  solanaSlot: number;
  hash: string;
  walletAddress: string;
}

export interface DogDayKeepsake {
  id: string;
  memoryId: string;
  dogName: string;
  dogImage: string;
  signatureTrait: string;
  tagline: string;
  memorableLine: string;
  ownerMessage: string;
  traits: string[];
  createdDate: string;
  occasion: string;
  blockchainPreservation?: BlockchainPreservation;
}

export type ExperienceStep = 
  | 'landing'
  | 'upload'
  | 'questions'
  | 'analyzing'
  | 'profile'
  | 'conversation'
  | 'memories'
  | 'generating-story'
  | 'story'
  | 'keepsake'
  | 'preserved';
