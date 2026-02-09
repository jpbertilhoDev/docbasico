"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Serviços", href: "/servicos" },
    { name: "Notícias", href: "/noticias" },
    { name: "Contacto", href: "/contato" },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/80 shadow-sm h-16">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full" aria-label="Top">
        <div className="flex items-center justify-center lg:justify-between h-full gap-4">
          {/* Logo Compacto */}
          <div className="flex items-center flex-shrink-0 min-w-0">
            <Link 
              href="/" 
              className="flex items-center h-full py-2 focus:outline-none rounded transition-opacity hover:opacity-90"
              aria-label="Doc Basico - Página inicial"
            >
              <Image
                src="/logo.png"
                alt="Doc Basico"
                width={140}
                height={48}
                className="h-8 md:h-10 w-auto object-contain"
                priority
                sizes="140px"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-6 flex-1 justify-end">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-semibold transition-colors duration-200 whitespace-nowrap relative group py-2",
                    isActive ? "text-primary-600" : "text-gray-700 hover:text-primary-600"
                  )}
                >
                  {item.name}
                  <span className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 transition-transform duration-200 ease-out origin-left",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              );
            })}
            <Link
              href="/agendar"
              className="bg-primary-600 text-white px-5 py-2 rounded-lg font-bold text-sm transition-all duration-200 hover:bg-primary-700 hover:shadow-md active:scale-95 whitespace-nowrap"
            >
              Agendar
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
