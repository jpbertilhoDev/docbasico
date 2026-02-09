"use client";

import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FileText, Globe, Building2, Calculator, Shield, Calendar, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import HeroCarousel from "@/components/HeroCarousel";

// Lazy load componentes não-críticos
const ScrollReveal = lazy(() => import("@/components/ScrollReveal"));

export default function Home() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // Buscar posts APÓS 1 segundo (não bloqueia renderização inicial)
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const baseUrl = window.location.origin;
        const res = await fetch(`${baseUrl}/api/posts?limit=3`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setPostsLoading(false);
      }
    }, 1000); // 1 segundo de delay

    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      icon: FileText,
      title: "Renovação de Residência",
      description: "Processo completo de renovação da sua autorização de residência em Portugal.",
      href: "/servicos/renovacao-residencia",
      stat: "98% de aprovação",
    },
    {
      icon: Globe,
      title: "Visto para Portugal",
      description: "Orientações e suporte para obtenção de visto de trabalho e residência.",
      href: "/servicos/visto-portugal",
      stat: "Processo otimizado",
    },
    {
      icon: Shield,
      title: "Processo de Nacionalidade",
      description: "Acompanhamento completo do processo de nacionalidade portuguesa.",
      href: "/servicos/nacionalidade",
      stat: "Experiência comprovada",
    },
    {
      icon: FileText,
      title: "NIF e Documentação",
      description: "Solicitação de NIF, Segurança Social e Cartão Cidadão.",
      href: "/servicos/documentacao",
      stat: "Rápido e eficiente",
    },
    {
      icon: Calculator,
      title: "Serviços de IRS",
      description: "Reconhecimento de faturas, agregado familiar e envio do IRS.",
      href: "/servicos/irs",
      stat: "Economia garantida",
    },
    {
      icon: Building2,
      title: "Constituição de Empresa",
      description: "Abertura de empresa e consultoria empresarial em Portugal.",
      href: "/servicos/empresas",
      stat: "Sucesso comprovado",
    },
  ];

  const carouselImages = [
    {
      src: "/imigrante-ok.png",
      alt: "Documentação e legalização para imigrantes em Portugal",
      title: "Transforme a Complexidade em Simplicidade",
      description: "Mais de 10.000 imigrantes já confiaram em nós para regularizar a sua situação em Portugal",
    },
    {
      src: "/consultoria-img.png",
      alt: "Consultoria empresarial em Portugal",
      title: "Construa o Seu Futuro em Portugal",
      description: "Da constituição à gestão, acompanhamos cada etapa do seu negócio",
    },
  ];

  const currentSlide = carouselImages[currentSlideIndex] || carouselImages[0];


  return (
    <div className="flex flex-col overflow-x-hidden w-full">
      {/* Hero Section Cinematográfico */}
      <section className="relative h-[500px] md:h-[650px] lg:h-[750px] overflow-hidden">
        <div className="absolute inset-0">
          <HeroCarousel
            images={carouselImages}
            autoPlayInterval={6000}
            onSlideChange={setCurrentSlideIndex}
          />
        </div>

        {/* Overlay Azul Suave e Profissional */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 via-primary-800/30 to-primary-900/35 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/50 via-transparent to-transparent z-10" />

        {/* Conteúdo Hero */}
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              {/* Título Principal Compacto */}
              <h1
                key={currentSlideIndex}
                className="text-3xl md:text-5xl lg:text-6xl mb-4 md:mb-6 text-white leading-tight tracking-tight font-black"
                style={{
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  animation: "fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {currentSlide.title ? (
                  currentSlide.title.includes("Transforme") ? (
                    <>
                      Transforme a <span className="text-primary-300 font-black">Complexidade</span> em <span className="text-primary-300 font-black">Simplicidade</span>
                    </>
                  ) : currentSlide.title.includes("Construa") ? (
                    <>
                      <span className="text-primary-300 font-black">Construa</span> o Seu <span className="text-primary-300 font-black">Futuro</span> em Portugal
                    </>
                  ) : (
                    currentSlide.title
                  )
                ) : (
                  <>
                    Transforme a <span className="text-primary-300 font-black">Complexidade</span> em <span className="text-primary-300 font-black">Simplicidade</span>
                  </>
                )}
              </h1>

              {/* Descrição */}
              <p
                key={`desc-${currentSlideIndex}`}
                className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 text-white/90 leading-relaxed max-w-2xl font-medium"
                style={{
                  textShadow: "0 1px 5px rgba(0,0,0,0.3)",
                  animation: "fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {currentSlide.description || "Mais de 10.000 imigrantes já confiaram em nós para regularizar a sua situação em Portugal"}
              </p>

              {/* CTAs com Micro-Interações Profissionais - Compactos */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8">
                <Suspense fallback={<div className="opacity-0 h-12" />}>
                  <ScrollReveal delay={200}>
                    <Link
                      href="/agendar"
                      className="group relative inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-sm md:text-base overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 w-full sm:w-auto"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Agendar Consulta Agora
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Link>
                  </ScrollReveal>
                </Suspense>

                <Suspense fallback={<div className="opacity-0 h-12" />}>
                  <ScrollReveal delay={400}>
                    <Link
                      href="/servicos"
                      className="group relative inline-flex items-center justify-center gap-2 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-sm md:text-base border border-white/50 overflow-hidden transition-all duration-300 hover:border-white hover:shadow-2xl active:scale-95 w-full sm:w-auto"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Explorar Serviços
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                    </Link>
                  </ScrollReveal>
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section com Reveal e Carrossel Mobile */}
      <section className="py-12 md:py-20 px-0 md:px-6 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-8 md:mb-12 px-4">
              <h2 className="text-2xl md:text-4xl mb-3 text-gray-900 font-black tracking-tight">
                Nossos <span className="text-primary-600">Serviços</span>
              </h2>
              <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Soluções completas para cada etapa da sua jornada em Portugal
              </p>
            </div>
          </ScrollReveal>

          {/* Container Responsivo: Carrossel no Mobile / Grid no Desktop */}
          <div className="
            flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-6 
            md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:pb-0 md:overflow-visible
            scrollbar-hide
          ">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={service.href} className="snap-center shrink-0 w-[85vw] md:w-auto">
                  <ScrollReveal delay={index * 100} className="h-full">
                    <Link
                      href={service.href}
                      className="group relative flex flex-col h-full bg-white rounded-xl border border-gray-200 p-5 md:p-6 hover:border-primary-600 hover:shadow-xl transition-all duration-300"
                    >
                      {/* Ícone */}
                      <div className="mb-4">
                        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 group-hover:scale-105 transition-all duration-300">
                          <Icon className="w-6 h-6 text-primary-600" />
                        </div>
                      </div>

                      {/* Conteúdo */}
                      <div className="space-y-2 flex-grow">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors leading-tight">
                            {service.title}
                          </h3>
                        </div>

                        <p className="text-xs font-bold text-primary-600 uppercase tracking-wide">
                          {service.stat}
                        </p>

                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 md:line-clamp-3">
                          {service.description}
                        </p>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center text-primary-600 font-bold text-xs md:text-sm pt-4 mt-2 border-t border-gray-100 group-hover:border-primary-100 transition-colors">
                        <span>Saber mais</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </Link>
                  </ScrollReveal>
                </div>
              );
            })}
          </div>

          {/* Indicador de Swipe para Mobile */}
          <div className="md:hidden flex justify-center gap-2 mt-2">
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              Deslize para ver mais serviços
            </div>
          </div>
        </div>
      </section>

      {/* News Section com Reveal */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl mb-3 text-gray-900 font-black tracking-tight">
                  Mantenha-se <span className="text-primary-600">Atualizado</span>
                </h2>
                <p className="text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed">
                  Informações essenciais sobre mudanças nas leis e processos que podem impactar a sua situação.
                </p>
              </div>
              <Link
                href="/noticias"
                className="hidden md:flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 hover:gap-3 transition-all group"
              >
                Ver todas
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          {posts.length === 0 ? (
            <ScrollReveal>
              <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-100">
                <p className="text-gray-600">
                  Nenhuma notícia publicada ainda. As notícias aparecerão aqui assim que forem publicadas.
                </p>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post: any, index) => (
                <ScrollReveal key={post.id} delay={index * 150}>
                  <Link
                    href={`/noticias/${post.slug}`}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden hover-lift"
                  >
                    {post.featured_image_url && (
                      <div className="aspect-video bg-gray-200 overflow-hidden relative">
                        <Image
                          src={post.featured_image_url}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    )}
                    <div className="p-6">
                      {post.categories && (
                        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded-full mb-3">
                          {post.categories.name}
                        </span>
                      )}
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary-700 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {post.published_at && formatDate(post.published_at)}
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section Clean */}
      <section className="py-16 md:py-20 px-4 md:px-6 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl mb-4 text-white font-black tracking-tight">
              Pronto para Transformar a Sua Situação?
            </h2>
            <p className="text-base md:text-lg mb-8 text-primary-50 max-w-2xl mx-auto leading-relaxed">
              Junte-se a milhares de imigrantes que já regularizaram a sua situação em Portugal com o nosso apoio especializado.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link
                href="/agendar"
                className="group relative inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-sm md:text-base overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Agendar Consulta Agora
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gray-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>

              <Link
                href="/contato"
                className="group relative inline-flex items-center justify-center gap-2 bg-primary-800/50 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-sm md:text-base border border-white/30 overflow-hidden transition-all duration-300 hover:border-white hover:shadow-2xl active:scale-95 w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Falar com Especialista
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-primary-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Prontos para te ajudar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Profissionais qualificados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Resposta em 24h</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
