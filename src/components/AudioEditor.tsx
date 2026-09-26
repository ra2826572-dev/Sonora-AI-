import React, { useState } from 'react';
import { 
  Scissors, 
  Play, 
  Pause, 
  Volume2, 
  Download, 
  RefreshCw, 
  Sliders, 
  Music, 
  Layers, 
  Split, 
  SlidersHorizontal,
  Plus
} from 'lucide-react';

export const AudioEditor: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(85);
  const [speed, setSpeed] = useState(1.0);
  const [fadeIn, setFadeIn] = useState(true);
  const [fadeOut, setFadeOut] = useState(true);
  const [bgMusic, setBgMusic] = useState('Lo-Fi Ambient Chill');

  return (
    <div className="h-full flex flex-col">
      {/* Studio Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-800/80 bg-[#0d121f]/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <span>Voxora Professional Audio Editor</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">3-Column Studio</span>
            </h1>
            <p className="text-xs text-slate-400">Timeline Waveform Mastering · Trimming, Splitting, and Effects</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/25 transition-all flex items-center gap-2">
            <Download className="w-3.5 h-3.5" />
            <span>Export Master WAV</span>
          </button>
        </div>
      </div>

      {/* 3-COLUMN AUDIO MASTERING WORKSPACE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-[calc(100vh-140px)]">
        
        {/* COLUMN 1: Tracks & Stems (3 cols) */}
        <div className="lg:col-span-3 border-r border-slate-800/80 bg-[#0d121f]/30 p-5 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Audio Tracks</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-purple-600/15 border border-purple-500/40 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span>Track 1: Primary Voice</span>
                  <span className="text-[10px] text-purple-300 font-mono">Solo</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Voice: Kore (24kHz)</span>
                  <span>100% Vol</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Track 2: Ambient Music</span>
                  <span className="text-[10px] text-slate-500 font-mono">Bed</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{bgMusic}</span>
                  <span>25% Vol</span>
                </div>
              </div>

              <button className="w-full py-2.5 rounded-xl border border-dashed border-slate-800 hover:border-purple-500/40 text-xs font-semibold text-slate-400 hover:text-purple-300 flex items-center justify-center gap-1.5 transition-all">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Background Music Stem</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-indigo-400" />
              <span>Background Music Presets</span>
            </h3>
            <select
              value={bgMusic}
              onChange={(e) => setBgMusic(e.target.value)}
              className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="Lo-Fi Ambient Chill">Lo-Fi Ambient Chill</option>
              <option value="Corporate Inspiring Upbeat">Corporate Inspiring Upbeat</option>
              <option value="Cinematic Orchestral">Cinematic Orchestral</option>
              <option value="Minimal Acoustic Pulse">Minimal Acoustic Pulse</option>
            </select>
          </div>
        </div>

        {/* COLUMN 2: Waveform Timeline Center Stage (6 cols) */}
        <div className="lg:col-span-6 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Multi-Track Timeline</span>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>00:12.4 / 00:45.0</span>
              </div>
            </div>

            {/* Timeline Editor Display */}
            <div className="p-6 rounded-2xl bg-[#090d15] border border-slate-800/90 shadow-2xl relative overflow-hidden min-h-[260px] flex flex-col justify-between">
              
              {/* Playhead line */}
              <div className="absolute top-0 bottom-0 left-[35%] w-[2px] bg-purple-500 shadow-lg shadow-purple-500 z-20 pointer-events-none"></div>

              {/* Track 1 visual waveform */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-purple-300 uppercase tracking-wider">VOICE WAVEFORM</span>
                <div className="h-16 flex items-center justify-between gap-[2px] px-2 bg-[#0e1424] rounded-xl border border-purple-500/20">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-gradient-to-t from-purple-600 to-indigo-400 rounded-full"
                      style={{ height: `${Math.sin(i * 0.3) * 24 + 30}px` }}
                    />
                  ))}
                </div>
              </div>

              {/* Track 2 visual waveform */}
              <div className="space-y-1.5 mt-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">BACKGROUND MUSIC</span>
                <div className="h-12 flex items-center justify-between gap-[2px] px-2 bg-[#0e1424]/60 rounded-xl border border-slate-800/80">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="w-1 bg-slate-700 rounded-full"
                      style={{ height: `${Math.cos(i * 0.4) * 12 + 18}px` }}
                    />
                  ))}
                </div>
              </div>

              {/* Transport Controls */}
              <div className="flex items-center justify-center gap-4 pt-6">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 transition-all"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
              </div>
            </div>

            {/* Editing Tools Bar */}
            <div className="flex items-center justify-between gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all">
                  <Scissors className="w-3.5 h-3.5 text-purple-400" />
                  <span>Trim In / Out</span>
                </button>
                <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all">
                  <Split className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Split at Playhead</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                Sample Rate: 48.0 kHz 32-bit
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: Mastering & Effects Inspector (3 cols) */}
        <div className="lg:col-span-3 border-l border-slate-800/80 bg-[#0d121f]/30 p-5 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
              <span>Mastering Effects</span>
            </h3>

            <div className="space-y-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Master Volume</span>
                  <span className="font-mono text-purple-400">{volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Playback Pitch / Speed</span>
                  <span className="font-mono text-indigo-400">{speed}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <span>Smart Fade In (0.5s)</span>
                  <input
                    type="checkbox"
                    checked={fadeIn}
                    onChange={(e) => setFadeIn(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                  <span>Smooth Fade Out (1.2s)</span>
                  <input
                    type="checkbox"
                    checked={fadeOut}
                    onChange={(e) => setFadeOut(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2">
              <Download className="w-3.5 h-3.5" />
              <span>Export Rendered Audio</span>
            </button>
            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-all border border-slate-700">
              Reset Waveform Edits
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
