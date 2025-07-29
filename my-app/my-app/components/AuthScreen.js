import React, { useState } from 'react';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';

const AuthScreen = () => {
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'signup', 'forgot'

  const switchToSignup = () => setCurrentScreen('signup');
  const switchToLogin = () => setCurrentScreen('login');
  const switchToForgotPassword = () => setCurrentScreen('forgot');

  if (currentScreen === 'signup') {
    return <SignupScreen switchToLogin={switchToLogin} />;
  }
  if (currentScreen === 'forgot') {
    return <ForgotPasswordScreen onBack={switchToLogin} />;
  }
  return (
    <LoginScreen 
      switchToSignup={switchToSignup} 
      onForgotPassword={switchToForgotPassword}
    />
  );
};
export default AuthScreen;

