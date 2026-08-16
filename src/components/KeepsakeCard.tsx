import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Download, Printer, Share2, Sparkles, Award, ShieldCheck, Check, Link2, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DogProfile, DogStory, DogDayKeepsake } from '../types';
import { sound } from '../utils/audio';

interface KeepsakeCardProps {
  profile: DogProfile;
  story: DogStory;
  keepsake: DogDayKeepsake;
  onOpenSolanaPreservation: () => void;
}

export const KeepsakeCard: React.FC<KeepsakeCardProps> = ({
  profile,
  story,
  keepsake,
  onOpenSolanaPreservation,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Trigger celebration confetti on view load
  React.useEffect(() => {
    sound.playChime('success');
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1b382b', '#e5a93c', '#10b981', '#f59e0b', '#d97706'],
      });
    } catch (e) {
      // Ignore if canvas is not available
    }
  }, []);

  const handleDownloadImage = async () => {
    setDownloading(true);
    sound.playChime('pop');

    try {
      // High-res Canvas export
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = 800;
      const height = 1100;
      canvas.width = width;
      canvas.height = height;

      // Background Paper
      ctx.fillStyle = '#faf6ee';
      ctx.fillRect(0, 0, width, height);

      // Outer Decorative Border
      ctx.strokeStyle = '#1b382b';
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      // Inner Gold Border
      ctx.strokeStyle = '#e5a93c';
      ctx.lineWidth = 3;
      ctx.strokeRect(45, 45, width - 90, height - 90);

      // Header Occasion
      ctx.fillStyle = '#1b382b';
      ctx.font = 'bold 22px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('INTERNATIONAL DOG DAY', width / 2, 100);

      ctx.fillStyle = '#92400e';
      ctx.font = '600 16px sans-serif';
      ctx.fillText('26 AUGUST 2026', width / 2, 130);

      // Dog Name
      ctx.fillStyle = '#1b382b';
      ctx.font = 'bold 46px Georgia, serif';
      ctx.fillText(profile.name.toUpperCase(), width / 2, 190);

      // Tagline
      ctx.fillStyle = '#736858';
      ctx.font = 'italic 18px Georgia, serif';
      ctx.fillText(`${profile.personality.signatureTrait} • Full-Time Good Dog`, width / 2, 225);

      // Draw Dog Image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = profile.image;

      await new Promise((resolve) => {
        img.onload = () => {
          // Rounded photo frame
          ctx.save();
          const imgSize = 340;
          const imgX = (width - imgSize) / 2;
          const imgY = 260;

          ctx.beginPath();
          ctx.arc(width / 2, imgY + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, imgX, imgY, imgSize, imgSize);
          ctx.restore();

          // Circle frame border
          ctx.strokeStyle = '#1b382b';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.arc(width / 2, imgY + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
          ctx.stroke();

          resolve(true);
        };
        img.onerror = () => resolve(false);
      });

      // Memorable Quote Box
      const quoteY = 660;
      ctx.fillStyle = '#1b382b';
      ctx.font = 'italic bold 22px Georgia, serif';
      const quoteText = `“${story.pullQuote || 'Somehow, ordinary days became my favourite days.'}”`;
      ctx.fillText(quoteText, width / 2, quoteY);

      // Owner message
      if (story.closing) {
        ctx.fillStyle = '#615443';
        ctx.font = '16px sans-serif';
        ctx.fillText(story.closing, width / 2, quoteY + 45);
      }

      // Personality Traits Pills
      const traitsText = profile.personality.traits.join('  •  ');
      ctx.fillStyle = '#1b382b';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(traitsText.toUpperCase(), width / 2, quoteY + 110);

      // Memory ID
      ctx.fillStyle = '#9c8e7b';
      ctx.font = '13px monospace';
      ctx.fillText(`ID: ${keepsake.memoryId}`, width / 2, height - 120);

      // TAILORY Footer
      ctx.fillStyle = '#1b382b';
      ctx.font = 'bold 20px Georgia, serif';
      ctx.fillText('TAILORY', width / 2, height - 80);

      ctx.fillStyle = '#877b69';
      ctx.font = '14px sans-serif';
      ctx.fillText('Every dog has a story.', width / 2, height - 55);

      // Trigger Download
      const link = document.createElement('a');
      link.download = `tailory-${profile.name.toLowerCase()}-dogday-keepsake.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      sound.playChime('success');
    } catch (err) {
      console.error('Keepsake export error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    sound.playChime('pop');
    window.print();
  };

  const handleShare = () => {
    sound.playChime('pop');
    if (navigator.share) {
      navigator.share({
        title: `${profile.name}’s Dog Day Keepsake`,
        text: `Meet ${profile.name}! ${profile.personality.signatureTrait}. Created on TAILORY for International Dog Day 2026.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Banner */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#eef5f0] text-[#1b382b] border border-[#bedecb] mb-2">
          Final Milestone • Dog Day Keepsake
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#1b382b] mb-1">
          You made something worth keeping.
        </h1>
        <p className="text-sm sm:text-base text-[#6b5f4f]">
          A little piece of {profile.name}’s story, made for International Dog Day 2026.
        </p>
      </div>

      {/* Keepsake Certificate Frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        ref={cardRef}
        className="bg-[#fffdf9] p-6 sm:p-10 rounded-3xl border-4 border-[#1b382b] shadow-xl relative overflow-hidden text-center space-y-6"
        id="dogday-keepsake-card"
      >
        {/* Inner Gold Ribbon Border */}
        <div className="absolute inset-2 sm:inset-3 border-2 border-[#e5a93c]/60 rounded-2xl pointer-events-none" />

        {/* Top Seal */}
        <div className="flex flex-col items-center pt-2">
          <div className="w-12 h-12 rounded-full bg-[#1b382b] text-[#f59e0b] flex items-center justify-center font-bold text-xl shadow-sm mb-2">
            🐾
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#1b382b]">
            INTERNATIONAL DOG DAY
          </span>
          <span className="text-[11px] font-semibold text-[#b45309]">
            26 AUGUST 2026
          </span>
        </div>

        {/* Dog Name & Title */}
        <div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#1b382b] tracking-tight mb-1">
            {profile.name.toUpperCase()}
          </h2>
          <p className="text-sm sm:text-base text-[#7a6d5c] font-medium italic">
            {profile.personality.signatureTrait} • Full-Time Good Dog
          </p>
        </div>

        {/* Dog Portrait in Circular Frame */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-full overflow-hidden border-4 border-[#1b382b] shadow-md bg-white">
          <img
            src={profile.image}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Personality Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
          {profile.personality.traits.map((trait) => (
            <span
              key={trait}
              className="px-3 py-1 rounded-full text-xs font-bold bg-[#1b382b] text-[#faf6ee]"
            >
              {trait}
            </span>
          ))}
        </div>

        {/* Memorable Line Quote */}
        <div className="py-3 px-4 max-w-lg mx-auto bg-[#faf6ee] rounded-2xl border border-[#e8dfcf]">
          <p className="text-base sm:text-lg font-display font-bold text-[#1b382b] italic">
            “{story.pullQuote || 'Somehow, ordinary days became my favourite days.'}”
          </p>
        </div>

        {/* Owner message */}
        {story.closing && (
          <p className="text-xs sm:text-sm text-[#706353] italic max-w-md mx-auto">
            {story.closing}
          </p>
        )}

        {/* Footer info & Unique Memory ID */}
        <div className="pt-4 border-t border-[#eee5d5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8c7f6e] gap-2">
          <div className="flex items-center gap-1 font-bold text-[#1b382b]">
            <span>TAILORY</span>
            <span>—</span>
            <span className="font-normal text-[#736655]">Every dog has a story.</span>
          </div>

          <div className="font-mono text-[11px] bg-[#f0e8d8] px-2.5 py-1 rounded-lg">
            ID: {keepsake.memoryId}
          </div>
        </div>

        {/* On-Chain Solana Verification Seal (If Preserved) */}
        {keepsake.blockchainPreservation?.preserved && (
          <div className="mt-4 p-3 rounded-2xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-between text-xs text-[#065f46]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#059669]" />
              <span className="font-bold">Preserved on Solana Devnet</span>
            </div>
            <a
              href={keepsake.blockchainPreservation.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline flex items-center gap-1 text-[#059669]"
            >
              <span>View On-Chain Receipt</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </motion.div>

      {/* Action Buttons Toolbar */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className="py-3.5 px-4 bg-[#1b382b] hover:bg-[#254d3c] text-[#faf6ee] rounded-2xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          id="keepsake-download-btn"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Rendering Image…' : 'Download PNG'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="py-3.5 px-4 bg-[#f0e7d5] hover:bg-[#e7dcbf] text-[#1b382b] rounded-2xl font-bold text-sm border border-[#ded1b9] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          id="keepsake-print-btn"
        >
          <Printer className="w-4 h-4" />
          <span>Print / PDF</span>
        </button>

        <button
          onClick={handleShare}
          className="py-3.5 px-4 bg-[#f0e7d5] hover:bg-[#e7dcbf] text-[#1b382b] rounded-2xl font-bold text-sm border border-[#ded1b9] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          id="keepsake-share-btn"
        >
          {copiedLink ? <Check className="w-4 h-4 text-[#10b981]" /> : <Share2 className="w-4 h-4" />}
          <span>{copiedLink ? 'Link Copied!' : 'Share Keepsake'}</span>
        </button>
      </div>

      {/* Solana Preservation Highlight Banner */}
      {!keepsake.blockchainPreservation?.preserved && (
        <div className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-[#1b382b] to-[#254d3c] text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#f59e0b] bg-white/10 px-2.5 py-0.5 rounded-full">
                Solana Preservation Layer
              </span>
            </div>
            <h3 className="text-xl font-display font-bold">
              Keep this forever on Solana
            </h3>
            <p className="text-xs text-[#d1e0d7] max-w-md">
              Preserve {profile.name}’s Dog Day story as a permanent, tamper-evident cryptographic memory on the Solana ledger.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playChime('pop');
              onOpenSolanaPreservation();
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#f59e0b] hover:bg-[#d97706] text-[#1b382b] font-bold text-sm rounded-2xl shadow-md transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
            id="solana-preserve-cta-btn"
          >
            <Sparkles className="w-4 h-4" />
            <span>Preserve on Solana</span>
          </button>
        </div>
      )}
    </div>
  );
};
