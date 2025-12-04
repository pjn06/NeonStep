import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { NeonCard, NeonButton, ProgressBar } from '../components/NeonUI';
import { Goal } from '../types';
import { Plus, Check, MoreVertical, BrainCircuit, Loader2 } from 'lucide-react';
import { getSmartGoalSuggestion } from '../services/geminiService';

export const GoalManager: React.FC = () => {
  const { goals, addGoal, updateGoalProgress } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState(1);
  const [newUnit, setNewUnit] = useState('회');
  const [newType, setNewType] = useState<Goal['type']>('STUDY');

  const today = new Date().toISOString().split('T')[0];
  const todayGoals = goals.filter(g => g.date === today);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newTitle,
      type: newType,
      targetValue: newTarget,
      currentValue: 0,
      unit: newUnit,
      completed: false,
      date: today
    };

    addGoal(goal);
    resetForm();
  };

  const handleSuggestion = async () => {
      setIsSuggesting(true);
      const suggestion = await getSmartGoalSuggestion();
      if(suggestion) {
          setNewTitle(suggestion.title);
          setNewType(suggestion.type);
          setNewTarget(suggestion.value);
          setNewUnit(suggestion.unit);
          setShowAddForm(true);
      }
      setIsSuggesting(false);
  }

  const resetForm = () => {
    setNewTitle('');
    setNewTarget(1);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">목표 관리</h2>
        <NeonButton onClick={() => setShowAddForm(!showAddForm)} variant="primary" className="!py-2 !px-4">
            {showAddForm ? '취소' : <><Plus size={18} className="inline mr-1" /> 추가</>}
        </NeonButton>
      </div>

      {/* Suggestion Button */}
      {!showAddForm && (
        <button 
            onClick={handleSuggestion}
            disabled={isSuggesting}
            className="w-full bg-slate-800/50 border border-dashed border-fuchsia-500/50 rounded-xl p-3 text-sm text-fuchsia-400 flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
        >
            {isSuggesting ? <Loader2 className="animate-spin" size={16}/> : <BrainCircuit size={16} />}
            AI에게 목표 추천받기
        </button>
      )}

      {/* Add Form */}
      {showAddForm && (
        <NeonCard className="animate-fade-in" neonColor="cyan">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">목표 이름</label>
              <input 
                type="text" 
                value={newTitle} 
                onChange={e => setNewTitle(e.target.value)}
                placeholder="예: 영어 단어 10개 외우기"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white focus:border-cyan-500 outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">카테고리</label>
                <select 
                  value={newType} 
                  onChange={e => setNewType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none"
                >
                  <option value="STUDY">✏️ 공부</option>
                  <option value="OUTDOOR">👟 외출</option>
                  <option value="HEALTH">💪 건강</option>
                  <option value="SOCIAL">🗣️ 소통</option>
                </select>
              </div>
              <div className="flex gap-2">
                 <div className="flex-1">
                    <label className="block text-xs text-slate-400 mb-1">목표량</label>
                    <input 
                        type="number" 
                        min="1"
                        value={newTarget}
                        onChange={e => setNewTarget(parseInt(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none"
                    />
                 </div>
                 <div className="w-20">
                    <label className="block text-xs text-slate-400 mb-1">단위</label>
                    <input 
                        type="text" 
                        value={newUnit}
                        onChange={e => setNewUnit(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 text-white outline-none"
                    />
                 </div>
              </div>
            </div>
            <NeonButton fullWidth type="submit">목표 등록</NeonButton>
          </form>
        </NeonCard>
      )}

      {/* Goal List */}
      <div className="space-y-4">
        {todayGoals.length === 0 && !showAddForm ? (
            <div className="text-center py-10 text-slate-500">
                오늘의 목표를 등록하고<br/>하루를 시작해보세요!
            </div>
        ) : (
            todayGoals.map(goal => (
                <NeonCard key={goal.id} className={`transition-all ${goal.completed ? 'opacity-75 grayscale-[0.5]' : ''}`} neonColor={goal.completed ? 'purple' : 'pink'}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                             <span className="text-2xl">
                                {goal.type === 'STUDY' ? '✏️' : goal.type === 'OUTDOOR' ? '👟' : goal.type === 'HEALTH' ? '💪' : '🗣️'}
                             </span>
                             <div>
                                 <h3 className="font-bold text-lg">{goal.title}</h3>
                                 <p className="text-xs text-slate-400">{goal.currentValue} / {goal.targetValue} {goal.unit}</p>
                             </div>
                        </div>
                        {goal.completed && <Check className="text-green-400 w-6 h-6" />}
                    </div>

                    <div className="mb-4">
                        <ProgressBar current={goal.currentValue} max={goal.targetValue} color={goal.completed ? "bg-green-500" : "bg-fuchsia-500"} />
                    </div>

                    {!goal.completed && (
                        <div className="flex gap-2 justify-end">
                            <button 
                                onClick={() => updateGoalProgress(goal.id, 1)}
                                className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 hover:bg-slate-700 active:scale-95 text-sm font-bold transition-all text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                            >
                                +1 {goal.unit}
                            </button>
                             <button 
                                onClick={() => updateGoalProgress(goal.id, goal.targetValue - goal.currentValue)}
                                className="px-4 py-2 rounded-lg bg-fuchsia-900/30 border border-fuchsia-900 hover:bg-fuchsia-900/50 active:scale-95 text-sm font-bold transition-all text-fuchsia-400"
                            >
                                완료하기
                            </button>
                        </div>
                    )}
                </NeonCard>
            ))
        )}
      </div>
    </div>
  );
};