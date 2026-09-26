import React from 'react';
import { User } from '../types';
import { X, Shield, CreditCard, Sparkles, Zap } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, currentUser }) => {
  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="bg-[#0e1424] border border-slate-800 rounded-3xl w-full max-w-lg p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800/80">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-purple-500/40 shadow-xl"
          />
          <div>
            <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="text-purple-300 font-semibold">@{currentUser.username || 'creator'}</span>
              <span>·</span>
              <span>{currentUser.email}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3.5">
          <div className="flex items-center justify-between p-4 bg-[#090d17] rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-slate-300">Workspace Role</span>
            </div>
            <span className="text-xs font-semibold text-white capitalize px-2.5 py-1 bg-slate-800 rounded-lg">{currentUser.role}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#090d17] rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-300">Studio Tier</span>
            </div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg">{currentUser.plan}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#090d17] rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-semibold text-slate-300">Monthly AI Credits</span>
            </div>
            <span className="text-xs font-mono font-bold text-purple-300">
              {currentUser.role === 'admin' ? 'Unlimited' : `${currentUser.credits - currentUser.creditsUsed} / ${currentUser.credits}`}
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
};
