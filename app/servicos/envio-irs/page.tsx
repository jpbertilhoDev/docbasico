import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function EnvioIRSPage() {
  const steps = [
    {
      number: "1",
      title: "Reunir Documentação",
      description: "Colete todos os documentos necessários (recibos de vencimento, faturas, etc.).",
    },
    {
      number: "2",
      title: "Organizar Informações",
      description: "Organize todas as informações e despesas dedutíveis.",
    },
    {
      number: "3",
      title: "Preencher Declaração",
      description: "Preencha a declaração de IRS com todas as informações corretas.",
    },
    {
      number: "4",
      title: "Revisar e Validar",
      description: "Revise toda a declaração antes do envio.",
    },
    {
      number: "5",
      title: "Enviar Declaração",
      description: "Envie a declaração através do Portal das Finanças.",
    },
  ];

  const documents = [
    "Recibos de vencimento",
    "Faturas elegíveis para dedução",
    "Comprovativos de despesas",
    "Informações sobre dependentes",
    "Outros documentos conforme sua situação",
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Envio do IRS</h1>
          <p className="text-xl text-gray-600">
            Preparação e envio completo da declaração de IRS.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Sobre o Serviço</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            O envio do IRS é uma obrigação anual para todos os residentes em Portugal. 
            Uma declaração bem preparada pode resultar em reembolso ou redução do imposto a pagar.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Oferecemos suporte completo na preparação e envio da sua declaração de IRS, 
            garantindo que todas as deduções possíveis sejam aproveitadas e que tudo esteja 
            em conformidade com a legislação.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Processo Passo a Passo</h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Documentos Necessários</h2>
          <ul className="space-y-3">
            {documents.map((doc, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{doc}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Por Que Escolher Nosso Serviço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Maximização de Deduções</h3>
              <p className="text-gray-700 text-sm">
                Identificamos todas as deduções possíveis para reduzir seu IRS.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Conformidade Legal</h3>
              <p className="text-gray-700 text-sm">
                Garantimos que tudo está em conformidade com a legislação fiscal.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Revisão Completa</h3>
              <p className="text-gray-700 text-sm">
                Revisamos toda a declaração antes do envio para evitar erros.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Suporte Personalizado</h3>
              <p className="text-gray-700 text-sm">
                Atendimento dedicado para suas necessidades específicas.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-primary-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Precisa de Ajuda com seu IRS?</h2>
          <p className="mb-6 text-primary-100">
            Entre em contacto connosco e receba orientação personalizada.
          </p>
          <Link
            href="/contato?service=envio-irs"
            className="inline-block bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Solicitar Serviço
          </Link>
        </section>
      </div>
    </div>
  );
}

