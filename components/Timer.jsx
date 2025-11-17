'use client';
import { useState, useEffect } from 'react';

export default function Timer() {
  const [time, setTime] = useState(24*60*60*1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev - 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const h = Math.floor(time / 3600000);
  const m = Math.floor((time % 3600000) / 60000);
  const s = Math.floor((time % 60000) / 1000);

  return <p className="text-white font-bold text-center mb-4">⏳ Reset in {h}h {m}m {s}s</p>;
}
