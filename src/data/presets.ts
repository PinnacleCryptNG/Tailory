import { DogAnswers, DogMemories } from '../types';

export interface PresetDog {
  id: string;
  name: string;
  breed: string;
  image: string;
  answers: DogAnswers;
  memories: DogMemories;
}

export const PRESET_DOGS: PresetDog[] = [
  {
    id: 'bruno',
    name: 'Bruno',
    breed: 'Golden Retriever & Labrador Mix',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    answers: {
      happiness: 'Food & Belly rubs',
      crime: 'Stealing socks',
      energy: 'Always ready for an adventure',
      socialStyle: 'Thinks everyone is their best friend',
      secret: 'He sleeps right across the bedroom doorway every night like a fluffy sentinel.'
    },
    memories: {
      meeting: 'We saw him in a wooden shelter box at the rural adoption fair; he rested his chin on my sneaker and refused to move.',
      favourite: 'The afternoon at the autumn lake when he swam out after a stick, discovered a family of ducks, and carefully swam circles around them with supreme dignity.',
      funny: 'Whenever someone opens the cheese drawer in the fridge, he teleports from a dead sleep in another room in 0.4 seconds.',
      message: 'You made our quiet house feel like a home full of warmth and laughter.'
    }
  },
  {
    id: 'luna',
    name: 'Luna',
    breed: 'French Bulldog',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    answers: {
      happiness: 'Causing trouble',
      crime: 'Pretending they didn’t hear me',
      energy: 'Runs the entire household',
      socialStyle: 'Selective',
      secret: 'She snores like an idling diesel truck and demands her own pillow on the sofa.'
    },
    memories: {
      meeting: 'Picked her up on a rainy Tuesday; she immediately climbed inside my jacket and fell asleep on my chest.',
      favourite: 'When she wore her little yellow raincoat for the first time and strutted down the sidewalk like a runway supermodel.',
      funny: 'She has full, dramatic grumble conversations with the toaster whenever toast pops up.',
      message: 'You have the biggest, bravest heart in the smallest furry body.'
    }
  },
  {
    id: 'barnaby',
    name: 'Barnaby',
    breed: 'Basset Hound',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80',
    answers: {
      happiness: 'Sleeping',
      crime: 'Eating things they shouldn’t',
      energy: 'Professional couch potato',
      socialStyle: 'Chilled most of the time',
      secret: 'He has an existential sigh he releases right before naptime that sounds like an elderly philosopher.'
    },
    memories: {
      meeting: 'He was the sleepiest puppy in the rescue pen, snoozing right in his food bowl.',
      favourite: 'Sunday morning coffee on the porch where he lays his heavy head across my feet and just listens to the birds.',
      funny: 'Tripping over his own ears during high-speed snack chases.',
      message: 'Thank you for teaching me to slow down and enjoy the quiet moments.'
    }
  }
];

export const HAPPINESS_OPTIONS = [
  'Walkies & Exploring',
  'Food & Crunchy Snacks',
  'Belly rubs & Cuddles',
  'Playing Fetch & Tug',
  'Sleeping in warm sunbeams',
  'Being with their favourite humans',
  'Causing delightful chaos',
  'Chewing sticks & toys'
];

export const CRIME_OPTIONS = [
  'Stealing clean socks from laundry',
  'Eating things they shouldn’t',
  'Digging secret garden holes',
  'Barking at absolutely nothing at 2 AM',
  'Destroying squeaky toys in 3 minutes',
  'Chasing anything with wheels or wings',
  'Pretending they didn’t hear their name',
  'Occupying exactly 85% of the bed'
];

export const ENERGY_OPTIONS = [
  'Professional couch potato (0–15% energy)',
  'Chilled most of the time (30–50% energy)',
  'Always ready for an adventure (80% energy)',
  'Runs the entire household (120% infinite zoomies)'
];

export const SOCIAL_OPTIONS = [
  'Loves every single human immediately',
  'Selective VIP guest list only',
  'A little shy at first, then pure love',
  'Suspicious of strangers until snacks appear',
  'Thinks every stranger is their long-lost best friend'
];
