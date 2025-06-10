import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChefHat, Mail, Lock, User, ArrowRight } from 'lucide-react';

enum AuthMode {
  LOGIN,
  REGISTER
}

const SignIn: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, loginWithGoogle, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === AuthMode.LOGIN) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred with Google login');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === AuthMode.LOGIN ? AuthMode.REGISTER : AuthMode.LOGIN);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-culinary-pattern bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-culinary-900/40 backdrop-blur-sm"></div>
      <div className="relative max-w-md w-full mx-4">
        <div className="card bg-white/95 backdrop-blur-lg p-8 space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-herb-100">
              <ChefHat className="h-10 w-10 text-herb-600" />
            </div>
            <h2 className="mt-4 text-3xl font-bold text-culinary-900">
              {mode === AuthMode.LOGIN ? 'Welcome Back Chef!' : 'Join the Kitchen'}
            </h2>
            <p className="mt-2 text-sm text-culinary-600">
              {mode === AuthMode.LOGIN 
                ? 'Your culinary journey continues here' 
                : 'Start your culinary adventure today'}
            </p>
          </div>
          
          {error && (
            <div className="bg-spice-50 border-l-4 border-spice-500 p-4 rounded-r-lg">
              <p className="text-spice-700 text-sm">{error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {mode === AuthMode.REGISTER && (
              <div>
                <label htmlFor="name\" className="block text-sm font-medium text-culinary-700">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-culinary-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Gordon Ramsay"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-culinary-700">
                Email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-culinary-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="chef@kitchen.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-culinary-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-culinary-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === AuthMode.LOGIN ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center group"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                  <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <span>{mode === AuthMode.LOGIN ? 'Sign in' : 'Create account'}</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-culinary-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-culinary-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full btn-secondary flex justify-center items-center"
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.033s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.522 0-10 4.478-10 10s4.478 10 10 10c8.396 0 10.249-7.85 9.449-11.666l-9.449 0.001z"
                fill="#4285F4"
              />
            </svg>
            Google
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={toggleMode}
              className="text-herb-600 hover:text-herb-700 font-medium focus:outline-none focus:underline transition duration-150 ease-in-out"
            >
              {mode === AuthMode.LOGIN
                ? "New to cooking? Create an account"
                : 'Already a chef? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;