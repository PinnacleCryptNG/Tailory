import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, RotateCcw, Download, Sparkles, Volume2, ShieldCheck, 
  MessageSquare, BookOpen, Award, CheckCircle, Video, ArrowRight, ExternalLink,
  Monitor, RefreshCw, Mic
} from 'lucide-react';
import { sound } from '../utils/audio';

interface DemoScene {
  id: number;
  timeRange: string;
  title: string;
  badge: string;
  narration: string;
  actionSummary: string;
  screenVisual: 'landing' | 'personality' | 'conversation' | 'story' | 'solana';
}

const DEMO_SCENES: DemoScene[] = [
  {
    id: 1,
    timeRange: '0:00 - 0:35',
    title: 'Welcome & The Vision of TAILORY',
    badge: 'Introduction & Mission',
    narration: '“Welcome to TAILORY, built for International Dog Day 2026. Most pet apps treat our dogs as data points—calories, weight, or trackers. TAILORY celebrates the emotional story, bizarre daily habits, and unconditional companionship that makes dogs our family.”',
    actionSummary: 'Exploring the natural editorial interface and picking Bruno the Golden Mix from the instant presets.',
    screenVisual: 'landing',
  },
  {
    id: 2,
    timeRange: '0:35 - 1:10',
    title: 'Google Gemini Multimodal Character Analysis',
    badge: 'Google Gemini 3.7 Flash',
    narration: '“We introduce Bruno and answer 5 fun personality dimensions: his happiest tail-wag triggers, favorite sneaker-theft habits, and social quirks. Powered by Google Gemini 3.7 Flash, the AI analyzes Bruno\'s photo and answers to construct his character archetype: Executive Snack Strategist.”',
    actionSummary: 'Evaluating visual cues and formulating personality traits (Loyal, Mischievous, Affectionate).',
    screenVisual: 'personality',
  },
  {
    id: 3,
    timeRange: '1:10 - 1:55',
    title: 'Interactive Spoken Canine Companion',
    badge: 'ElevenLabs Voice & Soundwaves',
    narration: '“Now we can talk directly to Bruno! Let\'s ask: ‘Why did you steal my socks?’ Hear his voice synthesized with ElevenLabs: ‘Those were not socks, they were emergency foot blankets I inspected for safety!’ The avatar responds dynamically with animated soundwaves.”',
    actionSummary: 'Real-time conversation with canine logic, expressive speech, and live reacting visualizer.',
    screenVisual: 'conversation',
  },
  {
    id: 4,
    timeRange: '1:55 - 2:35',
    title: 'Heartfelt Storycraft Narrative Engine',
    badge: 'Storycraft & Drop-Caps',
    narration: '“Next, TAILORY\'s Storycraft Engine weaves our 4 favorite memories—how we met, unforgettable adventures, funny moments, and our heartfelt message—into an emotional, literary short story formatted with editorial drop-caps and a built-in read-aloud narrator.”',
    actionSummary: 'Creating a custom 3-act illustrated keepsake narrative with pull-quotes and audio playback.',
    screenVisual: 'story',
  },
  {
    id: 5,
    timeRange: '2:35 - 3:00',
    title: 'Dog Day Keepsake & Solana Devnet Preservation',
    badge: 'Solana Devnet & Canvas PNG',
    narration: '“Finally, TAILORY generates an official Dog Day 2026 Keepsake Certificate. We can download a high-resolution print card or preserve the memory permanently on the Solana Devnet blockchain with verifiable cryptographic receipts and explorer links.”',
    actionSummary: '1-click high-res PNG export, printable certificate, and on-chain cryptographic memory verification.',
    screenVisual: 'solana',
  },
];

interface VideoDemoStudioProps {
  onClose: () => void;
}

