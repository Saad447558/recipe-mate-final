import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import AuthScreen from './components/AuthScreen';
import MainScreen from './components/MainScreen';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';

const AppContent = () => {
  const { currentUser, loading } = useAuth();

  // Force clear any cached authentication state on app start
  useEffect(() => {
    const clearAuthCache = async () => {
      try {
        // Clear any existing authentication state
        if (auth.currentUser) {
          await signOut(auth);
        }
        
        // Clear any local storage or session storage
        if (typeof window !== 'undefined') {
          localStorage.clear();
          sessionStorage.clear();
        }
      } catch (error) {
        console.log('Cache clearing completed');
      }
    };

    // Only clear cache on initial load
    const hasCleared = sessionStorage.getItem('authCacheCleared');
    if (!hasCleared) {
      clearAuthCache();
      sessionStorage.setItem('authCacheCleared', 'true');
    }
  }, []);

  if (loading) {
    return null; // Or a loading spinner
  }

  // Always show AuthScreen if no user is authenticated
  if (!currentUser) {
    return <AuthScreen />;
  }

  return <MainScreen />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

