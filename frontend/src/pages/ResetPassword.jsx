import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = query.get('token');
    if (t) {
      setToken(t);
    } else {
      setError('Invalid reset link. Please request a new one.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      setError('Invalid or missing token. Please request a new link.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.resetPassword(token, password);
      setMessage(res.data?.message || 'Password updated successfully.');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
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
          <div className="text-6xl mb-4 drop-shadow-2xl">🔐</div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 bg-clip-text text-transparent mb-2">
            Set New Password
          </h2>
          <p className="text-pink-200 text-sm">
            Choose a strong password for your Spiritual Katha account.
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
              htmlFor="password"
              className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2"
            >
              <span className="text-xl">🔑</span> New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-5 py-3.5 bg-gradient-to-br from-purple-700/30 to-pink-700/20 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium placeholder-gray-400 hover:border-pink-400/70 shadow-lg"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2"
            >
              <span className="text-xl">✅</span> Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-5 py-3.5 bg-gradient-to-br from-purple-700/30 to-pink-700/20 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium placeholder-gray-400 hover:border-pink-400/70 shadow-lg"
              placeholder="Re-enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 text-white py-3.5 rounded-xl hover:from-pink-700 hover:via-purple-700 hover:to-orange-700 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

