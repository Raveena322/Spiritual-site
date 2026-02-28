import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-purple-900 to-black text-white py-12 mt-20 border-t border-purple-500/30 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 group">
              <div className="text-4xl group-hover:scale-110 transition-transform">🕉️</div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-orange-300 bg-clip-text text-transparent">Spiritual Katha</h3>
                <p className="text-xs text-pink-200">Divine Wisdom Platform</p>
              </div>
            </div>
            <p className="text-sm text-pink-200/80">Connect with revered Gurus and book transformative divine sessions for spiritual growth.</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-pink-300">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-pink-200/80 hover:text-pink-300 transition-colors font-medium flex items-center gap-2"><span>→</span> Home</a></li>
              <li><a href="/login" className="text-pink-200/80 hover:text-pink-300 transition-colors font-medium flex items-center gap-2"><span>→</span> Login</a></li>
              <li><a href="/register" className="text-pink-200/80 hover:text-pink-300 transition-colors font-medium flex items-center gap-2"><span>→</span> Register</a></li>
              <li><a href="/bookings" className="text-pink-200/80 hover:text-pink-300 transition-colors font-medium flex items-center gap-2"><span>→</span> My Bookings</a></li>
            </ul>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-pink-300">About</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-pink-200/80 hover:text-pink-300 transition-colors font-medium flex items-center gap-2"><span>✨</span> Our Mission</a></li>
              <li><a href="#" className="text-pink-200/80 hover:text-pink-300 transition-colors font-medium flex items-center gap-2"><span>🙏</span> Our Vision</a></li>
              <li><a href="#" className="text-pink-200/80 hover:text-pink-300 transition-colors font-medium flex items-center gap-2"><span>📖</span> Learn More</a></li>
              <li><a href="#" className="text-pink-200/80 hover:text-pink-300 transition-colors font-medium flex items-center gap-2"><span>💬</span> Contact Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-pink-300">Connect</h4>
            <div className="space-y-3">
              <p className="text-pink-200/80 font-medium text-sm">📧 Email us anytime</p>
              <p className="text-pink-100 font-bold">info@spiritualkatha.com</p>
              <div className="flex gap-4 pt-2">
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">f</a>
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">t</a>
                <a href="#" className="w-10 h-10 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">in</a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-pink-200 font-bold text-lg">© 2026 Raveena Choudhary | All Rights Reserved</p>
          </div>
          <div className="flex gap-6 text-xs text-pink-200/70 font-medium">
            <a href="#" className="hover:text-pink-300 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-pink-300 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-pink-300 transition-colors">Cookie Policy</a>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-pink-500/0 via-pink-500/50 to-pink-500/0"></div>
      </div>
    </footer>
  );
};

export default Footer;
