
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import PrivacyForm from '@/components/PrivacyForm';

export const metadata: Metadata = {
    title: 'Políticas de Privacidade | Doc Básico',
    description: 'Leia as políticas de privacidade do Doc Básico e saiba como protegemos seus dados.',
};

export default function PrivacidadePage() {
    const sections = [
        { id: 'finalidade', title: '1. Finalidade do Processamento' },
        { id: 'recolha', title: '2. Recolhendo os seus dados' },
        { id: 'cookies', title: '3. Cookies' },
        { id: 'publicidade', title: '4. Publicidade' },
        { id: 'uso-dados', title: '5. Usando os seus dados' },
        { id: 'partilha', title: '6. Partilhar os seus dados' },
        { id: 'terceiros', title: '7. Website de Terceiros' },
        { id: 'conteudo-usuario', title: '8. Conteúdo Gerado pelo Utilizador' },
        { id: 'transferencia', title: '9. Transferência Internacional' },
        { id: 'seguranca', title: '10. Segurança' },
        { id: 'retencao', title: '11. Retenção' },
        { id: 'criancas', title: '12. Política com Crianças' },
        { id: 'direitos', title: '13. Os seus Direitos' },
        { id: 'queixas', title: '14. Queixas' },
        { id: 'contato', title: '15. Informação de Contacto' },
        { id: 'pedido-acesso', title: '16. Pedido de Acesso de Dados' },
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
                        <nav className="sticky top-24 space-y-1 h-[calc(100vh-8rem)] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200">
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
                    <article className="lg:col-span-9 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12 prose prose-gray max-w-none prose-headings:font-sans prose-headings:tracking-tight prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline">

                        <h1 className="text-3xl md:text-4xl mb-4 font-sans tracking-tight text-gray-900">Políticas de Privacidade</h1>
                        <p className="text-sm text-gray-500 mb-8 border-b pb-8">
                            Esta política de privacidade (“Política”) descreve como <strong>Doc Básico</strong> (‘Empresa’, ‘nós’ e ‘nosso’) procede, recolhe, usa e partilha informação pessoal quando usa este website https://docbasico.com. Por favor leia a informação abaixo cuidadosamente.
                        </p>

                        <div className="space-y-12">
                            <section id="finalidade" className="scroll-mt-24">
                                <h2>1 – FINALIDADE DO PROCESSAMENTO</h2>
                                <h3 className="text-lg font-semibold mt-4 mb-2">O que são dados pessoais?</h3>
                                <p>
                                    Nós recolhemos informação sobre si de várias formas, incluíndo dados pessoais. Como descrito nesta Política “dados pessoais” conforme é definido no regulamento geral de proteção de dados, incluí qualquer informação, que combinada com mais dados, ou não que recolhemos sobre você identifica você como um indivíduo, incluíndo por exemplo o seu nome, código postal, email e telefone.
                                </p>
                                <h3 className="text-lg font-semibold mt-4 mb-2">Porquê que precisamos desta informação pessoal?</h3>
                                <p>
                                    Somente processaremos os seus dados pessoais de acordo com as leis de proteção de dados e privacidade aplicáveis. Precisamos de certos dados pessoais para fornecer-lhe acesso ao site. Se você se registrou connosco, terá sido solicitado que você assinala-se para concordar em fornecer essas informações para acessar aos nossos serviços. Este consentimento nos fornece a base legal que exigimos sob a lei aplicável para processar os seus dados. Você mantém o direito de retirar tal consentimento a qualquer momento. Se você não concordar com o uso dos seus dados pessoais de acordo com esta Política, por favor, não use o nosso website.
                                </p>
                            </section>

                            <section id="recolha" className="scroll-mt-24">
                                <h2>2 – RECOLHENDO OS SEUS DADOS PESSOAIS</h2>
                                <p>Nós recolhemos informações sobre das seguintes formas: Informações que você nos dá. Inclui:</p>
                                <ul>
                                    <li>Os dados pessoais que você fornece quando se registra para usar o nosso website, incluindo seu nome, morada, e-mail, número de telefone, nome de usuário, senha e informações demográficas;</li>
                                    <li>Os dados pessoais que podem estar contidos em qualquer comentário ou outra publicação que você no nosso website;</li>
                                    <li>Os dados pessoais que você fornece no nosso programa de afiliados ou em outras promoções que corremos no nosso website;</li>
                                    <li>Os dados pessoais que você fornece quando reporta um problema no nosso website ou quando necessita de suporte ao cliente;</li>
                                    <li>Os dados pessoais que você fornece quando faz compras no nosso website;</li>
                                    <li>Os dados pessoais que você fornece quando nos contacta por telefone, email ou de outra forma.</li>
                                </ul>
                                <p>
                                    <strong>Informações que recolhemos automaticamente.</strong> registramos automaticamente informações sobre si e o seu computador, ou dispositivo móvel quando você acessa o nosso website. Por exemplo, ao visitar o nosso website, registramos o nome e a versão do seu computador, ou dispositivo móvel, o fabricante e o modelo, o tipo de navegador, o idioma do navegador, a resolução do ecrã, o website visitado antes de entrar no nosso website, as páginas visualizadas e por quanto tempo você esteve em uma página, tempos de acesso e informações sobre o seu uso e ações no nosso website. Recolhemos informações sobre si usando cookies.
                                </p>
                            </section>

                            <section id="cookies" className="scroll-mt-24">
                                <h2>3 – COOKIES</h2>
                                <h3 className="text-lg font-semibold mt-4 mb-2">O que são cookies?</h3>
                                <p>
                                    Podemos recolher informação sua usando ‘cookies’. Cookies são pequenos arquivos de dados armazenados no disco rígido do seu computador, ou dispositivo móvel no seu browser. Podemos usar tanto cookies (que expiram depois de fechar o browser) como cookies sem data de expiração ( que ficam no seu computador, ou dispositivo móvel até que você os apague) para fornecer-lhe uma experiência mais pessoal e interativa no nosso website. Usamos dois tipos de cookies: Primeiramente cookies inseridos por nós no seu computador, ou dispositivo móvel, que nós utilizamos para reconhecer quando você voltar a visitar o nosso website; e cookies de terceiros que são de serviços prestados por terceiros no nosso website, e que podem ser usados para reconhecer quando o seu computador, ou dispositivo móvel visita o nosso e outros websites.
                                </p>

                                <h3 className="text-lg font-semibold mt-6 mb-4">Cookies que utilizamos</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 font-semibold border-b">Tipo de cookies</th>
                                                <th className="px-4 py-2 font-semibold border-b">Propósitos</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-4 py-2 font-medium">Cookies essenciais</td>
                                                <td className="px-4 py-2">Estes cookies são necessários para fornecer os serviços disponíveis no nosso website, para que você seja capaz de utilizar algumas das suas funcionalidades. Sem estes cookies muitos dos serviços disponíveis no nosso website poderão não funcionar correctamente.</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 font-medium">Cookies de funções</td>
                                                <td className="px-4 py-2">Este cookie permite recordar as escolhas que você já fez no nosso website, como por exemplo a língua, detalhes de login, assim como outras escolhas que fez que possam ser personalizadas por si.</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 font-medium">Cookies de analise e performance</td>
                                                <td className="px-4 py-2">
                                                    Estes cookies servem para recolher a informações sobre o tráfego do nosso website e como os utilizadores utilização e navegam no website. Nós utilizamos o Google Analytics com este propósito. <br />
                                                    <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage" target="_blank" rel="nofollow">Info Cookies Google</a> | <a href="http://www.google.com/analytics/learn/privacy.html" target="_blank" rel="nofollow">Privacidade Google</a> | <a href="https://tools.google.com/dlpage/gaoptout?hl=pt-BR" target="_blank" rel="nofollow">Opt-out Google Analytics</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 font-medium">Cookies de publicidade</td>
                                                <td className="px-4 py-2">
                                                    Estes cookies analisam a forma como navega para podermos mostrar-lhe anúncios relevantes. Você pode desabilitar cookies em <a href="http://www.youronlinechoices.com/uk/your-ad-choices" target="_blank" rel="nofollow">youronlinechoices.com</a>.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2 font-medium">Cookies de redes sociais</td>
                                                <td className="px-4 py-2">Estes cookies são utilizados quando você partilha informação nas redes sociais, ou de alguma forma tem acesso aos nossos conteúdos através das redes sociais.</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <h3 className="text-lg font-semibold mt-6 mb-2">Desabilitando os cookies</h3>
                                <p>
                                    Você pode remover, ou rejeitar cookies através das configurações do browser. Para fazer isso recomendamos que siga as instruções do seus browser (normalmente pode encontrar estas informações nas “configurações” do seu browser em “ajuda”, ou “ferramentas”). Se não aceitar os nossos cookies, a sua experiência no nosso site não será tão agradável.
                                </p>
                            </section>

                            <section id="publicidade" className="scroll-mt-24">
                                <h2>4 – PUBLICIDADE</h2>
                                <p>
                                    Nós poderemos utilizar terceiros para apresentar anúncios quando visita o nosso website. Estas empresas poderão recolher informações como, tipo de browser, hora e dia, tipo de anúncio foi clicado, neste e outros websites de forma a mostrar os anúncios mais relevantes a você. Estas empresas normalmente utilizam o seu sistema para recolher estes dados, que estão sujeitos ás suas políticas de privacidade.
                                </p>
                            </section>

                            <section id="uso-dados" className="scroll-mt-24">
                                <h2>5 – USANDO OS SEUS DADOS PESSOAIS</h2>
                                <p>Nós poderemos utilizar os seus dados pessoais da seguinte forma:</p>
                                <ul>
                                    <li>para manter e melhorar o nosso website, produtos e serviços;</li>
                                    <li>para gerir a sua conta, incluindo comunicações que temos consigo relativamente á sua conta;</li>
                                    <li>para operar e administrar o nosso programa de afiliados e outras promoções;</li>
                                    <li>para responder aos seus comentários e perguntas e para prestar apoio ao cliente;</li>
                                    <li>para enviar informações técnicas, actualizações, alertas de segurança e suporte;</li>
                                    <li>com o seu consentimento, fazemos e-mail marketing. Você poderá sair da lista a qualquer momento;</li>
                                    <li>para processar pagamentos;</li>
                                    <li>para cumprir com a lei e proteger direitos;</li>
                                    <li>para analisar e estudar serviços.</li>
                                </ul>
                            </section>

                            <section id="partilha" className="scroll-mt-24">
                                <h2>6 – PARTILHAR OS SEUS DADOS PESSOAIS</h2>
                                <p>Podemos partilhar os seus dados pessoais das seguintes formas:</p>
                                <ul>
                                    <li>A terceiros designados por você com o seu consentimento.</li>
                                    <li>Serviços prestados por terceiros (analise de dados, pagamentos, suporte, etc).</li>
                                </ul>
                            </section>

                            <section id="terceiros" className="scroll-mt-24">
                                <h2>7 – WEBSITE DE TERCEIROS</h2>
                                <p>
                                    O nosso website poderá conter links de terceiros. Esta Política não cobre as Políticas de privacidade de terceiros. Não aceitamos qualquer responsabilidade sobre esses websites. Por favor leia as políticas de privacidade destes websites de terceiros antes de submeter qualquer informação.
                                </p>
                            </section>

                            <section id="conteudo-usuario" className="scroll-mt-24">
                                <h2>8 – CONTEÚDO GERADO PELO UTILIZADOR</h2>
                                <p>
                                    Poderá partilhar os seus dados pessoais connosco quando submete e gera conteúdo no nosso website (comentários, mensagens). Qualquer informação que você publique no nosso website torna-se de conhecimento publico e ficará acessível a todos. Sugerimos cautela.
                                </p>
                            </section>

                            <section id="transferencia" className="scroll-mt-24">
                                <h2>9 – TRANSFERÊNCIA DE DADOS INTERNACIONAL</h2>
                                <p>
                                    As suas informações poderão ser transferidos para, guardado em, e processado por nós fora do país onde você reside. Ao aceitar esta política de privacidade você concorda com esta transferência. Tomaremos as medidas necessárias para assegurar a segurança dos seus dados.
                                </p>
                            </section>

                            <section id="seguranca" className="scroll-mt-24">
                                <h2>10 – SEGURANÇA</h2>
                                <p>
                                    Procuramos tomar sempre todas as medidas, técnicas e administrativas para proteger todos os seus dados. Infelizmente nenhum sistema é 100% seguro. Se pensa que os seus dados foram comprometidos, contacte-nos imediatamente.
                                </p>
                            </section>

                            <section id="retencao" className="scroll-mt-24">
                                <h2>11 – RETENÇÃO</h2>
                                <p>
                                    Nós apenas guardaremos a sua informação pessoal enquanto for necessário e permitido por você para que você possa utilizar o nosso website até que você feche a sua conta ou termine a sua subscrição, a não ser que o período mais longo seja necessário, ou permitido por lei.
                                </p>
                            </section>

                            <section id="criancas" className="scroll-mt-24">
                                <h2>12 – NOSSA POLÍTICA COM CRIANÇAS</h2>
                                <p>
                                    O nosso website não é direcionado para crianças abaixo dos 18 anos. Se verificarmos dados de crianças sem consentimento, iremos apagá-los o mais rápido possível.
                                </p>
                            </section>

                            <section id="direitos" className="scroll-mt-24">
                                <h2>13 – OS SEUS DIREITOS</h2>
                                <ul>
                                    <li><strong>Sair da lista:</strong> Você pode contactar-nos a qualquer momento para sair da nossa lista de marketing.</li>
                                    <li><strong>Acesso:</strong> Você poderá ter acesso ás informações que nós possuímos de você.</li>
                                    <li><strong>Alterar:</strong> Você pode actualizar ou corrigir sua informação pessoal.</li>
                                    <li><strong>Mover:</strong> A sua informação pessoal pode ser transferida para outro serviço.</li>
                                    <li><strong>Apagar:</strong> Você poderá pedir para apagarmos os seus dados.</li>
                                </ul>
                                <p>
                                    Para exercer estes direitos, contacte-nos. Iremos atender ao seu pedido em até 30 dias.
                                </p>
                            </section>

                            <section id="queixas" className="scroll-mt-24">
                                <h2>14 – QUEIXAS</h2>
                                <p>
                                    Se tiver alguma queixa sobre nossa política de privacidade, contacte-nos em: <a href="mailto:contato@docbasico.com">contato@docbasico.com</a>. Responderemos em até 30 dias. Se a queixa não for resolvida, você tem o direito de contactar a autoridade local de protecção de dados.
                                </p>
                            </section>

                            <section id="contato" className="scroll-mt-24">
                                <h2>15 – INFORMAÇÃO DE CONTACTO</h2>
                                <p>
                                    Agradecemos os seus comentários e questões. Contacte-nos por e-mail em <a href="mailto:contato@docbasico.com">contato@docbasico.com</a>
                                </p>
                                <p className="text-sm mt-4">
                                    Todas as suas informações pessoais recolhidas, serão usadas para o ajudar a tornar a sua visita no nosso site o mais produtiva e agradável possível. A garantia da confidencialidade dos dados pessoais dos utilizadores do nosso site é importante para o Doc Básico. Todas as informações pessoais relativas a membros, assinantes, clientes ou visitantes que usem o Doc Básico serão tratadas em concordância com a Lei da Proteção de Dados Pessoais.
                                </p>
                            </section>

                            <section id="pedido-acesso" className="scroll-mt-24 border-t pt-12">
                                <h2>16 – Pedido de Acesso de Dados e Cancelamento</h2>
                                <p className="mb-8">
                                    Utilize o formulário abaixo para solicitar uma cópia dos dados que temos sobre você ou para solicitar a exclusão dos seus dados.
                                </p>

                                <PrivacyForm />
                            </section>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
}
