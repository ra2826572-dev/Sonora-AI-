import React, { useEffect, useState } from 'react';
import { User, Project } from '../types';
import { fetchAdminStats, verifyAdminPassword, updateAdminUserCredits, deleteUserByAdmin } from '../services/api';
import { 
  ShieldAlert, 
  Users, 
  FolderKanban, 
  Activity, 
  Server, 
  Search, 
  Sparkles, 
  Cpu, 
  Lock, 
  KeyRound, 
  LogIn, 
  Clock, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Play, 
  RefreshCw, 
  Trash2, 
  PlusCircle,
  FileText,
  Mic,
  BookOpen,
  ArrowRight,
  Mail
} from 'lucide-react';

interface AdminViewProps {
  currentUser: User | null;
}

export const AdminView: React.FC<AdminViewProps> = ({ currentUser }) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return currentUser?.role === 'admin' || sessionStorage.getItem('voxora_admin_unlocked') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'users' | 'logins' | 'projects' | 'logs'>('logins');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminStats();
      setStats(data);
    } catch (err: any) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isUnlocked) {
      loadData();
    }
  }, [isUnlocked]);

  const handleUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setVerifyError(null);
    setVerifying(true);

    try {
      await verifyAdminPassword(passwordInput.trim());
      setIsUnlocked(true);
      sessionStorage.setItem('voxora_admin_unlocked', 'true');
      setPasswordInput('');
    } catch (err: any) {
      setVerifyError(err.message || 'Incorrect Admin Password. Required: 591111');
    } finally {
      setVerifying(false);
    }
  };


  const handleLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('voxora_admin_unlocked');
  };

  const handleAddCredits = async (userId: string, currentCredits: number) => {
    try {
      await updateAdminUserCredits(userId, currentCredits + 1000);
      setActionSuccess('Added 1,000 credits to user successfully!');
      setTimeout(() => setActionSuccess(null), 3000);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user ${name}?`)) return;
    try {
      await deleteUserByAdmin(userId);
      setActionSuccess(`User ${name} removed from database.`);
      setTimeout(() => setActionSuccess(null), 3000);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ==================== 1. PASSWORD GATE SCREEN (If not unlocked) ====================
  if (!isUnlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="bg-[#0e1424] border border-slate-800 rounded-3xl w-full max-w-md p-8 shadow-2xl relative text-center">
          <div className="relative mx-auto mb-5 w-24 h-24">
            <img 
              src="/rizwan_admin.jpg" 
              alt="Rizwan - Web Designer & Developer" 
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-full object-cover ring-2 ring-amber-400/90 shadow-2xl shadow-amber-500/30"
            />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-950 border border-amber-500/60 flex items-center justify-center text-amber-400 shadow-md">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-0.5">Rizwan · Admin Master Gate</h2>
          <p className="text-[11px] font-semibold text-amber-400 tracking-wide uppercase mb-2">Web Designer & Developer</p>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Yeh panel restricted hai. Is ko access karne ke liye Admin Master Password darj karein. Is ke andar tamam registered users ka login aur studio data show hota hai.
          </p>

          {verifyError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {verifyError}
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Admin Master Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full bg-[#090d17] border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-xs text-white focus:outline-none focus:border-amber-500 font-mono tracking-wider"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={verifying || !passwordInput}
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {verifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Passcode...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>Unlock Admin Panel</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==================== 2. UNLOCKED FULL ADMIN PANEL ====================
  if (loading && !stats) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm font-mono flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
        <span>Loading live admin user telemetry & login database...</span>
      </div>
    );
  }

  const usersList = stats?.users || [];
  const loginHistoryList = stats?.loginHistory || [];
  const projectsList = stats?.projects || [];

  const filteredUsers = usersList.filter((u: any) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 uppercase tracking-wider">
              Master Admin Session
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <ShieldAlert className="w-7 h-7 text-amber-400" />
            <span>Voxora AI Master Admin Panel</span>
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Is panel mein har naye register hone wale aur login karne wale user ka mukammal data real-time save aur display hota hai.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleLock}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Panel</span>
          </button>
        </div>
      </div>

      {/* Admin Email & Profile Identification Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-purple-500/10 to-indigo-500/15 border border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-2xl">
        <div className="flex items-center gap-4">
          <img 
            src="/rizwan_admin.jpg" 
            alt="Rizwan - Web Designer & Developer" 
            referrerPolicy="no-referrer"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-amber-400 shadow-xl shadow-amber-500/25 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                Rizwan <span className="text-amber-400 font-normal text-xs sm:text-sm">· Web Designer & Developer</span>
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Root Admin Active
              </span>
            </div>
            
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs font-semibold text-slate-300">Admin Email:</span>
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-lg border border-amber-500/40 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                ra2826572@gmail.com
              </span>
              <span className="text-[11px] text-slate-400 font-mono">(@rizwan)</span>
            </div>

            <p className="text-xs text-slate-300 mt-1">
              "Building Modern Websites That Grow Your Business" · Admin Panel Full Master Privileges
            </p>
          </div>
        </div>

        <div className="text-right text-xs font-mono bg-slate-900/90 px-4 py-3 rounded-2xl border border-slate-800">
          <div className="text-slate-400 text-[10px] uppercase tracking-wider">Active Master Session</div>
          <div className="text-amber-400 font-bold text-sm">{currentUser?.email || 'ra2826572@gmail.com'}</div>
          <div className="text-emerald-400 text-[11px] mt-0.5 flex items-center justify-end gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Connected as Root Admin
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Metric Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0e1424]/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Registered Users</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{stats?.stats?.totalUsers || usersList.length}</div>
          <span className="text-[11px] text-purple-400 mt-1 block">Live in system</span>
        </div>

        <div className="bg-[#0e1424]/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Recorded Logins</span>
            <LogIn className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{loginHistoryList.length}</div>
          <span className="text-[11px] text-amber-400 mt-1 block">Sessions tracked</span>
        </div>

        <div className="bg-[#0e1424]/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">User Projects Created</span>
            <FolderKanban className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{projectsList.length}</div>
          <span className="text-[11px] text-indigo-400 mt-1 block">Audio, scripts, transcripts</span>
        </div>

        <div className="bg-[#0e1424]/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Credits Consumed</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{stats?.stats?.totalCreditsUsed || 0}</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">Across all accounts</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
        <button
          onClick={() => setActiveTab('logins')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'logins'
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Live User Logins ({loginHistoryList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>All Registered Users ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'projects'
              ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FolderKanban className="w-3.5 h-3.5" />
          <span>User Audio & Projects ({projectsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Audit Logs ({stats?.logs?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: LIVE USER LOGINS FEED */}
      {activeTab === 'logins' && (
        <div className="bg-[#0e1424]/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Real-Time User Login Stream</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Jo bi user login karega, is ka data yahan timestamp aur device ke sath real-time aayega.</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{loginHistoryList.length} Sessions Logged</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {loginHistoryList.map((entry: any) => (
              <div key={entry.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 px-3 rounded-xl transition-colors">
                <div className="flex items-center gap-3.5">
                  <img 
                    src={entry.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} 
                    alt={entry.name} 
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{entry.name}</span>
                      <span className="text-[11px] font-mono text-purple-400">@{entry.username}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        entry.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {entry.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-[11px] font-semibold">
                        <Mail className="w-3 h-3 text-purple-400" />
                        <span>Login Email: {entry.email}</span>
                      </span>
                      {entry.email === 'ra2826572@gmail.com' && (
                        <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-md border border-amber-500/30">
                          ★ Root Admin
                        </span>
                      )}
                      <span className="text-slate-500 text-[11px] font-mono">· {entry.device || 'Studio Client'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="text-xs font-mono">
                    <span className="text-slate-300 font-semibold block">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    <span className="text-[10px] text-slate-500">{new Date(entry.timestamp).toLocaleDateString()}</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-500/10"></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="bg-[#0e1424]/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Registered Users Directory</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Har naya user automatically is table mein add hota hai.</p>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search user, @username, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#090d17] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3 px-4">User</th>
                  <th className="pb-3 px-4">Handle</th>
                  <th className="pb-3 px-4">Login Email</th>
                  <th className="pb-3 px-4">Role</th>
                  <th className="pb-3 px-4">Plan</th>
                  <th className="pb-3 px-4">Credits Consumed</th>
                  <th className="pb-3 px-4">Last Activity</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredUsers.map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-purple-500/30" />
                      <span className="font-bold text-white font-sans">{u.name}</span>
                    </td>
                    <td className="py-3 px-4 text-purple-400 font-semibold">@{u.username}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span className={`font-semibold ${u.email === 'ra2826572@gmail.com' ? 'text-amber-400 font-bold' : 'text-slate-200'}`}>
                          {u.email}
                        </span>
                        {u.email === 'ra2826572@gmail.com' && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                            Root
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 capitalize text-indigo-400 font-sans font-semibold">{u.plan}</td>
                    <td className="py-3 px-4 text-slate-300">{u.creditsUsed} / {u.credits}</td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] font-sans truncate max-w-[140px]">{u.lastAction}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAddCredits(u.id, u.credits)}
                          title="Add 1,000 Credits"
                          className="px-2 py-1 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg text-[10px] font-semibold transition-all"
                        >
                          +1k Credits
                        </button>
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            title="Delete User"
                            className="p-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USER AUDIO & PROJECTS INSPECTOR */}
      {activeTab === 'projects' && (
        <div className="bg-[#0e1424]/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-indigo-400" />
              <span>User Audio Generations & Stems Inspector</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Admin kisi bi user ki generate ki gayi voice, scripts aur transcripts sun aur check kar sakta hai.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectsList.map((p: any) => {
              const creator = usersList.find((u: any) => u.id === p.userId);
              return (
                <div key={p.id} className="p-4 rounded-xl bg-[#090d17] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-purple-400">@{creator?.username || p.userId}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 font-mono leading-relaxed">{p.content}</p>

                  {p.audioUrl && (
                    <audio controls src={p.audioUrl} className="w-full h-8 accent-purple-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-[#0e1424]/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white">System Security Activity Logs</h3>
          <div className="space-y-2">
            {stats?.logs?.map((log: any) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-[#090d17] rounded-xl border border-slate-800/80 text-xs font-mono">
                <span className="text-slate-300">{log.message}</span>
                <span className="text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
