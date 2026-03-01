import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingsAPI } from '../services/api';

const BookingConfirmation = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('No booking ID');
      return;
    }
    bookingsAPI
      .getById(id)
      .then((res) => {
        setBooking(res.data.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Booking not found');
        setBooking(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-pink-500" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl text-pink-200 mb-6">{error || 'Booking not found'}</p>
          <Link
            to="/bookings"
            className="inline-block px-6 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700"
          >
            Back to My Bookings
          </Link>
        </div>
      </div>
    );
  }

  const locationText =
    booking.fullAddress ||
    (booking.district && booking.state ? `${booking.district}, ${booking.state}` : null) ||
    booking.location ||
    '—';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-black">
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/80 to-purple-800/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-purple-500/30 print:bg-white print:text-black print:border print:border-gray-300">
            <div className="text-center mb-8 no-print">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-pink-300 to-orange-300 bg-clip-text text-transparent print:text-black">
                Booking Confirmed
              </h1>
              <p className="text-pink-200 mt-2 print:text-gray-700">
                Your katha session request has been submitted. Save your Booking ID for reference.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-6 mb-6 print:bg-gray-50 print:text-black">
              <div className="text-sm font-bold text-pink-200 uppercase tracking-wide mb-2 print:text-gray-600">
                Booking ID
              </div>
              <div className="text-2xl font-mono font-bold text-white break-all print:text-black">
                {booking._id}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <span className="text-xs font-bold text-pink-200 uppercase print:text-gray-600">Granth</span>
                <p className="text-lg font-semibold text-white print:text-black">{booking.selectedGranth}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-pink-200 uppercase print:text-gray-600">Dates</span>
                <p className="text-lg font-semibold text-white print:text-black">
                  {formatDate(booking.fromDate)} – {formatDate(booking.toDate)}
                </p>
              </div>
              <div>
                <span className="text-xs font-bold text-pink-200 uppercase print:text-gray-600">Location</span>
                <p className="text-lg font-semibold text-white print:text-black">{locationText}</p>
                {booking.mapsLink && (
                  <a
                    href={booking.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-300 hover:underline text-sm mt-1 inline-block print:no-underline"
                  >
                    Open in Google Maps →
                  </a>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-pink-200 uppercase print:text-gray-600">Status</span>
                <p className="text-lg font-semibold text-amber-300 print:text-black">{booking.status}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 no-print">
              <button
                type="button"
                onClick={handlePrint}
                className="flex-1 min-h-[48px] px-6 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:from-pink-700 hover:to-purple-700 touch-manipulation"
              >
                📄 Print / Save as PDF
              </button>
              <Link
                to="/bookings"
                className="flex-1 min-h-[48px] px-6 py-4 rounded-xl border-2 border-purple-400 text-center font-bold text-lg text-pink-200 hover:bg-purple-700/20 touch-manipulation flex items-center justify-center"
              >
                My Bookings
              </Link>
              <Link
                to="/"
                className="flex-1 min-h-[48px] px-6 py-4 rounded-xl border-2 border-pink-400/50 text-center font-bold text-lg text-pink-200 hover:bg-pink-700/20 touch-manipulation flex items-center justify-center"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
