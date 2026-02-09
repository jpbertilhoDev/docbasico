import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meus Agendamentos - Doc Basico",
  description: "Consulte, gerencie e cancele seus agendamentos de forma rápida e segura.",
};

export default function MeusAgendamentosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

