import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function AgregadoFamiliarPage() {
  const benefits = [
    "Redução significativa do IRS a pagar",
    "Acesso a deduções adicionais",
    "Benefícios fiscais para dependentes",
    "Possibilidade de reembolso maior",
  ];

  const requirements = [
    "Cônjuge ou união de fato",
    "Filhos menores de 25 anos (se estudantes)",
    "Filhos de qualquer idade com deficiência",
    "Outros dependentes conforme legislação",
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Agregado Familiar</h1>
          <p className="text-xl text-gray-600">
            Orientação sobre agregado familiar e benefícios fiscais.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Sobre o Agregado Familiar</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            O agregado familiar permite que casais e famílias declarem o IRS em conjunto, 
            aproveitando deduções e benefícios fiscais que podem resultar em uma redução 
            significativa do imposto a pagar.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Oferecemos orientação completa sobre como constituir o agregado familiar e 
            maximizar os benefícios fiscais disponíveis.
          </p>
        </section>

        <section className="mb-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Quem Pode Fazer Parte do Agregado</h2>
          <ul className="space-y-3">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Benefícios do Agregado Familiar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-primary-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-2 text-primary-700">{benefit}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Como Funciona</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Ao constituir o agregado familiar, os rendimentos de todos os membros são somados, 
            mas as deduções também são maiores. Isso geralmente resulta em uma taxa de imposto 
            mais baixa e maior possibilidade de reembolso.
          </p>
          <p className="text-gray-700 leading-relaxed">
            É importante analisar cada caso individualmente, pois em algumas situações pode 
            ser mais vantajoso declarar separadamente.
          </p>
        </section>

        <section className="bg-primary-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Quer Otimizar seu Agregado Familiar?</h2>
          <p className="mb-6 text-primary-100">
            Entre em contacto connosco e receba uma análise personalizada.
          </p>
          <Link
            href="/contato?service=agregado-familiar"
            className="inline-block bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Solicitar Serviço
          </Link>
        </section>
      </div>
    </div>
  );
}

