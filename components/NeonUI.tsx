import React from 'react';

export const NeonButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}> = ({ children, onClick, variant = 'primary', className = '', fullWidth = false, disabled, type }) => {
  const baseStyle = "relative px-6 py-3 rounded-xl font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-fuchsia-600 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)] hover:shadow-[0_0_25px_rgba(217,70,239,0.7)] hover:bg-fuchsia-500 border border-fuchsia-400",
    secondary: "bg-slate-800 text-cyan-400 border border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.2)] hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:bg-slate-700",
    danger: "bg-slate-900 text-red-500 border border-red-500 hover:bg-red-900/20"
  };

  return (
    <button 
      onClick={onClick} 
      type={type}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export const NeonCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  neonColor?: 'pink' | 'cyan' | 'purple';
}> = ({ children, className = '', neonColor = 'purple' }) => {
  const glow = {
    pink: "shadow-[0_0_10px_rgba(217,70,239,0.15)] border-fuchsia-500/30",
    cyan: "shadow-[0_0_10px_rgba(6,182,212,0.15)] border-cyan-500/30",
    purple: "shadow-[0_0_10px_rgba(168,85,247,0.15)] border-purple-500/30",
  };

  return (
    <div className={`bg-slate-900/80 backdrop-blur-md border rounded-2xl p-4 ${glow[neonColor]} ${className}`}>
      {children}
    </div>
  );
};

export const ProgressBar: React.FC<{
  current: number;
  max: number;
  color?: string;
}> = ({ current, max, color = "bg-gradient-to-r from-cyan-400 to-blue-500" }) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  
  return (
    <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden relative shadow-inner">
      <div 
        className={`h-full ${color} transition-all duration-700 ease-out`}
        style={{ width: `${percentage}%` }}
      />
      {/* Glossy effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-t-full pointer-events-none"></div>
    </div>
  );
};

export const LevelBadge: React.FC<{ level: number }> = ({ level }) => (
  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-slate-900 font-bold border-2 border-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.6)]">
    {level}
  </div>
);