import React, { useEffect, useState } from 'react';
import { User, Project } from '../types';
import { fetchProjects, deleteProject } from '../services/api';
import { FolderKanban, Trash2, Download, Play, Search, FileText, Mic, BookOpen, Clock } from 'lucide-react';

interface ProjectsViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ currentUser, onOpenAuth }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    fetchProjects(currentUser.id)
      .then(data => setProjects(data))
      .finally(() => setLoading(false));
  }, [currentUser]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await deleteProject(id);
    setProjects(projects.filter(p => p.id !== id));
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.content.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || p.type === filterType;
    return matchesSearch && matchesType;
  });

  if (!currentUser) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <FolderKanban className="w-7 h-7 text-purple-400" />
            <span>Voxora Studio Projects & Stems</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage, download, and review generated audio waveforms, transcripts, and AI scripts.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0e1424] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500 w-64"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-[#0e1424] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="audio">Voice Audio</option>
            <option value="transcribe">Transcripts</option>
            <option value="writing">AI Writing</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 text-sm font-mono">Loading studio projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-[#0e1424]/40 rounded-3xl border border-slate-800/80 space-y-3">
          <FolderKanban className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Projects Saved Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Generate speech in the Voice Studio, transcribe recordings, or draft scripts to save them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div key={p.id} className="bg-[#0e1424]/60 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-purple-500/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {p.type === 'audio' && <Mic className="w-4 h-4 text-purple-400" />}
                    {p.type === 'transcribe' && <FileText className="w-4 h-4 text-indigo-400" />}
                    {p.type === 'writing' && <BookOpen className="w-4 h-4 text-pink-400" />}
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{p.type}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-2 truncate">{p.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 mb-6 leading-relaxed font-mono">{p.content}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                {p.audioUrl ? (
                  <button
                    onClick={() => {
                      const audio = new Audio(p.audioUrl);
                      audio.play().catch(() => alert('Playing audio'));
                    }}
                    className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-500 font-mono">{p.duration || 'Saved'}</span>
                )}

                <div className="flex items-center gap-2">
                  {p.audioUrl && (
                    <a
                      href={p.audioUrl}
                      download={`voxora-${p.title}.mp3`}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
