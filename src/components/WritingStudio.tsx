import React, { useState } from 'react';
import { User, ActiveTab } from '../types';
import { generateWriting, translateText } from '../services/api';
import { 
  BookOpen, 
  Sparkles, 
  Copy, 
  Send, 
  RefreshCw, 
  Download, 
  FileText, 
  Layers, 
  SlidersHorizontal,
  Check,
  Globe
} from 'lucide-react';

interface WritingStudioProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const WritingStudio: React.FC<WritingStudioProps> = ({ currentUser, onOpenAuth, setActiveTab }) => {
  const [prompt, setPrompt] = useState('Top 5 generative AI tools for video creators in 2026');
  const [contentType, setContentType] = useState('YouTube Script');
  const [tone, setTone] = useState('Engaging and upbeat');
  const [language, setLanguage] = useState('English');
  const [length, setLength] = useState('Medium');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contentTypes = [
    { id: 'YouTube Script', label: 'YouTube Video Script', desc: 'Full narrative script with hooks & host cues' },
    { id: 'YouTube Shorts Script', label: 'YouTube Shorts / Reels', desc: 'Fast-paced viral 60-second retention format' },
    { id: 'Podcast Show Notes', label: 'Podcast Discussion Script', desc: 'Dual-speaker conversational dialogue' },
    { id: 'Advertisement Script', label: 'Commercial Ad Copy', desc: 'High-converting call to action' },
    { id: 'Blog Post', label: 'Tech Article / Blog', desc: 'Structured editorial breakdown' },
    { id: 'Story Generator', label: 'Creative Fiction Story', desc: 'Immersive narrative storytelling' },
  ];

  const handleGenerate = async () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await generateWriting({
        prompt,
        contentType,
        tone,
        language,
        length,
        userId: currentUser.id,
      });

      if (res.content) {
        setOutput(res.content);
      }
    } catch (err: any) {
      setError(err.message || 'Script generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Studio Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-800/80 bg-[#0d121f]/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-2">
              <span>Voxora AI Scriptwriter & Story Studio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">3-Column Studio</span>
            </h1>
            <p className="text-xs text-slate-400">AI Narrative Generation · Direct Integration with Voice Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/25 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Generate Content</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mx-8 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {error}
        </div>
      )}

      {/* 3-COLUMN AI SCRIPTWRITING STUDIO */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden min-h-[calc(100vh-140px)]">
        
        {/* COLUMN 1: Content Type & Persona Settings (3 cols) */}
        <div className="lg:col-span-3 border-r border-slate-800/80 bg-[#0d121f]/30 p-5 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Format Preset</span>
            </h3>

            <div className="space-y-2">
              {contentTypes.map((c) => {
                const isSelected = contentType === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setContentType(c.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all border ${
                      isSelected
                        ? 'bg-purple-600/15 border-purple-500/50 shadow-md shadow-purple-900/20'
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="text-xs font-semibold text-white">{c.label}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{c.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Tone of Voice</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="Engaging and upbeat">Engaging & Upbeat</option>
                <option value="Professional and authoritative">Authoritative & Thought-Leader</option>
                <option value="Humorous and entertaining">Humorous & Entertaining</option>
                <option value="Suspenseful storytelling">Dramatic Storytelling</option>
                <option value="Calm educational">Educational & Crisp</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-[#0a0e17] border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
              >
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
                <option value="Roman Urdu">Roman Urdu</option>
                <option value="Arabic">Arabic</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Target Length</label>
              <div className="grid grid-cols-3 gap-2">
                {['Short', 'Medium', 'Long'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLength(l)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                      length === l 
                        ? 'bg-purple-600 text-white border-purple-500' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: Prompt Input & Generated Script Stage (6 cols) */}
        <div className="lg:col-span-6 p-6 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">Topic or Prompt Brief</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full bg-[#0a0e17] border border-slate-800/90 rounded-2xl p-4 text-slate-100 text-sm focus:outline-none focus:border-purple-500 transition-all leading-relaxed shadow-inner"
                placeholder="What topic or narrative should Voxora AI write about?"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Generated Script</label>
                {output && (
                  <span className="text-xs text-slate-400 font-mono">
                    {output.split(/\s+/).filter(Boolean).length} words
                  </span>
                )}
              </div>

              <textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                rows={13}
                className="w-full bg-[#0a0e17] border border-slate-800/90 rounded-2xl p-4 text-slate-100 text-xs font-mono focus:outline-none focus:border-purple-500 transition-all leading-relaxed shadow-inner"
                placeholder="Generated script output will appear here. You can freely edit and refine it..."
              />
            </div>
          </div>
        </div>

        {/* COLUMN 3: Script Inspector & Transfer Engine (3 cols) */}
        <div className="lg:col-span-3 border-l border-slate-800/80 bg-[#0d121f]/30 p-5 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
              <span>Studio Actions</span>
            </h3>

            {output ? (
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('voice')}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Voice Studio</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Script</span>
                    </>
                  )}
                </button>

                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(output)}`}
                  download="voxora-script.txt"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </a>
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl space-y-2">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-300">Ready to Write</p>
                <p className="text-[11px] text-slate-500">Configure your parameters and generate broadcast-ready scripts.</p>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-[11px] space-y-2 text-slate-400 font-mono">
            <div className="flex justify-between">
              <span>Engine:</span>
              <span className="text-purple-400">Gemini 3.8 Flash</span>
            </div>
            <div className="flex justify-between">
              <span>Model Class:</span>
              <span className="text-slate-200">Creative Scripting</span>
            </div>
            <div className="flex justify-between">
              <span>Transfer:</span>
              <span className="text-indigo-400 font-semibold">1-Click TTS</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
