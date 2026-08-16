/**
 * Audio synthesis and sound effects for TAILORY.
 * Supports ElevenLabs audio streaming with intelligent Web Speech API fallback,
 * plus gentle ambient Web Audio synthesized sound effects.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopCurrent();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public stopCurrent() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Playful gentle tap / chime
   */
  public playChime(type: 'pop' | 'success' | 'sparkle' | 'bark-tone' = 'pop') {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'success') {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);

        gain.gain.setValueAtTime(0.1, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.3);
      });
    } else if (type === 'bark-tone') {
      // Warm double resonant chirp
      [320, 480].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + idx * 0.09 + 0.12);

        gain.gain.setValueAtTime(0.15, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.12);
      });
    }
  }

  /**
   * Play dog speech via ElevenLabs audio URL or high quality Web Speech synthesis
   */
  public async speakText(
    text: string,
    audioUrl?: string,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    if (this.isMuted) {
      if (onEnd) onEnd();
      return;
    }

    this.stopCurrent();

    // If we have ElevenLabs base64 audio stream URL
    if (audioUrl && audioUrl.startsWith('data:audio/')) {
      return new Promise((resolve) => {
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;
        audio.onplay = () => {
          if (onStart) onStart();
        };
        audio.onended = () => {
          this.currentAudio = null;
          if (onEnd) onEnd();
          resolve();
        };
        audio.onerror = () => {
          this.currentAudio = null;
          // Fallback to speech synthesis if audio playback errors
          this.speakWithBrowser(text, onStart, onEnd).then(resolve);
        };
        audio.play().catch(() => {
          this.speakWithBrowser(text, onStart, onEnd).then(resolve);
        });
      });
    }

    // Otherwise use browser Web Speech API
    return this.speakWithBrowser(text, onStart, onEnd);
  }

  private speakWithBrowser(
    text: string,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        if (onEnd) onEnd();
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_~]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.02;
      utterance.pitch = 1.15; // slightly friendly, warm higher pitch for cute dog character

      // Try to select an expressive English voice
      const voices = window.speechSynthesis.getVoices();
      const friendlyVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Daniel') ||
            v.name.includes('Karen') ||
            v.name.includes('Fred'))
      );
      if (friendlyVoice) {
        utterance.voice = friendlyVoice;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };
      utterance.onend = () => {
        if (onEnd) onEnd();
        resolve();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }
}

export const sound = new SoundEngine();
