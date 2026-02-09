import Link from "next/link";
import { ArrowLeft, CheckCircle, ArrowRight } from "lucide-react";

export default function ConstituicaoEmpresaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEÇÃO DE VÍDEO - DESTAQUE PRINCIPAL */}
      <section className="py-4 md:py-8 lg:py-12 px-3 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Touch-Friendly (44px) */}
          <nav className="mb-3 md:mb-6">
            <Link
              href="/servicos"
              className="inline-flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-primary-600"
              aria-label="Voltar para Serviços"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </nav>

          {/* Copy Irresistível ANTES do Vídeo */}
          <div className="text-center mb-4 md:mb-8 animate-fade-in">
            <h1 className="text-lg md:text-2xl lg:text-3xl font-black text-gray-900 mb-2 md:mb-4 leading-tight px-2">
              Transforme Seu Sonho em <span className="text-primary-600">Realidade Empresarial</span><br className="hidden sm:block" />
              em Portugal
            </h1>
            
            <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto px-2">
              Em menos de <strong>3 minutos</strong>, descubra como abrir sua empresa em Portugal 
              de forma simples, rápida e com todo o suporte necessário.
            </p>
          </div>

          {/* Vídeo Otimizado e Centralizado */}
          <div className="relative">
            {/* Container do Vídeo com Shadow e Border */}
            <div className="relative aspect-video bg-gray-900 rounded-lg md:rounded-xl overflow-hidden shadow-lg md:shadow-xl border border-gray-200 md:border-2 hover:border-primary-300 transition-all duration-300">
              {/* 
                OPÇÃO 1: Vídeo do YouTube/Vimeo 
                Substitua VIDEO_ID pelo ID do seu vídeo
                Exemplo: https://www.youtube.com/watch?v=dQw4w9WgXcQ -> VIDEO_ID = dQw4w9WgXcQ
              */}
              <iframe
                src="https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1"
                title="Como Abrir sua Empresa em Portugal - Doc Basico"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
              
              {/* 
                OPÇÃO 2: Vídeo Nativo (se hospedar em /public/videos/)
                Descomente o código abaixo e comente o iframe acima
                
                <video 
                  controls 
                  className="w-full h-full object-cover"
                  poster="/videos/empresa-thumbnail.jpg"
                >
                  <source src="/videos/empresa.mp4" type="video/mp4" />
                  Seu navegador não suporta vídeo HTML5.
                </video>
              */}
            </div>
          </div>

          {/* CTAs Otimizados (Primário vs Secundário) */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 md:mt-10">
            <Link
              href="/agendar?servico=constituicao-empresa"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold text-sm md:text-base hover:bg-primary-700 hover:shadow-lg transition-all active:scale-95 max-w-xs sm:max-w-none mx-auto sm:mx-0"
            >
              Agendar Consulta Agora
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contato?servico=constituicao-empresa"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-primary-600 text-primary-600 px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-base hover:bg-primary-50 transition-all max-w-xs sm:max-w-none mx-auto sm:mx-0"
            >
              Tirar Dúvidas
            </Link>
          </div>
        </div>
      </section>

      {/* Como Trabalhamos */}
      <section className="py-6 md:py-12 lg:py-16 px-3 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4 md:mb-8">
            <h2 className="text-lg md:text-2xl lg:text-3xl font-black text-gray-900 mb-1 md:mb-3">
              Como a <span className="text-primary-600">Doc Basico</span> Trabalha
            </h2>
            <p className="text-xs md:text-base text-gray-600 max-w-2xl mx-auto px-2">
              Do planeamento ao primeiro dia de operação, estamos ao seu lado
            </p>
          </div>

          <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-4 md:p-6 lg:p-8 shadow-sm">
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-6">
              Na <strong>Doc Basico</strong>, transformamos o processo de abertura de empresa 
              em Portugal numa jornada simples e eficiente.
            </p>

            {/* Bullet Points com Ícones (Mais Escaneável) */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1">Consultoria Personalizada</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Recomendação do tipo societário ideal para o seu negócio (Unipessoal, Lda, SA)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1">Zero Burocracia</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Cuidamos da verificação de nome, contratos, registo oficial e licenças
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1">Especialista Dedicado</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Acompanhamento direto do início ao fim para que você foque no seu negócio
                  </p>
                </div>
              </div>
            </div>

            {/* Destaque de Estatísticas */}
            <div className="grid grid-cols-3 gap-2 md:gap-6 mt-5 md:mt-10 pt-4 md:pt-8 border-t border-gray-100">
              <div className="text-center">
                <div className="text-xl md:text-3xl font-black text-primary-600 mb-1">300+</div>
                <p className="text-[10px] md:text-sm text-gray-600 font-medium leading-tight">Empresas Abertas</p>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-3xl font-black text-primary-600 mb-1">7-15</div>
                <p className="text-[10px] md:text-sm text-gray-600 font-medium leading-tight">Dias em Média</p>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-3xl font-black text-primary-600 mb-1">100%</div>
                <p className="text-[10px] md:text-sm text-gray-600 font-medium leading-tight">Suporte Legal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Empresa */}
      <section className="py-6 md:py-12 bg-white px-3 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg md:text-2xl lg:text-3xl font-black text-gray-900 mb-4 md:mb-6 text-center">
            Tipos de <span className="text-primary-600">Empresa</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
            <div className="bg-gray-50 p-3 md:p-5 rounded-lg md:rounded-xl border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-1 text-xs md:text-base">Unipessoal (SUQ)</h3>
              <p className="text-gray-600 text-[11px] md:text-sm leading-snug">
                Empresa com um único sócio, ideal para pequenos negócios.
              </p>
            </div>
            <div className="bg-gray-50 p-3 md:p-5 rounded-lg md:rounded-xl border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-1 text-xs md:text-base">Lda (Limitada)</h3>
              <p className="text-gray-600 text-[11px] md:text-sm leading-snug">
                Empresa com dois ou mais sócios, responsabilidade limitada.
              </p>
            </div>
            <div className="bg-gray-50 p-3 md:p-5 rounded-lg md:rounded-xl border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-1 text-xs md:text-base">SA (Anónima)</h3>
              <p className="text-gray-600 text-[11px] md:text-sm leading-snug">
                Empresa de maior dimensão, capital social mais elevado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* O Que Inclui o Serviço */}
      <section className="py-6 md:py-12 px-3 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg md:text-2xl lg:text-3xl font-black text-gray-900 mb-4 md:mb-6 text-center">
            O Que <span className="text-primary-600">Inclui</span> o Serviço
          </h2>

          <div className="bg-white rounded-lg md:rounded-xl border border-gray-200 p-4 md:p-6 lg:p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 md:w-5 md:h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-[11px] md:text-sm font-medium leading-snug">Orientação na escolha do tipo societário</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 md:w-5 md:h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-[11px] md:text-sm font-medium leading-snug">Verificação de disponibilidade do nome</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 md:w-5 md:h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-[11px] md:text-sm font-medium leading-snug">Preparação de toda a documentação</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 md:w-5 md:h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-[11px] md:text-sm font-medium leading-snug">Registo oficial da empresa</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 md:w-5 md:h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-[11px] md:text-sm font-medium leading-snug">Orientação sobre licenças necessárias</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 md:w-5 md:h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-[11px] md:text-sm font-medium leading-snug">Apoio nas obrigações fiscais iniciais</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-6 md:py-12 lg:py-16 px-3 md:px-4 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-lg md:text-2xl lg:text-3xl font-black text-white mb-2 md:mb-4 px-2">
            Pronto para Abrir Sua Empresa em Portugal?
          </h2>
          <p className="text-xs md:text-base text-primary-50 mb-5 md:mb-8 max-w-2xl mx-auto px-2 leading-relaxed">
            Mais de 300 empreendedores já iniciaram seus negócios em Portugal com nosso apoio. 
            Você pode ser o próximo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/agendar?servico=constituicao-empresa"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold text-sm md:text-base hover:bg-gray-50 hover:shadow-xl transition-all active:scale-95 max-w-xs sm:max-w-none mx-auto sm:mx-0"
            >
              Agendar Consulta Agora
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link
              href="/contato"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-base hover:bg-white/10 transition-all max-w-xs sm:max-w-none mx-auto sm:mx-0"
            >
              Tirar Dúvidas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

