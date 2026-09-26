import React from 'react';
import { Sparkles, Mic, Play, ArrowRight, Headphones, Sliders, Zap, ShieldCheck, Globe, Volume2 } from 'lucide-react';
import { ActiveTab } from '../types';
import { Logo } from './Logo';

interface LandingHeroProps {
  onGetStarted: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onGetStarted, setActiveTab }) => {
  return (
    <div className="relative overflow-hidden bg-[#0b0f17] text-slate-100">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-br from-purple-600/20 via-indigo-600/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold mb-8 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Next-Gen Audio Intelligence Engine · Powered by Gemini 3.8</span>
        </div>

        <div className="flex justify-center mb-6">
          <Logo size="lg" showTagline={true} />
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.12] mb-6">
          Your Voice. Your Creativity. <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 bg-clip-text text-transparent">AI.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The all-in-one 3-column AI voice and audio studio. Generate hyper-realistic speech, transcribe meetings instantly, write viral scripts, and master multi-track audio.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Launch Studio Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2"
          >
            <Headphones className="w-4 h-4 text-purple-400" />
            <span>Listen to Voice Gallery</span>
          </button>
        </div>

        {/* Interactive Audio Waveform Preview Widget */}
        <div className="max-w-3xl mx-auto rounded-3xl bg-[#0e1424]/90 border border-purple-500/25 p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white">Voxora Waveform Synthesis Preview</h4>
                <p className="text-xs text-slate-400">Voice: Kore · American Natural · 24kHz Ultra-HD</p>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-lg">Studio Live</span>
          </div>

          <div className="bg-[#090d17] p-4 rounded-2xl flex items-center gap-4 mb-4 border border-slate-800/80">
            <button 
              onClick={() => {
                const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
                audio.play().catch(() => alert('Playing Voxora sample audio'));
              }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/40 transition-all shrink-0"
            >
              <Play className="w-5 h-5 ml-0.5" />
            </button>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>0:00</span>
                <span>0:32</span>
              </div>
              {/* Waveform Bar display */}
              <div className="h-6 flex items-center justify-between gap-1 px-1">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-indigo-500 to-purple-400 rounded-full"
                    style={{ height: `${Math.abs(Math.sin(i * 0.3)) * 18 + 6}px` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 italic text-center">
            "Your Voice. Your Creativity. AI. Welcome to Voxora AI Studio."
          </p>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-4">Complete 3-Column AI Audio Ecosystem</h2>
          <p className="text-slate-400 text-sm">Professional creative tools engineered for podcasters, YouTubers, marketers, and studios.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-[#0e1424]/60 border border-slate-800 hover:border-purple-500/40 transition-all group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">AI Voice Studio</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              3-column Text-to-Speech workspace with emotion shaping, speed & pitch sliders, and instant multilingual translation.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0e1424]/60 border border-slate-800 hover:border-indigo-500/40 transition-all group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">Speech-to-Text Studio</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Live microphone capture and multi-format audio transcription with multi-speaker diarization and TXT download.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#0e1424]/60 border border-slate-800 hover:border-pink-500/40 transition-all group shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-pink-600/15 border border-pink-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sliders className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-3">AI Scriptwriter & Mastering</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Generate viral scripts for YouTube and TikTok, master waveforms, and blend background music seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-slate-500">© 2026 Voxora AI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="#docs" className="hover:text-slate-400 transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
