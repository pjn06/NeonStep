import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { GoalManager } from './pages/GoalManager';
import { Community } from './pages/Community';
import { Profile } from './pages/Profile';
import { Onboarding } from './pages/Onboarding';

const AuthenticatedApp: React.FC = () => {
  const { user, isLoading } = useApp();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-cyan-500">Loading...</div>;
  }

  if (!user) {
    return <Onboarding />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/goals" element={<GoalManager />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AuthenticatedApp />
      </HashRouter>
    </AppProvider>
  );
};

export default App;