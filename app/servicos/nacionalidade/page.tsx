import Link from "next/link";
import { ArrowLeft, CheckCircle, ArrowRight } from "lucide-react";

export default function NacionalidadePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEÇÃO DE VÍDEO - DESTAQUE PRINCIPAL */}
      <section className="py-6 md:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Touch-Friendly (44px) */}
          <nav className="mb-4 md:mb-6">
            <Link
              href="/servicos"
              className="inline-flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-primary-600"
              aria-label="Voltar para Serviços"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </nav>

          {/* Copy Irresistível ANTES do Vídeo */}
          <div className="text-center mb-6 md:mb-8 animate-fade-in">
            <h1 className="text-lg md:text-2xl lg:text-3xl font-black text-gray-900 mb-3 md:mb-4 leading-tight px-2">
              Descubra Como <span className="text-primary-600">500+ Pessoas</span><br className="hidden sm:block" />
              Conquistaram a Nacionalidade Portuguesa
            </h1>
            
            <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto px-2">
              Em menos de <strong>3 minutos</strong>, você vai entender exatamente como funciona 
              o processo e por que a Doc Basico é referência em nacionalidade portuguesa.
            </p>
          </div>

          {/* Vídeo Otimizado e Centralizado */}
          <div className="relative">
            {/* Container do Vídeo com Shadow e Border */}
            <div className="relative aspect-video bg-gray-900 rounded-lg md:rounded-xl overflow-hidden shadow-xl border-2 border-gray-200 hover:border-primary-300 transition-all duration-300">
              {/* 
                OPÇÃO 1: Vídeo do YouTube/Vimeo 
                Substitua VIDEO_ID pelo ID do seu vídeo
                Exemplo: https://www.youtube.com/watch?v=dQw4w9WgXcQ -> VIDEO_ID = dQw4w9WgXcQ
              */}
              <iframe
                src="https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1"
                title="Como Conquistar a Nacionalidade Portuguesa - Doc Basico"
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
                  poster="/videos/nacionalidade-thumbnail.jpg"
                >
                  <source src="/videos/nacionalidade.mp4" type="video/mp4" />
                  Seu navegador não suporta vídeo HTML5.
                </video>
              */}
            </div>

            {/* Badge Decorativo com Estatística */}
           
          </div>

          {/* CTAs Otimizados (Primário vs Secundário) */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 md:mt-10">
            <Link
              href="/agendar?servico=nacionalidade"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-bold text-sm md:text-base hover:bg-primary-700 hover:shadow-lg transition-all active:scale-95 max-w-xs sm:max-w-none mx-auto sm:mx-0"
            >
              Agendar Consulta Agora
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contato?servico=nacionalidade"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-primary-600 text-primary-600 px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-semibold text-sm md:text-base hover:bg-primary-50 transition-all max-w-xs sm:max-w-none mx-auto sm:mx-0"
            >
              Tirar Dúvidas
            </Link>
          </div>
        </div>
      </section>

      {/* Como Trabalhamos (em vez de Passo a Passo) */}
      <section className="py-10 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-gray-900 mb-2 md:mb-3">
              Como a <span className="text-primary-600">Doc Basico</span> Trabalha
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Nossa abordagem é completa, personalizada e focada no seu sucesso
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 md:p-6 lg:p-8 shadow-sm">
            <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-6">
              Na <strong>Doc Basico</strong>, oferecemos um serviço completo e transparente 
              que garante tranquilidade em cada etapa do seu processo de nacionalidade portuguesa.
            </p>

            {/* Bullet Points com Ícones (Mais Escaneável) */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1">Avaliação em 24h</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Verificação completa dos requisitos legais e análise personalizada do seu caso
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1">Documentação Completa</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Organização, tradução e preparação de todos os documentos necessários
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
                    Acompanhamento direto do início ao fim com atualizações constantes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1">Suporte Até o Passaporte</h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    Estamos ao seu lado até o momento em que você recebe seu passaporte português
                  </p>
                </div>
              </div>
            </div>

            {/* Destaque de Estatísticas (WCAG Compliant) */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 mt-8 md:mt-10 pt-6 md:pt-8 border-t border-gray-100">
              <div className="text-center">
                <div className="text-xl md:text-3xl font-black text-primary-600 mb-1">98%</div>
                <p className="text-xs md:text-sm text-gray-600 font-medium leading-tight">Taxa de Aprovação</p>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-3xl font-black text-primary-600 mb-1">12-18</div>
                <p className="text-xs md:text-sm text-gray-600 font-medium leading-tight">Meses em Média</p>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-3xl font-black text-primary-600 mb-1">500+</div>
                <p className="text-xs md:text-sm text-gray-600 font-medium leading-tight">Processos Concluídos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requisitos (Redesenhado) */}
      <section className="py-10 md:py-12 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-gray-900 mb-5 md:mb-6 text-center">
            Requisitos <span className="text-primary-600">Principais</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {[
              "Residência legal em Portugal há pelo menos 5 anos",
              "Conhecimento suficiente da língua portuguesa",
              "Não ter condenação criminal",
              "Documentos de identificação válidos",
              "Comprovativo de residência",
              "Vínculos efetivos com Portugal"
            ].map((req, idx) => (
              <div key={idx} className="flex items-start gap-2.5 bg-gray-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-gray-100">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-xs md:text-sm font-medium leading-snug">{req}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center text-xs md:text-sm text-gray-600 bg-yellow-50 border border-yellow-100 rounded-lg md:rounded-xl p-4">
            <strong>Nota:</strong> Os requisitos podem variar conforme sua situação específica. 
            Agende uma consulta para avaliação personalizada gratuita.
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-10 md:py-12 lg:py-16 px-4 bg-gradient-to-br from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white mb-3 md:mb-4">
            Transforme seu Sonho em Realidade
          </h2>
          <p className="text-sm md:text-base text-primary-50 mb-6 md:mb-8 max-w-2xl mx-auto">
            Milhares de pessoas já conquistaram a nacionalidade portuguesa com nosso apoio. 
            Você pode ser o próximo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/agendar?servico=nacionalidade"
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