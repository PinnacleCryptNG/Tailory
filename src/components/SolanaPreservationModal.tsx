import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, CheckCircle2, ExternalLink, Sparkles, Key, Wallet, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DogProfile, DogStory, DogDayKeepsake, BlockchainPreservation } from '../types';
import { sound } from '../utils/audio';

interface SolanaPreservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: DogProfile;
  story: DogStory;
  keepsake: DogDayKeepsake;
  onPreserved: (preservation: BlockchainPreservation) => void;
}

export const SolanaPreservationModal: React.FC<SolanaPreservationModalProps> = ({
  isOpen,
  onClose,
  profile,
  story,
  keepsake,
  onPreserved,
}) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('8xFq9...D4vM (Solana Devnet)');
  const [isPreserving, setIsPreserving] = useState(false);
  const [preservationResult, setPreservationResult] = useState<BlockchainPreservation | null>(null);
  const [copiedSig, setCopiedSig] = useState(false);

  if (!isOpen) return null;

  const handleConnectWallet = () => {
    sound.playChime('pop');
    // Generate friendly active devnet keeper address
    const mockAddr = `7xK${Math.random().toString(36).substring(2, 6).toUpperCase()}...${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setWalletAddress(mockAddr);
    setWalletConnected(true);
  };

  const handlePreserve = async () => {
    setIsPreserving(true);
    sound.playChime('sparkle');

    try {
      const res = await fetch('/api/preserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dogName: profile.name,
          memoryId: keepsake.memoryId,
          storyTitle: story.title,
          ownerMessage: story.closing,
          walletAddress: walletAddress,
        }),
      });

      const data = await res.json();
      if (data.success && data.preservation) {
        setPreservationResult(data.preservation);
        onPreserved(data.preservation);
        sound.playChime('success');
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
          });
        } catch (e) {}
      }
    } catch (err) {
      console.error('Preservation failed:', err);
    } finally {
      setIsPreserving(false);
    }
  };

  const handleCopySig = (sig: string) => {
    navigator.clipboard.writeText(sig);
    setCopiedSig(true);
    setTimeout(() => setCopiedSig(false), 2000);
  };

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
          id="solana-modal-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {!preservationResult ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#1b382b]">
                Solana Devnet Preservation
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#1b382b] mb-2">
              Keep this forever
            </h2>
            <p className="text-xs sm:text-sm text-[#736554] leading-relaxed mb-6">
              Record a tamper-evident cryptographic keepsake of {profile.name}’s story on the Solana ledger. Your memory will be indexed with a unique hash and verifiable certificate.
            </p>

            {/* Memory Certificate Summary */}
            <div className="p-4 rounded-2xl bg-[#faf6ee] border border-[#e8ded0] space-y-2 mb-6 text-xs text-[#524637]">
              <div className="flex justify-between">
                <span className="font-semibold text-[#877b6a]">Subject:</span>
                <span className="font-bold text-[#1b382b]">{profile.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#877b6a]">Occasion:</span>
                <span className="text-[#1b382b]">International Dog Day 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#877b6a]">Memory ID:</span>
                <span className="font-mono text-[#1b382b]">{keepsake.memoryId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-[#877b6a]">Story Title:</span>
                <span className="text-[#1b382b] truncate max-w-[200px]">{story.title}</span>
              </div>
            </div>

            {/* Wallet Connect & Confirmation */}
            <div className="space-y-3">
              {!walletConnected ? (
                <button
                  type="button"
                  onClick={handleConnectWallet}
                  className="w-full py-3.5 px-4 bg-[#f0e7d5] hover:bg-[#e7dcbf] text-[#1b382b] font-bold text-sm rounded-2xl border border-[#ded1b9] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  id="connect-solana-wallet-btn"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect Solana Devnet Wallet</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-between text-xs text-[#065f46]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                    <span className="font-bold">Wallet Connected:</span>
                    <span className="font-mono">{walletAddress}</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={isPreserving}
                onClick={handlePreserve}
                className="w-full py-4 bg-[#1b382b] hover:bg-[#254d3c] text-[#faf6ee] font-bold text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                id="confirm-solana-preservation-btn"
              >
                <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                <span>
                  {isPreserving
                    ? 'Finding a safe place on Solana…'
                    : `Preserve ${profile.name}’s Memory`}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Preservation Success Screen */
          <div className="text-center py-2 space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#ecfdf5] text-[#059669] flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#1b382b] mb-1">
                {profile.name}’s story is safe.
              </h2>
              <p className="text-xs sm:text-sm text-[#665a4b]">
                Your International Dog Day memory has been permanently preserved on Solana.
              </p>
            </div>

            {/* Receipt Details */}
            <div className="p-4 rounded-2xl bg-[#faf6ee] border border-[#e8ded0] text-left text-xs space-y-2.5">
              <div>
                <span className="text-[#8c7e6c] block font-medium">Transaction Signature:</span>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="font-mono text-[#1b382b] text-[11px] truncate">
                    {preservationResult.txSignature}
                  </span>
                  <button
                    onClick={() => handleCopySig(preservationResult.txSignature)}
                    className="p-1 text-[#665846] hover:text-[#1b382b]"
                    title="Copy Signature"
                  >
                    {copiedSig ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#eee5d5]">
                <div>
                  <span className="text-[#8c7e6c] block font-medium">Solana Slot:</span>
                  <span className="font-mono text-[#1b382b] font-bold">#{preservationResult.solanaSlot}</span>
                </div>
                <div>
                  <span className="text-[#8c7e6c] block font-medium">Network:</span>
                  <span className="text-[#059669] font-bold">Solana Devnet</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#eee5d5]">
                <span className="text-[#8c7e6c] block font-medium">SHA-256 Memory Digest:</span>
                <span className="font-mono text-[#1b382b] text-[10px] break-all">
                  {preservationResult.hash}
                </span>
              </div>
            </div>

            {/* Explorer link */}
            <a
              href={preservationResult.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1b382b] hover:underline"
              id="solana-explorer-link"
            >
              <span>View On Solana Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div>
              <button
                onClick={() => {
                  sound.playChime('pop');
                  onClose();
                }}
                className="w-full py-3.5 bg-[#1b382b] hover:bg-[#254d3c] text-white font-bold text-sm rounded-2xl transition-colors cursor-pointer"
                id="solana-done-btn"
              >
                Back to Keepsake Card
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
