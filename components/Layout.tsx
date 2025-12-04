
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Target, Users, User as UserIcon, Settings } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ApiKeyModal } from './ApiKeyModal';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { xpGained, clearXpPopup, apiKey } = useApp();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Simple XP popup animation
  React.useEffect(() => {
    if (xpGained) {
      const timer = setTimeout(clearXpPopup, 2000);
      return () => clearTimeout(timer);
    }
  }, [xpGained, clearXpPopup]);

  return (
    <div className="min-h-screen pb-20 bg-slate-950 text-white overflow-x-hidden">
      {/* API Key Modal */}
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen || !apiKey} 
        onClose={() => setIsApiKeyModalOpen(false)} 
        forceOpen={!apiKey}
      />

      {/* XP Popup */}
      {xpGained && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-yellow-400 text-slate-900 font-bold px-6 py-2 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.8)] border-2 border-white">
            +{xpGained} XP!
          </div>
        </div>
      )}

      {/* Top Bar for Settings */}
      {apiKey && (
        <div className="fixed top-4 right-4 z-40 md:absolute md:right-4">
            <button 
                onClick={() => setIsApiKeyModalOpen(true)}
                className="p-2 bg-slate-900/80 backdrop-blur rounded-full border border-slate-700 text-slate-400 hover:text-cyan-400 transition-colors shadow-lg"
            >
                <Settings size={20} />
            </button>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-md mx-auto min-h-screen bg-slate-900 relative shadow-2xl overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 p-4 pt-12 md:pt-4">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-lg border-t border-slate-700">
        <div className="max-w-md mx-auto flex justify-around items-center p-2">
          <NavLink to="/" className={({ isActive }) => `flex flex-col items-center p-2 transition-all ${isActive ? 'text-cyan-400 scale-110 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]' : 'text-slate-400 hover:text-slate-200'}`}>
            <Home size={24} />
            <span className="text-xs mt-1">홈</span>
          </NavLink>
          <NavLink to="/goals" className={({ isActive }) => `flex flex-col items-center p-2 transition-all ${isActive ? 'text-fuchsia-400 scale-110 drop-shadow-[0_0_5px_rgba(232,121,249,0.8)]' : 'text-slate-400 hover:text-slate-200'}`}>
            <Target size={24} />
            <span className="text-xs mt-1">목표</span>
          </NavLink>
          <NavLink to="/community" className={({ isActive }) => `flex flex-col items-center p-2 transition-all ${isActive ? 'text-yellow-400 scale-110 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]' : 'text-slate-400 hover:text-slate-200'}`}>
            <Users size={24} />
            <span className="text-xs mt-1">광장</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center p-2 transition-all ${isActive ? 'text-green-400 scale-110 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]' : 'text-slate-400 hover:text-slate-200'}`}>
            <UserIcon size={24} />
            <span className="text-xs mt-1">내정보</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};
