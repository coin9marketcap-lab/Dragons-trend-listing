'use client';

import { useEffect, useState } from 'react';

export default function Timer({ initialSeconds = 86400, onReset }) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onReset?.();
          return initialSeconds;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [initialSeconds, onReset]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  return <span>{formatTime(timeLeft)}</span>;
      }
