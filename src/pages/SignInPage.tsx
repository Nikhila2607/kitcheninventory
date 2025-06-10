import React from 'react';
import SignIn from '../components/auth/SignIn';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const SignInPage: React.FC = () => {
  const { authState } = useAuth();

  if (authState.isAuthenticated) {
    return <Navigate to="/kitchen-select" />;
  }

  return <SignIn />;
};

export default SignInPage;