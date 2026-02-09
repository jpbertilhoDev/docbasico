
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Termos de Uso e Condições | Doc Básico',
    description: 'Leia os termos e condições que regulam o uso do site Doc Básico.',
};

export default function TermosPage() {
    const sections = [
        { id: 'politicas-privacidade', title: '1. Políticas de Privacidade' },
        { id: 'sua-conta', title: '2. A Sua Conta' },
        { id: 'servicos', title: '3. Serviços' },
        { id: 'servicos-terceiros', title: '4. Serviços de Terceiros' },
        { id: 'usos-proibidos', title: '5. Usos Proibidos' },
        { id: 'materiais-empresa', title: '6. Materiais da Empresa' },
        { id: 'isencao', title: '7. Isenção de Responsabilidades' },
        { id: 'indenizacao', title: '8. Indenização' },
        { id: 'cancelamento', title: '9. Cancelamento' },
        { id: 'diversos', title: '10. Diversos' },
        { id: 'reclamacoes', title: '11. Reclamações' },
        { id: 'contato', title: '12. Informação de Contato' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            {/* Header Simples */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Voltar para Home</span>
                    </Link>
                    <div className="text-sm text-gray-500 hidden sm:block">
                        Última atualização: 25 de Maio de 2018
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="lg:grid lg:grid-cols-12 lg:gap-12">

                    {/* Sidebar de Navegação (Desktop) */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <nav className="sticky top-24 space-y-1">
                            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                Índice
                            </p>
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="block px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-primary-600 transition-colors"
                                >
                                    {section.title}
                                </a>
                            ))}
                        </nav>
                    </aside>

                    {/* Conteúdo Principal */}
                    <article className="lg:col-span-9 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 prose prose-gray max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed">

                        <h1 className="text-3xl md:text-4xl mb-4 font-serif text-gray-900">Termos de Uso e Condições</h1>
                        <p className="text-sm text-gray-500 mb-8 border-b pb-8">
                            Estes termos de serviço regulam o uso deste site. Ao acessá-lo você concorda com estes termos. Por favor, consulte regularmente os nossos termos de serviço.
                        </p>

                        <div className="space-y-12">
                            <section>
                                <p>
                                    Os termos e condições (“Termos”) descrevem como <strong>Doc Básico</strong> (‘Empresa,’ ‘nós,’ e ‘nosso’) regula o uso deste website https://www.docbasico.com (o ‘website’).
                                </p>
                                <p>
                                    Por favor leia as informações a seguir com cuidado de forma a entender as nossas praticas referentes ao uso do website. A Empresa poderá alterar os Termos a qualquer altura. A Empresa poderá informa-lo da alteração dos Termos utilizando os meios de comunicação disponíveis. A Empresa recomenda que verifique o website com frequência de forma a que veja a versão atual dos Termos e as versões anteriores.
                                </p>
                            </section>

                            <section id="politicas-privacidade" className="scroll-mt-24">
                                <h2>1 – POLÍTICAS DE PRIVACIDADE</h2>
                                <p>
                                    A nossa política de privacidade encontra-se disponível em outra página. A nossa política de privacidade explica-lhe como nós utilizamos os seus dados pessoais. Ao utilizar o nosso website você reconhece que tem conhecimento e aceitas as nossas políticas de privacidade e da forma como processamos os seus dados.
                                </p>
                            </section>

                            <section id="sua-conta" className="scroll-mt-24">
                                <h2>2 – A SUA CONTA</h2>
                                <p>
                                    Quando usa o nosso website, você fica responsável por assegurar a confidencialidade da sua conta, senha e outros dados. Não poderá passar a sua conta a terceiros. Nós não nos responsabilizamos por acessos não autorizados que resultem de negligencia por parte do utilizador (dono da conta). A empresa está no direito de terminar o serviço, ou cancelar a sua conta e remover os seus dados, caso você partilhe a sua conta.
                                </p>
                            </section>

                            <section id="servicos" className="scroll-mt-24">
                                <h2>3 – SERVIÇOS</h2>
                                <p>
                                    O website permite que você use os serviços disponiveis no website. Não poderá utilizar esses serviços com propósitos ilegais. Nós poderemos em alguns casos, estipular um valor para poder utilizar o website. Todos os preços serão publicados separadamente nas páginas apropriadas no website. Poderemos em alguns casos, e a qualquer momento mudar os valores para poder aceder. Poderemos também utilizar sistemas de processamento de pagamentos que terão taxas de processamento de pagamentos. Algumas dessas taxas poderão ser apresentadas quando você escolher um determinado meio de pagamento. Todos os detalhes sobre as taxas desses sistema de pagamentos poderão ser encontrados no seus respectivos websites.
                                </p>
                            </section>

                            <section id="servicos-terceiros" className="scroll-mt-24">
                                <h2>4 – SERVIÇOS DE TERCEIROS</h2>
                                <p>
                                    O website poderá incluir links para outros websites, aplicações ou plataformas. Nós não controlamos os websites de terceiros, e não seremos responsáveis pelos conteúdos e outro tipo de materiais incluídos nesses websites. Nós deixamos esses disponíveis para você e mantemos todos os nossos serviços e funcionalidades no nosso website.
                                </p>
                            </section>

                            <section id="usos-proibidos" className="scroll-mt-24">
                                <h2>5 – USOS PROIBIDOS E PROPRIEDADE INTELECTUAL</h2>
                                <p>
                                    Nós concedemos a você uma licença revogável, intransferível e não exclusiva para aceder e usar o nosso website de um dispositivo de acordo com os Termos. Você não deve usar o website para fins ilegais, ou proibidos. Você não pode usar o website de forma a que possa desabilitar, danificar ou interferir no website.
                                </p>
                                <p>
                                    Todo o conteúdo presente no nosso website incluindo texto, código, gráficos, logos, imagens, vídeos, software utilizados no website (doravante e aqui anteriormente o ‘Conteúdo’). O conteúdo é propriedade da empresa, ou dos seus contratados e protegidos por lei (propriedade intelectual) que protegem esses direitos. Você não pode publicar, partilhar, modificar, fazer engenharia reversa, participar da transferência ou criar e vender trabalhos derivados, ou de qualquer forma usar qualquer um dos Conteúdos.
                                </p>
                                <p>
                                    A sua utilização do website não lhe dá o direito de fazer qualquer uso ilegal e não permitido do Conteúdo e, em particular, você não poderá alterar os direitos de propriedade ou avisos no Conteúdo. Você deverá usar o Conteúdo apenas para seu uso pessoal e não comercial. A Empresa não concede a você nenhuma licença para propriedade intelectual dos seus conteúdos.
                                </p>
                            </section>

                            <section id="materiais-empresa" className="scroll-mt-24">
                                <h2>6 – MATERIAIS DA EMPRESA</h2>
                                <p>
                                    Ao publicar, enviar, submeter, ou efetuar upload do seu Conteúdo, você está a ceder os direitos do uso desse Conteúdo a nós para o desenvolvimento do nosso negócio, incluindo, mas não limitado a, os direitos de transmissão, exibição pública, distribuição, execução pública, cópia, reprodução e tradução do seu Conteúdo; e publicação do seu nome em conexão com o seu Conteúdo.
                                </p>
                                <p>
                                    Nenhuma compensação será paga com relação ao uso do seu Conteúdo. A Empresa não terá obrigação de publicar ou desfrutar de qualquer Conteúdo que você possa nos enviar e poderá remover seu Conteúdo a qualquer momento sem qualquer aviso. Ao publicar, fazer upload, inserir, fornecer ou enviar o seu Conteúdo, você garante e declara que possui todos os direitos sobre seu Conteúdo.
                                </p>
                            </section>

                            <section id="isencao" className="scroll-mt-24">
                                <h2>7 – ISENÇÃO DE CERTAS RESPONSABILIDADES</h2>
                                <p>
                                    As informações disponíveis através do website podem incluir erros tipográficos ou imprecisões. A Empresa não será responsável por essas imprecisões e erros. A Empresa não faz declarações sobre a disponibilidade, precisão, confiabilidade, adequação e atualidade do Conteúdo contido e dos serviços disponíveis no website. Na medida máxima permitida pela lei aplicável, todos os Conteúdos e serviços são fornecidos ‘no estado em que se encontram’. A Empresa se isenta de todas as garantias e condições relativas a este Conteúdo e serviços, incluindo garantias e provisões de comercialização, adequação a um determinado propósito.
                                </p>
                            </section>

                            <section id="indenizacao" className="scroll-mt-24">
                                <h2>8 – INDENIZAÇÃO</h2>
                                <p>
                                    Você concorda em indenizar, defender e isentar a Companhia, seus gerentes, diretores, funcionários, agentes e terceiros, por quaisquer custos, perdas, despesas (incluindo honorários de advogados), responsabilidades relativas, ou decorrentes de sua fruição ou incapacidade para aproveitar o website, ou os seus serviços e produtos da Empresa, a sua violação dos Termos, ou a sua violação de quaisquer direitos de terceiros, ou a sua violação da lei aplicável. Você deve cooperar com a Empresa na afirmação de quaisquer defesas disponíveis.
                                </p>
                            </section>

                            <section id="cancelamento" className="scroll-mt-24">
                                <h2>9 – CANCELAMENTO E RESTRIÇÃO DE ACESSO</h2>
                                <p>
                                    A Empresa pode cancelar ou bloquear o seu acesso ou conta no website e os seus respectivos serviços, a qualquer altura, sem aviso, no caso de você violar os Termos e condições.
                                </p>
                            </section>

                            <section id="diversos" className="scroll-mt-24">
                                <h2>10 – DIVERSOS</h2>
                                <p>
                                    A lei que rege os Termos deve ser as leis substantivas do país onde a Empresa está estabelecida, exceto as regras de conflito de leis. Você não deve usar o Website em jurisdições que não deem efeito a todas as disposições dos Termos.
                                </p>
                                <p>
                                    Nenhuma parceria, emprego ou relacionamento de agência estará implícito entre você e a Empresa como resultado dos Termos ou uso do Website. Nada nos Termos deverá ser uma derrogação ao direito da Empresa de cumprir com solicitações ou requisitos governamentais, judiciais, policiais e policiais ou requisitos relacionados ao seu usufruto do Website.
                                </p>
                                <p>
                                    Se qualquer parte dos Termos for considerada inválida ou inexequível de acordo com a lei aplicável, as cláusulas inválidas ou inexequíveis serão consideradas substituídas por cláusulas válidas e exequíveis que deverão ser semelhantes à versão original dos Termos e outras partes e seções do Contrato. Termos serão aplicáveis a você e à Empresa.
                                </p>
                                <p>
                                    Os Termos constituem o acordo integral entre você e a Empresa em relação ao desfrute do Website e os Termos substituem todos os anteriores ou comunicações e ofertas, sejam eletrônicas, orais ou escritas, entre você e a Empresa.
                                </p>
                                <p>
                                    A Empresa e suas afiliadas não serão responsáveis por uma falha ou atraso no cumprimento de suas obrigações quando a falha ou atraso resultar de qualquer causa além do controle razoável da Empresa, incluindo falhas técnicas, desastres naturais, bloqueios, embargos, revoltas, atos, regulamentos, legislação. ou ordens de governo, atos terroristas, guerra ou qualquer outra força fora do controle da Empresa.
                                </p>
                                <p>
                                    Em caso de controvérsias, demandas, reclamações, disputas ou causas de ação entre a Empresa e você em relação ao Website ou outros assuntos relacionados, ou aos Termos, você e a Empresa concordam em tentar resolver tais controvérsias, demandas, reclamações, disputas , ou causas de ação por negociação de boa-fé, e em caso de falha de tal negociação, exclusivamente através dos tribunais do país onde a Companhia está estabelecida.
                                </p>
                            </section>

                            <section id="reclamacoes" className="scroll-mt-24">
                                <h2>11 – RECLAMAÇÕES</h2>
                                <p>
                                    Estamos empenhados em resolver quaisquer reclamações sobre a forma como recolhemos ou usamos os seus dados pessoais. Se você gostaria de fazer uma reclamação sobre estes Termos ou nossas práticas em relação aos seus dados pessoais, entre em contato conosco em: <a href="mailto:contato@docbasico.com" className="text-primary-600 hover:text-primary-700 font-medium">contato@docbasico.com</a>.
                                </p>
                                <p>
                                    Responderemos à sua reclamação assim que pudermos e, em qualquer caso, dentro de 30 dias.
                                </p>
                                <p>
                                    Esperamos resolver qualquer reclamação que seja levada ao nosso conhecimento, no entanto, se você achar que a sua reclamação não foi adequadamente resolvida, você se reserva no direito de entrar em contato com a autoridade supervisora de proteção de dados local.
                                </p>
                            </section>

                            <section id="contato" className="scroll-mt-24">
                                <h2>12 – INFORMAÇÃO DE CONTATO</h2>
                                <p>
                                    Agradecemos os seus comentários ou perguntas sobre estes Termos. Você pode nos contactar por escrito em <a href="mailto:contato@docbasico.com" className="text-primary-600 hover:text-primary-700 font-medium">contato@docbasico.com</a>.
                                </p>
                                <div className="mt-8 p-6 bg-gray-50 border border-gray-100 rounded-lg">
                                    <p className="font-medium text-gray-900 mb-2">Aceitação dos Termos</p>
                                    <p className="text-sm">
                                        Aceito os termos e condições definidos nos Termos e Condições.
                                    </p>
                                </div>
                            </section>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
}