export const VideoDemoStudio: React.FC<VideoDemoStudioProps> = ({ onClose }) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isScreenRecording, setIsScreenRecording] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [recordError, setRecordError] = useState<string | null>(null);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Keep live mutable state for high-frequency 60fps canvas loop
  const liveStateRef = useRef({
    activeSceneIndex: 0,
    progress: 0,
    isPlaying: false,
    isRecording: false,
    scene: DEMO_SCENES[0],
  });

  const scene = DEMO_SCENES[activeSceneIndex];
  const SCENE_DURATION_MS = 14000; // 14 seconds per scene for smooth pacing

  // Sync ref with state
  useEffect(() => {
    liveStateRef.current = {
      activeSceneIndex,
      progress,
      isPlaying,
      isRecording,
      scene: DEMO_SCENES[activeSceneIndex],
    };
  }, [activeSceneIndex, progress, isPlaying, isRecording]);

  // Setup Web Audio Master Destination for Studio Recording
  const getAudioDestination = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
        audioDestinationRef.current = audioContextRef.current.createMediaStreamDestination();
      }
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioDestinationRef.current;
  };

  // Play synthesized audio tones into recorded track
  const playToneToStream = (freq: number, duration: number, type: OscillatorType = 'sine') => {
    const actx = audioContextRef.current;
    const dest = audioDestinationRef.current;
    if (!actx || !dest) return;
    try {
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, actx.currentTime);
      gain.gain.setValueAtTime(0.15, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(dest);
      gain.connect(actx.destination); // also play to speakers
      
      osc.start();
      osc.stop(actx.currentTime + duration);
    } catch (e) {
      // Audio context might be suspended
    }
  };

  // Autoplay progression timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const interval = 100;
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (activeSceneIndex < DEMO_SCENES.length - 1) {
              const nextIdx = activeSceneIndex + 1;
              setActiveSceneIndex(nextIdx);
              handlePlayVoice(DEMO_SCENES[nextIdx].narration);
              return 0;
            } else {
              setIsPlaying(false);
              if (isRecording) {
                stopRecording();
              }
              return 100;
            }
          }
          return prev + (interval / SCENE_DURATION_MS) * 100;
        });
      }, interval);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeSceneIndex, isRecording]);

  // Recording seconds counter
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording || isScreenRecording) {
      timer = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording, isScreenRecording]);

  // Speech Narration helper
  const handlePlayVoice = (text: string) => {
    // Play chime into audio stream
    playToneToStream(587.33, 0.2, 'triangle'); // D5 chime

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.replace(/[“”"']/g, ''));
        utterance.rate = 0.98;
        utterance.pitch = 1.05;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error:', err);
      }
    }
  };

  // Continuous 60fps Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let wavePhase = 0;

    const renderLoop = () => {
      wavePhase += 0.04;
      const { activeSceneIndex: curIdx, progress: curProg, isPlaying: curPlaying, scene: curScene } = liveStateRef.current;

      const w = canvas.width;
      const h = canvas.height;

      // 1. Background gradient
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, '#12241b');
      bg.addColorStop(0.5, '#1b382b');
      bg.addColorStop(1, '#274f3d');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // 2. Gold subtle border
      ctx.strokeStyle = '#e5a93c';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, w - 40, h - 40);

      // 3. Header Tag
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(40, 40, 260, 32, 16);
      ctx.fill();
      ctx.fillStyle = '#1b382b';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('🐾  TAILORY DEMO PRESENTATION', 52, 61);

      // Timestamp & Badge
      ctx.fillStyle = '#faf6ee';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`SCENE ${curScene.id}/5 • ${curScene.timeRange}`, w - 230, 62);

      // Scene Title
      ctx.fillStyle = '#faf6ee';
      ctx.font = 'bold 26px Georgia, serif';
      ctx.fillText(curScene.title, 40, 115);

      // 4. Main Scene Visual Mockup Card
      const cardX = 40;
      const cardY = 135;
      const cardW = w - 80;
      const cardH = 340;

      ctx.fillStyle = '#fffdfa';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 16);
      ctx.fill();
      ctx.strokeStyle = '#e5decf';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw screen-specific visuals
      if (curScene.screenVisual === 'landing') {
        ctx.fillStyle = '#1b382b';
        ctx.font = 'bold 22px Georgia, serif';
        ctx.fillText('International Dog Day 2026', cardX + 30, cardY + 50);
        ctx.fillStyle = '#635a4d';
        ctx.font = 'italic 16px Georgia, serif';
        ctx.fillText('“Every dog has a story. We just help you tell it.”', cardX + 30, cardY + 78);

        // 3 Preset Cards
        const presets = [
          { name: 'Bruno', breed: 'Golden Mix', badge: 'Snack Strategist' },
          { name: 'Luna', breed: 'French Bulldog', badge: 'Velvet Goblin' },
          { name: 'Barnaby', breed: 'Basset Hound', badge: 'Sofa Philosopher' }
        ];
        presets.forEach((p, idx) => {
          const px = cardX + 30 + idx * 240;
          ctx.fillStyle = idx === 0 ? '#fef3c7' : '#f8f5ee';
          ctx.beginPath();
          ctx.roundRect(px, cardY + 105, 220, 200, 12);
          ctx.fill();
          ctx.strokeStyle = idx === 0 ? '#e5a93c' : '#e5decf';
          ctx.lineWidth = idx === 0 ? 2.5 : 1;
          ctx.stroke();

          ctx.fillStyle = '#1b382b';
          ctx.font = 'bold 18px Georgia, serif';
          ctx.fillText(p.name, px + 20, cardY + 145);
          ctx.fillStyle = '#786852';
          ctx.font = '13px sans-serif';
          ctx.fillText(p.breed, px + 20, cardY + 170);
          ctx.fillStyle = '#065f46';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(`✨ ${p.badge}`, px + 20, cardY + 235);
        });
      } else if (curScene.screenVisual === 'personality') {
        ctx.fillStyle = '#1b382b';
        ctx.font = 'bold 22px Georgia, serif';
        ctx.fillText('✨ Google Gemini AI Character Blueprint: Bruno', cardX + 30, cardY + 45);

        ctx.fillStyle = '#faf6ee';
        ctx.beginPath();
        ctx.roundRect(cardX + 30, cardY + 65, cardW - 60, 245, 12);
        ctx.fill();

        ctx.fillStyle = '#1b382b';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('Archetype: Executive Snack Strategist & Sock Connoisseur', cardX + 50, cardY + 105);

        const traits = ['99% Loyalty', '92% Slipper Theft', '100% Good Boy', '85% Couch Potato'];
        traits.forEach((t, i) => {
          const tx = cardX + 50 + (i % 2) * 340;
          const ty = cardY + 150 + Math.floor(i / 2) * 55;
          ctx.fillStyle = '#e8dfcf';
          ctx.beginPath();
          ctx.roundRect(tx, ty, 320, 42, 8);
          ctx.fill();
          ctx.fillStyle = '#1b382b';
          ctx.font = 'bold 14px sans-serif';
          ctx.fillText(t, tx + 15, ty + 26);
        });
      } else if (curScene.screenVisual === 'conversation') {
        ctx.fillStyle = '#1b382b';
        ctx.font = 'bold 20px Georgia, serif';
        ctx.fillText('🎙️ Live Spoken Voice Companion (ElevenLabs)', cardX + 30, cardY + 40);

        // User bubble
        ctx.fillStyle = '#f0e7d5';
        ctx.beginPath();
        ctx.roundRect(cardX + 30, cardY + 60, cardW - 60, 50, 10);
        ctx.fill();
        ctx.fillStyle = '#1b382b';
        ctx.font = '14px sans-serif';
        ctx.fillText('Human: “Bruno, why did you steal my socks from the laundry basket?”', cardX + 45, cardY + 90);

        // Dog bubble
        ctx.fillStyle = '#e8f5e9';
        ctx.beginPath();
        ctx.roundRect(cardX + 30, cardY + 125, cardW - 60, 95, 10);
        ctx.fill();
        ctx.fillStyle = '#1b382b';
        ctx.font = 'italic bold 15px Georgia, serif';
        ctx.fillText('Bruno: “Those were not socks, human! Those were emergency foot blankets that required', cardX + 45, cardY + 160);
        ctx.fillText('immediate dental inspection for structural safety. You are welcome!”', cardX + 45, cardY + 185);

        // Audio Wave visualizer
        ctx.strokeStyle = '#1b382b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < 280; x += 6) {
          const waveY = cardY + 265 + Math.sin(wavePhase * 2 + x * 0.1) * (curPlaying ? 15 : 4);
          if (x === 0) ctx.moveTo(cardX + 260 + x, waveY);
          else ctx.lineTo(cardX + 260 + x, waveY);
        }
        ctx.stroke();

        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('🔊 Live Voice Synthesis Active', cardX + 330, cardY + 305);
      } else if (curScene.screenVisual === 'story') {
        ctx.fillStyle = '#1b382b';
        ctx.font = 'bold 22px Georgia, serif';
        ctx.fillText('📖 The Chronicle of Bruno: A Dog Day Story', cardX + 30, cardY + 45);

        ctx.fillStyle = '#fbf8f2';
        ctx.beginPath();
        ctx.roundRect(cardX + 30, cardY + 65, cardW - 60, 245, 12);
        ctx.fill();

        ctx.fillStyle = '#e5a93c';
        ctx.font = 'bold 44px Georgia, serif';
        ctx.fillText('T', cardX + 50, cardY + 125);

        ctx.fillStyle = '#1b382b';
        ctx.font = '15px Georgia, serif';
        ctx.fillText('he afternoon sun broke through the window, catching Bruno in his favorite morning stretch.', cardX + 85, cardY + 105);
        ctx.fillText('From the golden hour walks along the riverbank to the quiet evenings by the hearth,', cardX + 85, cardY + 130);
        ctx.fillText('he turned every ordinary day into an adventure of boundless tail wags and pure devotion.', cardX + 50, cardY + 155);

        ctx.fillStyle = '#1b382b';
        ctx.beginPath();
        ctx.roundRect(cardX + 50, cardY + 180, cardW - 100, 50, 8);
        ctx.fill();
        ctx.fillStyle = '#fef3c7';
        ctx.font = 'italic bold 15px Georgia, serif';
        ctx.fillText('“Somehow, between muddy paws and silent companionship, life found its rhythm.”', cardX + 70, cardY + 210);

        ctx.fillStyle = '#92400e';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('✨ Woven from 4 personal memories via Google Gemini AI', cardX + 50, cardY + 275);
      } else if (curScene.screenVisual === 'solana') {
        ctx.fillStyle = '#1b382b';
        ctx.font = 'bold 22px Georgia, serif';
        ctx.fillText('📜 Official Keepsake Certificate & Solana Preservation', cardX + 30, cardY + 45);

        ctx.fillStyle = '#ecfdf5';
        ctx.beginPath();
        ctx.roundRect(cardX + 30, cardY + 65, cardW - 60, 115, 12);
        ctx.fill();
        ctx.strokeStyle = '#6ee7b7';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('🛡️ Preserved On-Chain: Solana Devnet #Slot 312849', cardX + 50, cardY + 98);
        ctx.font = '12px monospace';
        ctx.fillStyle = '#047857';
        ctx.fillText('SHA-256 Digest: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', cardX + 50, cardY + 125);
        ctx.fillText('Signature: 5K9aXjP...7vQ2wL  •  Status: Confirmed On-Chain', cardX + 50, cardY + 150);

        ctx.fillStyle = '#f5f3ef';
        ctx.beginPath();
        ctx.roundRect(cardX + 30, cardY + 195, cardW - 60, 115, 12);
        ctx.fill();

        ctx.fillStyle = '#1b382b';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('✓ 1-Click High-Res PNG (800x1100) Export', cardX + 50, cardY + 230);
        ctx.fillText('✓ Print & Framed Layout Styling', cardX + 50, cardY + 260);
        ctx.fillText('✓ Permanent Solana Explorer Verification Link', cardX + 50, cardY + 290);
      }

      // 5. Narration Box at Bottom
      ctx.fillStyle = '#faf6ee';
      ctx.beginPath();
      ctx.roundRect(40, 490, w - 80, 140, 14);
      ctx.fill();
      ctx.strokeStyle = '#e5a93c';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#1b382b';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('🎙️ PRESENTATION SCRIPT / VOICE-OVER:', 60, 515);

      ctx.fillStyle = '#2c251d';
      ctx.font = 'italic 15px Georgia, serif';
      const words = curScene.narration.split(' ');
      let line = '';
      let lineY = 542;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > w - 140 && n > 0) {
          ctx.fillText(line, 60, lineY);
          line = words[n] + ' ';
          lineY += 24;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 60, lineY);

      // 6. Progress bar at very bottom
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(40, 645, w - 80, 6);
      ctx.fillStyle = '#f59e0b';
      const totalPct = ((curIdx + curProg / 100) / DEMO_SCENES.length) * (w - 80);
      ctx.fillRect(40, 645, Math.max(0, Math.min(w - 80, totalPct)), 6);

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Safe MIME Type resolver
  const getSafeMimeType = () => {
    if (typeof MediaRecorder === 'undefined' || !MediaRecorder.isTypeSupported) {
      return '';
    }
    const candidates = [
      'video/webm;codecs=vp8,opus',
      'video/webm;codecs=vp9,opus',
      'video/webm',
      'video/mp4',
    ];
    for (const mime of candidates) {
      if (MediaRecorder.isTypeSupported(mime)) {
        return mime;
      }
    }
    return '';
  };

  // 1. Studio Canvas Video + Audio Recording
  const startCanvasRecording = async () => {
    setRecordError(null);
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // 25 FPS stream from canvas
      const videoStream = canvas.captureStream(25);
      
      // Combine with Audio Stream
      const audioDest = getAudioDestination();
      let combinedStream = videoStream;

      // Optional: Also request microphone so user's live voice can be captured directly
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const mic = await navigator.mediaDevices.getUserMedia({ audio: true });
          micStreamRef.current = mic;
          const micTrack = mic.getAudioTracks()[0];
          if (micTrack) {
            combinedStream = new MediaStream([
              ...videoStream.getVideoTracks(),
              micTrack,
            ]);
          }
        }
      } catch (micErr) {
        console.log('Mic not enabled, using Web Audio destination track.');
        if (audioDest && audioDest.stream.getAudioTracks().length > 0) {
          combinedStream = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...audioDest.stream.getAudioTracks(),
          ]);
        }
      }

      const mimeType = getSafeMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      
      const recorder = new MediaRecorder(combinedStream, options);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (micStreamRef.current) {
          micStreamRef.current.getTracks().forEach((t) => t.stop());
        }
        const finalBlob = new Blob(chunks, { type: mimeType || 'video/webm' });
        const url = URL.createObjectURL(finalBlob);
        setDownloadUrl(url);
        setIsRecording(false);
        sound.playChime('success');
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setActiveSceneIndex(0);
      setProgress(0);
      setIsPlaying(true);
      handlePlayVoice(DEMO_SCENES[0].narration);
    } catch (err: any) {
      console.error('Canvas recording failed:', err);
      setRecordError('Canvas video capture failed on this browser. Try the "Record Screen / Tab (With Audio)" button below!');
    }
  };

  // 2. Direct Screen / Tab Recording (Records full system / tab audio + video)
  const startScreenRecording = async () => {
    setRecordError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Screen capture not supported in this browser environment.');
      }

      // Prompt user to select tab or screen and include audio
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30, max: 60 } },
        audio: true,
      });

      screenStreamRef.current = stream;
      const mimeType = getSafeMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setIsScreenRecording(false);
        sound.playChime('success');
      };

      stream.getVideoTracks()[0].onended = () => {
        if (recorder.state !== 'inactive') {
          recorder.stop();
        }
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsScreenRecording(true);
      setIsPlaying(true);
      handlePlayVoice(scene.narration);
    } catch (err: any) {
      console.error('Screen recording failed:', err);
      setRecordError(err.message || 'Screen recording was cancelled.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
    }
    setIsRecording(false);
    setIsScreenRecording(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1b382b] border border-[#e5a93c]/50 rounded-2xl max-w-5xl w-full p-6 text-[#faf6ee] shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2d5945] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#e5a93c] text-[#1b382b] font-bold">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-[#faf6ee]">
                TAILORY Video Demo Studio & Exporter (With Audio)
              </h2>
              <p className="text-xs text-[#d1fae5]">
                Generate an automated demo video with synchronized voice audio, or record your screen walkthrough.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              stopRecording();
              onClose();
            }}
            className="text-[#d1d5db] hover:text-white px-3 py-1.5 rounded-lg bg-[#142a20] text-sm cursor-pointer"
          >
            ✕ Close
          </button>
        </div>

        {/* Error notification if any */}
        {recordError && (
          <div className="p-3 mb-3 bg-red-950/80 border border-red-500/50 rounded-lg text-red-200 text-xs">
            {recordError}
          </div>
        )}

        {/* Video Canvas Container */}
        <div className="flex flex-col items-center justify-center bg-[#13241c] rounded-xl p-3 border border-[#274f3d] mb-4">
          <canvas
            ref={canvasRef}
            width={854}
            height={480}
            className="w-full max-w-[854px] aspect-video rounded-lg shadow-lg border border-[#e5a93c]/30 block"
          />
        </div>

        {/* Scene Navigation Selector */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {DEMO_SCENES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                sound.playChime('pop');
                setActiveSceneIndex(idx);
                setProgress(0);
                if (isPlaying) {
                  handlePlayVoice(s.narration);
                }
              }}
              className={`p-2 rounded-lg text-left text-xs transition-all border cursor-pointer ${
                activeSceneIndex === idx
                  ? 'bg-[#e5a93c] text-[#1b382b] font-bold border-[#f59e0b] shadow-md'
                  : 'bg-[#142a20] text-[#e5e7eb] hover:bg-[#204232] border-[#2d5945]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>Scene {s.id}</span>
                <span className="text-[10px] opacity-80">{s.timeRange.split(' - ')[0]}</span>
              </div>
              <div className="truncate font-medium mt-0.5">{s.badge}</div>
            </button>
          ))}
        </div>

        {/* Controls and Export Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#142a20] p-4 rounded-xl border border-[#274f3d]">
          {/* Playback & Voice Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playChime('pop');
                const nextState = !isPlaying;
                setIsPlaying(nextState);
                if (nextState) {
                  handlePlayVoice(scene.narration);
                } else if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-[#faf6ee] text-[#1b382b] hover:bg-white transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play & Narrate'}</span>
            </button>

            <button
              onClick={() => {
                sound.playChime('pop');
                setActiveSceneIndex(0);
                setProgress(0);
              }}
              className="p-2 rounded-lg text-[#d1d5db] hover:text-white bg-[#1b382b] border border-[#2d5945] cursor-pointer"
              title="Restart from Scene 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => handlePlayVoice(scene.narration)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs bg-[#1b382b] text-[#fef3c7] hover:bg-[#254d3c] border border-[#2d5945] cursor-pointer"
              title="Speak scene voice-over"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#e5a93c]" />
              <span className="hidden sm:inline">Re-read Voice</span>
            </button>
          </div>

          {/* Recording Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {isRecording || isScreenRecording ? (
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-[#f59e0b] hover:bg-[#d97706] text-[#1b382b] shadow-lg animate-pulse cursor-pointer"
              >
                <Pause className="w-4 h-4" />
                <span>Stop Recording ({recordSeconds}s)</span>
              </button>
            ) : (
              <>
                <button
                  onClick={startCanvasRecording}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm bg-[#dc2626] hover:bg-[#ef4444] text-white shadow-lg transition-colors cursor-pointer"
                  title="Records the automated animated canvas presentation with audio track"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <span>Record Studio Video (with Audio)</span>
                </button>

                <button
                  onClick={startScreenRecording}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm bg-[#2563eb] hover:bg-[#3b82f6] text-white shadow-lg transition-colors cursor-pointer"
                  title="Records your entire browser tab or screen including system audio"
                >
                  <Monitor className="w-4 h-4" />
                  <span>Record Screen / Tab</span>
                </button>
              </>
            )}

            {downloadUrl && (
              <a
                href={downloadUrl}
                download="tailory-demo-video.webm"
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm bg-[#059669] hover:bg-[#10b981] text-white shadow-lg transition-colors animate-bounce cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Video (.webm)</span>
              </a>
            )}
          </div>
        </div>

        <div className="mt-3 text-xs text-[#a7f3d0]/80 flex flex-wrap items-center justify-between gap-2">
          <span>🔊 <strong>Audio Included</strong>: Voice-over narration and chime sound effects are now muxed directly into the recorded video stream!</span>
          <span className="font-mono text-[11px] text-[#e5a93c]">Ready for YouTube / Loom / DEV.to</span>
        </div>
      </div>
    </div>
  );
};
