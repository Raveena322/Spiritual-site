import React from 'react';

const BookingCard = ({ booking, onApprove, onReject, showActions = false }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"></div>
      <div className="relative bg-gradient-to-br from-slate-800/80 to-purple-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-7 hover:shadow-pink-500/50 transition-all duration-300 border border-purple-500/30 group-hover:border-pink-500/60 transform group-hover:-translate-y-2">
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                {booking.devoteeId?.name?.charAt(0) || booking.slotId?.guruId?.name?.charAt(0) || 'B'}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-300 to-orange-300 bg-clip-text">
                  {booking.devoteeId?.name || booking.slotId?.guruId?.name || 'Booking'}
                </h3>
                <p className="text-xs text-pink-200">
                  {booking.devoteeId?.email || ''}
                </p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm border ${
              booking.status === 'Approved' ? 'bg-gradient-to-r from-green-500/40 to-emerald-500/40 text-green-200 border-green-400/50' :
              booking.status === 'Rejected' ? 'bg-gradient-to-r from-red-500/40 to-rose-500/40 text-red-200 border-red-400/50' :
              'bg-gradient-to-r from-yellow-500/40 to-amber-500/40 text-yellow-200 border-yellow-400/50'
            }`}>
              {booking.status === 'Approved' && '✅ '}
              {booking.status === 'Rejected' && '❌ '}
              {booking.status === 'Pending' && '⏳ '}
              {booking.status}
            </span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-400/30 hover:border-blue-400/60 transition-colors">
              <div className="text-xs font-bold text-blue-200 uppercase tracking-wide mb-2">📖 Granth</div>
              <div className="text-sm font-bold text-pink-100">{booking.selectedGranth}</div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/30 hover:border-purple-400/60 transition-colors">
              <div className="text-xs font-bold text-purple-200 uppercase tracking-wide mb-2">📅 Dates</div>
              <div className="text-sm font-bold text-pink-100">
                {formatDate(booking.fromDate)} - {formatDate(booking.toDate)}
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-xl border border-amber-400/30 hover:border-amber-400/60 transition-colors">
              <div className="text-xs font-bold text-amber-200 uppercase tracking-wide mb-2">📍 Location</div>
              <div className="text-sm font-bold text-pink-100">
                {booking.district ? `${booking.district}, ${booking.state}` : booking.location || 'Not specified'}
              </div>
            </div>
            
            {booking.message && (
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-400/30 hover:border-green-400/60 transition-colors">
                <div className="text-xs font-bold text-green-200 uppercase tracking-wide mb-2">💬 Message</div>
                <div className="text-sm text-pink-100">{booking.message}</div>
              </div>
            )}
          
            <div className="text-xs text-pink-300/70 font-medium pt-3 border-t border-pink-400/20">
              Created: {formatDate(booking.createdAt)}
            </div>
          </div>

          {showActions && booking.status === 'Pending' && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => onApprove(booking._id)}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-800 transition-all duration-300 font-bold shadow-lg hover:shadow-green-500/50 transform hover:scale-105 border border-green-400/50"
              >
                ✅ Approve
              </button>
              <button
                onClick={() => onReject(booking._id)}
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-700 text-white py-3 rounded-xl hover:from-red-700 hover:to-rose-800 transition-all duration-300 font-bold shadow-lg hover:shadow-red-500/50 transform hover:scale-105 border border-red-400/50"
              >
                ❌ Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;

