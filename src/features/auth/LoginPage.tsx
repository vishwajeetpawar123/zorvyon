import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Lock, User, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import zorvynLogo from '@/assets/zorvynimg.png';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'abc' && password === '123') {
      login();
      const origin = location.state?.from?.pathname || '/';
      navigate(origin);
    } else {
      setError('Invalid username or password. Please use credentials provided.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-glow rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-info/10 rounded-full filter blur-3xl opacity-30"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        <div className="glass-panel border border-border-default rounded-2xl p-8 md:p-10 shadow-xl flex flex-col justify-center bg-bg-elevated/60">
          <div className="mb-8 text-center">
            <img src={zorvynLogo} alt="Zorvyn Fintech" className="h-12 mx-auto mb-4 object-contain" />
            <h1 className="text-3xl font-bold text-text-primary">
              Welcome to Zorvyn
            </h1>
            <p className="text-text-muted mt-2">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-border-default rounded-lg bg-bg-surface text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-colors hover:border-border-active"
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-text-muted" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-border-default rounded-lg bg-bg-surface text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-accent-primary transition-colors hover:border-border-active"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm font-medium flex items-center gap-2">
                <span className="shrink-0">⚠️</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-accent-primary hover:bg-accent-primary/90 text-white py-3 px-4 rounded-lg font-medium transition-all active:scale-[0.98] shadow-sm"
            >
              Sign In <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="glass-panel border border-border-default rounded-2xl p-8 md:p-10 shadow-xl flex flex-col justify-center bg-bg-surface/40 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-success/10 rounded-lg border border-success/20">
              <ShieldCheck className="w-6 h-6 text-success" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">Evaluator Access</h2>
          </div>
          
          <p className="text-text-secondary mb-8 leading-relaxed">
            Welcome to the Zorvyn review process. Please use the designated assessment credentials below to access the financial dashboard and its features.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-bg-elevated/50 rounded-xl border border-border-default hover:border-border-active transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-text-muted group-hover:text-accent-primary transition-colors" />
                  <div>
                    <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-0.5">Username</p>
                    <p className="text-text-primary font-mono font-medium text-lg tracking-tight">abc</p>
                  </div>
                </div>
                <button 
                  onClick={() => setUsername('abc')}
                  className="text-xs font-medium text-accent-primary bg-accent-primary/10 hover:bg-accent-primary/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Fill
                </button>
              </div>
            </div>

            <div className="p-4 bg-bg-elevated/50 rounded-xl border border-border-default hover:border-border-active transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-text-muted group-hover:text-accent-primary transition-colors" />
                  <div>
                    <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-0.5">Password</p>
                    <p className="text-text-primary font-mono font-medium text-lg tracking-tight">123</p>
                  </div>
                </div>
                <button 
                  onClick={() => setPassword('123')}
                  className="text-xs font-medium text-accent-primary bg-accent-primary/10 hover:bg-accent-primary/20 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Fill
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
