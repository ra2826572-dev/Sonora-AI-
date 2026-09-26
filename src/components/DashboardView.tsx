import React from 'react';
import { User, ActiveTab } from '../types';
import { 
  Sparkles, 
  Mic, 
  FileText, 
  BookOpen, 
  Scissors, 
  ArrowRight, 
  CreditCard, 
  ShieldCheck, 
  Zap,
  Activity,
  Headphones,
  Sliders,
  FolderKanban,
  AtSign,
  Mail
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: User | null;
  setActiveTab: (tab: ActiveTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ currentUser, setActiveTab }) => {
  if (!currentUser) return null;

  const creditLimit = currentUser.role === 'admin' ? 10000 : (currentUser.plan === 'pro' ? 1000 : (currentUser.plan === 'business' ? 5000 : 100));
  const creditsRemaining = currentUser.role === 'admin' ? 'Unlimited' : (creditLimit - currentUser.creditsUsed);
  const percentageUsed = currentUser.role === 'admin' ? 12 : Math.min(100, Math.round((currentUser.creditsUsed / creditLimit) * 100));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Welcome Banner with Prominent User Name and Profile Picture */}
      <div className="bg-gradient-to-r from-[#141226] via-[#101426] to-[#0c101c] border border-purple-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-5 z-10">
          {/* User Profile Picture (DP) */}
          <div className="relative group">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-purple-500/50 shadow-2xl transition-transform group-hover:scale-105"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-[#0c101c] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 uppercase tracking-wider">
                {currentUser.plan} Studio Tier
              </span>
              {currentUser.role === 'admin' && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 uppercase tracking-wider">
                  Admin Master
                </span>
              )}
            </div>
            
            {/* User Full Name & Handle */}
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <span>{currentUser.name}</span>
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
              <span className="text-purple-300 font-semibold">@{currentUser.username || 'creator'}</span>
              <span>·</span>
              <span className="text-slate-400">{currentUser.email}</span>
            </div>
          </div>
        </div>

        {/* Live Credit Meter */}
        <div className="bg-[#0a0e17]/90 border border-slate-800 rounded-2xl p-5 w-full md:w-80 shadow-2xl z-10 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span>Available AI Credits</span>
            </span>
            <span className="font-mono font-bold text-purple-300">{creditsRemaining}</span>
          </div>

          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500" 
              style={{ width: `${percentageUsed}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-500 font-mono">{currentUser.creditsUsed} / {creditLimit} used</span>
            <button
              onClick={() => setActiveTab('pricing')}
              className="text-[11px] font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>Upgrade</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Studio Quick Access */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Modern 3-Column AI Studios</h3>
          <span className="text-xs text-purple-400 font-mono">Select a workspace to start</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <button
            onClick={() => setActiveTab('voice')}
            className="p-6 bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/50 rounded-2xl text-left transition-all group shadow-xl hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">AI Voice Studio</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              3-column TTS studio with emotion parameters, 24kHz HD audio, and multilingual translation.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('transcribe')}
            className="p-6 bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl text-left transition-all group shadow-xl hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Speech-to-Text</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              3-column transcription studio with live mic capture, multi-format upload, and export.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('writing')}
            className="p-6 bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/50 rounded-2xl text-left transition-all group shadow-xl hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">AI Scriptwriter</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate YouTube video scripts, shorts, and ad copy with 1-click voice studio transfer.
            </p>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className="p-6 bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl text-left transition-all group shadow-xl hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Scissors className="w-6 h-6 text-indigo-400" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Audio Editor</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Multi-track waveform timeline with trimming, background music stems, and master export.
            </p>
          </button>

        </div>
      </div>

      {/* Asset Hub Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="p-6 rounded-2xl bg-[#0d121f]/50 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Voice Personas Library</h4>
              <p className="text-[11px] text-slate-400">Preview 6+ professional broadcast personas</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('library')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
          >
            Explore
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-[#0d121f]/50 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Recent Projects & Stems</h4>
              <p className="text-[11px] text-slate-400">Manage saved audio, transcripts & copy</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('projects')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
          >
            View All
          </button>
        </div>
      </div>
    </div>
  );
};
