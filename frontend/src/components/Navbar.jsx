import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isGuru } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="no-print bg-gradient-to-r from-purple-700 via-pink-600 to-orange-600 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-md bg-opacity-95 border-b border-white/10">
      <div className="container mx-auto px-4 py-5">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group hover:opacity-90 transition-opacity">
            <div className="text-4xl group-hover:scale-125 transition-transform duration-300 drop-shadow-lg">🕉️</div>
            <div>
              <div className="text-2xl font-bold tracking-tight drop-shadow-md">Spiritual Katha</div>
              <div className="text-xs text-pink-100 font-light drop-shadow">Divine Wisdom</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/"
              className="px-5 py-2.5 rounded-full hover:bg-white/20 transition-all duration-300 font-semibold backdrop-blur-sm border border-white/30 hover:scale-105 hover:shadow-lg flex items-center gap-2"
            >
              🏠 Home
            </Link>
            {isAuthenticated ? (
              <>
                {isGuru ? (
                  <Link
                    to="/dashboard"
                    className="px-6 py-2.5 rounded-full hover:bg-white/20 transition-all duration-300 font-semibold backdrop-blur-sm border border-white/30 hover:scale-105 hover:shadow-lg"
                  >
                    📊 Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/bookings"
                    className="px-6 py-2.5 rounded-full hover:bg-white/20 transition-all duration-300 font-semibold backdrop-blur-sm border border-white/30 hover:scale-105 hover:shadow-lg"
                  >
                    📋 My Bookings
                  </Link>
                )}
                <div className="px-4 py-2.5 bg-gradient-to-r from-white/10 to-white/5 rounded-full backdrop-blur-sm border border-white/30 shadow-lg">
                  <span className="text-sm font-semibold">👤 {user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300 font-bold hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-6 py-2.5 rounded-full hover:bg-white/20 transition-all duration-300 font-semibold backdrop-blur-sm border border-white/30 hover:scale-105 hover:shadow-lg"
                >
                  📝 Register
                </Link>
                <Link
                  to="/login"
                  className="px-7 py-2.5 bg-gradient-to-r from-white to-pink-50 text-transparent bg-clip-text font-bold rounded-full hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-white shadow-lg"
                >
                  🔐 Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white text-2xl" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-white/20 pt-4 animate-slideDown">
            <Link to="/" className="block px-4 py-3 rounded-lg hover:bg-white/10 font-semibold transition-all" onClick={() => setIsOpen(false)}>
              🏠 Home
            </Link>
            {isAuthenticated ? (
              <>
                {isGuru ? (
                  <Link to="/dashboard" className="block px-4 py-3 rounded-lg hover:bg-white/10 font-semibold transition-all" onClick={() => setIsOpen(false)}>
                    📊 Dashboard
                  </Link>
                ) : (
                  <Link to="/bookings" className="block px-4 py-3 rounded-lg hover:bg-white/10 font-semibold transition-all" onClick={() => setIsOpen(false)}>
                    📋 My Bookings
                  </Link>
                )}
                <div className="px-4 py-3 bg-white/10 rounded-lg font-semibold">👤 {user?.name}</div>
                <button onClick={handleLogout} className="w-full px-4 py-3 bg-red-600 rounded-lg hover:bg-red-700 font-bold transition-all">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="block px-4 py-3 rounded-lg hover:bg-white/10 font-semibold transition-all" onClick={() => setIsOpen(false)}>
                  📝 Register
                </Link>
                <Link to="/login" className="block px-4 py-3 bg-white text-purple-700 rounded-lg font-bold hover:shadow-lg transition-all" onClick={() => setIsOpen(false)}>
                  🔐 Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

