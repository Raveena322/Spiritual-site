import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingsAPI, slotsAPI } from '../services/api';
import { getAllStates, getDistricts } from '../data/indianLocations';
import AvailabilityCalendar from '../components/AvailabilityCalendar';

const AvailableSlots = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const slot = location.state?.slot;
  const [formData, setFormData] = useState({
    selectedGranth: slot?.availableGranths[0] || '',
    fromDate: '',
    toDate: '',
    state: slot?.state || '',
    district: slot?.district || '',
    fullAddress: slot?.fullAddress || '',
    city: slot?.city || '',
    mapsLink: slot?.mapsLink || '',
    message: '',
    purposeOfKatha: '',
    specialRequests: '',
  });
  const [loading, setLoading] = useState(false);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState(
    slot?.state ? getDistricts(slot.state) : []
  );

  useEffect(() => {
    if (!slot) {
      navigate('/');
    }
  }, [slot, navigate]);

  useEffect(() => {
    if (!slot?._id) return;
    slotsAPI
      .getBookedDates(slot._id)
      .then((res) => setBookedRanges(res.data.data || []))
      .catch(() => setBookedRanges([]));
  }, [slot?._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      const districts = getDistricts(value);
      setAvailableDistricts(districts);
      setFormData({
        ...formData,
        state: value,
        district: '', // Reset district when state changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await bookingsAPI.create({
        slotId: slot._id,
        ...formData,
      });
      const bookingId = res.data.data?._id;
      if (bookingId) {
        navigate(`/bookings/confirmation/${bookingId}`, { replace: true });
      } else {
        alert('Booking request submitted successfully!');
        navigate('/bookings');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating booking');
    } finally {
      setLoading(false);
    }
  };

  if (!slot) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black">
      {/* Animated background elements */}
      <div className="inset-0 overflow-hidden pointer-events-none absolute md:fixed">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-12 relative z-10 overflow-x-hidden">
        <div className="mb-12 text-center animate-fadeIn space-y-4">
          <div className="text-7xl mb-4 drop-shadow-2xl" style={{ animationDuration: '2s' }}>✨</div>
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-pink-300 via-purple-300 to-orange-300 bg-clip-text text-transparent mb-2">
            Book Your Session
          </h1>
          <p className="text-pink-200 text-lg font-semibold">Complete your booking details below</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/50 to-purple-800/30 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-8 border border-purple-500/30 animate-fadeIn">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-10 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full shadow-lg"></div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300">Slot Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-400/30 hover:border-blue-400/60 transition-colors">
                <div className="text-xs font-bold text-blue-200 uppercase tracking-wide mb-2">👤 Guru</div>
                <div className="text-lg font-bold text-pink-100">{slot.guruId?.name}</div>
              </div>
              <div className="p-5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/30 hover:border-purple-400/60 transition-colors">
                <div className="text-xs font-bold text-purple-200 uppercase tracking-wide mb-2">📅 Dates</div>
                <div className="text-sm font-bold text-pink-100">
                  {new Date(slot.fromDate).toLocaleDateString()} - {new Date(slot.toDate).toLocaleDateString()}
                </div>
              </div>
              <div className="p-5 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl border border-amber-400/30 hover:border-amber-400/60 transition-colors">
                <div className="text-xs font-bold text-amber-200 uppercase tracking-wide mb-2">📍 Location</div>
                <div className="text-sm font-bold text-pink-100">
                  {slot.fullAddress || (slot.district ? `${slot.district}, ${slot.state}` : null) || slot.location || 'Not specified'}
                </div>
                {slot.mapsLink && (
                  <a href={slot.mapsLink} target="_blank" rel="noopener noreferrer" className="text-pink-300 hover:underline text-xs mt-1 inline-block">
                    Open in Maps →
                  </a>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-slate-800/50 to-purple-800/30 backdrop-blur-xl rounded-3xl shadow-2xl p-6 md:p-10 border border-purple-500/30 animate-fadeIn overflow-x-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-10 bg-gradient-to-b from-pink-500 to-orange-500 rounded-full shadow-lg"></div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-orange-300">Booking Details</h2>
            </div>

            {bookedRanges.length > 0 && (
              <div className="mb-6 p-4 bg-amber-500/20 border border-amber-400/40 rounded-xl">
                <p className="text-amber-200 text-sm font-semibold mb-2">📅 Some dates in this slot are already booked. Choose dates that are still available (green on calendar).</p>
                <AvailabilityCalendar
                  slots={[slot]}
                  bookedRanges={bookedRanges}
                  className="max-w-sm"
                />
              </div>
            )}
            <div className="space-y-7">
              <div>
                <label className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2">
                  <span className="text-lg">📖</span> Select Granth *
                </label>
                <select
                  name="selectedGranth"
                  value={formData.selectedGranth}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-3.5 bg-gradient-to-br from-purple-700/30 to-pink-700/20 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium placeholder-gray-400 hover:border-pink-400/70 shadow-lg"
                >
                  <option value="">-- Select a Granth --</option>
                  {slot.availableGranths && slot.availableGranths.length > 0 ? (
                    slot.availableGranths.map((granth) => (
                      <option key={granth} value={granth}>
                        {granth}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No granths available for this slot</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2">
                    <span className="text-lg">📅</span> From Date *
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleChange}
                    min={new Date(slot.fromDate).toISOString().split('T')[0]}
                    max={new Date(slot.toDate).toISOString().split('T')[0]}
                    required
                    className="w-full px-5 py-3.5 bg-gradient-to-br from-purple-700/30 to-pink-700/20 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium hover:border-pink-400/70 shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2">
                    <span className="text-lg">📅</span> To Date *
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    value={formData.toDate}
                    onChange={handleChange}
                    min={formData.fromDate || new Date(slot.fromDate).toISOString().split('T')[0]}
                    max={new Date(slot.toDate).toISOString().split('T')[0]}
                    required
                    className="w-full px-5 py-3.5 bg-gradient-to-br from-purple-700/30 to-pink-700/20 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium hover:border-pink-400/70 shadow-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2">
                    <span className="text-lg">🗺️</span> State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3.5 bg-gradient-to-br from-purple-700/30 to-pink-700/20 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium hover:border-pink-400/70 shadow-lg"
                  >
                    <option value="">Select State</option>
                    {getAllStates().map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2">
                    <span className="text-lg">📍</span> District *
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    disabled={!formData.state}
                    className="w-full px-5 py-3.5 bg-gradient-to-br from-purple-700/30 to-pink-700/20 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium hover:border-pink-400/70 shadow-lg disabled:bg-purple-700/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">{formData.state ? 'Select District' : 'Select State First'}</option>
                    {availableDistricts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2">
                  <span className="text-lg">🙏</span> Purpose of katha (Optional)
                </label>
                <input
                  type="text"
                  name="purposeOfKatha"
                  value={formData.purposeOfKatha}
                  onChange={handleChange}
                  placeholder="e.g. Housewarming, peace, health..."
                  className="w-full px-5 py-3.5 bg-gradient-to-br from-purple-700/30 to-pink-700/20 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium placeholder-gray-400 min-h-[48px] touch-manipulation"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2">
                  <span className="text-lg">💬</span> Special requests (Optional)
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-5 py-3.5 bg-gradient-to-br from-purple-700/30 to-pink-700/20 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium placeholder-gray-400 hover:border-pink-400/70 resize-none shadow-lg min-h-[48px]"
                  placeholder="Any special requests for the Guru..."
                />
                </div>
              <div>
                <label className="block text-sm font-bold text-pink-200 mb-3 flex items-center gap-2">
                  <span className="text-lg">💬</span> Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-5 py-3.5 bg-gradient-to-br from-purple-700/30 to-pink-700/20 border-2 border-purple-400/50 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all text-white font-medium placeholder-gray-400 hover:border-pink-400/70 resize-none shadow-lg min-h-[48px]"
                  placeholder="Any other message..."
                ></textarea>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 px-6 py-4 border-2 border-purple-400/50 rounded-xl hover:bg-purple-700/20 transition-all duration-300 font-bold text-pink-200 hover:text-pink-100 hover:border-purple-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 min-h-[48px] md:py-4 py-3 bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 text-white rounded-xl hover:from-pink-700 hover:via-purple-700 hover:to-orange-700 transition-all duration-300 font-bold text-base md:text-lg shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group border border-pink-400/50 touch-manipulation"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <span>✨</span>
                        Submit Booking Request
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AvailableSlots;

