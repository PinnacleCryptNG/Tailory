import { DogProfile, ChatMessage } from '../types';

interface CanineResponseContext {
  dog: DogProfile;
  message: string;
  history: ChatMessage[];
}

export function generateCanineResponse({ dog, message, history }: CanineResponseContext): string {
  const q = message.toLowerCase().trim();
  const name = dog.name || 'Your Dog';
  const archetype = dog.personality?.signatureTrait || 'Companion';
  const traits = dog.personality?.traits || [];
  const secret = dog.ownerSecret || '';

  // 1. Specific question matchers
  if (q.includes('sock') || q.includes('slipper') || q.includes('shoe') || q.includes('steal')) {
    const responses = [
      `Those were not stolen! They were emergency foot blankets requiring immediate dental inspection for structural integrity. You are welcome.`,
      `I didn't steal them—I relocated them to a strategic safety perimeter under the sofa. It's called security, human!`,
      `Listen, they smell like my favorite person in the galaxy. Carrying them around is my highest duty! (Also they are delightfully chewy).`,
      `I plead the Fifth Bark Amendment! But if cheese is offered, I might negotiate their exact coordinates.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (q.includes('leave for work') || q.includes('when i leave') || q.includes('alone') || q.includes('go to work') || q.includes('miss me')) {
    const responses = [
      `First, I sit dramatically by the window looking like a Victorian novel protagonist. Then I nap in 4 different strategic sunbeams until you return!`,
      `I monitor the perimeter for squirrels, test every single cushion on the couch for softness, and count down the seconds until that glorious front door click!`,
      `I conduct an emergency audit of the living room rug, dream about chasing giant tennis balls, and guard your spot on the bed with supreme dedication.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (q.includes('good boy') || q.includes('good girl') || q.includes('goodest') || q.includes('best boy') || q.includes('best girl')) {
    const responses = [
      `I have reviewed the global canine rankings and can confirm with 100% statistical accuracy: YES, IT IS ME! 🐾`,
      `*vigorous tail wag* The rumors are true! But extra belly rubs are required to maintain my reigning championship status!`,
      `I knew it! The council of paws has spoken! Now, about that championship victory treat you owe me...?`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (q.includes('dream') || q.includes('twitch') || q.includes('paws twitch') || q.includes('sleep')) {
    const responses = [
      `I was in a magical kingdom where all the trees grow roasted chicken and tennis balls bounce in slow motion! I almost caught one!`,
      `I was defending our backyard from a 50-foot robotic squirrel who tried to steal our couch! My twitching paws were executing master martial arts!`,
      `I was dreaming that the refrigerator opened all by itself and a gentle waterfall of cheese rained down into my open mouth.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (q.includes('mail') || q.includes('postman') || q.includes('delivery') || q.includes('doorbell') || q.includes('bark')) {
    const responses = [
      `Have you ever noticed that every single day that suspicious envelope-carrier approaches, I bark fiercely, and THEN THEY RETREAT?! My system works flawlessly!`,
      `The mail person wears suspicious uniforms and slides flat paper into our wall! I am defending our sovereignty from unauthorized paper deliveries!`,
      `That was not barking, that was an official canine royal proclamation alerting the entire neighborhood of approaching parcels!`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (q.includes('love') || q.includes('like me') || q.includes('hug') || q.includes('cuddle') || q.includes('friend')) {
    const responses = [
      `I love you more than bacon, belly rubs, and sunny afternoons combined! You are my whole universe, human.`,
      `Every time you walk through the door, it is the absolute greatest moment of my entire day. Never forget that!`,
      `*nuzzles hand gently* You are my favorite human in all of space and time. Even when you don't share your pizza crust.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (q.includes('food') || q.includes('snack') || q.includes('treat') || q.includes('eat') || q.includes('hungry') || q.includes('dinner') || q.includes('breakfast')) {
    const responses = [
      `I am experiencing a severe, life-threatening snack deficiency! Please administer one crunchy biscuit immediately!`,
      `Did someone say TREAT?! My ears perked up, my tail is wagging at 200 RPM, and I am ready to perform any trick in the book!`,
      `I have calculated that my stomach has been empty for approximately 4 million years. Immediate bacon intervention required!`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (q.includes('walk') || q.includes('outside') || q.includes('park') || q.includes('leash') || q.includes('car ride')) {
    const responses = [
      `DID SOMEONE SAY WALK?! 🐕 I am already doing full zoomies around the coffee table! Grab the leash!`,
      `There are approximately 42,000 urgent neighborhood smells that require my immediate sniffing expertise! Let's go!`,
      `I am mentally already at the park sniffing the ceremonial Great Tree. Put your shoes on, human!`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (q.includes('bath') || q.includes('water') || q.includes('shower') || q.includes('clean') || q.includes('groom')) {
    const responses = [
      `The betrayal! The wet horror chamber! I spent weeks cultivating that exquisite backyard mud perfume!`,
      `I will submit to the soap ritual ONLY under protest and with the contractual guarantee of three emergency biscuits afterwards.`,
      `*hides behind the armchair* I am suddenly invisible. You cannot see me. Bath time has been legally cancelled.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (q.includes('cat') || q.includes('squirrel') || q.includes('bird') || q.includes('rabbit') || q.includes('dog')) {
    const responses = [
      `The neighborhood squirrels are clearly plotting something behind the cedar fence. I maintain constant tactical surveillance!`,
      `Cats walk around like they own the place with their supreme indifference. But I know they secretly admire my fluffy tail.`,
      `If I run fast enough, one day I WILL catch that squirrel. It is my canine destiny!`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('sup') || q.includes('yo')) {
    const responses = [
      `Hey my favorite human! I was just sitting here thinking about how great you are (and wondering if you have cheese).`,
      `*happy tail thumps on floor* Hello hello! What are we doing today? Nap? Walk? Living room zoomies?`,
      `Greetings human! As your official ${archetype}, I am ready for any questions, belly rubs, or snack consultations!`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (q.includes('how are you') || q.includes('how r u') || q.includes('feeling') || q.includes('doing today')) {
    const responses = [
      `Operating at 100% fluffiness and peak good-dog efficiency! Ready for quality time with you!`,
      `My tail is wagging, my ears are perked, and I rate today a 12 out of 10! How is my best human doing?`,
      `Living the dream! Found a warm sunbeam earlier, took a glorious nap, and now I get to chat with you!`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (q.includes('who are you') || q.includes('name') || q.includes('breed') || q.includes('what are you')) {
    return `I am ${name}, your devoted ${archetype}! My primary credentials include expert cuddle delivery, professional snack location, and 24/7 loyalty!`;
  }

  if (q.includes('secret') || q.includes('tell me a secret')) {
    if (secret) {
      return `Between you and me: ${secret} But don't tell the other pets in the neighborhood!`;
    }
    return `My biggest secret? Whenever you say "good boy", my heart does a happy little backflip!`;
  }

  if (q.includes('sorry') || q.includes('apologize') || q.includes('my bad')) {
    return `All is forgiven, human! Dogs don't hold grudges—especially not when forehead kisses and ear scratches are on the table.`;
  }

  if (q.includes('trick') || q.includes('sit') || q.includes('paw') || q.includes('roll over') || q.includes('stay')) {
    return `*sits with supreme posture and offers a polite paw* Behold my impeccable manners! Now please deposit one treat into the designated canine slot.`;
  }

  // 2. Personality-driven contextual responses for general queries
  const dynamicGeneralResponses = [
    `*tilts head quizzically with perked ears* That is a profound human question. In canine terms: life is simple when you love deeply and never pass up a snack!`,
    `As your certified ${archetype}, I have evaluated your question and determined that the answer requires immediate mutual ear-scratching!`,
    `*tail wag* I may not understand all human words, but I understand the love behind them. Also, let's explore together!`,
    `Whatever you're thinking, human, I am on your team 100%! Where you go, my happy paws follow.`,
    `*gives enthusiastic nose boop* I agree with whatever you just said, provided it includes a walk or dinner!`,
    `My canine intuition tells me today is going to be wonderful because we are spending it together.`
  ];

  // Pick deterministic but varied response based on message hash
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    hash = (hash << 5) - hash + message.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % dynamicGeneralResponses.length;
  return dynamicGeneralResponses[index];
}
