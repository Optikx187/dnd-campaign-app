import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../lib/api';
import PageLayout from '../components/ui/PageLayout';
import GoogleIcon from '../components/ui/GoogleIcon';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = await apiPost<{ user: { id: string; username: string } }>('/api/auth/login', { username, password });
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/campaigns');
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Google OAuth - currently disabled due to passport module resolution issues
    alert('Google login is currently disabled. Please use username/password.');
  };

  return (
    <PageLayout className="flex items-center justify-center">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl shadow-2xl border border-purple-500/30 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎲 D&D Campaign Manager</h1>
          <p className="text-gray-400">Log in to manage your campaigns</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all font-medium shadow-lg shadow-purple-500/50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800 text-gray-400">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="mt-4 w-full py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-medium flex items-center justify-center gap-2"
          >
            <GoogleIcon />
            Sign in with Google
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <button className="text-purple-400 hover:text-purple-300 font-medium">
            Sign up
          </button>
        </p>
      </div>
    </PageLayout>
  );
}
