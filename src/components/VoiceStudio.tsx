import React, { useState } from 'react';
import { User, ActiveTab } from '../types';
import { generateTTS, saveProject, translateText } from '../services/api';
import { 
  Mic, 
  Play, 
  Pause, 
  Download, 
  Sparkles, 
  Volume2, 
  Sliders, 
  Globe, 
  RefreshCw, 
  Check, 
  Copy, 
  Send, 
  Headphones, 
  Settings2, 
  Zap, 
  Trash2,
  FileEdit,
  Clock,
  Radio
} from 'lucide-react';

interface VoiceStudioProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  setActiveTab?: (tab: ActiveTab) => void;
}

export const VoiceStudio: React.FC<VoiceStudioProps> = ({ currentUser, onOpenAuth, setActiveTab }) => {
  const [text, setText] = useState('Welcome to Voxora AI. Experience the next era of lifelike voice intelligence, seamless multilingual speech synthesis, and studio-grade audio production.');
  const [voiceName, setVoiceName] = useState('Kore');
  const [style, setStyle] = useState('Natural, professional, and conversational');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState('normal');
  const [language, setLanguage] = useState('English');
  const [translating, setTranslating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState('0:08');
  const [projectSaved, setProjectSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const voices = [
    { id: 'Kore', name: 'Kore', gender: 'Female', accent: 'American', style: 'Articulate & Warm', tag: 'Recommended' },
    { id: 'Puck', name: 'Puck', gender: 'Male', accent: 'British', style: 'Deep Authority', tag: 'Popular' },
    { id: 'Charon', name: 'Charon', gender: 'Male', accent: 'American', style: 'Calm Narration', tag: 'Story' },
    { id: 'Fenrir', name: 'Fenrir', gender: 'Female', accent: 'Australian', style: 'Energetic Commercial', tag: 'Punchy' },
    { id: 'Zephyr', name: 'Zephyr', gender: 'Female', accent: 'Global', style: 'Conversational Podcast', tag: 'Soft' },
    { id: 'Aoede', name: 'Aoede', gender: 'Female', accent: 'British', style: 'Elegant & Crisp', tag: 'Audiobook' }
  ];

  const languages = [
    { name: 'English', dir: 'ltr' },
    { name: 'Urdu', dir: 'rtl' },
    { name: 'Roman Urdu', dir: 'ltr' },
    { name: 'Arabic', dir: 'rtl' },
    { name: 'Hindi', dir: 'ltr' },
    { name: 'Punjabi', dir: 'ltr' },
    { name: 'Spanish', dir: 'ltr' },
    { name: 'French', dir: 'ltr' },
    { name: 'German', dir: 'ltr' },
  ];

  const samplePrompts = [
    "Welcome to today's deep dive into generative voice synthesis and creative audio workflows.",
    "Breaking news: Researchers unveil ultra-realistic speech models capable of nuanced emotion.",
    "Take a deep breath. Feel the calm wash over your body as we embark on this mindful journey."
  ];

  const currentLangObj = languages.find(l => l.name === language) || languages[0];

  const handleGenerate = async () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setProjectSaved(false);

    try {
      const res = await generateTTS({
        text,
        voiceName,
        style,
        speed,
        pitch,
        userId: currentUser.id,
      });

      if (res.success && res.audioData) {
        setAudioUrl(res.audioData);
        setDuration(res.duration || '0:10');
      }
    } catch (err: any) {
      setError(err.message || 'Voice synthesis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setTranslating(true);
    try {
      const res = await translateText(text, language);
      if (res.translatedText) {
        setText(res.translatedText);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTranslating(false);
    }
  };

  const handleSaveToProjects = async () => {
    if (!currentUser || !audioUrl) return;
    try {
      await saveProject({
        userId: currentUser.id,
        title: text.slice(0, 32) + '...',
        type: 'audio',
        content: text,
        audioUrl: audioUrl,
        duration: duration,
      });
      setProjectSaved(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Studio Header Bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-800/80 bg-[#0d121f]/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <span>Voxora Voice Studio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">3-Column Studio</span>
            </h1>
            <p className="text-xs text-slate-400">Text-to-Speech Engine · Multilingual Speech Synthesis</p>
          </div>
        </div>

        {/* Global Language & Action Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#121829] border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
            >
              {languages.map((l) => (
                <option key={l.name} value={l.name} className="bg-[#0f1424] text-white">{l.name}</option>
              ))}
            </select>
            <button
              onClick={handleTranslate}
              disabled={translating}
              className="ml-2 px-2.5 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all"
            >
              {translating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              <span>Translate Text</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mx-8 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* 3-COLUMN AI STUDIO WORKSPACE */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-[calc(100vh-140px)]">
        
        {/* COLUMN 1: Voice Persona & Style Presets (3 cols) */}
        <div className="lg:col-span-3 border-r border-slate-800/80 bg-[#0d121f]/30 p-5 overflow-y-auto space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-purple-400" />
                <span>Voice Persona</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">{voices.length} Available</span>
            </div>

            <div className="space-y-2">
              {voices.map((v) => {
                const isSelected = voiceName === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setVoiceName(v.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all border flex items-center justify-between group ${
                      isSelected
                        ? 'bg-purple-600/15 border-purple-500/50 shadow-md shadow-purple-900/20'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected 
                          ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/50' 
                          : 'bg-slate-800 text-slate-400 group-hover:text-purple-300'
                      }`}>
                        {v.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-white">{v.name}</span>
                          <span className="text-[10px] text-slate-400">· {v.gender}</span>
                        </div>
                        <span className="text-[11px] text-purple-400/90 font-medium block">{v.style}</span>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                      {v.accent}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Speaking Emotion / Style */}
          <div className="pt-4 border-t border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-indigo-400" />
              <span>Emotion & Tone</span>
            </h3>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="Natural, professional, and conversational">Conversational & Natural</option>
              <option value="Warm, empathetic storytelling narration">Storytelling & Narration</option>
              <option value="Enthusiastic and energetic broadcast style">Energetic Commercial</option>
              <option value="Calm, serene meditation instructor">Calm & Meditative</option>
              <option value="Crisp authoritative news anchor">News & Educational</option>
            </select>
          </div>

          {/* Quick Script Prompts */}
          <div className="pt-4 border-t border-slate-800/80">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <FileEdit className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sample Scripts</span>
            </h3>
            <div className="space-y-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setText(p)}
                  className="w-full p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800/80 text-[11px] text-slate-400 hover:text-slate-200 text-left line-clamp-2 transition-all"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMN 2: Center Creative Stage & Waveform Editor (6 cols) */}
        <div className="lg:col-span-6 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Script Workspace</span>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>{text.length} chars</span>
                <span>·</span>
                <span>{text.split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </div>

            <div className="relative">
              <textarea
                dir={currentLangObj.dir}
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
                className="w-full bg-[#0a0e17] border border-slate-800/90 rounded-2xl p-5 text-slate-100 text-sm focus:outline-none focus:border-purple-500 transition-all leading-relaxed shadow-inner"
                placeholder="Write or paste your script here..."
              />
              <div className="absolute right-4 bottom-4 flex items-center gap-2">
                <button
                  onClick={() => setText('')}
                  title="Clear text"
                  className="p-1.5 text-slate-500 hover:text-slate-300 bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(text)}
                  title="Copy text"
                  className="p-1.5 text-slate-500 hover:text-slate-300 bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Waveform Visualization Canvas */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d1222] via-[#10162a] to-[#0d1222] border border-purple-500/20 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Waveform Master</span>
                </span>
                <span>{duration}</span>
              </div>

              {/* Dynamic waveform visualizer */}
              <div className="h-14 flex items-center justify-between gap-1 px-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                {Array.from({ length: 42 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      loading 
                        ? 'bg-purple-500 animate-pulse' 
                        : audioUrl 
                          ? 'bg-gradient-to-t from-indigo-500 to-purple-400' 
                          : 'bg-slate-800'
                    }`}
                    style={{
                      height: loading 
                        ? `${Math.sin(i * 0.4) * 20 + 25}px` 
                        : audioUrl 
                          ? `${Math.abs(Math.sin(i * 0.35)) * 34 + 10}px` 
                          : '8px'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Voice: <span className="font-semibold text-white">{voiceName}</span> · Est. Speed: <span className="font-mono text-purple-400">{speed}x</span>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !text.trim()}
              className="px-8 py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-xl shadow-purple-600/30 transition-all flex items-center gap-2.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Voice...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize Voice</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* COLUMN 3: Inspector, Playback & Export Engine (3 cols) */}
        <div className="lg:col-span-3 border-l border-slate-800/80 bg-[#0d121f]/30 p-5 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Voice Parameters</span>
            </h3>

            <div className="space-y-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Playback Speed</span>
                  <span className="font-mono text-purple-400">{speed}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1.5">
                  <span>Pitch Tone</span>
                  <span className="capitalize font-mono text-indigo-400">{pitch}</span>
                </div>
                <select
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  className="w-full bg-[#0a0e17] border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="low">Deep / Warm</option>
                  <option value="normal">Standard Natural</option>
                  <option value="high">High / Bright</option>
                </select>
              </div>
            </div>
          </div>

          {/* Audio Output Player Card */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Audio Output</span>
            </h3>

            {audioUrl ? (
              <div className="p-4 bg-slate-900/90 border border-purple-500/30 rounded-2xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Format: MP3 HD</span>
                  <span className="text-purple-400 font-mono font-semibold">{duration}</span>
                </div>

                <audio controls src={audioUrl} className="w-full accent-purple-500" />

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <a
                    href={audioUrl}
                    download={`voxora-audio-${Date.now()}.mp3`}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Master Audio</span>
                  </a>

                  <button
                    onClick={handleSaveToProjects}
                    disabled={projectSaved}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700"
                  >
                    {projectSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Saved to Projects</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>Save to Projects</span>
                      </>
                    )}
                  </button>

                  {setActiveTab && (
                    <button
                      onClick={() => setActiveTab('editor')}
                      className="w-full py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-indigo-500/20"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Send to Audio Editor</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-2">
                <Mic className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-300">No Audio Generated</p>
                <p className="text-[11px] text-slate-500">Hit "Synthesize Voice" to generate high-definition audio.</p>
              </div>
            )}
          </div>

          {/* Model Telemetry */}
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-[11px] space-y-1.5 font-mono text-slate-400">
            <div className="flex justify-between">
              <span>Engine:</span>
              <span className="text-purple-400">gemini-3.8-flash-lite-tts</span>
            </div>
            <div className="flex justify-between">
              <span>Sample Rate:</span>
              <span className="text-slate-200">24.0 kHz Ultra-HD</span>
            </div>
            <div className="flex justify-between">
              <span>Direction:</span>
              <span className="uppercase text-slate-200">{currentLangObj.dir}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
