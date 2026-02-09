"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { countries, defaultCountry, type Country } from "@/lib/country-codes";

// Países CPLP e mais comuns (primeiros 8)
const commonCountriesCodes = ['PT', 'BR', 'AO', 'MZ', 'CV', 'GW', 'ST', 'TL'];
import { validatePhoneNumber, normalizePhoneNumber } from "@/lib/phone-validation";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
}

export default function PhoneInput({
  value,
  onChange,
  onBlur,
  error,
  required = false,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [showCountryList, setShowCountryList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Inicializar com valor existente ou país padrão
  useEffect(() => {
    if (value) {
      // Se o valor começa com +, tentar identificar o país
      if (value.startsWith("+")) {
        // Encontrar o país com o código mais longo que corresponda
        const matchingCountry = countries
          .filter(c => value.startsWith(c.dialCode))
          .sort((a, b) => b.dialCode.length - a.dialCode.length)[0];
        
        if (matchingCountry) {
          setSelectedCountry(matchingCountry);
          const numberPart = value.replace(matchingCountry.dialCode, "").trim();
          setPhoneNumber(numberPart.replace(/\D/g, ""));
          return;
        }
      }
      // Se não tem código de país, assumir país padrão e usar o valor como número
      const numberOnly = value.replace(/\D/g, "");
      setPhoneNumber(numberOnly);
      // Garantir que o valor completo seja atualizado
      if (numberOnly) {
        onChange(`${defaultCountry.dialCode}${numberOnly}`);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryList(false);
        setSearchQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryList(false);
    setSearchQuery("");
    
    // Atualizar valor completo (código + número)
    const fullNumber = phoneNumber 
      ? `${country.dialCode}${phoneNumber}`
      : country.dialCode;
    onChange(fullNumber);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, ""); // Apenas números
    setPhoneNumber(inputValue);
    
    // Atualizar valor completo (código + número)
    const fullNumber = inputValue 
      ? `${selectedCountry.dialCode}${inputValue}`
      : selectedCountry.dialCode;
    onChange(fullNumber);
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separar países comuns dos outros
  const commonFiltered = filteredCountries.filter(c => commonCountriesCodes.includes(c.code));
  const otherFiltered = filteredCountries.filter(c => !commonCountriesCodes.includes(c.code));

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">
        Telefone {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="flex gap-2">
        {/* Seletor de País */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowCountryList(!showCountryList)}
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors ${
              error
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-white hover:border-primary-500 hover:bg-primary-50"
            } focus:outline-none focus:ring-2 focus:ring-primary-500`}
          >
            <span className="text-xl">{selectedCountry.flag}</span>
            <span className="text-sm font-medium text-gray-700 min-w-[60px] text-left">
              {selectedCountry.dialCode}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
          </button>

          {/* Dropdown de Países */}
          {showCountryList && (
            <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
              {/* Busca */}
              <div className="p-2 border-b border-gray-200 bg-gray-50">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar país..."
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                    autoFocus
                  />
                </div>
              </div>

              {/* Lista de Países */}
              <div className="overflow-y-auto max-h-80">
                {filteredCountries.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    Nenhum país encontrado
                  </div>
                ) : (
                  <>
                    {/* Países Comuns */}
                    {commonFiltered.length > 0 && (
                      <>
                        <div className="px-3 py-2 bg-primary-50 border-b border-gray-200">
                          <span className="text-xs font-semibold text-primary-700 uppercase">Países Mais Comuns</span>
                        </div>
                        {commonFiltered.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                              selectedCountry.code === country.code ? "bg-primary-50 border-l-4 border-primary-600" : ""
                            }`}
                          >
                            <span className="text-xl flex-shrink-0">{country.flag}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-900 truncate">{country.name}</div>
                              <div className="text-xs text-gray-500">{country.dialCode}</div>
                            </div>
                            {selectedCountry.code === country.code && (
                              <span className="text-primary-600 font-bold flex-shrink-0">✓</span>
                            )}
                          </button>
                        ))}
                      </>
                    )}
                    
                    {/* Outros Países */}
                    {otherFiltered.length > 0 && (
                      <>
                        {commonFiltered.length > 0 && (
                          <div className="px-3 py-2 bg-gray-100 border-t border-b border-gray-200">
                            <span className="text-xs font-semibold text-gray-600 uppercase">Outros Países</span>
                          </div>
                        )}
                        {otherFiltered.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                              selectedCountry.code === country.code ? "bg-primary-50 border-l-4 border-primary-600" : ""
                            }`}
                          >
                            <span className="text-xl flex-shrink-0">{country.flag}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-900 truncate">{country.name}</div>
                              <div className="text-xs text-gray-500">{country.dialCode}</div>
                            </div>
                            {selectedCountry.code === country.code && (
                              <span className="text-primary-600 font-bold flex-shrink-0">✓</span>
                            )}
                          </button>
                        ))}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Campo de Número */}
        <div className="flex-1">
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            onBlur={onBlur}
            placeholder="912345678"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-primary-500"
            }`}
            required={required}
          />
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
      
      {!error && (
        <p className="mt-1.5 text-xs text-gray-500">
          Selecione o país e digite o número do telefone
        </p>
      )}
    </div>
  );
}

