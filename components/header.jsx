'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/">
        <img
          src="https://ibb.co/3Y0wy0M3"
          alt="Dragons Trending Logo"
          className="h-12 w-12"
        />
      </Link>
      <nav className="space-x-4">
        <Link href="/" className="hover:text-yellow-400">Home</Link>
        <Link href="/admin/login" className="hover:text-yellow-400">Admin</Link>
      </nav>
    </header>
  );
        }
