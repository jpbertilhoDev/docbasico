import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Doc Basico - Serviços Burocráticos para Imigrantes em Portugal",
  description: "Serviços de documentação, legalização, consultoria fiscal e empresarial para imigrantes em Portugal. Renovação de residência, NIF, Segurança Social, IRS e muito mais.",
  keywords: ["imigração portugal", "renovação residência", "NIF", "IRS", "documentação portugal"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" className={inter.variable}>
      <head>
        {/* Preconnect para APIs externas (melhora velocidade) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS Prefetch para recursos externos */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Preload de recursos críticos */}
        <link 
          rel="preload" 
          href="/api/appointments/lookup" 
          as="fetch" 
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased">
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}

