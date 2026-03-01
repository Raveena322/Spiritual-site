import React, { useState, useEffect } from 'react';
import { gitaShlokas } from '../data/gitaShlokas';

const ROTATE_INTERVAL_MS = 9000; // 9 seconds

const GitaShlokas = () => {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % gitaShlokas.length);
        setIsVisible(true);
      }, 400);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const shloka = gitaShlokas[index];

  const goTo = (newIndex) => {
    setIsVisible(false);
    setTimeout(() => {
      setIndex(newIndex);
      setIsVisible(true);
    }, 300);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-900/90 via-orange-900/80 to-slate-900 p-8 md:p-12 shadow-2xl border border-amber-500/30 backdrop-blur-sm">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-4xl">🕉️</span>
          <h2 className="text-2xl md:text-3xl font-bold text-amber-100">
            Bhagavad Gita — Divine Verses
          </h2>
        </div>

        <div
          className={`transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <p className="text-amber-200/90 text-sm font-semibold mb-3">
            Chapter {shloka.chapter}, Shloka {shloka.shloka} — {shloka.title}
          </p>

          <blockquote className="text-amber-50 text-lg md:text-xl leading-relaxed mb-6 font-medium whitespace-pre-line">
            {shloka.sanskrit}
          </blockquote>

          <div className="space-y-4">
            <p className="text-amber-100/95 text-base md:text-lg leading-relaxed">
              <span className="text-amber-300 font-semibold">English: </span>
              {shloka.english}
            </p>
            <p className="text-amber-100/95 text-base md:text-lg leading-relaxed">
              <span className="text-amber-300 font-semibold">हिंदी: </span>
              {shloka.hindi}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
          <div className="flex gap-2">
            {gitaShlokas.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === index ? 'bg-amber-400 scale-125' : 'bg-amber-500/40 hover:bg-amber-500/60'
                }`}
                aria-label={`Go to shloka ${i + 1}`}
              />
            ))}
          </div>
          <p className="text-amber-200/80 text-sm">
            Changes every 9 seconds • {index + 1} / {gitaShlokas.length}
          </p>
        </div>
      </div>

      <div className="absolute top-4 left-4 text-amber-500/20 text-4xl">ॐ</div>
      <div className="absolute bottom-4 right-4 text-amber-500/20 text-4xl">ॐ</div>
    </div>
  );
};

export default GitaShlokas;
