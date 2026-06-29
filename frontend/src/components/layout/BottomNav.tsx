"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Inicio", icon: "home" },
  { href: "/mapa", label: "Mapa", icon: "map" },
  { href: "/recursos", label: "Recursos", icon: "auto_stories" },
  { href: "/perfil", label: "Perfil", icon: "person" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-low border-t border-outline-variant"
      aria-label="Navegación inferior"
    >
      <ul className="flex items-stretch" role="tablist">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <li key={tab.href} role="none" className="flex-1">
              <Link
                href={tab.href}
                role="tab"
                aria-selected={active}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-1 py-2 w-full min-h-[56px] text-xs font-semibold transition-colors ${
                  active
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span
                  className={`material-symbols-rounded text-2xl transition-all ${
                    active ? "text-primary" : "text-on-surface-variant"
                  }`}
                  aria-hidden="true"
                  style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
