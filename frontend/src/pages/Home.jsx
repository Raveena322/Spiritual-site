import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { slotsAPI } from '../services/api';
import SlotCard from '../components/SlotCard';
import GitaShlokas from '../components/GitaShlokas';
import AvailabilityCalendar from '../components/AvailabilityCalendar';
import { AuthContext } from '../context/AuthContext';
import { getAllStates, getDistricts } from '../data/indianLocations';

const Home = () => {
  const { isAuthenticated, isGuru } = useContext(AuthContext);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ state: '', district: '', granth: '' });
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [calendarSelectedDate, setCalendarSelectedDate] = useState(null);

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      const response = await slotsAPI.getAll();
      setSlots(response.data.data);
    } catch (error) {
      console.error('Error loading slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredByFilter = slots.filter((slot) => {
    const stateMatch = !filter.state || slot.state === filter.state;
    const districtMatch = !filter.district || slot.district === filter.district;
    const granthMatch =
      !filter.granth || slot.availableGranths.includes(filter.granth);
    return stateMatch && districtMatch && granthMatch;
  });

  const filteredSlots = calendarSelectedDate
    ? filteredByFilter.filter((slot) => {
        const d = new Date(calendarSelectedDate);
        d.setHours(0, 0, 0, 0);
        const from = new Date(slot.fromDate);
        from.setHours(0, 0, 0, 0);
        const to = new Date(slot.toDate);
        to.setHours(23, 59, 59, 999);
        return d >= from && d <= to;
      })
    : filteredByFilter;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      const districts = getDistricts(value);
      setAvailableDistricts(districts);
      setFilter({ ...filter, state: value, district: '' }); // Reset district when state changes
    } else {
      setFilter({ ...filter, [name]: value });
    }
  };

  const uniqueGranths = [
    ...new Set(slots.flatMap((slot) => slot.availableGranths)),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-5 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-900 via-pink-800 to-orange-700 text-white py-20 md:py-28 mb-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/40"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-10 max-w-4xl mx-auto">
            <div className="text-7xl md:text-8xl mb-2 animate-bounce drop-shadow-2xl" style={{ animationDuration: '2s' }}>🕉️</div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black drop-shadow-2xl leading-tight bg-gradient-to-r from-yellow-200 via-pink-200 to-orange-200 bg-clip-text text-transparent">
              Welcome to Spiritual Katha
            </h1>
            <p className="text-xl md:text-2xl text-pink-100/95 font-medium drop-shadow-lg">
              Connect with revered Gurus and book transformative divine sessions — Ramayan, Bhagwat, Mahabharat & more
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="px-8 py-4 rounded-2xl bg-white text-purple-700 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white"
                  >
                    🔐 Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-8 py-4 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white font-bold text-lg hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-xl"
                  >
                    ✨ Create Account
                  </Link>
                </>
              ) : isGuru ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-4 rounded-2xl bg-white text-purple-700 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  📊 Go to Dashboard
                </Link>
              ) : (
                <a
                  href="#sessions"
                  className="px-8 py-4 rounded-2xl bg-white text-purple-700 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 inline-block"
                >
                  📖 View Available Sessions
                </a>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              <span className="flex items-center gap-2 text-pink-100 text-sm md:text-base font-medium">
                <span className="text-2xl">✨</span> Divine Experience
              </span>
              <span className="flex items-center gap-2 text-pink-100 text-sm md:text-base font-medium">
                <span className="text-2xl">🙏</span> Sacred Wisdom
              </span>
              <span className="flex items-center gap-2 text-pink-100 text-sm md:text-base font-medium">
                <span className="text-2xl">📖</span> Ancient Granths
              </span>
            </div>

            {/* YouTube — SatsangSevaSumiran */}
            <a
              href="https://www.youtube.com/@SatsangSevaSumiran"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 mt-8 px-6 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-red-500/50"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>Watch on YouTube — SatsangSevaSumiran</span>
            </a>
          </div>
        </div>
      </section>

      {/* Bhagavad Gita Shlokas — rotates every 9 seconds */}
      <section className="container mx-auto px-4 mb-20 relative z-20">
        <GitaShlokas />
      </section>

      {/* How it works */}
      <section className="container mx-auto px-4 mb-20 relative z-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-3">
            How It Works
          </h2>
          <p className="text-pink-200/90 text-lg max-w-2xl mx-auto">Book your spiritual session in three simple steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-slate-800/60 to-purple-800/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 hover:border-pink-500/40 transition-all duration-300 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">1</div>
            <h3 className="text-xl font-bold text-white mb-2">Choose a Session</h3>
            <p className="text-pink-200/90">Filter by state, district & granth. Find a slot that fits your devotion.</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800/60 to-purple-800/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 hover:border-pink-500/40 transition-all duration-300 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">2</div>
            <h3 className="text-xl font-bold text-white mb-2">Book Your Slot</h3>
            <p className="text-pink-200/90">Sign in or register, then click Book and submit your request to the Guru.</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800/60 to-purple-800/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 hover:border-pink-500/40 transition-all duration-300 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">3</div>
            <h3 className="text-xl font-bold text-white mb-2">Get Approved</h3>
            <p className="text-pink-200/90">The Guru reviews and approves. You can track status in My Bookings.</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16 relative z-20">
        {/* Filters & Slots */}
        <div id="sessions" className="scroll-mt-8">
        <div className="bg-gradient-to-br from-slate-800/50 to-purple-800/30 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10 mb-8 md:mb-16 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-4">
              <div className="w-2 h-10 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full shadow-lg"></div>
              <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300">Find Your Divine Session</h2>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 rounded-xl font-bold text-sm md:text-base min-h-[48px] touch-manipulation transition-all ${
                  viewMode === 'list'
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'bg-slate-700/50 text-pink-200 hover:bg-slate-700/70'
                }`}
              >
                📋 List
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-3 rounded-xl font-bold text-sm md:text-base min-h-[48px] touch-manipulation transition-all ${
                  viewMode === 'calendar'
                    ? 'bg-pink-600 text-white shadow-lg'
                    : 'bg-slate-700/50 text-pink-200 hover:bg-slate-700/70'
                }`}
              >
                📅 Calendar
              </button>
            </div>
          </div>
          {viewMode === 'calendar' && (
            <div className="mb-8">
              <AvailabilityCalendar
                slots={filteredByFilter}
                selectedDate={calendarSelectedDate}
                onSelectDate={setCalendarSelectedDate}
              />
              {calendarSelectedDate && (
                <p className="mt-3 text-pink-200 text-sm">
                  Showing slots for {calendarSelectedDate.toLocaleDateString()}. Click a day to filter.
                </p>
              )}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="space-y-3">
              <label className="block text-lg font-bold text-pink-200 flex items-center gap-3">
                <span className="text-2xl">🗺️</span> Select State
              </label>
              <select
                name="state"
                value={filter.state}
                onChange={handleFilterChange}
                className="w-full px-5 py-3.5 bg-gradient-to-br from-purple-700/40 to-pink-700/40 backdrop-blur-sm border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-semibold hover:border-pink-400/70 shadow-lg"
              >
                <option value="">All States</option>
                {getAllStates().map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="block text-lg font-bold text-pink-200 flex items-center gap-3">
                <span className="text-2xl">📍</span> Select District
              </label>
              <select
                name="district"
                value={filter.district}
                onChange={handleFilterChange}
                disabled={!filter.state}
                className="w-full px-5 py-3.5 bg-gradient-to-br from-purple-700/40 to-pink-700/40 backdrop-blur-sm border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-semibold hover:border-pink-400/70 shadow-lg disabled:bg-gray-700/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">{filter.state ? 'All Districts' : 'Select State First'}</option>
                {availableDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-3">
              <label className="block text-lg font-bold text-pink-200 flex items-center gap-3">
                <span className="text-2xl">📖</span> Select Granth
              </label>
              <select
                name="granth"
                value={filter.granth}
                onChange={handleFilterChange}
                className="w-full px-5 py-3.5 bg-gradient-to-br from-purple-700/40 to-pink-700/40 backdrop-blur-sm border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-semibold hover:border-pink-400/70 shadow-lg"
              >
                <option value="">All Granths</option>
                {uniqueGranths.map((granth) => (
                  <option key={granth} value={granth}>
                    {granth}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Slots List */}
        {loading ? (
          <div className="text-center py-28 space-y-8">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-purple-300 border-t-pink-500 shadow-2xl"></div>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300">Loading divine sessions...</p>
            <div className="flex justify-center gap-3">
              <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0s' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        ) : filteredSlots.length === 0 ? (
          <div className="text-center py-28 bg-gradient-to-br from-purple-800/40 to-pink-800/40 rounded-3xl shadow-2xl border border-purple-500/20 backdrop-blur-xl">
            <div className="text-8xl mb-6 drop-shadow-lg">🙏</div>
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-4">
              No sessions available
            </p>
            <p className="text-pink-200 text-lg">
              Check back soon for new spiritual sessions
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredSlots.map((slot, index) => (
              <div key={slot._id} className="animate-fadeIn hover:scale-105 transition-transform duration-500" style={{ animationDelay: `${index * 0.1}s` }}>
                <SlotCard slot={slot} />
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Home;

