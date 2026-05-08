// ─────────────────────────────────────────────
//  AirSafe AI — Root App Component
// ─────────────────────────────────────────────
import React, { useState } from 'react';
import { PhoneFrame, StatusBar, ScreenSlot } from './components/PhoneFrame';
import { BottomNav } from './components/BottomNav';
import { Dashboard }   from './screens/Dashboard';
import { MapScreen }   from './screens/MapScreen';
import { Survey }      from './screens/Survey';
import { Profile }     from './screens/Profile';
import { LoginScreen } from './screens/LoginScreen';
import type { TabId }  from './types';
import './styles/index.css';

import { apiLogin, setToken, clearToken, getToken } from './api/airsafe';

type AppView = 'login' | 'app';

const makeScreens = (onLogout: () => void): Record<TabId, React.ReactNode> => ({
  0: <Dashboard />,
  1: <MapScreen />,
  2: <Survey />,
  3: <Profile onLogout={onLogout} />,
});

const App: React.FC = () => {
  // ── Vérifier si déjà connecté (token en localStorage) ──
  const [view, setView] = useState<AppView>(
    getToken() ? 'app' : 'login'   // ← si token valide → accès direct
  );
  const [activeTab, setActiveTab] = useState<TabId>(0);

  const handleLogin = async (email: string, password: string): Promise<void> => {
    const data = await apiLogin(email, password);
    setToken(data.token);
    setView('app');
  };

  if (view === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onForgotPassword={() => console.log('Mot de passe oublié')}
      />
    );
  }

  const handleLogout = () => {
    clearToken();
    setActiveTab(0);
    setView('login');
  };

  const screens = makeScreens(handleLogout);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#D1D5DB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
    }}>
      <PhoneFrame>
        <StatusBar />
        <ScreenSlot key={activeTab}>
          {screens[activeTab]}
        </ScreenSlot>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </PhoneFrame>
    </div>
  );
};

export default App;