/**
 * Códigos de países comuns para seleção de telefone
 * Focado em países CPLP e principais destinos de imigrantes em Portugal
 */

export interface Country {
  code: string; // Código ISO (PT, BR, etc.)
  name: string;
  dialCode: string; // Código de discagem (+351, +55, etc.)
  flag: string; // Emoji da bandeira
}

// Países mais comuns primeiro (CPLP e principais destinos de imigrantes)
const commonCountries: Country[] = [
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'BR', name: 'Brasil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'AO', name: 'Angola', dialCode: '+244', flag: '🇦🇴' },
  { code: 'MZ', name: 'Moçambique', dialCode: '+258', flag: '🇲🇿' },
  { code: 'CV', name: 'Cabo Verde', dialCode: '+238', flag: '🇨🇻' },
  { code: 'GW', name: 'Guiné-Bissau', dialCode: '+245', flag: '🇬🇼' },
  { code: 'ST', name: 'São Tomé e Príncipe', dialCode: '+239', flag: '🇸🇹' },
  { code: 'TL', name: 'Timor-Leste', dialCode: '+670', flag: '🇹🇱' },
];

// Outros países
const otherCountries: Country[] = [
  { code: 'FR', name: 'França', dialCode: '+33', flag: '🇫🇷' },
  { code: 'ES', name: 'Espanha', dialCode: '+34', flag: '🇪🇸' },
  { code: 'IT', name: 'Itália', dialCode: '+39', flag: '🇮🇹' },
  { code: 'DE', name: 'Alemanha', dialCode: '+49', flag: '🇩🇪' },
  { code: 'GB', name: 'Reino Unido', dialCode: '+44', flag: '🇬🇧' },
  { code: 'US', name: 'Estados Unidos', dialCode: '+1', flag: '🇺🇸' },
  { code: 'IN', name: 'Índia', dialCode: '+91', flag: '🇮🇳' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'PK', name: 'Paquistão', dialCode: '+92', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵' },
  { code: 'VE', name: 'Venezuela', dialCode: '+58', flag: '🇻🇪' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'CO', name: 'Colômbia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪' },
  { code: 'EC', name: 'Equador', dialCode: '+593', flag: '🇪🇨' },
  { code: 'UY', name: 'Uruguai', dialCode: '+598', flag: '🇺🇾' },
  { code: 'PY', name: 'Paraguai', dialCode: '+595', flag: '🇵🇾' },
  { code: 'BO', name: 'Bolívia', dialCode: '+591', flag: '🇧🇴' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'UA', name: 'Ucrânia', dialCode: '+380', flag: '🇺🇦' },
  { code: 'RO', name: 'Roménia', dialCode: '+40', flag: '🇷🇴' },
  { code: 'BG', name: 'Bulgária', dialCode: '+359', flag: '🇧🇬' },
  { code: 'PL', name: 'Polónia', dialCode: '+48', flag: '🇵🇱' },
  { code: 'RU', name: 'Rússia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'TR', name: 'Turquia', dialCode: '+90', flag: '🇹🇷' },
  { code: 'MA', name: 'Marrocos', dialCode: '+212', flag: '🇲🇦' },
  { code: 'DZ', name: 'Argélia', dialCode: '+213', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunísia', dialCode: '+216', flag: '🇹🇳' },
  { code: 'EG', name: 'Egito', dialCode: '+20', flag: '🇪🇬' },
  { code: 'ZA', name: 'África do Sul', dialCode: '+27', flag: '🇿🇦' },
  { code: 'NG', name: 'Nigéria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'KE', name: 'Quénia', dialCode: '+254', flag: '🇰🇪' },
  { code: 'GH', name: 'Gana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'SN', name: 'Senegal', dialCode: '+221', flag: '🇸🇳' },
  { code: 'CI', name: 'Costa do Marfim', dialCode: '+225', flag: '🇨🇮' },
  { code: 'CM', name: 'Camarões', dialCode: '+237', flag: '🇨🇲' },
  { code: 'TG', name: 'Togo', dialCode: '+228', flag: '🇹🇬' },
  { code: 'BJ', name: 'Benim', dialCode: '+229', flag: '🇧🇯' },
  { code: 'ML', name: 'Mali', dialCode: '+223', flag: '🇲🇱' },
  { code: 'BF', name: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
  { code: 'NE', name: 'Níger', dialCode: '+227', flag: '🇳🇪' },
  { code: 'TD', name: 'Chade', dialCode: '+235', flag: '🇹🇩' },
  { code: 'CF', name: 'República Centro-Africana', dialCode: '+236', flag: '🇨🇫' },
  { code: 'GA', name: 'Gabão', dialCode: '+241', flag: '🇬🇦' },
  { code: 'CG', name: 'República do Congo', dialCode: '+242', flag: '🇨🇬' },
  { code: 'CD', name: 'República Democrática do Congo', dialCode: '+243', flag: '🇨🇩' },
  { code: 'GQ', name: 'Guiné Equatorial', dialCode: '+240', flag: '🇬🇶' },
  { code: 'MR', name: 'Mauritânia', dialCode: '+222', flag: '🇲🇷' },
  { code: 'GM', name: 'Gâmbia', dialCode: '+220', flag: '🇬🇲' },
  { code: 'GN', name: 'Guiné', dialCode: '+224', flag: '🇬🇳' },
  { code: 'SL', name: 'Serra Leoa', dialCode: '+232', flag: '🇸🇱' },
  { code: 'LR', name: 'Libéria', dialCode: '+231', flag: '🇱🇷' },
  { code: 'PH', name: 'Filipinas', dialCode: '+63', flag: '🇵🇭' },
  { code: 'ID', name: 'Indonésia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'MY', name: 'Malásia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'TH', name: 'Tailândia', dialCode: '+66', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietname', dialCode: '+84', flag: '🇻🇳' },
  { code: 'MM', name: 'Myanmar', dialCode: '+95', flag: '🇲🇲' },
  { code: 'KH', name: 'Camboja', dialCode: '+855', flag: '🇰🇭' },
  { code: 'LA', name: 'Laos', dialCode: '+856', flag: '🇱🇦' },
  { code: 'SG', name: 'Singapura', dialCode: '+65', flag: '🇸🇬' },
  { code: 'BN', name: 'Brunei', dialCode: '+673', flag: '🇧🇳' },
  { code: 'MX', name: 'México', dialCode: '+52', flag: '🇲🇽' },
  { code: 'GT', name: 'Guatemala', dialCode: '+502', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras', dialCode: '+504', flag: '🇭🇳' },
  { code: 'SV', name: 'El Salvador', dialCode: '+503', flag: '🇸🇻' },
  { code: 'NI', name: 'Nicarágua', dialCode: '+505', flag: '🇳🇮' },
  { code: 'CR', name: 'Costa Rica', dialCode: '+506', flag: '🇨🇷' },
  { code: 'PA', name: 'Panamá', dialCode: '+507', flag: '🇵🇦' },
  { code: 'DO', name: 'República Dominicana', dialCode: '+1', flag: '🇩🇴' },
  { code: 'CU', name: 'Cuba', dialCode: '+53', flag: '🇨🇺' },
  { code: 'JM', name: 'Jamaica', dialCode: '+1', flag: '🇯🇲' },
  { code: 'HT', name: 'Haiti', dialCode: '+509', flag: '🇭🇹' },
  { code: 'TT', name: 'Trindade e Tobago', dialCode: '+1', flag: '🇹🇹' },
  { code: 'BB', name: 'Barbados', dialCode: '+1', flag: '🇧🇧' },
  { code: 'BS', name: 'Bahamas', dialCode: '+1', flag: '🇧🇸' },
  { code: 'AG', name: 'Antígua e Barbuda', dialCode: '+1', flag: '🇦🇬' },
  { code: 'DM', name: 'Dominica', dialCode: '+1', flag: '🇩🇲' },
  { code: 'GD', name: 'Granada', dialCode: '+1', flag: '🇬🇩' },
  { code: 'LC', name: 'Santa Lúcia', dialCode: '+1', flag: '🇱🇨' },
  { code: 'VC', name: 'São Vicente e Granadinas', dialCode: '+1', flag: '🇻🇨' },
  { code: 'KN', name: 'São Cristóvão e Neves', dialCode: '+1', flag: '🇰🇳' },
  { code: 'SR', name: 'Suriname', dialCode: '+597', flag: '🇸🇷' },
  { code: 'GY', name: 'Guiana', dialCode: '+592', flag: '🇬🇾' },
  { code: 'GF', name: 'Guiana Francesa', dialCode: '+594', flag: '🇬🇫' },
  { code: 'FK', name: 'Ilhas Falkland', dialCode: '+500', flag: '🇫🇰' },
  { code: 'GS', name: 'Geórgia do Sul e Ilhas Sandwich do Sul', dialCode: '+500', flag: '🇬🇸' },
  { code: 'AQ', name: 'Antártida', dialCode: '+672', flag: '🇦🇶' },
  { code: 'TF', name: 'Territórios Franceses do Sul', dialCode: '+262', flag: '🇹🇫' },
  { code: 'HM', name: 'Ilha Heard e Ilhas McDonald', dialCode: '+672', flag: '🇭🇲' },
  { code: 'CC', name: 'Ilhas Cocos', dialCode: '+61', flag: '🇨🇨' },
  { code: 'CX', name: 'Ilha do Natal', dialCode: '+61', flag: '🇨🇽' },
  { code: 'NF', name: 'Ilha Norfolk', dialCode: '+672', flag: '🇳🇫' },
  { code: 'PN', name: 'Ilhas Pitcairn', dialCode: '+872', flag: '🇵🇳' },
  { code: 'SH', name: 'Santa Helena', dialCode: '+290', flag: '🇸🇭' },
  { code: 'AC', name: 'Ilha de Ascensão', dialCode: '+247', flag: '🇦🇨' },
  { code: 'TA', name: 'Tristão da Cunha', dialCode: '+290', flag: '🇹🇦' },
];

// Combinar países comuns primeiro, depois os outros
export const countries: Country[] = [...commonCountries, ...otherCountries];

// País padrão (Portugal)
export const defaultCountry: Country = commonCountries[0];

/**
 * Buscar país por código de discagem
 */
export function getCountryByDialCode(dialCode: string): Country | undefined {
  return countries.find(country => country.dialCode === dialCode);
}

/**
 * Buscar país por código ISO
 */
export function getCountryByCode(code: string): Country | undefined {
  return countries.find(country => country.code === code);
}

