"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Globe, Building2, Calculator, Shield, User, CreditCard, CheckCircle2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

interface Service {
  icon: any;
  title: string;
  description: string;
  href: string;
  category: string;
}

export default function ServicosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");

  const services: Service[] = [
    {
      icon: FileText,
      title: "Renovação de Residência",
      description: "Processo completo de renovação da sua autorização de residência em Portugal.",
      href: "/servicos/renovacao-residencia",
      category: "Documentação",
    },
    {
      icon: Globe,
      title: "Visto para Portugal",
      description: "Orientações e suporte para obtenção de visto de trabalho e residência.",
      href: "/servicos/visto-portugal",
      category: "Documentação",
    },
    {
      icon: Shield,
      title: "Processo de Nacionalidade",
      description: "Acompanhamento completo do processo de nacionalidade portuguesa.",
      href: "/servicos/nacionalidade",
      category: "Documentação",
    },
    {
      icon: User,
      title: "NIF (Número de Identificação Fiscal)",
      description: "Solicitação de NIF para residentes e não residentes.",
      href: "/servicos/nif",
      category: "Documentação",
    },
    {
      icon: CreditCard,
      title: "Segurança Social",
      description: "Inscrição e regularização na Segurança Social portuguesa.",
      href: "/servicos/seguranca-social",
      category: "Documentação",
    },
    {
      icon: CreditCard,
      title: "Cartão Cidadão",
      description: "Solicitação e renovação do Cartão Cidadão português.",
      href: "/servicos/cartao-cidadao",
      category: "Documentação",
    },
    {
      icon: Calculator,
      title: "Reconhecimento de Faturas",
      description: "Organização e reconhecimento de faturas para dedução no IRS.",
      href: "/servicos/reconhecimento-faturas",
      category: "Fiscal",
    },
    {
      icon: Calculator,
      title: "Agregado Familiar",
      description: "Orientação sobre agregado familiar e benefícios fiscais.",
      href: "/servicos/agregado-familiar",
      category: "Fiscal",
    },
    {
      icon: Calculator,
      title: "Envio do IRS",
      description: "Preparação e envio completo da declaração de IRS.",
      href: "/servicos/envio-irs",
      category: "Fiscal",
    },
    {
      icon: Building2,
      title: "Constituição de Empresa",
      description: "Abertura de empresa em Portugal com suporte completo.",
      href: "/servicos/constituicao-empresa",
      category: "Empresarial",
    },
    {
      icon: Building2,
      title: "Consultoria Empresarial",
      description: "Consultoria especializada para empresas em Portugal.",
      href: "/servicos/consultoria-empresarial",
      category: "Empresarial",
    },
  ];

  const categories = ["Todos", "Documentação", "Fiscal", "Empresarial"];

  // Filtrar serviços baseado na categoria selecionada
  const filteredServices = selectedCategory === "Todos" 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  // Contar serviços por categoria
  const getCategoryCount = (category: string) => {
    if (category === "Todos") return services.length;
    return services.filter(service => service.category === category).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Profissional */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-100 px-4 py-2 rounded-full mb-6">
              <CheckCircle2 className="w-4 h-4 text-primary-600" />
              <span className="text-xs font-bold text-primary-700 uppercase tracking-wide">
                Mais de 10.000 casos resolvidos
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-gray-900 leading-tight tracking-tight">
              Serviços que <span className="text-primary-600">Transformam</span> a Sua Jornada
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Cada processo é único. Oferecemos soluções personalizadas para cada etapa da sua jornada em Portugal.
            </p>
          </div>
        </ScrollReveal>

        {/* Filtros de Categoria - Minimalista e Funcional */}
        <ScrollReveal delay={200}>
          <div className="mb-12">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((category) => {
                const isActive = selectedCategory === category;

                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2 rounded-md text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-primary-600 text-white shadow-md shadow-primary-600/20 translate-y-[-1px]"
                        : "bg-white text-gray-600 hover:bg-gray-50 hover:text-primary-600 border border-gray-200 hover:border-primary-200"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Grid de Serviços - Design Profissional Unificado */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {filteredServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <ScrollReveal key={service.href} delay={index * 100}>
                  <Link
                    href={service.href}
                    className="group relative block bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-600 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Ícone unificado */}
                    <div className="mb-5">
                      <div className="w-14 h-14 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 group-hover:scale-105 transition-all duration-300">
                        <Icon className="w-7 h-7 text-primary-600" />
                      </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors leading-tight">
                        {service.title}
                      </h3>
                      
                      <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
                        {service.category}
                      </p>

                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {service.description}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center text-primary-600 font-semibold text-sm pt-5 border-t border-gray-100 group-hover:border-primary-100 transition-colors">
                        <span>Saber mais</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        ) : (
          <ScrollReveal>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-16 text-center mb-20">
              <p className="text-gray-500 text-lg">
                Nenhum serviço encontrado nesta categoria.
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* CTA Profissional - Azul e Convidativo */}
        <ScrollReveal>
          <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-12 md:p-16 text-center overflow-hidden shadow-2xl">
            {/* Background limpo, sem patterns */}
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-white leading-tight tracking-tight">
                Precisa de Ajuda <span className="text-primary-200">Personalizada?</span>
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                Nossa equipe está pronta para encontrar a melhor solução para o seu caso específico.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/contato"
                  className="group relative bg-white text-primary-700 px-10 py-4 rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Fale Connosco Agora
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-primary-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
                
                <Link
                  href="/agendar"
                  className="group relative bg-primary-800/50 text-white px-10 py-4 rounded-xl font-bold text-lg border-2 border-white/30 overflow-hidden transition-all duration-300 hover:border-white hover:shadow-2xl active:scale-95 backdrop-blur-sm"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Agendar Consulta
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
