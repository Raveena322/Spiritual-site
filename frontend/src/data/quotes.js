// Spiritual quotes for daily inspiration
export const spiritualQuotes = [
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha",
    emoji: "🧘"
  },
  {
    text: "You are what you believe in. You become that which you believe you can become.",
    author: "Bhagavad Gita",
    emoji: "🕉️"
  },
  {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    emoji: "☮️"
  },
  {
    text: "The soul is neither born, and nor does it die.",
    author: "Bhagavad Gita",
    emoji: "✨"
  },
  {
    text: "When you realize there is nothing lacking, the whole world belongs to you.",
    author: "Lao Tzu",
    emoji: "🌍"
  },
  {
    text: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
    emoji: "😊"
  },
  {
    text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.",
    author: "Buddha",
    emoji: "💝"
  },
  {
    text: "The best way to find yourself is to lose yourself in the service of others.",
    author: "Mahatma Gandhi",
    emoji: "🤲"
  },
  {
    text: "Happiness is not something ready made. It comes from your own actions.",
    author: "Dalai Lama",
    emoji: "🌟"
  },
  {
    text: "The divine is within you. You are the divine.",
    author: "Hindu Philosophy",
    emoji: "🙏"
  },
  {
    text: "Be the change that you wish to see in the world.",
    author: "Mahatma Gandhi",
    emoji: "🌱"
  },
  {
    text: "The journey of a thousand miles begins with one step.",
    author: "Lao Tzu",
    emoji: "🚶"
  },
  {
    text: "In the end, only three things matter: how much you loved, how gently you lived, and how gracefully you let go of things not meant for you.",
    author: "Buddha",
    emoji: "🌸"
  },
  {
    text: "The present moment is the only time over which we have dominion.",
    author: "Thich Nhat Hanh",
    emoji: "⏰"
  },
  {
    text: "Where there is love, there is life.",
    author: "Mahatma Gandhi",
    emoji: "💖"
  },
  {
    text: "The quieter you become, the more you can hear.",
    author: "Ram Dass",
    emoji: "🔇"
  },
  {
    text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.",
    author: "Rumi",
    emoji: "💕"
  },
  {
    text: "The divine light in me recognizes the divine light in you.",
    author: "Namaste",
    emoji: "🕯️"
  },
  {
    text: "Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.",
    author: "Rumi",
    emoji: "🧭"
  },
  {
    text: "The wound is the place where the Light enters you.",
    author: "Rumi",
    emoji: "💫"
  }
];

// Get a quote based on the day (so it changes daily)
export const getDailyQuote = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  return spiritualQuotes[dayOfYear % spiritualQuotes.length];
};

// Get random quote
export const getRandomQuote = () => {
  return spiritualQuotes[Math.floor(Math.random() * spiritualQuotes.length)];
};

