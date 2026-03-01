import React, { useMemo } from 'react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isDateInRange(date, fromDate, toDate) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const from = new Date(fromDate);
  from.setHours(0, 0, 0, 0);
  const to = new Date(toDate);
  to.setHours(23, 59, 59, 999);
  return d >= from && d <= to;
}

function getDaysInMonth(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days = [];
  const startPad = first.getDay();
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  return days;
}

const AvailabilityCalendar = ({ slots = [], bookedRanges = [], selectedDate, onSelectDate, className = '' }) => {
  const [viewDate, setViewDate] = React.useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const { year, month } = viewDate;
  const days = useMemo(() => getDaysInMonth(year, month), [year, month]);

  const getDayStatus = (date) => {
    if (!date) return { available: false, booked: false };
    const available = slots.some((slot) =>
      isDateInRange(date, slot.fromDate, slot.toDate)
    );
    const booked = bookedRanges.some(
      (r) => isDateInRange(date, r.fromDate, r.toDate)
    );
    return { available, booked };
  };

  const prevMonth = () => {
    setViewDate((prev) =>
      prev.month === 0
        ? { year: prev.year - 1, month: 11 }
        : { year: prev.year, month: prev.month - 1 }
    );
  };
  const nextMonth = () => {
    setViewDate((prev) =>
      prev.month === 11
        ? { year: prev.year + 1, month: 0 }
        : { year: prev.year, month: prev.month + 1 }
    );
  };

  const monthLabel = new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const isSelected = (date) =>
    selectedDate &&
    date &&
    selectedDate.getFullYear() === date.getFullYear() &&
    selectedDate.getMonth() === date.getMonth() &&
    selectedDate.getDate() === date.getDate();

  return (
    <div className={`bg-gradient-to-br from-slate-800/60 to-purple-800/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-lg bg-purple-600/40 text-white hover:bg-purple-500/60 transition-colors touch-manipulation min-h-[44px] min-w-[44px]"
          aria-label="Previous month"
        >
          ←
        </button>
        <h3 className="text-lg font-bold text-white">{monthLabel}</h3>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-lg bg-purple-600/40 text-white hover:bg-purple-500/60 transition-colors touch-manipulation min-h-[44px] min-w-[44px]"
          aria-label="Next month"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-pink-200/80 py-1"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, i) => {
          const { available, booked } = date ? getDayStatus(date) : { available: false, booked: false };
          const disabled = !date || !available;
          const selected = isSelected(date);
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => date && available && onSelectDate && onSelectDate(date)}
              className={`
                min-h-[44px] rounded-lg text-sm font-medium transition-all touch-manipulation
                ${!date ? 'invisible' : ''}
                ${disabled && date ? 'bg-slate-700/40 text-slate-500 cursor-not-allowed' : ''}
                ${available && !disabled ? 'cursor-pointer' : ''}
                ${available && !booked ? 'bg-emerald-500/30 text-emerald-100 hover:bg-emerald-500/50' : ''}
                ${available && booked ? 'bg-amber-500/40 text-amber-100' : ''}
                ${selected ? 'ring-2 ring-pink-400 ring-offset-2 ring-offset-slate-800' : ''}
              `}
            >
              {date ? date.getDate() : ''}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-pink-200/90">
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-emerald-500/50" /> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-amber-500/50" /> Booked
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-slate-700/50" /> Unavailable
        </span>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
