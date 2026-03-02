import React, { useState, useEffect } from 'react';
import { slotsAPI, bookingsAPI } from '../services/api';
import BookingCard from '../components/BookingCard';
import { getAllStates, getDistricts, granths as importedGranths } from '../data/indianLocations';

// Fallback granths list in case import fails
const FALLBACK_GRANTHS = [
  "Geeta",
  "Ramayan",
  "Bhagwat Geeta",
  "Gurupuran",
  "Mahabharat",
  "Shiv Puran",
  "Devi Bhagwat",
  "Vishnu Puran",
  "Brahma Puran",
  "Padma Puran",
  "Skanda Puran",
  "Garuda Puran",
  "Narada Puran",
  "Markandeya Puran",
  "Agni Puran",
  "Bhavishya Puran",
  "Linga Puran",
  "Varaha Puran",
  "Kurma Puran",
  "Matsya Puran",
  "Other"
];

// Use imported granths or fallback
const granths = importedGranths && Array.isArray(importedGranths) && importedGranths.length > 0 
  ? importedGranths 
  : FALLBACK_GRANTHS;

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, upcoming: 0, past: 0 });
  const [loading, setLoading] = useState(false);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [slotForm, setSlotForm] = useState({
    fromDate: '',
    toDate: '',
    state: '',
    district: '',
    city: '',
    fullAddress: '',
    mapsLink: '',
    availableGranths: [],
  });
  const [availableDistricts, setAvailableDistricts] = useState([]);

  useEffect(() => {
    if (activeTab === 'slots') {
      loadSlots();
    } else {
      loadBookings();
    }
  }, [activeTab]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await bookingsAPI.getStats();
        setStats(res.data.data || { total: 0, pending: 0, upcoming: 0, past: 0 });
      } catch {
        // ignore
      }
    };
    loadStats();
  }, [activeTab, bookings.length]);

  // Debug: Log granths on component mount
  useEffect(() => {
    console.log('Dashboard - Granths imported:', granths);
    console.log('Granths type:', typeof granths);
    console.log('Granths is array:', Array.isArray(granths));
    console.log('Granths length:', granths ? granths.length : 'undefined');
  }, []);


  const loadSlots = async () => {
    setLoading(true);
    try {
      const response = await slotsAPI.getMySlots();
      setSlots(response.data.data);
    } catch (error) {
      console.error('Error loading slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsAPI.getPending();
      setBookings(response.data.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setSlotForm({
        ...slotForm,
        availableGranths: checked
          ? [...slotForm.availableGranths, value]
          : slotForm.availableGranths.filter((g) => g !== value),
      });
    } else if (name === 'state') {
      // When state changes, update districts and reset district
      const districts = getDistricts(value);
      setAvailableDistricts(districts);
      setSlotForm({
        ...slotForm,
        state: value,
        district: '', // Reset district when state changes
      });
    } else {
      setSlotForm({ ...slotForm, [name]: value });
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // DEBUG: Print WHAT YOU SEND - FIRST THING
    console.log("DEBUG slotForm BEFORE axios:", slotForm);
    
    // Validate form data - check for empty strings explicitly
    const stateValue = slotForm.state?.trim() || '';
    const districtValue = slotForm.district?.trim() || '';
    
    console.log('=== FORM VALIDATION ===');
    console.log('Raw form state:', slotForm);
    console.log('State value:', stateValue, 'Length:', stateValue.length);
    console.log('District value:', districtValue, 'Length:', districtValue.length);
    console.log('Available granths:', slotForm.availableGranths);
    
    if (!stateValue || stateValue === '') {
      alert('Please select a state');
      setLoading(false);
      return;
    }
    
    if (!districtValue || districtValue === '') {
      alert('Please select a district');
      setLoading(false);
      return;
    }
    
    if (!slotForm.availableGranths || slotForm.availableGranths.length === 0) {
      alert('Please select at least one granth');
      setLoading(false);
      return;
    }
    
    if (!slotForm.fromDate || !slotForm.toDate) {
      alert('Please select both from date and to date');
      setLoading(false);
      return;
    }
    
    try {
      // STEP 3: SEND EXPLICIT PAYLOAD with forced string types
      const dataToSend = {
        fromDate: slotForm.fromDate,
        toDate: slotForm.toDate,
        state: String(slotForm.state).trim(),
        district: String(slotForm.district).trim(),
        city: slotForm.city ? String(slotForm.city).trim() : undefined,
        fullAddress: slotForm.fullAddress ? String(slotForm.fullAddress).trim() : undefined,
        mapsLink: slotForm.mapsLink ? String(slotForm.mapsLink).trim() : undefined,
        availableGranths: slotForm.availableGranths,
      };
      
      console.log('=== SENDING TO API ===');
      console.log('Data to send:', JSON.stringify(dataToSend, null, 2));
      console.log('State:', dataToSend.state, 'Type:', typeof dataToSend.state);
      console.log('District:', dataToSend.district, 'Type:', typeof dataToSend.district);
      
      await slotsAPI.create(dataToSend);
      setShowSlotForm(false);
      setSlotForm({
        fromDate: '',
        toDate: '',
        state: '',
        district: '',
        city: '',
        fullAddress: '',
        mapsLink: '',
        availableGranths: [],
      });
      setAvailableDistricts([]);
      loadSlots();
      alert('Slot created successfully!');
    } catch (error) {
      console.error('Slot creation error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Full error:', JSON.stringify(error.response?.data, null, 2));
      const errorMessage = error.response?.data?.message || error.message || 'Error creating slot';
      alert(`Failed to create slot: ${errorMessage}\n\nCheck browser console (F12) for details.`);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await bookingsAPI.approve(id);
      loadBookings();
      alert('Booking approved!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error approving booking');
    }
  };

  const handleReject = async (id) => {
    try {
      await bookingsAPI.reject(id);
      loadBookings();
      alert('Booking rejected!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error rejecting booking');
    }
  };

  const handleDeleteSlot = async (slotId, slotSummary) => {
    const confirmed = window.confirm(
      `Remove this available slot?\n\n${slotSummary}\n\nThis cannot be undone. Existing bookings for this slot will remain, but the slot will no longer appear for new bookings.`
    );
    if (!confirmed) return;
    try {
      await slotsAPI.delete(slotId);
      loadSlots();
      const loadStats = async () => {
        try {
          const res = await bookingsAPI.getStats();
          setStats(res.data.data || { total: 0, pending: 0, upcoming: 0, past: 0 });
        } catch { /* ignore */ }
      };
      loadStats();
      alert('Slot removed successfully.');
    } catch (error) {
      alert(error.response?.data?.message || 'Could not delete slot.');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black overflow-x-hidden relative">
      {/* Animated background elements */}
      <div className="decorative-bg inset-0 overflow-hidden pointer-events-none absolute md:fixed">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="mb-12 mt-2 animate-fadeIn space-y-4">
          <div className="flex items-start gap-3">
            <div className="text-4xl sm:text-5xl drop-shadow-lg flex-shrink-0">🙏</div>
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 bg-clip-text text-transparent break-words">
                Guru Dashboard
              </h1>
              <p className="text-pink-200 mt-2 text-sm sm:text-base md:text-lg font-semibold leading-snug break-words">
                Manage your spiritual katha sessions
              </p>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-800/80 to-purple-800/40 rounded-2xl p-5 md:p-6 border border-purple-500/30">
            <div className="text-xs font-bold text-purple-200 uppercase tracking-wide mb-1">Total Bookings</div>
            <div className="text-2xl md:text-3xl font-black text-white">{stats.total}</div>
          </div>
          <div className="bg-gradient-to-br from-amber-800/40 to-yellow-800/30 rounded-2xl p-5 md:p-6 border border-amber-500/30">
            <div className="text-xs font-bold text-amber-200 uppercase tracking-wide mb-1">Pending</div>
            <div className="text-2xl md:text-3xl font-black text-white">{stats.pending}</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-800/40 to-green-800/30 rounded-2xl p-5 md:p-6 border border-emerald-500/30">
            <div className="text-xs font-bold text-emerald-200 uppercase tracking-wide mb-1">Upcoming</div>
            <div className="text-2xl md:text-3xl font-black text-white">{stats.upcoming}</div>
          </div>
          <div className="bg-gradient-to-br from-slate-700/60 to-slate-800/40 rounded-2xl p-5 md:p-6 border border-slate-500/30">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wide mb-1">Past completed</div>
            <div className="text-2xl md:text-3xl font-black text-white">{stats.past}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gradient-to-br from-slate-800/50 to-purple-800/30 backdrop-blur-xl rounded-3xl shadow-2xl mb-12 border border-purple-500/30 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex-1 px-6 py-6 font-bold text-lg transition-all duration-300 relative ${
                activeTab === 'bookings'
                  ? 'text-pink-300'
                  : 'text-pink-200/70 hover:text-pink-300'
              }`}
            >
              {activeTab === 'bookings' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-orange-500 shadow-lg"></div>
              )}
              <span className="flex items-center justify-center gap-3">
                <span>📋</span>
                Pending Bookings
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeTab === 'bookings' 
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-purple-600/50 text-pink-200'
                }`}>
                  {bookings.length}
                </span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('slots')}
              className={`flex-1 px-6 py-6 font-bold text-lg transition-all duration-300 relative ${
                activeTab === 'slots'
                  ? 'text-pink-300'
                  : 'text-pink-200/70 hover:text-pink-300'
              }`}
            >
              {activeTab === 'slots' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-orange-500 shadow-lg"></div>
              )}
              <span className="flex items-center justify-center gap-3">
                <span>📅</span>
                My Slots
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  activeTab === 'slots' 
                    ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg' 
                    : 'bg-purple-600/50 text-pink-200'
                }`}>
                  {slots.length}
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            {loading ? (
              <div className="text-center py-28 space-y-8">
                <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-purple-300 border-t-pink-500 shadow-2xl"></div>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300">Loading bookings...</p>
                <div className="flex justify-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0s' }}></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-gradient-to-br from-slate-800/50 to-purple-800/30 backdrop-blur-xl rounded-3xl shadow-2xl p-20 text-center border border-purple-500/20">
                <div className="text-8xl mb-6 drop-shadow-lg">🙏</div>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-3">No pending bookings</p>
                <p className="text-pink-200 text-lg">All booking requests have been processed</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {bookings.map((booking, index) => (
                  <div key={booking._id} className="animate-fadeIn hover:scale-105 transition-transform duration-500" style={{ animationDelay: `${index * 0.1}s` }}>
                    <BookingCard
                      booking={booking}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      showActions={true}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Slots Tab */}
        {activeTab === 'slots' && (
          <div>
            <div className="mb-8 flex justify-between items-center">
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 flex items-center gap-3">
                <span>📅</span>
                My Available Slots
              </h2>
              <button
                onClick={() => setShowSlotForm(!showSlotForm)}
                className="bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 text-white px-7 py-3 rounded-xl hover:from-pink-700 hover:via-purple-700 hover:to-orange-700 transition-all duration-300 font-bold shadow-lg hover:shadow-pink-500/50 transform hover:scale-105 border border-pink-400/50"
              >
                {showSlotForm ? '❌ Cancel' : '✨ + Add New Slot'}
              </button>
            </div>

            {showSlotForm && (
              <div className="bg-gradient-to-br from-slate-800/50 to-purple-800/30 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-12 border border-purple-500/30 animate-fadeIn">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-2 h-10 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full shadow-lg"></div>
                  <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300">Create New Slot</h3>
                </div>
                <form onSubmit={handleCreateSlot} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2">
                        <span>📅</span> From Date
                      </label>
                      <input
                        type="date"
                        name="fromDate"
                        value={slotForm.fromDate}
                        onChange={handleSlotFormChange}
                        required
                        className="w-full px-5 py-3 bg-gradient-to-br from-purple-700/30 to-pink-700/20 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium hover:border-pink-400/70 shadow-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2">
                        <span>📅</span> To Date
                      </label>
                      <input
                        type="date"
                        name="toDate"
                        value={slotForm.toDate}
                        onChange={handleSlotFormChange}
                        required
                        className="w-full px-5 py-3 bg-gradient-to-br from-purple-700/30 to-pink-700/20 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium hover:border-pink-400/70 shadow-lg"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2">
                        <span>🗺️</span> State *
                      </label>
                      <select
                        name="state"
                        value={slotForm.state}
                        onChange={handleSlotFormChange}
                        required
                        className="w-full px-5 py-3 bg-slate-800 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium hover:border-pink-400/70 shadow-lg appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-slate-900 text-gray-300">Select State</option>
                        {getAllStates().map((state) => (
                          <option key={state} value={state} className="bg-slate-900 text-white">
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2">
                        <span>📍</span> District *
                      </label>
                      <select
                        name="district"
                        value={slotForm.district}
                        onChange={handleSlotFormChange}
                        required
                        disabled={!slotForm.state}
                        className="w-full px-5 py-3 bg-slate-800 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium hover:border-pink-400/70 shadow-lg disabled:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-slate-900 text-gray-300">Select District</option>
                        {availableDistricts.map((district) => (
                          <option key={district} value={district} className="bg-slate-900 text-white">
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2">
                        <span>🏙️</span> City (optional)
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={slotForm.city}
                        onChange={handleSlotFormChange}
                        placeholder="e.g. Haridwar"
                        className="w-full px-5 py-3 bg-slate-800 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium placeholder-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2">
                        <span>🔗</span> Google Maps link (optional)
                      </label>
                      <input
                        type="url"
                        name="mapsLink"
                        value={slotForm.mapsLink}
                        onChange={handleSlotFormChange}
                        placeholder="https://maps.google.com/..."
                        className="w-full px-5 py-3 bg-slate-800 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium placeholder-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2">
                      <span>📍</span> Full address (optional)
                    </label>
                    <input
                      type="text"
                      name="fullAddress"
                      value={slotForm.fullAddress}
                      onChange={handleSlotFormChange}
                      placeholder="Street, area, landmark"
                      className="w-full px-5 py-3 bg-slate-800 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium placeholder-gray-500"
                    />
                  </div>
                  <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 p-6 rounded-2xl border-2 border-purple-400/30 mb-6 hover:border-purple-400/60 transition-colors">
                    <label className="block text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300 mb-4 flex items-center gap-3">
                      <span className="text-3xl">📖</span> 
                      <span>Available Granths * (Select at least one)</span>
                    </label>
                    
                    {granths && Array.isArray(granths) && granths.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
                          {granths.map((granth) => (
                            <label 
                              key={granth} 
                              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
                                slotForm.availableGranths.includes(granth)
                                  ? 'border-pink-500/60 bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-200 font-bold shadow-lg'
                                  : 'border-purple-400/30 hover:border-purple-400/60 bg-purple-700/10 text-pink-200 hover:text-pink-100'
                              }`}
                            >
                              <input
                                type="checkbox"
                                value={granth}
                                checked={slotForm.availableGranths.includes(granth)}
                                onChange={handleSlotFormChange}
                                className="w-6 h-6 text-pink-600 focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 rounded cursor-pointer flex-shrink-0 accent-pink-500"
                              />
                              <span className="text-base font-semibold flex-1">{granth}</span>
                            </label>
                          ))}
                        </div>
                        
                        {slotForm.availableGranths.length === 0 && (
                          <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-400/40 rounded-xl mb-3">
                            <p className="text-yellow-200 text-sm font-bold flex items-center gap-2">
                              <span className="text-xl">⚠️</span> 
                              <span>Please select at least one granth to continue</span>
                            </p>
                          </div>
                        )}
                        
                        {slotForm.availableGranths.length > 0 && (
                          <div className="p-4 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-green-500/10 border-2 border-pink-400/40 rounded-xl">
                            <p className="text-pink-200 text-sm font-bold flex items-center gap-2 mb-2">
                              <span className="text-xl">✅</span> 
                              <span>Selected Granths ({slotForm.availableGranths.length}):</span>
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {slotForm.availableGranths.map((g) => (
                                <span 
                                  key={g}
                                  className="px-3 py-1 bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-200 rounded-full text-sm font-semibold border border-pink-400/30"
                                >
                                  {g}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-6 bg-gradient-to-r from-red-500/10 to-pink-500/10 border-2 border-red-400/40 rounded-xl">
                        <p className="text-red-300 font-bold text-lg mb-3">❌ Error: Granths not loaded!</p>
                        <div className="bg-slate-700/50 p-3 rounded border border-red-400/30 mb-3">
                          <p className="text-red-300 text-sm font-mono mb-1">Granths value: {String(granths)}</p>
                          <p className="text-red-300 text-sm font-mono mb-1">Type: {typeof granths}</p>
                          <p className="text-red-300 text-sm font-mono">Is Array: {Array.isArray(granths) ? 'Yes' : 'No'}</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => window.location.reload()}
                          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 font-bold transition-all hover:shadow-lg"
                        >
                          🔄 Refresh Page
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 text-white py-4 rounded-xl hover:from-pink-700 hover:via-purple-700 hover:to-orange-700 transition-all duration-300 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <span>✨</span>
                          Create Slot
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </form>
              </div>
            )}

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-400/30 border-t-pink-600 mb-4"></div>
                <p className="text-lg text-pink-300 font-medium">Loading slots...</p>
                <div className="mt-4 flex justify-center gap-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            ) : slots.length === 0 ? (
              <div className="bg-gradient-to-br from-slate-800/50 to-purple-800/30 rounded-2xl shadow-xl p-16 text-center border border-purple-500/30 backdrop-blur-xl">
                <div className="text-7xl mb-6">📅</div>
                <p className="text-2xl font-bold text-pink-300 mb-2">No slots created yet</p>
                <p className="text-pink-200">Click "Add New Slot" to create your first available slot</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {slots.map((slot, index) => (
                  <div
                    key={slot._id}
                    className="bg-gradient-to-br from-slate-800/50 to-purple-800/30 rounded-2xl shadow-lg p-6 border border-purple-500/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group animate-fadeIn backdrop-blur-xl"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-bold text-pink-300 flex items-center gap-2">
                          <span>📅</span> Slot Details
                        </h3>
                        <span
                          className={`px-4 py-2 rounded-full text-xs font-bold shadow-md ${
                            slot.isActive
                              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {slot.isActive ? '✨ Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-xl border border-blue-400/20">
                          <div className="text-xs font-semibold text-blue-300 uppercase tracking-wide mb-1">📅 Dates</div>
                          <div className="text-sm font-bold text-blue-100">
                            {formatDate(slot.fromDate)} - {formatDate(slot.toDate)}
                          </div>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/20">
                          <div className="text-xs font-semibold text-purple-300 uppercase tracking-wide mb-1">📍 Location</div>
                          <div className="text-sm font-bold text-purple-100">
                            {slot.fullAddress || (slot.district ? `${slot.district}, ${slot.state}` : null) || slot.location || 'Not specified'}
                          </div>
                          {slot.mapsLink && (
                            <a href={slot.mapsLink} target="_blank" rel="noopener noreferrer" className="text-pink-300 hover:underline text-xs mt-1 inline-block">Maps →</a>
                          )}
                        </div>
                        <div className="p-3 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-xl border border-orange-400/20">
                          <div className="text-xs font-semibold text-orange-300 uppercase tracking-wide mb-2">📖 Granths</div>
                          <div className="flex flex-wrap gap-2">
                            {slot.availableGranths.map((granth, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-xs font-bold shadow-md"
                              >
                                {granth}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-purple-500/20">
                        <button
                          type="button"
                          onClick={() => handleDeleteSlot(slot._id, `${formatDate(slot.fromDate)} – ${formatDate(slot.toDate)} (${slot.district || slot.location || 'slot'})`)}
                          className="w-full py-3 rounded-xl font-bold text-sm text-red-200 bg-red-900/40 border border-red-500/50 hover:bg-red-800/50 hover:border-red-400/60 transition-all touch-manipulation min-h-[44px]"
                          title="Remove this slot if there is any inconvenience"
                        >
                          🗑️ Remove slot (inconvenience / cancel availability)
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

