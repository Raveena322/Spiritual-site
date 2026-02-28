import React, { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import BookingCard from '../components/BookingCard';
import DailyQuote from '../components/DailyQuote';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-12 animate-fadeIn space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-6xl drop-shadow-lg">📋</div>
            <div>
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 bg-clip-text text-transparent">
                My Bookings
              </h1>
              <p className="text-pink-200 mt-2 text-lg font-semibold">Track your spiritual katha sessions</p>
            </div>
          </div>
        </div>

        {/* Daily Spiritual Quote */}
        <div className="mb-16 animate-fadeIn">
          <DailyQuote />
        </div>

        {loading ? (
          <div className="text-center py-28 space-y-8">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-purple-300 border-t-pink-500 shadow-2xl"></div>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300">Loading your bookings...</p>
            <div className="flex justify-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-800/50 to-purple-800/30 backdrop-blur-xl rounded-3xl shadow-2xl p-16 text-center border border-purple-500/20 animate-fadeIn">
            <div className="text-8xl mb-6 drop-shadow-lg">🙏</div>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-4">
              No bookings yet
            </p>
            <p className="text-pink-200 mb-8 text-lg font-semibold">
              Start your spiritual journey by booking a katha session
            </p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 text-white px-10 py-4 rounded-xl hover:from-pink-700 hover:via-purple-700 hover:to-orange-700 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 border border-pink-400/50"
            >
              ✨ Browse Available Slots →
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {bookings.map((booking, index) => (
              <div key={booking._id} className="animate-fadeIn hover:scale-105 transition-transform duration-500" style={{ animationDelay: `${index * 0.1}s` }}>
                <BookingCard booking={booking} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;

