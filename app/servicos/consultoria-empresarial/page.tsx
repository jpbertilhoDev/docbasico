import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ConsultoriaEmpresarialPage() {
  const services = [
    {
      title: "Planeamento Fiscal",
      description: "Otimização fiscal e planeamento tributário para sua empresa.",
    },
    {
      title: "Gestão Contabilística",
      description: "Apoio na gestão contabilística e obrigações fiscais.",
    },
    {
      title: "Compliance Legal",
      description: "Garantia de conformidade com todas as obrigações legais.",
    },
    {
      title: "Consultoria Estratégica",
      description: "Orientação estratégica para crescimento do negócio.",
    },
  ];

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8">
          <Link
            href="/servicos"
            className="text-primary-600 hover:text-primary-700 flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Serviços
          </Link>
        </nav>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Consultoria Empresarial</h1>
          <p className="text-xl text-gray-600">
            Consultoria especializada para empresas em Portugal.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Sobre o Serviço</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Gerir uma empresa em Portugal envolve diversas obrigações legais, fiscais e 
            contabilísticas. Nossa consultoria empresarial oferece suporte completo para 
            para que possa focar no crescimento do seu negócio.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Oferecemos consultoria personalizada adaptada às necessidades específicas 
            da sua empresa, desde startups até empresas estabelecidas.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Serviços Oferecidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-primary-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-700 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Áreas de Atuação</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Planeamento e otimização fiscal</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Gestão de obrigações contabilísticas</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Compliance e conformidade legal</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Consultoria em processos empresariais</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Orientação em questões laborais</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">Suporte em licenças e autorizações</span>
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Por Que Escolher Nossa Consultoria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Experiência</h3>
              <p className="text-gray-700 text-sm">
                Conhecimento profundo da legislação empresarial portuguesa.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Personalização</h3>
              <p className="text-gray-700 text-sm">
                Soluções adaptadas às necessidades específicas da sua empresa.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Eficiência</h3>
              <p className="text-gray-700 text-sm">
                Otimização de processos para maximizar resultados.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Suporte Contínuo</h3>
              <p className="text-gray-700 text-sm">
                Acompanhamento regular para garantir conformidade.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-primary-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Precisa de Consultoria Empresarial?</h2>
          <p className="mb-6 text-primary-100">
            Entre em contacto connosco e receba uma proposta personalizada.
          </p>
          <Link
            href="/contato?service=consultoria-empresarial"
            className="inline-block bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Solicitar Consultoria
          </Link>
        </section>
      </div>
    </div>
  );
}

