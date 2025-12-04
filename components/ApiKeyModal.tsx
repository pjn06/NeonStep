
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { NeonCard, NeonButton } from './NeonUI';
import { verifyApiKey } from '../services/geminiService';
import { Key, CheckCircle, AlertCircle, Loader2, X, Lock } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  forceOpen?: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, forceOpen }) => {
  const { apiKey, setApiKey } = useApp();
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputValue(apiKey || '');
      setStatus('idle');
      setErrorMsg('');
    }
  }, [isOpen, apiKey]);

  const handleTestAndSave = async () => {
    if (!inputValue.trim()) {
      setStatus('invalid');
      setErrorMsg('API Key를 입력해주세요.');
      return;
    }

    setStatus('checking');
    const isValid = await verifyApiKey(inputValue.trim());

    if (isValid) {
      setStatus('valid');
      setApiKey(inputValue.trim());
      // Auto close after success if not forced, or give user a moment to see success
      setTimeout(() => {
         if (!forceOpen) onClose();
      }, 1500);
    } else {
      setStatus('invalid');
      setErrorMsg('유효하지 않은 API Key입니다. 다시 확인해주세요.');
    }
  };

  const handleClear = () => {
    setApiKey('');
    setInputValue('');
    setStatus('idle');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <NeonCard className="w-full max-w-sm relative animate-fade-in border-fuchsia-500/50" neonColor="pink">
        {!forceOpen && (
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        )}

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.3)] mb-3">
            <Key className="text-fuchsia-400" size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">API Key 설정</h3>
          <p className="text-xs text-slate-400 text-center mt-2">
            Gemini API를 사용하기 위해 Key가 필요합니다.<br/>
            입력된 키는 로컬 드라이브에 암호화되어 저장됩니다.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-slate-500" />
             </div>
             <input
                type="password"
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setStatus('idle');
                }}
                placeholder="AI Studio API Key 입력"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-fuchsia-500 transition-colors placeholder:text-slate-600"
              />
          </div>

          {status === 'checking' && (
            <div className="flex items-center justify-center text-cyan-400 text-sm gap-2">
              <Loader2 className="animate-spin" size={16} /> 연결 확인 중...
            </div>
          )}

          {status === 'valid' && (
            <div className="flex items-center justify-center text-green-400 text-sm gap-2 font-bold">
              <CheckCircle size={16} /> 연결 성공! 키가 저장되었습니다.
            </div>
          )}

          {status === 'invalid' && (
            <div className="flex items-center justify-center text-red-400 text-sm gap-2 font-bold">
              <AlertCircle size={16} /> {errorMsg}
            </div>
          )}

          <NeonButton 
            fullWidth 
            onClick={handleTestAndSave}
            className="flex items-center justify-center gap-2"
          >
             {status === 'checking' ? '확인 중...' : '연결 테스트 및 저장'}
          </NeonButton>
          
          {apiKey && (
            <button 
                onClick={handleClear} 
                className="w-full text-xs text-slate-500 hover:text-red-400 py-2"
            >
                저장된 키 삭제하기
            </button>
          )}

          <div className="pt-2 border-t border-slate-800 text-center">
             <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs text-cyan-500 hover:text-cyan-300 underline"
             >
                Google AI Studio에서 키 발급받기
             </a>
          </div>
        </div>
      </NeonCard>
    </div>
  );
};
