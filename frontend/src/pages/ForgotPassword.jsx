import React, { useState } from 'react';
import { authAPI } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setMessage('If an account exists, a password reset link has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="max-w-md w-full bg-gradient-to-br from-slate-800/50 to-purple-800/30 backdrop-blur-xl rounded-3xl shadow-2xl p-10 relative z-10 border border-purple-500/30">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 drop-shadow-2xl">🔑</div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 bg-clip-text text-transparent mb-2">
            Forgot Password
          </h2>
          <p className="text-pink-200 text-sm">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {message && (
          <div className="mb-4 rounded-xl border border-emerald-500/60 bg-emerald-900/30 px-4 py-3 text-emerald-100 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl border border-red-500/60 bg-red-900/30 px-4 py-3 text-red-100 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2"
            >
              <span className="text-xl">📧</span> Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3.5 bg-gradient-to-br from-purple-700/30 to-pink-700/20 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium placeholder-gray-400 hover:border-pink-400/70 shadow-lg"
              placeholder="satsangsevasumiran@gmail.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 text-white py-3.5 rounded-xl hover:from-pink-700 hover:via-purple-700 hover:to-orange-700 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending link...' : 'Send reset link'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

