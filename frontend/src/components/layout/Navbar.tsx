"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/mapa", label: "Mapa" },
  { href: "/refugios", label: "Refugios" },
  { href: "/recursos", label: "Recursos" },
  { href: "/directorio", label: "Directorio" },
  { href: "/chat", label: "Chat" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface-container-low border-b border-outline-variant shadow-card">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-primary font-bold text-xl min-h-0"
          aria-label="SARA — Ir al inicio"
        >
          <img src="/logo.webp" alt="SARA" className="h-8 w-auto" />
          <span>SARA</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors min-h-0 ${
                pathname === link.href
                  ? "bg-primary-fixed text-primary"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop SOS CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/sos"
            className="flex items-center gap-2 bg-secondary-container text-on-secondary px-5 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity min-h-0"
          >
            <span className="material-symbols-rounded text-lg" aria-hidden="true">
              crisis_alert
            </span>
            NECESITO AYUDA
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden flex items-center justify-center w-12 h-12 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
        >
          <span className="material-symbols-rounded" aria-hidden="true">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav
          className="lg:hidden border-t border-outline-variant bg-surface-container-low"
          aria-label="Menú móvil"
        >
          <ul className="flex flex-col divide-y divide-outline-variant">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-5 py-4 text-base font-medium transition-colors ${
                    pathname === link.href
                      ? "text-primary bg-primary-fixed"
                      : "text-on-surface hover:bg-surface-container"
                  }`}
                  aria-current={pathname === link.href ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/sos"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-5 py-4 text-base font-bold text-secondary-container"
              >
                <span className="material-symbols-rounded text-lg" aria-hidden="true">
                  crisis_alert
                </span>
                NECESITO AYUDA — SOS
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
