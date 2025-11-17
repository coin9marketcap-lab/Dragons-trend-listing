import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-black border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        
        {/* Logo + Title */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Dragons Trending"
            className="h-12 w-12 rounded-full"
          />
          <h1 className="text-white text-xl font-bold">Dragons Trending</h1>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-white font-medium">
          <Link href="/submit" className="hover:text-red-400 transition">Submit</Link>
          <Link href="/leaderboard" className="hover:text-red-400 transition">Leaderboard</Link>
          <Link href="/premium" className="hover:text-red-400 transition">Premium</Link>
        </nav>

      </div>
    </header>
  );
    }
