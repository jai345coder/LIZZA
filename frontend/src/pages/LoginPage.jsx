import React, { useState, useEffect, useRef } from 'react';
import StickerBadge from '../components/StickerBadge.jsx';
import RandomStickers from '../components/RandomStickers.jsx';
import PizzaLogoIcon from '../components/PizzaLogoIcon.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Page 1: Login / Register Page
 */
export default function LoginPage({ onLoginSuccess, onNavigate }) {
  const { login, register, verifyEmail } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [flavorVibe, setFlavorVibe] = useState('Hot Honey');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // References for sticker collision avoidance (Logo & Login/Register Box)
  const logoRef = useRef(null);
  const boxRef = useRef(null);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotMsg, setForgotMsg] = useState({ text: '', isError: false });

  // Check for email verification token in URL params or path if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setSubmitting(true);
      verifyEmail(token)
        .then(() => setSuccessMsg('Email verified successfully! You can now log in.'))
        .catch((err) => setErrorMsg(err.response?.data?.message || 'Verification failed.'))
        .finally(() => setSubmitting(false));
    }
  }, [verifyEmail]);

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotMsg({ text: '', isError: false });
    setForgotSubmitting(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      setForgotMsg({
        text: '🎉 Password reset email sent! Check your inbox for the link.',
        isError: false,
      });
    } catch (err) {
      setForgotMsg({
        text: err.message || 'Error requesting password reset.',
        isError: true,
      });
    } finally {
      setForgotSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      if (isRegister) {
        console.log("Register");
        const res = await register({
          username: name || email.split('@')[0],
          email,
          password,
        });
        setSuccessMsg(res.message || 'Registration successful! Verification email sent.');
        setIsRegister(false);
      } else {//login
        console.log("login")
        const res = await login({ email, password });
        setSuccessMsg('Logged in successfully!');
        console.log("LOGIN SUCCESS:" , res);
        if (onLoginSuccess) {
          onLoginSuccess(res.user || { email, name: name || 'Pizza Lover' });
        }
        if (onNavigate) {
          onNavigate('menu');
        }
      }
    } catch (err) {
      console.log('Auth error:', err);
      setErrorMsg(err.response?.data?.message || 'An error occurred during authentication.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF5F0] flex flex-col justify-between relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Dynamic Animated Random Stickers (Avoids Logo and Login/Register Box, fades out in 2s) */}
      <RandomStickers logoRef={logoRef} boxRef={boxRef} />

      {/* Background Decorative Gen Z Stickers */}
      <div className="absolute top-30 left-8 hidden lg:block rotate-[-12deg] pointer-events-none">
        <StickerBadge text="🍕 100% CHAOS GUARANTEED" variant="lime" size="lg" />
      </div>
      <div className="absolute bottom-12 right-10 hidden lg:block rotate-[15deg] pointer-events-none">
        <StickerBadge text="⚡ HOT & READY 24/7" variant="pink" size="lg" />
      </div>
      <div className="absolute top-1/3 right-12 hidden xl:block rotate-[-6deg] pointer-events-none">
        <StickerBadge text="🔥 NO RULES. JUST DOUGH." variant="yellow" size="md" />
      </div>

      {/* Brand Header */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 mb-6">
        <div 
          ref={logoRef}
          onClick={() => onNavigate && onNavigate('menu')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 bg-white neo-border neo-shadow rounded-2xl flex items-center justify-center rotate-[-4deg] group-hover:rotate-0 transition-transform">
            <PizzaLogoIcon className="w-8 h-8" />
          </div>
          <span className="font-heading font-black text-3xl text-[#1E1E1E] tracking-tight">
            LIZZA
          </span>
        </div>

        <button
          onClick={() => onNavigate && onNavigate('menu')}
          className="neo-btn px-2 py-1.5 sm:px-4 sm:py-2 bg-white text-[#1E1E1E] font-heading font-bold text-[10px] sm:text-xs uppercase rounded-xl cursor-pointer whitespace-nowrap"
        >
          Browse Menu →
        </button>
      </header>

      {/* Main Form Center Shell */}
      <main className="flex-1 flex items-center justify-center py-6 z-10">
        <div ref={boxRef} className="w-full max-w-md bg-white neo-border neo-shadow-lg rounded-[28px] p-6 sm:p-8 space-y-6 relative overflow-hidden">
          {/* Top Promotional Sticker */}
          <div className="absolute -top-3 right-6 rotate-[6deg]">
            <StickerBadge text="GET 20% OFF 🏷️" variant="lime" size="sm" />
          </div>

          {/* Title & Mode Switcher */}
          <div className="text-center space-y-2 pt-2">
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#1E1E1E] uppercase tracking-tight">
              {isRegister ? 'JOIN THE SQUAD' : 'WELCOME BACK'}
            </h1>
            <p className="text-sm font-medium text-gray-600">
              {isRegister ? 'Create your Lizza account for instant crust perks' : 'Log in to order your favorite chaos pie'}
            </p>
          </div>

          {/* Error & Success Messages */}
          {errorMsg && (
            <div className="p-3 bg-red-100 neo-border border-red-500 text-red-700 font-bold text-xs rounded-xl text-center">
              ⚠️ {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-emerald-100 neo-border border-emerald-500 text-emerald-700 font-bold text-xs rounded-xl text-center">
              ✅ {successMsg}
            </div>
          )}

          {/* Toggle Switch Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-[#FFF5F0] neo-border rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2.5 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                !isRegister ? 'bg-[#FF6B35] text-white neo-shadow-sm' : 'text-[#1E1E1E] hover:bg-white/50'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setErrorMsg(''); setSuccessMsg(''); }}
              className={`py-2.5 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                isRegister ? 'bg-[#FF6B35] text-white neo-shadow-sm' : 'text-[#1E1E1E] hover:bg-white/50'
              }`}
            >
              Register
            </button>
          </div>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block font-heading font-bold text-xs uppercase tracking-wider text-[#1E1E1E] mb-1">
                  Full Name / Username
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full neo-border rounded-xl px-4 py-3 bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>
            )}

            <div>
              <label className="block font-heading font-bold text-xs uppercase tracking-wider text-[#1E1E1E] mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@lizza.com"
                className="w-full neo-border rounded-xl px-4 py-3 bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>

            <div>
              <label className="block font-heading font-bold text-xs uppercase tracking-wider text-[#1E1E1E] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full neo-border rounded-xl px-4 py-3 bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 hover:text-[#1E1E1E] cursor-pointer"
                >
                  {showPassword ? 'HIDE' : 'SHOW'}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block font-heading font-bold text-xs uppercase tracking-wider text-[#1E1E1E] mb-1">
                  Your Primary Flavor Vibe
                </label>
                <select
                  value={flavorVibe}
                  onChange={(e) => setFlavorVibe(e.target.value)}
                  className="w-full neo-border rounded-xl px-4 py-3 bg-white font-heading font-bold text-xs uppercase focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                >
                  <option value="Hot Honey">🔥 Hot Honey & Pepperoni</option>
                  <option value="Extra Cheese">🧀 Cheese Pull Fanatic</option>
                  <option value="Spicy Veggie">🌱 Spicy Vegan Supreme</option>
                  <option value="Truffle Mushroom">🍄 Truffle & Garlic Chaos</option>
                </select>
              </div>
            )}

            {!isRegister && (
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-bold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-[#1E1E1E] text-[#FF6B35] focus:ring-0" defaultChecked />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => { setShowForgotModal(true); setForgotMsg({ text: '', isError: false }); }}
                  className="text-[#FF6B35] hover:underline uppercase font-bold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full neo-btn py-3.5 px-6 bg-[#FF6B35] hover:bg-[#ff5a22] text-white font-heading font-black text-sm uppercase tracking-widest rounded-xl transition-transform cursor-pointer mt-2 disabled:opacity-50"
            >
              {submitting
                ? 'PROCESSING...'
                : isRegister
                ? 'CREATE SQUAD ACCOUNT'
                : 'LOG IN & ORDER 🍕'}
            </button>
          </form>
        </div>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white neo-border neo-shadow-lg rounded-3xl p-6 sm:p-8 max-w-md w-full relative">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#1E1E1E] font-bold text-xl cursor-pointer"
            >
              ✕
            </button>

            <div className="mb-6 text-center">
              <span className="text-4xl mb-2 block">📩</span>
              <h3 className="font-heading font-black text-xl uppercase text-[#1E1E1E]">
                Forgot Password?
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Enter your registered email address and we'll send you a link to reset your password.
              </p>
            </div>

            {forgotMsg.text && (
              <div
                className={`p-3 rounded-xl neo-border font-heading font-bold text-xs uppercase mb-4 ${
                  forgotMsg.isError
                    ? 'bg-[#FFDEE9] text-[#D8000C] border-[#D8000C]'
                    : 'bg-[#E1F8DC] text-[#276749] border-[#276749]'
                }`}
              >
                {forgotMsg.text}
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div>
                <label className="block font-heading font-bold text-xs uppercase tracking-wider text-[#1E1E1E] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="you@lizza.com"
                  className="w-full neo-border rounded-xl px-4 py-3 bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-full sm:w-1/2 py-3 px-4 neo-border font-heading font-bold text-xs uppercase rounded-xl hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotSubmitting}
                  className="w-full sm:w-1/2 neo-btn py-3 px-4 bg-[#FF6B35] text-white font-heading font-black text-xs uppercase tracking-wider rounded-xl hover:bg-[#ff5a22] cursor-pointer disabled:opacity-50"
                >
                  {forgotSubmitting ? 'SENDING...' : 'SEND LINK 🚀'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer copyright */}
      <footer className="text-center text-xs font-heading font-bold uppercase text-gray-500 z-10 py-2">
        © 2026 LIZZA PIZZA CO. ALL RIGHTS RESERVED. NO RULES. JUST DOUGH.
      </footer>
      <h1 className='flex items-center justify-center z-[0.5]'>LIZZA</h1>
    </div>
  );
}
