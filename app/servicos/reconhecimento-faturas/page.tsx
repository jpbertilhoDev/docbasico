import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function ReconhecimentoFaturasPage() {
  const steps = [
    {
      number: "1",
      title: "Organizar Faturas",
      description: "Reúna todas as faturas elegíveis para dedução no IRS.",
    },
    {
      number: "2",
      title: "Verificar Elegibilidade",
      description: "Confirme quais faturas podem ser deduzidas conforme a legislação.",
    },
    {
      number: "3",
      title: "Registar no Portal",
      description: "Registe as faturas no Portal das Finanças ou aplicação móvel.",
    },
    {
      number: "4",
      title: "Validar Faturas",
      description: "Aguarde a validação das faturas pelo sistema.",
    },
  ];

  const eligibleExpenses = [
    "Despesas de saúde",
    "Despesas de educação",
    "Despesas com imóveis (arrendamento)",
    "Despesas gerais familiares",
    "Despesas com lares",
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Reconhecimento de Faturas</h1>
          <p className="text-xl text-gray-600">
            Organização e reconhecimento de faturas para dedução no IRS.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Sobre o Serviço</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            O reconhecimento de faturas permite deduzir despesas no IRS, reduzindo o valor 
            a pagar ou aumentando o reembolso. É importante manter todas as faturas organizadas 
            e registadas corretamente.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Oferecemos suporte completo na organização, verificação e registo de faturas, 
            garantindo que aproveite todas as deduções possíveis.
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
          <h2 className="text-2xl font-semibold mb-6">Despesas Elegíveis</h2>
          <ul className="space-y-3">
            {eligibleExpenses.map((expense, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{expense}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-gray-600">
            * Existem limites e condições específicas para cada tipo de despesa. 
            Entre em contacto para mais informações.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Benefícios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Redução do IRS</h3>
              <p className="text-gray-700 text-sm">
                Deduções podem reduzir significativamente o valor a pagar de IRS.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Reembolso Maior</h3>
              <p className="text-gray-700 text-sm">
                Aumenta a possibilidade de receber reembolso do IRS.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Organização</h3>
              <p className="text-gray-700 text-sm">
                Mantenha todas as faturas organizadas e acessíveis.
              </p>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Conformidade Legal</h3>
              <p className="text-gray-700 text-sm">
                Garanta que todas as deduções estão em conformidade com a lei.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-primary-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Precisa de Ajuda com Faturas?</h2>
          <p className="mb-6 text-primary-100">
            Entre em contacto connosco e receba orientação personalizada.
          </p>
          <Link
            href="/contato?service=reconhecimento-faturas"
            className="inline-block bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Solicitar Serviço
          </Link>
        </section>
      </div>
    </div>
  );
}

