import React, { useState, useEffect } from 'react';
import { slotsAPI } from '../services/api';
import SlotCard from '../components/SlotCard';
import DailyQuote from '../components/DailyQuote';
import { getAllStates, getDistricts, granths } from '../data/indianLocations';

const Home = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ state: '', district: '', granth: '' });
  const [availableDistricts, setAvailableDistricts] = useState([]);

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

  const filteredSlots = slots.filter((slot) => {
    const stateMatch = !filter.state || slot.state === filter.state;
    const districtMatch = !filter.district || slot.district === filter.district;
    const granthMatch =
      !filter.granth || slot.availableGranths.includes(filter.granth);
    return stateMatch && districtMatch && granthMatch;
  });

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
      <div className="relative overflow-hidden bg-gradient-to-b from-purple-900 via-pink-800 to-orange-700 text-white py-24 mb-16">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8">
            <div className="text-8xl md:text-9xl mb-2 animate-bounce drop-shadow-2xl" style={{ animationDuration: '2s' }}>🕉️</div>
            <h1 className="text-6xl md:text-7xl font-black mb-4 drop-shadow-2xl leading-tight bg-gradient-to-r from-yellow-200 via-pink-200 to-orange-200 bg-clip-text text-transparent">
              Welcome to Spiritual Katha
            </h1>
            <p className="text-2xl md:text-3xl text-pink-100 font-light drop-shadow-lg max-w-3xl mx-auto">
              Connect with revered Gurus and book transformative divine sessions
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <div className="group bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-lg px-8 py-4 rounded-full border border-pink-300/50 hover:border-pink-300 hover:bg-purple-500/40 transition-all duration-300 shadow-2xl hover:shadow-pink-500/50">
                <span className="text-lg font-bold group-hover:scale-110 transition-transform inline-block">✨ Divine Experience</span>
              </div>
              <div className="group bg-gradient-to-r from-pink-500/30 to-orange-500/30 backdrop-blur-lg px-8 py-4 rounded-full border border-orange-300/50 hover:border-orange-300 hover:bg-pink-500/40 transition-all duration-300 shadow-2xl hover:shadow-orange-500/50">
                <span className="text-lg font-bold group-hover:scale-110 transition-transform inline-block">🙏 Sacred Wisdom</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 relative z-20">
        {/* Daily Spiritual Quote */}
        <div className="mb-16 animate-fadeIn">
          <DailyQuote />
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-slate-800/50 to-purple-800/30 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-16 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 animate-fadeIn">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-2 h-10 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full shadow-lg"></div>
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300">Find Your Divine Session</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
  );
};

export default Home;

