import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AtSign, ArrowRight } from 'lucide-react';

export default function AuthScreen({ mode, onLoginSuccess, onNavigateToRegister }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegister = mode === 'register' || location.pathname === '/register';

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('yourname@pizza.com');
  const [password, setPassword] = useState('••••••••');

  const handleAuthAction = () => {
    // Set authentication token in localStorage for basic auth simulation
    localStorage.setItem('token', 'lizza_demo_token');
    if (onLoginSuccess) {
      onLoginSuccess();
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAuthAction();
  };

  const handleToggleMode = () => {
    if (onNavigateToRegister) {
      onNavigateToRegister();
    } else if (isRegister) {
      navigate('/login');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="h-full w-full max-h-full bg-[#FFF5F0] flex flex-col items-center justify-center p-3 sm:p-4 overflow-hidden relative box-border">
      {/* Top Floating Circular Slice Decoration */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#FFD6C9] rounded-full border-2 border-black/20 flex items-center justify-center pointer-events-none opacity-60">
        <span className="text-3xl opacity-40">🍕</span>
      </div>

      <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center z-10 my-auto">
        {/* Tilted Logo Sticky Box */}
        <div className="relative mb-2">
          <div className="bg-white neo-border neo-shadow py-2.5 px-6 rounded-xl transform -rotate-3 transition-transform hover:rotate-0 duration-200">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#FF5A26] font-heading drop-shadow-[2px_2px_0px_#1E1E1E]">
              Lizza
            </h1>
          </div>
        </div>

        {/* Tagline */}
        <h2 className="text-xs sm:text-sm font-extrabold text-[#C4380B] font-heading mb-3 tracking-wide flex items-center gap-1 text-center">
          Pizza hits different 🍕
        </h2>

        {/* Auth Form Card */}
        <div className="w-full bg-white neo-border neo-shadow-lg rounded-2xl p-4 sm:p-5 space-y-3 relative box-border">
          <p className="text-center font-bold text-[#1E1E1E] text-sm sm:text-base mb-0.5 font-heading">
            {isRegister ? 'Create Your Account' : 'Welcome Back!'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* Email Input */}
            <div className="space-y-1">
              <label className="block text-[11px] sm:text-xs font-bold text-gray-700 tracking-wide">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@pizza.com"
                  className="w-full bg-white neo-border rounded-full py-2 sm:py-2.5 pl-3.5 pr-9 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A26]"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700">
                  <AtSign className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="block text-[11px] sm:text-xs font-bold text-gray-700 tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white neo-border rounded-full py-2 sm:py-2.5 pl-3.5 pr-9 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5A26]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black cursor-pointer p-0.5"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            {!isRegister && (
              <div className="text-right">
                <a
                  href="#forgot"
                  className="text-[11px] font-bold text-[#8C3A27] underline hover:text-[#FF5A26]"
                >
                  Forgot Password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#FF6B35] text-white neo-btn font-heading font-extrabold text-sm sm:text-base py-2.5 sm:py-3 rounded-full flex items-center justify-center gap-1.5 hover:bg-[#FF5A26] transition-colors mt-1 cursor-pointer"
            >
              <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-2 text-[9px] sm:text-[10px] font-extrabold tracking-widest text-gray-400 font-heading">
              OR SLIDE IN WITH
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleAuthAction}
              className="w-full bg-white neo-btn rounded-xl py-2 px-2.5 flex items-center justify-center gap-1.5 text-xs font-bold text-gray-800 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={handleAuthAction}
              className="w-full bg-[#1A73E8] text-white neo-btn rounded-xl py-2 px-2.5 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.14-1.92-14.4-6.15-3.32-2.78-7.23-7.55-11.74-14.32-6.1-9.17-10.97-19.51-14.61-31.02-3.64-11.51-5.46-22.65-5.46-33.42 0-14.19 3.57-26.04 10.72-35.54 7.15-9.5 16.32-14.37 27.52-14.61 4.79 0 10.14 1.25 16.06 3.76 5.92 2.51 9.87 3.76 11.84 3.76 1.62 0 5.67-1.3 12.16-3.9 6.48-2.6 11.66-3.8 15.54-3.6 11.39.52 20.35 4.72 26.88 12.6-10.12 6.13-15.08 14.69-14.88 25.68.21 8.52 3.48 15.82 9.82 21.9 6.34 6.08 14.07 9.54 23.19 10.38-2.28 6.78-5.32 13.79-9.13 21.03zM119.22 31.07c0-6.75 2.45-13.16 7.35-19.23 4.9-6.07 11.02-9.76 18.36-11.07.21.98.32 1.89.32 2.73 0 6.64-2.52 13.06-7.56 19.27-5.04 6.2-11.19 9.87-18.47 11.01-.1-.91-.15-1.81-.15-2.71z"/>
              </svg>
              <span>Apple</span>
            </button>
          </div>
        </div>

        {/* Toggle Login/Register Footer */}
        <p className="mt-3 text-xs font-bold text-gray-700">
          {isRegister ? 'Already have an account? ' : 'New here? '}
          <button
            type="button"
            onClick={handleToggleMode}
            className="text-[#C4380B] underline hover:text-[#FF5A26] cursor-pointer"
          >
            {isRegister ? 'Sign In' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}

