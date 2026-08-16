import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Upload, Camera, ArrowRight, Sparkles, CheckCircle2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { PRESET_DOGS, PresetDog } from '../data/presets';
import { sound } from '../utils/audio';

interface UploadDogProps {
  dogName: string;
  setDogName: (name: string) => void;
  dogImage: string;
  setDogImage: (img: string) => void;
  onNext: () => void;
  onSelectPreset: (preset: PresetDog) => void;
}

export const UploadDog: React.FC<UploadDogProps> = ({
  dogName,
  setDogName,
  dogImage,
  setDogImage,
  onNext,
  onSelectPreset,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    setErrorMessage(null);
    if (!file.type.match(/^image\/(jpeg|png|webp|jpg|gif)$/i)) {
      setErrorMessage("That photo didn’t make it through the dog door. Try a JPG, PNG or WEBP under 10MB.");
      sound.playChime('pop');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("That photo is a bit heavy for the dog door! Please choose an image under 10MB.");
      sound.playChime('pop');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        setDogImage(e.target.result);
        sound.playChime('success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const isComplete = dogName.trim().length > 0 && dogImage.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#eef5f0] text-[#1b382b] border border-[#c6dfd1] mb-3">
          Step 1 of 4 • Introduction
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-[#1b382b] mb-2">
          Who’s joining us?
        </h1>
        <p className="text-base text-[#695f50]">
          Bring their photo and tell us their name. We’ll take it from there.
        </p>
      </motion.div>

      <div className="bg-[#fffdf9] p-6 sm:p-8 rounded-3xl border border-[#e5dcce] shadow-sm space-y-6">
        {/* Photo Upload Area */}
        <div>
          <label className="block text-sm font-bold text-[#1b382b] mb-2">
            Their Photo <span className="text-[#b45309]">*</span>
          </label>

          {dogImage ? (
            <div className="relative group rounded-2xl overflow-hidden border-2 border-[#bedecb] bg-[#f0f8f3] p-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-32 h-32 rounded-xl overflow-hidden shadow-xs shrink-0 border border-[#bedecb]">
                <img
                  src={dogImage}
                  alt={dogName || "Dog"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm font-bold text-[#1b382b]">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                  Photo Ready!
                </div>
                <p className="text-xs text-[#6e6354] mt-0.5">
                  Looking sharp! Google AI will inspect those lovely ears and playful expression.
                </p>
                <div className="mt-3 flex gap-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-medium text-[#1b382b] bg-[#e6efe9] hover:bg-[#d5e5db] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Change photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setDogImage('')}
                    className="text-xs font-medium text-[#991b1b] hover:bg-[#fee2e2] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-[#10b981] bg-[#eef8f2]'
                  : 'border-[#d8ccba] hover:border-[#1b382b] bg-[#faf6ee]/70 hover:bg-[#faf6ee]'
              }`}
              id="dog-dropzone"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />

              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#eef5f0] text-[#1b382b] flex items-center justify-center">
                <Camera className="w-7 h-7 text-[#1b382b]" />
              </div>

              <h3 className="font-bold text-base text-[#1b382b] mb-1">
                Drop their photo here or click to browse
              </h3>
              <p className="text-xs text-[#736858] max-w-xs mx-auto mb-3">
                Bring your best friend’s face. Supports JPG, PNG, or WEBP up to 10MB.
              </p>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1b382b] text-[#faf6ee] text-xs font-semibold rounded-full shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                Select Photo
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-[#b91c1c] bg-[#fee2e2] p-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Quick Sample Photos Bar */}
        {!dogImage && (
          <div className="pt-1">
            <span className="text-xs text-[#7d7160] block mb-2 font-medium">
              Or pick a sample photo:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {PRESET_DOGS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setDogImage(preset.image);
                    if (!dogName) setDogName(preset.name);
                    sound.playChime('pop');
                  }}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-[#f0e8d8]/80 hover:bg-[#e6dcbf] border border-[#e2d5be] transition-colors cursor-pointer shrink-0"
                >
                  <img
                    src={preset.image}
                    alt={preset.name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <span className="text-xs font-semibold text-[#1b382b]">
                    {preset.name} ({preset.breed.split(' ')[0]})
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dog Name Input */}
        <div>
          <label htmlFor="dog-name-input" className="block text-sm font-bold text-[#1b382b] mb-2">
            What’s their name? <span className="text-[#b45309]">*</span>
          </label>
          <input
            id="dog-name-input"
            type="text"
            value={dogName}
            onChange={(e) => setDogName(e.target.value)}
            placeholder="e.g. Bruno, Luna, Barnaby, Buster..."
            maxLength={40}
            className="w-full px-4 py-3.5 rounded-xl border border-[#d6c9b5] bg-[#ffffff] text-base text-[#1b382b] placeholder-[#a89b88] focus:outline-none focus:ring-2 focus:ring-[#1b382b]/30 focus:border-[#1b382b] transition-all"
          />
        </div>

        {/* Next Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={!isComplete}
            onClick={() => {
              sound.playChime('pop');
              onNext();
            }}
            className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isComplete
                ? 'bg-[#1b382b] hover:bg-[#254d3c] text-[#faf6ee] shadow-md hover:shadow-lg'
                : 'bg-[#e4dbca] text-[#938776] cursor-not-allowed'
            }`}
            id="upload-next-btn"
          >
            <span>Next: Tell us a little about {dogName.trim() || 'them'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
