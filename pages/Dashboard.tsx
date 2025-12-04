import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { NeonCard, ProgressBar, NeonButton } from '../components/NeonUI';
import { getMotivationalMessage } from '../services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Zap, Clock, MessageSquare, Loader2 } from 'lucide-react';
import { Goal } from '../types';

export const Dashboard: React.FC = () => {
  const { user, goals } = useApp();
  const [aiMessage, setAiMessage] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Stats calculation
  const todayGoals = goals.filter(g => g.date === new Date().toISOString().split('T')[0]);
  const completedCount = todayGoals.filter(g => g.completed).length;
  const totalCount = todayGoals.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleGetAdvice = async () => {
    if (!user) return;
    setLoadingAi(true);
    const msg = await getMotivationalMessage(user, todayGoals.filter(g => !g.completed));
    setAiMessage(msg);
    setLoadingAi(false);
  };

  const chartData = [
    { name: '완료', value: completedCount },
    { name: '미완료', value: Math.max(0, totalCount - completedCount) } // Ensure at least minimal visualization
  ];
  
  // If no goals, show a placeholder in chart
  const finalChartData = totalCount === 0 ? [{ name: '휴식', value: 1 }] : chartData;
  const COLORS = totalCount === 0 ? ['#334155'] : ['#d946ef', '#1e293b'];

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Header Profile */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">안녕하세요, <span className="text-cyan-400">{user.name}</span>님!</h2>
          <p className="text-slate-400 text-sm">오늘도 빛나는 하루를 만들어봐요 ✨</p>
        </div>
        <div className="relative">
          <img src={user.avatar} alt="Profile" className="w-12 h-12 rounded-full border-2 border-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
          <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {user.level}
          </div>
        </div>
      </div>

      {/* Main Stats Card */}
      <NeonCard className="relative overflow-hidden" neonColor="cyan">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Zap className="text-yellow-400" size={20} />
            오늘의 에너지
          </h3>
          <span className="text-2xl font-bold text-cyan-400">{Math.round(progressPercentage)}%</span>
        </div>
        
        <ProgressBar current={completedCount} max={totalCount || 1} color="bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
        
        <div className="mt-4 flex justify-between text-sm text-slate-400">
          <span>완료: {completedCount}</span>
          <span>전체: {totalCount}</span>
        </div>
      </NeonCard>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-4">
        <NeonCard className="h-40 flex flex-col items-center justify-center" neonColor="purple">
           <h4 className="text-sm text-slate-400 mb-2">목표 달성률</h4>
           <div className="w-full h-24">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={finalChartData}
                   cx="50%"
                   cy="50%"
                   innerRadius={25}
                   outerRadius={40}
                   paddingAngle={5}
                   dataKey="value"
                   stroke="none"
                 >
                   {finalChartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                   ))}
                 </Pie>
                 <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                 />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </NeonCard>
        
        <NeonCard className="h-40 flex flex-col justify-between" neonColor="pink">
          <div>
            <h4 className="text-sm text-slate-400">현재 연속 달성</h4>
            <p className="text-3xl font-bold text-fuchsia-400 mt-1">{user.streak}일 🔥</p>
          </div>
          <div className="text-xs text-slate-500">
             꾸준함이 최고의 재능입니다!
          </div>
        </NeonCard>
      </div>

      {/* AI Coach Section */}
      <NeonCard className="bg-gradient-to-br from-slate-900 to-indigo-950/50">
        <div className="flex items-center gap-2 mb-3">
            <div className="bg-fuchsia-600/20 p-2 rounded-lg">
                <MessageSquare className="text-fuchsia-400" size={20} />
            </div>
            <h3 className="font-bold text-white">AI 라이프 코치</h3>
        </div>
        
        {aiMessage ? (
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 animate-fade-in">
                <p className="text-slate-200 leading-relaxed italic">"{aiMessage}"</p>
                <div className="mt-2 text-right">
                    <button onClick={() => setAiMessage('')} className="text-xs text-slate-500 hover:text-white underline">닫기</button>
                </div>
            </div>
        ) : (
            <div className="text-center py-2">
                <p className="text-slate-400 text-sm mb-4">지금 동기부여가 필요하신가요?</p>
                <NeonButton 
                    onClick={handleGetAdvice} 
                    disabled={loadingAi}
                    className="w-full flex items-center justify-center gap-2 text-sm py-2"
                >
                    {loadingAi ? <Loader2 className="animate-spin" size={16} /> : '⚡ 응원 메시지 받기'}
                </NeonButton>
            </div>
        )}
      </NeonCard>

      {/* Recent Activity / Goals Snapshot */}
      <div>
        <h3 className="font-bold text-lg text-white mb-3 flex items-center gap-2">
            <Clock size={18} className="text-green-400" /> 오늘 할 일
        </h3>
        {todayGoals.length === 0 ? (
             <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-xl">
                 <p className="text-slate-500">아직 등록된 목표가 없어요.</p>
                 <p className="text-slate-600 text-sm">목표 탭에서 추가해보세요!</p>
             </div>
        ) : (
            <div className="space-y-3">
                {todayGoals.slice(0, 3).map(goal => (
                    <div key={goal.id} className="flex items-center justify-between bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                        <span className={`${goal.completed ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                            {goal.title}
                        </span>
                        {goal.completed && <span className="text-green-400 text-xs font-bold">완료</span>}
                    </div>
                ))}
                {todayGoals.length > 3 && (
                    <p className="text-center text-xs text-slate-500">외 {todayGoals.length - 3}개의 목표가 더 있습니다.</p>
                )}
            </div>
        )}
      </div>
    </div>
  );
};