export default function Leaderboard({ top }) {
  return (
    <section className="leaderboard p-6 text-center">
      <h2 className="text-white text-2xl font-bold mb-2">🔥 Top Coin Leaderboard</h2>
      <h3 className="text-neutral-400 mb-4">Today's Top Coins</h3>
      <div className="flex justify-center gap-4 flex-wrap">
        {top.map((p) => (
          <div key={p._id} className="leaderboard-item bg-gray-900 p-4 rounded-lg border border-gray-800 w-48">
            <img src={p.logo} alt={p.name} className="h-12 w-12 rounded-full mx-auto mb-2" />
            <h4 className="text-white font-bold">{p.name}</h4>
            <p className="text-neutral-400 mb-2">{p.votes} votes</p>
            <form method="POST" action="/api/vote">
              <input type="hidden" name="id" value={p._id} />
              <button className="vote-btn bg-yellow-400 w-full py-1 rounded font-bold hover:bg-yellow-500">⬆️ Upvote</button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
