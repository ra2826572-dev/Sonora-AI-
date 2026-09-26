/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, User } from './types';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { DashboardView } from './components/DashboardView';
import { VoiceStudio } from './components/VoiceStudio';
import { TranscribeStudio } from './components/TranscribeStudio';
import { WritingStudio } from './components/WritingStudio';
import { AudioEditor } from './components/AudioEditor';
import { VoiceLibrary } from './components/VoiceLibrary';
import { ProjectsView } from './components/ProjectsView';
import { PricingView } from './components/PricingView';
import { AdminView } from './components/AdminView';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('voxora_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    // Default logged in with Marcus Sterling so user can immediately experience the studio
    return {
      id: 'u_user1',
      name: 'Marcus Sterling',
      username: 'marcus',
      email: 'marcus@creator.io',
      role: 'user',
      plan: 'pro',
      credits: 1000,
      creditsUsed: 140,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      createdAt: new Date().toISOString()
    };
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => currentUser ? 'dashboard' : 'home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('voxora_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('voxora_user');
      // If user logs out, redirect to public landing page
      setActiveTab('home');
    }
  }, [currentUser]);

  // Protected route guard: Login ke baghair dashboard aur private studio access na ho (Admin panel has its own master passcode gate 591111)
  const safeSetActiveTab = (tab: ActiveTab) => {
    const publicTabs: ActiveTab[] = ['home', 'pricing', 'library', 'admin'];
    if (!currentUser && !publicTabs.includes(tab)) {
      setAuthOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  const showSidebar = !!currentUser && activeTab !== 'home';

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Clean Sidebar Navigation */}
      {showSidebar && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={safeSetActiveTab}
          currentUser={currentUser}
          onOpenAuth={() => setAuthOpen(true)}
          onOpenProfile={() => setProfileOpen(true)}
          onLogout={handleLogout}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
      )}

      {/* Main Workspace Frame */}
      <div 
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          showSidebar ? (sidebarCollapsed ? 'ml-20' : 'ml-64') : 'ml-0'
        }`}
      >
        <Navbar
          activeTab={activeTab}
          setActiveTab={safeSetActiveTab}
          currentUser={currentUser}
          onOpenAuth={() => setAuthOpen(true)}
          onOpenProfile={() => setProfileOpen(true)}
          onLogout={handleLogout}
          isSidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={showSidebar ? () => setSidebarCollapsed(!sidebarCollapsed) : undefined}
        />

        <main className="flex-1 overflow-x-hidden">
          {activeTab === 'home' && (
            <LandingHero
              onGetStarted={() => {
                if (currentUser) safeSetActiveTab('dashboard');
                else setAuthOpen(true);
              }}
              setActiveTab={safeSetActiveTab}
            />
          )}

          {activeTab === 'dashboard' && currentUser && (
            <DashboardView currentUser={currentUser} setActiveTab={safeSetActiveTab} />
          )}

          {activeTab === 'voice' && currentUser && (
            <VoiceStudio 
              currentUser={currentUser} 
              onOpenAuth={() => setAuthOpen(true)} 
              setActiveTab={safeSetActiveTab}
            />
          )}

          {activeTab === 'transcribe' && currentUser && (
            <TranscribeStudio 
              currentUser={currentUser} 
              onOpenAuth={() => setAuthOpen(true)} 
              setActiveTab={safeSetActiveTab}
            />
          )}

          {activeTab === 'writing' && currentUser && (
            <WritingStudio 
              currentUser={currentUser} 
              onOpenAuth={() => setAuthOpen(true)} 
              setActiveTab={safeSetActiveTab} 
            />
          )}

          {activeTab === 'editor' && currentUser && (
            <AudioEditor />
          )}

          {activeTab === 'library' && (
            <VoiceLibrary />
          )}

          {activeTab === 'projects' && currentUser && (
            <ProjectsView currentUser={currentUser} onOpenAuth={() => setAuthOpen(true)} />
          )}

          {activeTab === 'pricing' && (
            <PricingView currentUser={currentUser} onOpenAuth={() => setAuthOpen(true)} />
          )}

          {activeTab === 'admin' && (
            <AdminView currentUser={currentUser} />
          )}
        </main>
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLogin={handleLogin}
      />

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}
