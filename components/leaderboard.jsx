'use client';

import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [projects, setProjects] = useState([]);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds

  useEffect(() => {
    async function fetchTopProjects() {
      try {
        const res = await fetch('/api/projects/top');
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch top projects', err);
      }
    }
    fetchTopProjects();
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 24 * 60 * 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const voteProject = async (id) => {
    try {
      const res = await fetch(`/api/projects/${id}/vote`, { method: 'POST' });
      const updated = await res.json();
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? { ...p, votes: updated.votes } : p))
      );
    } catch (err) {
      console.error('Failed to vote', err);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg text-white max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Today's Top Coins</h2>
      <p className="text-sm mb-4">Next reset in: {formatTime(timeLeft)}</p>
      <div className="space-y-4">
        {projects.map((project, idx) => (
          <div
            key={project._id}
            className={`flex items-center justify-between p-4 rounded ${
              project.premium ? 'bg-yellow-600' : 'bg-gray-800'
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold">{idx + 1}.</span>
              <img src={project.logo} alt={project.name} className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-bold">{project.name}</p>
                <p className="text-sm">{project.symbol}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-bold">{project.votes}</p>
              <button
                onClick={() => voteProject(project._id)}
                className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
              >
                👍 Vote
              </button>
              {project.premium && <span className="ml-2 text-yellow-200">👑</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
