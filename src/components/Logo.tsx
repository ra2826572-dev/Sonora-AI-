import React from 'react';

interface LogoProps {
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ showTagline = false, size = 'md', className = '' }) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-9 h-9';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Modern Audio Waveform Icon */}
      <div className={`relative ${iconSize} rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-0.5 shadow-lg shadow-purple-600/25 flex items-center justify-center shrink-0 group`}>
        <div className="w-full h-full bg-[#0d121f] rounded-[10px] flex items-center justify-center gap-[2.5px] px-1.5 overflow-hidden">
          {/* Animated/Static Waveform Bars */}
          <span className="w-[3px] h-3 bg-indigo-400 rounded-full group-hover:h-4 transition-all duration-300"></span>
          <span className="w-[3px] h-5 bg-purple-400 rounded-full group-hover:h-6 transition-all duration-200"></span>
          <span className="w-[3px] h-6 bg-gradient-to-t from-indigo-400 to-purple-300 rounded-full group-hover:h-3 transition-all duration-300"></span>
          <span className="w-[3px] h-4 bg-purple-400 rounded-full group-hover:h-5 transition-all duration-200"></span>
          <span className="w-[3px] h-2 bg-indigo-400 rounded-full group-hover:h-3 transition-all duration-300"></span>
        </div>
        {/* Glow pill */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl blur-sm opacity-25 group-hover:opacity-60 transition duration-300 pointer-events-none"></div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <div className={`font-extrabold tracking-tight text-white ${textSize} flex items-center gap-1.5`}>
          <span>Voxora</span>
          <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent font-black">AI</span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-400 font-medium tracking-wide mt-1">
            Your Voice. Your Creativity. AI.
          </span>
        )}
      </div>
    </div>
  );
};
