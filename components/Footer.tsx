import Link from "next/link";
import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  const services = [
    { name: "Renovação de Residência", href: "/servicos/renovacao-residencia" },
    { name: "Visto para Portugal", href: "/servicos/visto-portugal" },
    { name: "Processo de Nacionalidade", href: "/servicos/nacionalidade" },
    { name: "NIF e Documentação", href: "/servicos/documentacao" },
    { name: "Serviços de IRS", href: "/servicos/irs" },
    { name: "Constituição de Empresa", href: "/servicos/empresas" },
  ];

  const links = [
    { name: "Contacto", href: "/contato" },
    { name: "Termos de Utilização", href: "/termos" },
    { name: "Política de Privacidade", href: "/privacidade" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Doc Basico</h3>
            <p className="mb-4">
              Serviços burocráticos e consultoria para imigrantes em Portugal.
              Documentação, legalização e questões fiscais.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="hover:text-white transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contato@docbasico.com"
                  className="hover:text-white transition-colors"
                >
                  contato@docbasico.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+351123456789"
                  className="hover:text-white transition-colors"
                >
                  +351 123 456 789
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Doc Basico. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

