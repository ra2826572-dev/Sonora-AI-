import React, { useState } from 'react';
import { Sparkles, Mic, Play, Search, Heart, Globe, Radio } from 'lucide-react';

export const VoiceLibrary: React.FC = () => {
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');

  const voices = [
    { id: 'Kore', name: 'Kore', gender: 'Female', accent: 'American', style: 'Professional & Warm', preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 'Puck', name: 'Puck', gender: 'Male', accent: 'British', style: 'Deep & Authoritative', preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 'Charon', name: 'Charon', gender: 'Male', accent: 'American', style: 'Calm Narration', preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { id: 'Fenrir', name: 'Fenrir', gender: 'Female', accent: 'Australian', style: 'Enthusiastic Commercial', preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { id: 'Zephyr', name: 'Zephyr', gender: 'Female', accent: 'Global', style: 'Conversational Podcast', preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
    { id: 'Aoede', name: 'Aoede', gender: 'Female', accent: 'British', style: 'Articulate & Elegant', preview: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' }
  ];

  const filteredVoices = voices.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.style.toLowerCase().includes(search.toLowerCase());
    const matchesGender = genderFilter === 'all' || v.gender.toLowerCase() === genderFilter;
    return matchesSearch && matchesGender;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Radio className="w-7 h-7 text-purple-400" />
            <span>Voxora Voice Personas Gallery</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Audition 24kHz HD studio voice personas for narration, dialogue, and commercials.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search voices or styles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0e1424] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-purple-500 w-64"
            />
          </div>

          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-[#0e1424] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Genders</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVoices.map((v) => (
          <div key={v.id} className="bg-[#0e1424]/60 border border-slate-800 rounded-2xl p-6 shadow-xl hover:border-purple-500/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300">
                    {v.name[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{v.name}</h3>
                    <p className="text-xs text-slate-400">{v.gender} · {v.accent} Accent</p>
                  </div>
                </div>
                <button className="text-slate-500 hover:text-rose-400 transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              <div className="inline-block px-2.5 py-1 bg-purple-500/10 text-purple-300 text-[11px] font-medium rounded-lg mb-4 border border-purple-500/20">
                {v.style}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">24kHz HD Waveform</span>
              <button
                onClick={() => {
                  const audio = new Audio(v.preview);
                  audio.play().catch(() => alert(`Playing Voxora preview for ${v.name}`));
                }}
                className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Audition</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
