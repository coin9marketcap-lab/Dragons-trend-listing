'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white p-6 mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <p>© 2025 Dragons Trending. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="https://t.me/dragonstrending" target="_blank">Telegram</a>
          <a href="https://x.com/Dragonstrend" target="_blank">X/Twitter</a>
          <a href="https://www.youtube.com/@DragonsTrending" target="_blank">YouTube</a>
          <a href="https://discord.gg/6EQ6vTT4E6" target="_blank">Discord</a>
        </div>
      </div>
    </footer>
  );
}
