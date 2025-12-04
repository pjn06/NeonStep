import React from 'react';
import { useApp } from '../contexts/AppContext';
import { NeonCard, ProgressBar, NeonButton, LevelBadge } from '../components/NeonUI';
import { Trophy, Settings, LogOut } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, logout } = useApp();

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold">내 정보</h2>
         <button onClick={logout} className="p-2 text-slate-500 hover:text-red-400">
            <LogOut size={20} />
         </button>
      </div>

      {/* Identity Card */}
      <NeonCard className="flex flex-col items-center py-8" neonColor="pink">
         <div className="relative mb-4">
             <img src={user.avatar} className="w-24 h-24 rounded-full border-4 border-slate-800 shadow-[0_0_20px_rgba(217,70,239,0.5)]" alt="Profile" />
             <div className="absolute -bottom-2 -right-2">
                <LevelBadge level={user.level} />
             </div>
         </div>
         <h3 className="text-2xl font-bold text-white mb-1">{user.name}</h3>
         <p className="text-fuchsia-400 font-medium">Neon Walker</p>
         
         <div className="w-full max-w-xs mt-6 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
                <span>EXP</span>
                <span>{user.xp} / {user.nextLevelXp}</span>
            </div>
            <ProgressBar current={user.xp} max={user.nextLevelXp} color="bg-gradient-to-r from-yellow-400 to-orange-500" />
         </div>
      </NeonCard>

      {/* Achievements (Mock) */}
      <div>
         <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Trophy className="text-yellow-400" size={20} /> 업적
         </h3>
         <div className="grid grid-cols-2 gap-3">
             <div className="bg-slate-800/50 p-4 rounded-xl border border-yellow-500/30 flex flex-col items-center text-center">
                 <div className="text-3xl mb-2">🌱</div>
                 <div className="font-bold text-sm text-yellow-100">시작의 발걸음</div>
                 <div className="text-xs text-slate-500 mt-1">첫 로그인 달성</div>
             </div>
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col items-center text-center opacity-50">
                 <div className="text-3xl mb-2">🔥</div>
                 <div className="font-bold text-sm text-slate-300">작심삼일 타파</div>
                 <div className="text-xs text-slate-500 mt-1">3일 연속 접속</div>
             </div>
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col items-center text-center opacity-50">
                 <div className="text-3xl mb-2">🎓</div>
                 <div className="font-bold text-sm text-slate-300">지식 탐구자</div>
                 <div className="text-xs text-slate-500 mt-1">공부 목표 10회 달성</div>
             </div>
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col items-center text-center opacity-50">
                 <div className="text-3xl mb-2">🌞</div>
                 <div className="font-bold text-sm text-slate-300">햇살 사냥꾼</div>
                 <div className="text-xs text-slate-500 mt-1">외출 목표 5회 달성</div>
             </div>
         </div>
      </div>

      {/* Settings Stub */}
      <NeonButton variant="secondary" fullWidth className="flex items-center justify-center gap-2">
         <Settings size={18} /> 설정
      </NeonButton>
    </div>
  );
};