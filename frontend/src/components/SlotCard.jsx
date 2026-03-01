import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const SlotCard = ({ slot }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isGuru } = useContext(AuthContext);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleBook = () => {
    if (!isAuthenticated) {
      if (window.confirm('Please login or register to book a katha session. Would you like to go to the login page?')) {
        navigate('/login');
      }
      return;
    }
    if (isGuru) {
      alert('Gurus cannot book sessions');
      return;
    }
    navigate('/book', { state: { slot } });
  };

  return (
    <div className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"></div>
      <div className="relative bg-gradient-to-br from-slate-800/80 to-purple-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-7 hover:shadow-pink-500/50 transition-all duration-300 border border-purple-500/30 group-hover:border-pink-500/60 transform group-hover:-translate-y-2">
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 via-purple-400 to-orange-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                {slot.guruId?.name?.charAt(0) || 'G'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-300 to-orange-300 bg-clip-text">
                  {slot.guruId?.name || 'Guru'}
                </h3>
                <p className="text-xs text-pink-200">{slot.guruId?.email}</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-gradient-to-r from-green-500/40 to-emerald-500/40 text-green-200 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border border-green-400/50 animate-pulse">
              ✨ Available
            </span>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-400/30 hover:border-blue-400/60 transition-colors">
              <span className="text-3xl">📅</span>
              <div>
                <div className="text-xs font-bold text-blue-200 uppercase tracking-wide mb-1">Dates</div>
                <div className="text-sm font-bold text-pink-100">
                  {formatDate(slot.fromDate)} - {formatDate(slot.toDate)}
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/30 hover:border-purple-400/60 transition-colors">
              <span className="text-3xl">📍</span>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-purple-200 uppercase tracking-wide mb-1">Location</div>
                <div className="text-sm font-bold text-pink-100">
                  {slot.fullAddress || (slot.district ? `${slot.district}, ${slot.state}` : null) || slot.location || 'Not specified'}
                </div>
                {slot.mapsLink && (
                  <a href={slot.mapsLink} target="_blank" rel="noopener noreferrer" className="text-pink-300 hover:underline text-xs mt-1 inline-block break-all">
                    Open in Google Maps →
                  </a>
                )}
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl border border-amber-400/30 hover:border-amber-400/60 transition-colors">
              <div className="text-xs font-bold text-amber-200 uppercase tracking-wide mb-3 flex items-center gap-2">
                <span>📖</span> Available Granths
              </div>
              <div className="flex flex-wrap gap-2">
                {slot.availableGranths.map((granth, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg text-xs font-bold shadow-lg hover:shadow-blue-500/50 hover:scale-110 transition-all"
                  >
                    {granth}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {!isGuru && (
            <button
              onClick={handleBook}
              className="w-full bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 text-white py-4 rounded-xl hover:from-pink-700 hover:via-purple-700 hover:to-orange-700 transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 relative overflow-hidden group border border-pink-400/50 hover:border-pink-400"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span>✨</span>
                Book This Slot
                <span>✨</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotCard;

