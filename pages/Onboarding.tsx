import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { NeonButton, NeonCard } from '../components/NeonUI';
import { Sparkles, ArrowRight } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { login } = useApp();
  const [name, setName] = useState('');
  const [step, setStep] = useState(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black"></div>
        <div className="absolute top-1/4 left-1/2 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[100px] -translate-x-1/2 animate-pulse"></div>
        
        <NeonCard className="max-w-md w-full relative z-10 neon-box-cyan border-slate-700/50">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4 border border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                    <Sparkles className="text-cyan-400 w-8 h-8" />
                </div>
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-2 tracking-tight">
                    NEON STEP
                </h1>
                <p className="text-slate-400">작은 발걸음이 만드는 빛나는 변화</p>
            </div>

            {step === 0 ? (
                <div className="space-y-6">
                    <div className="space-y-4">
                        <FeatureRow icon="🚀" text="작은 목표부터 시작하는 성취감" />
                        <FeatureRow icon="🤝" text="함께 응원하는 따뜻한 커뮤니티" />
                        <FeatureRow icon="💎" text="성장할수록 화려해지는 보상" />
                    </div>
                    <NeonButton fullWidth onClick={() => setStep(1)} className="mt-8">
                        시작하기 <ArrowRight className="inline ml-2 w-4 h-4" />
                    </NeonButton>
                </div>
            ) : (
                <form onSubmit={handleLogin} className="space-y-6 animate-fade-in">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">어떻게 불러드릴까요?</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="닉네임 입력"
                            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all"
                            required
                        />
                    </div>
                    <NeonButton fullWidth variant="primary">
                        여정 시작하기
                    </NeonButton>
                    <button 
                        type="button" 
                        onClick={() => setStep(0)}
                        className="w-full text-sm text-slate-500 hover:text-slate-300"
                    >
                        뒤로 가기
                    </button>
                </form>
            )}
        </NeonCard>
    </div>
  );
};

const FeatureRow: React.FC<{icon: string, text: string}> = ({icon, text}) => (
    <div className="flex items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
        <span className="text-2xl mr-4">{icon}</span>
        <span className="text-slate-200 font-medium">{text}</span>
    </div>
);