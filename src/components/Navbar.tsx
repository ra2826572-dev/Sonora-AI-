import React from 'react';
import { ActiveTab, User } from '../types';
import { Logo } from './Logo';
import { 
  Sparkles, 
  CreditCard, 
  User as UserIcon,
  ChevronDown,
  Menu,
  Sliders,
  Zap,
  LogOut,
  SlidersHorizontal,
  ShieldAlert
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onLogout,
  isSidebarCollapsed,
  onToggleSidebar
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);

  const getBreadcrumbTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'voice': return 'AI Voice Studio (3-Column)';
      case 'transcribe': return 'Speech-to-Text Studio';
      case 'writing': return 'AI Scriptwriter & Story Studio';
      case 'editor': return 'Professional Audio Editor';
      case 'library': return 'Voice Gallery & Personas';
      case 'projects': return 'Projects & Stem History';
      case 'pricing': return 'Subscription & Pricing';
      case 'admin': return 'Admin Control Panel';
      default: return 'Studio';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0d121f]/90 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3 transition-all">
      <div className="flex items-center justify-between">
        
        {/* Left: Sidebar Toggle & Breadcrumb */}
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              title="Toggle Studio Sidebar"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {!currentUser && (
            <button 
              onClick={() => setActiveTab('home')} 
              className="focus:outline-none flex items-center gap-2"
            >
              <Logo size="sm" showTagline={false} />
            </button>
          )}

          {currentUser && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Workspace</span>
              <span className="text-slate-600">/</span>
              <span className="font-bold text-white tracking-wide">{getBreadcrumbTitle(activeTab)}</span>
            </div>
          )}
        </div>

        {/* Right: Credits, Pricing, User Dropdown */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="hidden sm:flex items-center gap-2 bg-[#121829] border border-purple-500/20 px-3 py-1.5 rounded-xl text-xs">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-400">Credits:</span>
              <span className="font-mono font-bold text-purple-300">
                {currentUser.role === 'admin' ? 'Unlimited' : `${currentUser.credits - currentUser.creditsUsed}`}
              </span>
            </div>
          )}

          <button
            onClick={() => setActiveTab('pricing')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/25 rounded-xl hover:bg-purple-500/20 transition-all"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Upgrade</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-xl hover:bg-amber-500/20 transition-all"
            title="Admin Control Panel"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Admin Panel</span>
          </button>

          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2.5 p-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all focus:outline-none"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-purple-500/40"
                />
                <span className="hidden md:block text-xs font-semibold text-white px-1">{currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-1" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f1424] border border-slate-800 shadow-2xl py-2 z-50 backdrop-blur-xl">
                  <div className="px-4 py-2 border-b border-slate-800/80">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-xs font-semibold text-white truncate">{currentUser.email}</p>
                    <div className="mt-1 text-[10px] text-purple-400 capitalize">{currentUser.plan} Studio Plan</div>
                  </div>

                  <button
                    onClick={() => { setProfileMenuOpen(false); onOpenProfile(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-purple-400" />
                    <span>Account Settings</span>
                  </button>

                  <button
                    onClick={() => { setProfileMenuOpen(false); setActiveTab('pricing'); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span>Billing & Credits</span>
                  </button>

                  <div className="my-1 border-t border-slate-800"></div>

                  <button
                    onClick={() => { setProfileMenuOpen(false); onLogout(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAuth}
                className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={onOpenAuth}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/25 transition-all"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
