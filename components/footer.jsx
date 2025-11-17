export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-neutral-800 mt-10 py-8 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 p-4">

        {/* Brand Section */}
        <div>
          <h2 className="text-lg font-bold mb-3">Dragons Trending</h2>
          <p className="text-neutral-400 text-sm">
            Your #1 platform for memecoin listing, discovery, and promotion.
          </p>
        </div>

        {/* Navigation Section */}
        <div>
          <h2 className="text-lg font-bold mb-3">Navigation</h2>
          <ul className="space-y-2 text-neutral-300">
            <li><a href="/" className="hover:text-red-400">Home</a></li>
            <li><a href="/submit" className="hover:text-red-400">Submit Coin</a></li>
            <li><a href="/leaderboard" className="hover:text-red-400">Leaderboard</a></li>
            <li><a href="/premium" className="hover:text-red-400">Premium</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-lg font-bold mb-3">Socials & Bots</h2>
          <ul className="space-y-2 text-neutral-300 text-sm">
            <li><a href="https://t.me/dragonstrending" target="_blank" className="hover:text-red-400">Telegram Channel</a></li>
            <li><a href="https://t.me/Dragonstrend" target="_blank" className="hover:text-red-400">Telegram Group</a></li>
            <li><a href="https://x.com/Dragonstrend" target="_blank" className="hover:text-red-400">Twitter / X</a></li>
            <li><a href="https://www.youtube.com/@DragonsTrending" target="_blank" className="hover:text-red-400">YouTube</a></li>
            <li><a href="https://discord.gg/6EQ6vTT4E6" target="_blank" className="hover:text-red-400">Discord</a></li>
            <li><a href="https://linktr.ee/dragonstrend" target="_blank" className="hover:text-red-400">Linktree</a></li>
            <li><a href="https://t.me/dragonsdenvote" target="_blank" className="hover:text-red-400">Dragons Den Vote</a></li>
            <li><a href="https://t.me/DragonsRaidBot" target="_blank" className="hover:text-red-400">Raid Bot</a></li>
            <li><a href="https://t.me/DragonsVoteBuy" target="_blank" className="hover:text-red-400">Vote Bot</a></li>
            <li><a href="https://t.me/DragonsTrendBot" target="_blank" className="hover:text-red-400">Trend Bot</a></li>
            <li><a href="https://t.me/DragonsBuyBot" target="_blank" className="hover:text-red-400">Buy Bot</a></li>
            <li><a href="https://t.me/DragonsRaid" target="_blank" className="hover:text-red-400">Raid Lounge</a></li>
            <li><a href="https://t.me/DragonsAI" target="_blank" className="hover:text-red-400">Dragon Chat Bot</a></li>
          </ul>
        </div>

      </div>

      <div className="text-center text-neutral-600 text-sm mt-6">
        © {new Date().getFullYear()} Dragons Trending. All rights reserved.
      </div>
    </footer>
  );
}
