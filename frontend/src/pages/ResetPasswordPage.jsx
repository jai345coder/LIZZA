import React, { useState, useEffect } from 'react';
import StickerBadge from '../components/StickerBadge.jsx';

export default function ResetPasswordPage({ onNavigate, token: propToken }) {
  // Extract token from prop or from window location pathname (/reset-password/:token)
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', isError: false });

  useEffect(() => {
    if (propToken) {
      setToken(propToken);
    } else {
      const pathname = window.location.pathname;
      const parts = pathname.split('/reset-password/');
      if (parts.length > 1 && parts[1]) {
        setToken(parts[1]);
      } else {
        const queryToken = new URLSearchParams(window.location.search).get('token');
        if (queryToken) setToken(queryToken);
      }
    }
  }, [propToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: '', isError: false });

    if (!token) {
      setStatusMsg({ text: 'Invalid or missing reset token.', isError: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMsg({ text: 'Passwords do not match!', isError: true });
      return;
    }

    if (newPassword.length < 6) {
      setStatusMsg({ text: 'Password must be at least 6 characters long.', isError: true });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      setStatusMsg({ text: '🎉 Password reset successfully! Redirecting to login...', isError: false });
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('login');
        } else {
          window.location.href = '/';
        }
      }, 2500);
    } catch (err) {
      console.error('Reset Password Error:', err);
      setStatusMsg({ text: err.message || 'An error occurred. Please try again.', isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF5F0] flex flex-col justify-between relative overflow-hidden p-4 sm:p-6 lg:p-8">
      {/* Background Decorative Gen Z Stickers */}
      <div className="absolute top-8 left-8 hidden lg:block rotate-[-12deg] pointer-events-none">
        <StickerBadge text="🔒 SECURE YOUR SLICE" variant="lime" size="lg" />
      </div>
      <div className="absolute bottom-12 right-10 hidden lg:block rotate-[15deg] pointer-events-none">
        <StickerBadge text="🔑 NEW PASS. NEW VIBE." variant="pink" size="lg" />
      </div>

      {/* Brand Header */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 mb-6">
        <div 
          onClick={() => onNavigate && onNavigate('login')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FF6B35] neo-border neo-shadow-sm flex items-center justify-center text-2xl font-black text-white group-hover:rotate-6 transition-transform">
            🍕
          </div>
          <div>
            <h1 className="font-heading font-black text-2xl tracking-tighter text-[#1E1E1E]">
              LIZZA <span className="text-[#FF6B35]">PIZZA</span>
            </h1>
            <p className="text-[10px] font-heading font-extrabold uppercase tracking-widest text-gray-500">
              Reset Account Access
            </p>
          </div>
        </div>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-md mx-auto z-10 my-auto">
        <div className="bg-white neo-border neo-shadow-lg rounded-3xl p-6 sm:p-8 relative">
          <div className="mb-6 text-center">
            <span className="text-4xl mb-2 block">🔐</span>
            <h2 className="font-heading font-black text-2xl uppercase text-[#1E1E1E] tracking-tight">
              Reset Your Password
            </h2>
            <p className="text-xs font-semibold text-gray-500 mt-1">
              Enter your new password below to secure your account.
            </p>
          </div>

          {statusMsg.text && (
            <div
              className={`p-3.5 rounded-xl neo-border font-heading font-bold text-xs uppercase mb-5 ${
                statusMsg.isError
                  ? 'bg-[#FFDEE9] text-[#D8000C] border-[#D8000C]'
                  : 'bg-[#E1F8DC] text-[#276749] border-[#276749]'
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-heading font-bold text-xs uppercase tracking-wider text-[#1E1E1E] mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

            <div>
              <label className="block font-heading font-bold text-xs uppercase tracking-wider text-[#1E1E1E] mb-1">
                Confirm New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full neo-border rounded-xl px-4 py-3 bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full neo-btn py-3.5 px-6 bg-[#FF6B35] hover:bg-[#ff5a22] text-white font-heading font-black text-sm uppercase tracking-widest rounded-xl transition-transform cursor-pointer mt-2 disabled:opacity-50"
            >
              {loading ? 'RESETTING PASSWORD...' : 'UPDATE PASSWORD 🔑'}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs font-heading font-bold uppercase text-gray-500 z-10 py-2">
        © 2026 LIZZA PIZZA CO. ALL RIGHTS RESERVED. NO RULES. JUST DOUGH.
      </footer>
    </div>
  );
}
