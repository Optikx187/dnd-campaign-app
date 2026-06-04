import { useState } from 'react';
import PageLayout from '../ui/PageLayout';
import GoogleIcon from '../ui/GoogleIcon';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsLoading(true);
    try {
      await onLogin(username, password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <PageLayout className="flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-lg border border-purple-500/30 p-8">
        <div className="text-center mb-6">
          <span className="text-5xl mb-4 block">🐉</span>
          <h1 className="text-3xl font-bold text-white mb-2">D&D Campaign App</h1>
          <h2 className="text-xl text-gray-400">Login</h2>
        </div>
        
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full px-4 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all shadow-lg font-medium mb-4 flex items-center justify-center gap-2"
        >
          <GoogleIcon />
          Sign in with Google
        </button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-slate-800/50 text-gray-400">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-purple-500/30 rounded-lg bg-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your username"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-purple-500/30 rounded-lg bg-slate-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password.trim()}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/50 font-medium"
          >
            {isLoading ? '🔮 Logging in...' : '⚔️ Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          For demo purposes, any username/password will work
        </p>
      </div>
    </PageLayout>
  );
}
