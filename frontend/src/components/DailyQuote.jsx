import React, { useState, useEffect } from 'react';
import { getDailyQuote, getRandomQuote } from '../data/quotes';

const DailyQuote = () => {
  const [currentQuote, setCurrentQuote] = useState(getDailyQuote());
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Change quote every 10 seconds
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuote(getRandomQuote());
        setIsAnimating(false);
      }, 500); // Half second for fade out
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleNextQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote());
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 p-8 md:p-12 shadow-2xl border border-white/20 backdrop-blur-sm transform hover:scale-[1.02] transition-transform duration-300">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full" style={{ animation: 'shimmer 3s ease-in-out infinite' }}></div>

      <div className="relative z-10">
        {/* Quote Icon */}
        <div className="flex justify-center mb-6">
          <div className="text-6xl md:text-7xl animate-bounce" style={{ animationDuration: '3s' }}>
            {currentQuote.emoji}
          </div>
        </div>

        {/* Quote Text */}
        <div className={`text-center transition-all duration-500 ${isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}>
          <blockquote className="text-white text-xl md:text-2xl lg:text-3xl font-light leading-relaxed mb-6 italic">
            "{currentQuote.text}"
          </blockquote>
          
          {/* Author */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px bg-white/50 flex-1 max-w-20"></div>
            <p className="text-white/90 text-lg md:text-xl font-semibold">
              — {currentQuote.author}
            </p>
            <div className="h-px bg-white/50 flex-1 max-w-20"></div>
          </div>
        </div>

        {/* Next Quote Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleNextQuote}
            className="px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all duration-300 font-semibold border border-white/30 hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <span>✨</span>
            <span>Next Quote</span>
            <span>✨</span>
          </button>
        </div>

        {/* Quote Indicator Dots */}
        <div className="flex justify-center gap-2 mt-6">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 left-4 text-white/20 text-4xl">❝</div>
      <div className="absolute bottom-4 right-4 text-white/20 text-4xl transform rotate-180">❝</div>
    </div>
  );
};

export default DailyQuote;

