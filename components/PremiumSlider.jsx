'use client';

import { useEffect, useState } from 'react';

export default function PremiumSlider() {
  const [premiumProjects, setPremiumProjects] = useState([]);

  useEffect(() => {
    async function fetchPremium() {
      try {
        const res = await fetch('/api/projects/premium');
        const data = await res.json();
        setPremiumProjects(data);
      } catch (err) {
        console.error('Failed to fetch premium projects', err);
      }
    }
    fetchPremium();
  }, []);

  return (
    <div className="overflow-hidden whitespace-nowrap bg-gray-800 py-2 mb-6 rounded">
      <div className="animate-marquee flex space-x-8">
        {premiumProjects.map((project) => (
          <div
            key={project._id}
            className="inline-flex items-center space-x-2 px-4 py-1 bg-yellow-500 text-black rounded"
          >
            <img
              src={project.logo}
              alt={project.name}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-bold">{project.name}</span>
            <span>👑</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
        }
