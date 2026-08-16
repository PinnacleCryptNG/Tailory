// Utility to generate a high-resolution 16:9 Cover Image for DEV.to / Submissions
export async function generateDevToCoverImage(): Promise<void> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = 1280;
  const height = 720;
  canvas.width = width;
  canvas.height = height;

  // 1. Rich Forest Green Gradient Background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#13281f');
  gradient.addColorStop(0.5, '#1b382b');
  gradient.addColorStop(1, '#2d5945');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 2. Warm ambient light glows
  const sunGlow = ctx.createRadialGradient(width * 0.8, height * 0.2, 20, width * 0.8, height * 0.2, 450);
  sunGlow.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
  sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = sunGlow;
  ctx.fillRect(0, 0, width, height);

  // 3. Subtle gold border frame
  ctx.strokeStyle = '#e5a93c';
  ctx.lineWidth = 4;
  ctx.strokeRect(35, 35, width - 70, height - 70);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(45, 45, width - 90, height - 90);

  // 4. Tag / Occasion Pill
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.roundRect(80, 85, 360, 42, 21);
  ctx.fill();

  ctx.fillStyle = '#1b382b';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🐾  INTERNATIONAL DOG DAY 2026', 100, 112);

  // 5. Main Title
  ctx.fillStyle = '#faf6ee';
  ctx.font = 'bold 74px Georgia, serif';
  ctx.fillText('TAILORY', 80, 215);

  // 6. Subtitle / Tagline
  ctx.fillStyle = '#fef3c7';
  ctx.font = 'italic 28px Georgia, serif';
  ctx.fillText('“Every dog has a story. We just help you tell it.”', 80, 270);

  // 7. Feature bullet cards on left
  const features = [
    '✨  Google Gemini Multimodal AI Personality',
    '🎙️  ElevenLabs Spoken Canine Voice Companion',
    '📖  Heartfelt Storycraft Narrative Engine',
    '📜  Solana Devnet Permanent Keepsake Certificates',
  ];

  ctx.font = '500 20px sans-serif';
  features.forEach((feat, idx) => {
    const y = 345 + idx * 52;
    // Pill background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(80, y - 28, 590, 40, 12);
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(feat, 100, y - 2);
  });

  // 8. Right side: Decorative certificate card mockup preview
  const cardX = 730;
  const cardY = 120;
  const cardW = 460;
  const cardH = 500;

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.roundRect(cardX + 10, cardY + 15, cardW, cardH, 24);
  ctx.fill();

  // Card Body
  ctx.fillStyle = '#fffdf9';
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 24);
  ctx.fill();

  // Card Border
  ctx.strokeStyle = '#1b382b';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Gold inner line
  ctx.strokeStyle = '#e5a93c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(cardX + 15, cardY + 15, cardW - 30, cardH - 30, 16);
  ctx.stroke();

  // Inside card text
  ctx.fillStyle = '#1b382b';
  ctx.font = 'bold 15px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('OFFICIAL KEEPSAKE CERTIFICATE', cardX + cardW / 2, cardY + 55);

  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillText('BRUNO', cardX + cardW / 2, cardY + 110);

  ctx.fillStyle = '#786852';
  ctx.font = 'italic 15px sans-serif';
  ctx.fillText('Executive Snack Strategist • Full-Time Good Dog', cardX + cardW / 2, cardY + 138);

  // Trait Badges inside card
  const traits = ['Affectionate', 'Curious', 'Mischievous'];
  ctx.font = 'bold 12px sans-serif';
  traits.forEach((t, i) => {
    const tx = cardX + 120 + i * 110;
    ctx.fillStyle = '#1b382b';
    ctx.beginPath();
    ctx.roundRect(tx - 45, cardY + 160, 90, 26, 13);
    ctx.fill();
    ctx.fillStyle = '#faf6ee';
    ctx.fillText(t, tx, cardY + 177);
  });

  // Pull Quote in card
  ctx.fillStyle = '#faf6ee';
  ctx.beginPath();
  ctx.roundRect(cardX + 35, cardY + 210, cardW - 70, 100, 16);
  ctx.fill();
  ctx.strokeStyle = '#e8dfcf';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#1b382b';
  ctx.font = 'italic bold 16px Georgia, serif';
  ctx.fillText('“Somehow, through muddy paws and quiet', cardX + cardW / 2, cardY + 250);
  ctx.fillText('evenings, ordinary days became my favourite days.”', cardX + cardW / 2, cardY + 276);

  // Solana seal badge
  ctx.fillStyle = '#ecfdf5';
  ctx.beginPath();
  ctx.roundRect(cardX + 45, cardY + 335, cardW - 90, 48, 14);
  ctx.fill();
  ctx.strokeStyle = '#6ee7b7';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#065f46';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('🛡️  Preserved on Solana Devnet  •  Slot #312849', cardX + cardW / 2, cardY + 365);

  // Card Footer ID
  ctx.fillStyle = '#9c8e7b';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('ID: DOGDAY-2026-BRUNO-8K2A', cardX + cardW / 2, cardY + 440);

  // 9. Footer Tech Stack ribbon on banner
  ctx.textAlign = 'left';
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('POWERED BY:', 80, height - 70);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 16px sans-serif';
  ctx.fillText('Google Gemini AI  •  ElevenLabs Voice  •  Solana Devnet  •  React 19', 190, height - 70);

  // Trigger download
  const link = document.createElement('a');
  link.download = 'tailory-devto-cover-image.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
