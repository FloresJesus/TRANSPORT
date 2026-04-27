'use client';

import { useState, useEffect } from 'react';
import { LoginScreen } from '@/components/login-screen';
import { Dashboard } from '@/components/dashboard';

const AUTH_KEY = 'movismart-auth';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    setIsLoggedIn(stored === 'true');
    setIsLoaded(true);
  }, []);

  const handleLogin = () => {
    localStorage.setItem(AUTH_KEY, 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
