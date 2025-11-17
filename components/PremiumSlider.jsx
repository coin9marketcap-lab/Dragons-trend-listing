export default function PremiumSlider({ projects }) {
  return (
    <div className="premium-slider overflow-hidden py-4 bg-gray-900 border-b border-gray-800">
      <div className="flex animate-scroll whitespace-nowrap">
        {projects.map((p) => (
          <div key={p._id} className="flex items-center gap-3 px-4">
            <img src={p.logo} alt={p.name} className="h-12 w-12 rounded-full" />
            <span className="text-yellow-400 font-bold">👑 {p.name}</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .animate-scroll {
          display: inline-flex;
          animation: scroll 25s linear infinite;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
