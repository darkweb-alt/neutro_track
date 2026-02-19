
import React, { useState } from 'react';
import { AuthUser } from '../types';

interface AuthProps {
  onAuthSuccess: (user: AuthUser) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email || !password || (!isLogin && !name)) {
        throw new Error("Please fill in all required fields.");
      }

      if (!isLogin && password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      const usersKey = 'nutrilens_registered_users';
      const storedUsers = JSON.parse(localStorage.getItem(usersKey) || '[]');

      if (isLogin) {
        const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password);
        if (!foundUser) {
          throw new Error("Invalid email or password.");
        }
        
        // Success: Log in
        onAuthSuccess({ email: foundUser.email, name: foundUser.name });
      } else {
        const userExists = storedUsers.some((u: any) => u.email === email);
        if (userExists) {
          throw new Error("An account with this email already exists.");
        }

        // Success: Register and log in
        const newUser = { email, password, name };
        const updatedUsers = [...storedUsers, newUser];
        localStorage.setItem(usersKey, JSON.stringify(updatedUsers));
        
        onAuthSuccess({ email: newUser.email, name: newUser.name });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 dark:bg-emerald-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 dark:bg-indigo-900/10 rounded-full -ml-32 -mb-32 blur-3xl opacity-50"></div>

      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500 rounded-3xl shadow-xl shadow-emerald-500/20 flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <i className="fa-solid fa-lens text-white text-3xl"></i>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">NutriLens AI</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
            {isLogin ? "Welcome back! Good to see you." : "Start your journey to better health."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 p-4 rounded-2xl flex items-start gap-3 animate-fadeIn">
              <i className="fa-solid fa-circle-exclamation text-rose-500 mt-0.5"></i>
              <p className="text-rose-600 dark:text-rose-400 text-xs font-bold leading-relaxed">{error}</p>
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600"></i>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-emerald-500 transition-all shadow-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600"></i>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-emerald-500 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Password</label>
            <div className="relative">
              <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600"></i>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-emerald-500 transition-all shadow-sm"
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest ml-1">Confirm Password</label>
              <div className="relative">
                <i className="fa-solid fa-shield-check absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600"></i>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-emerald-500 transition-all shadow-sm"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-900/20 dark:shadow-black/50 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 mt-4"
          >
            {loading ? (
              <i className="fa-solid fa-circle-notch animate-spin text-lg"></i>
            ) : (
              isLogin ? "Sign In" : "Register Account"
            )}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="ml-2 text-emerald-600 dark:text-emerald-400 font-black hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
