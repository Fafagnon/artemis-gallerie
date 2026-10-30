"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Palette, Users, Globe, ExternalLink } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/admin/oeuvres", label: "Œuvres & Tableaux", icon: Palette },
    { href: "/admin/artistes", label: "Artistes", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F11] text-zinc-100 flex flex-col font-archivo">
      {/* Top Navigation Bar */}
      <header className="border-b border-zinc-800 bg-[#141416]/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="font-extrabold tracking-wider text-lg uppercase text-white">
              Artemis <span className="text-or font-newsreader italic font-normal text-xl">Admin</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 border-l border-zinc-800 pl-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-white border-b-2 border-or"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-850"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-1.5 rounded text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-or" />
            <span className="hidden sm:inline">Voir la galerie</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </Link>
        </div>
      </header>

      {/* Mobile nav bar */}
      <div className="md:hidden border-b border-zinc-800 bg-[#141416] px-4 py-2 flex items-center justify-around text-xs">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded ${
                isActive ? "text-or font-bold" : "text-zinc-400"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

