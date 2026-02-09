"use client";

import { useState, Suspense, lazy, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { getServiceInfo } from "@/lib/services-documents";
import { getAllBookableServices, isServiceBookable, getBookableService } from "@/lib/bookable-services";
import Link from "next/link";
import { ArrowLeft, Calendar, Search, Plus, Clock, User, Mail, Phone, FileText, XCircle, AlertCircle, CheckCircle2, CreditCard, ArrowRight, Shield, Building2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useDialog } from "@/hooks/useDialog";
import { useToast } from "@/hooks/useToast";
import { FormSkeleton } from "@/components/LoadingSkeleton";

// Lazy load do componente pesado de agendamento
const AppointmentAssistant = lazy(() => import("@/components/AppointmentAssistant"));

type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_slug: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string | null;
  documents_reminder: any;
  created_at: string;
}

function AgendarContent() {
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get("servico") || "";
  const [selectedService, setSelectedService] = useState(serviceSlug);
  
  const toast = useToast();

  // Memoizar lista de serviços (não muda durante a sessão)
  const bookableServices = useMemo(() => getAllBookableServices(), []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Profissional */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
                Agende Sua Consulta em<br />
                <span className="text-primary-200">Poucos Minutos</span>
              </h1>
              
              <p className="text-base md:text-lg text-white/90 mb-8 max-w-xl leading-relaxed font-medium">
                Escolha o serviço ideal, selecione o melhor horário e receba confirmação imediata. 
                <strong>Simples, rápido e seguro.</strong>
              </p>
            </div>

            {/* Link para Meus Agendamentos */}
            <div className="hidden md:block">
              <Link
                href="/meus-agendamentos"
                className="group flex flex-col items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform">
                  <Search className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <span className="block font-bold text-base">Já tem agendamento?</span>
                  <span className="text-xs text-white/80">Consulte ou cancele aqui</span>
                </div>
              </Link>
            </div>

            {/* Link Mobile para Meus Agendamentos */}
            <div className="md:hidden w-full mt-6 animate-fade-in">
              <Link
                href="/meus-agendamentos"
                className="flex items-center justify-center gap-2 w-full bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl text-white font-bold hover:bg-white/20 transition-all active:scale-95"
              >
                <Search className="w-5 h-5" />
                <span>Consultar meus agendamentos</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
          {!selectedService ? (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Selecione o Serviço
                </h2>
                <p className="text-gray-600">
                  Escolha abaixo o tipo de atendimento que você precisa.
                </p>
              </div>

              {/* Grid de Serviços - Design Minimalista */}
              <div className="grid grid-cols-1 gap-3 mb-8">
                {bookableServices.map((service) => {
                  const serviceInfo = getServiceInfo(service.slug);
                  return (
                    <button
                      key={service.slug}
                      onClick={() => setSelectedService(service.slug)}
                      className="group relative bg-white rounded-xl border-2 border-gray-100 hover:border-primary-600 p-5 text-left transition-all duration-200 hover:shadow-lg flex flex-col md:flex-row md:items-center gap-4"
                    >
                      {/* Ícone */}
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
                          {service.category === 'empresarial' ? (
                            <Building2 className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                          ) : (
                            <FileText className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {service.name}
                          </h3>
                          {service.requiresPayment && (
                            <span className="px-2.5 py-0.5 bg-primary-100 text-primary-700 text-xs font-bold rounded-full uppercase tracking-wide">
                              Com Pagamento
                            </span>
                          )}
                        </div>
                        
                        {serviceInfo && (
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {serviceInfo.estimatedDuration} min
                            </span>
                            <span className="hidden md:inline text-gray-300">|</span>
                            <span>
                              {service.category === 'empresarial' ? 'Empresarial' : 'Documentação'}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Informação Adicional - Design Clean */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-900 mb-1">
                      Não encontrou o que procura?
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Outros serviços como NIF, Segurança Social e IRS são realizados por atendimento direto.
                    </p>
                    <Link 
                      href="/contato" 
                      className="inline-flex items-center gap-2 text-primary-600 font-bold text-sm hover:gap-3 transition-all"
                    >
                      Falar com especialista
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <button
                onClick={() => setSelectedService("")}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 font-medium mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para seleção de serviços
              </button>

              <AppointmentAssistant
                serviceSlug={selectedService}
                onComplete={(data) => {
                  console.log("Appointment created:", data);
                  toast.success("Agendamento criado com sucesso!");
                }}
              />
            </div>
          )}
        </div>
      </div>
      <toast.ToastRenderer />
    </div>
  );
}

export default function AgendarPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-600">A carregar...</p>
          </div>
        </div>
      }
    >
      <AgendarContent />
    </Suspense>
  );
}
