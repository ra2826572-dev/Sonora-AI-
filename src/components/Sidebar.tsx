import React from 'react';
import { ActiveTab, User } from '../types';
import { Logo } from './Logo';
import { 
  Mic, 
  FileText, 
  BookOpen, 
  Scissors, 
  Sparkles, 
  FolderKanban, 
  LayoutDashboard, 
  CreditCard, 
  ShieldAlert, 
  User as UserIcon,
  LogOut,
  ChevronRight,
  Sliders,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onLogout,
  isCollapsed,
  setIsCollapsed
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Overview' },
    { id: 'voice', label: 'AI Voice Studio', icon: Mic, category: 'AI Studios', badge: 'Gemini 3.8' },
    { id: 'transcribe', label: 'Speech-to-Text', icon: FileText, category: 'AI Studios' },
    { id: 'writing', label: 'AI Scriptwriter', icon: BookOpen, category: 'AI Studios' },
    { id: 'editor', label: 'Audio Editor', icon: Scissors, category: 'AI Studios' },
    { id: 'library', label: 'Voice Gallery', icon: Sparkles, category: 'Assets' },
    { id: 'projects', label: 'Projects & History', icon: FolderKanban, category: 'Assets' },
    { id: 'pricing', label: 'Subscription', icon: CreditCard, category: 'Manage' },
    { id: 'admin', label: 'Admin Panel', icon: ShieldAlert, category: 'Manage' },
  ];

  return (
    <aside 
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#0d121f] border-r border-slate-800/80 transition-all duration-300 flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Brand Zone */}
      <div className="p-4 border-b border-slate-800/80">
        <button 
          onClick={() => setActiveTab(currentUser ? 'dashboard' : 'home')} 
          className="focus:outline-none w-full text-left"
        >
          {isCollapsed ? (
            <div className="flex justify-center">
              <Logo size="sm" />
            </div>
          ) : (
            <Logo showTagline={true} />
          )}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        <div>
          {!isCollapsed && (
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
              Studio Tools
            </div>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!currentUser && item.id !== 'dashboard' && item.id !== 'pricing' && item.id !== 'library') {
                      onOpenAuth();
                    } else {
                      setActiveTab(item.id as ActiveTab);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 text-purple-300 border border-purple-500/30 shadow-md shadow-purple-900/20' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                    isActive 
                      ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/50' 
                      : 'bg-slate-800/60 text-slate-400 group-hover:text-purple-300 group-hover:bg-slate-800'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between text-left truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 ml-1.5">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Studio Live Status Widget (when not collapsed) */}
        {!isCollapsed && currentUser && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#131a2e] to-[#0f1424] border border-indigo-500/20 shadow-inner">
            <div className="flex items-center justify-between text-[11px] mb-2">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Credits</span>
              </span>
              <span className="font-mono text-purple-300 font-bold">
                {currentUser.role === 'admin' ? 'Unlimited' : `${currentUser.credits - currentUser.creditsUsed} left`}
              </span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-2.5">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${currentUser.role === 'admin' ? 10 : Math.min(100, Math.round((currentUser.creditsUsed / currentUser.credits) * 100))}%` 
                }}
              />
            </div>
            <button
              onClick={() => setActiveTab('pricing')}
              className="w-full text-center text-[10px] font-bold text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 py-1.5 rounded-lg transition-all border border-indigo-500/20"
            >
              Get More Credits
            </button>
          </div>
        )}
      </div>

      {/* User & Settings Footer */}
      <div className="p-3 border-t border-slate-800/80">
        {currentUser ? (
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onOpenProfile}
              className={`flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/60 transition-all text-left flex-1 min-w-0 ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-purple-500/40 shrink-0" 
              />
              {!isCollapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-purple-400 font-medium truncate">@{currentUser.username || 'creator'} · <span className="capitalize">{currentUser.plan}</span></div>
                </div>
              )}
            </button>

            {!isCollapsed && (
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className={`w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-purple-600/20 transition-all ${
              isCollapsed ? 'px-0 text-[10px]' : 'px-4'
            }`}
          >
            {isCollapsed ? 'Login' : 'Sign In'}
          </button>
        )}
      </div>
    </aside>
  );
};
