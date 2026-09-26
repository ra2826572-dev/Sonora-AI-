import React, { useState } from 'react';
import { CheckCircle2, Sparkles, CreditCard, Zap } from 'lucide-react';
import { User } from '../types';

interface PricingViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ currentUser, onOpenAuth }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleUpgrade = (planName: string) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setSelectedPlan(planName);
    setSuccessMessage(`Successfully upgraded to Voxora ${planName} Plan! (Stripe billing simulated securely).`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Voxora AI Studio Subscriptions</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Simple, Transparent Pricing</h1>
        <p className="text-slate-400 text-sm">Empower your audio workflow with generous monthly AI credits, ultra-HD voice synthesis, and multi-track stems.</p>
      </div>

      {successMessage && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-medium shadow-xl">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Free Plan */}
        <div className="bg-[#0e1424]/60 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Free Explorer</h3>
            <p className="text-xs text-slate-400 mb-6">For casual experimentation and speech testing.</p>
            <div className="text-3xl font-extrabold text-white mb-6">$0 <span className="text-xs text-slate-400 font-normal">/ month</span></div>

            <ul className="space-y-3.5 text-xs text-slate-300 mb-8">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>100 Monthly AI Credits</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Standard Voice Personas</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Microphone Speech-to-Text</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Standard MP3 Export</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('Free')}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all"
          >
            Current Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-[#0e1424] border-2 border-purple-500/50 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Most Popular
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-1">Pro Creator</h3>
            <p className="text-xs text-slate-400 mb-6">For professional YouTubers, podcasters & studios.</p>
            <div className="text-3xl font-extrabold text-white mb-6">$29 <span className="text-xs text-slate-400 font-normal">/ month</span></div>

            <ul className="space-y-3.5 text-xs text-slate-300 mb-8">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>1,000 Monthly AI Credits</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Full Voice Gallery & Emotion Controls</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Multi-Speaker Diarization & Translation</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>24kHz Ultra-HD Master WAV Audio</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Full 3-Column Studio Workspaces</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('Pro Creator')}
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all"
          >
            Upgrade to Pro
          </button>
        </div>

        {/* Business Plan */}
        <div className="bg-[#0e1424]/60 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Business Studio</h3>
            <p className="text-xs text-slate-400 mb-6">For agencies, media networks & enterprise scale.</p>
            <div className="text-3xl font-extrabold text-white mb-6">$99 <span className="text-xs text-slate-400 font-normal">/ month</span></div>

            <ul className="space-y-3.5 text-xs text-slate-300 mb-8">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>5,000 Monthly AI Credits</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Custom Voice Personas & Cloning</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Team Collaboration Workspaces</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Dedicated High-Throughput Cloud Rendering</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleUpgrade('Business Studio')}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-all"
          >
            Upgrade to Business
          </button>
        </div>

      </div>
    </div>
  );
};
