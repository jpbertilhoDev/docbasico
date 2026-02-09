"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, Calendar, Newspaper, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileNavigation() {
  const pathname = usePathname();

  const navigation = [
    { name: "Início", href: "/", icon: Home },
    { name: "Serviços", href: "/servicos", icon: Briefcase },
    { name: "Agendar", href: "/agendar", icon: Calendar, highlight: true },
    { name: "Notícias", href: "/noticias", icon: Newspaper },
    { name: "Contato", href: "/contato", icon: Mail },
  ];

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
      <nav className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl px-5 py-2 flex items-center justify-between">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95",
                  isActive 
                    ? "bg-primary-700 text-white ring-4 ring-white" 
                    : "bg-primary-600 text-white ring-4 ring-white"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold mt-1 text-primary-700">
                  {item.name}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 min-w-[3.5rem] transition-colors",
                isActive ? "text-primary-600" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

