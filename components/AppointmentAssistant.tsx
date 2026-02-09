"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { getServiceInfo, getDocumentsForService, getPreparationNotes } from "@/lib/services-documents";
import { isServiceBookable, getBookableService } from "@/lib/bookable-services";
import { validatePhoneNumber, normalizePhoneNumber } from "@/lib/phone-validation";
import PhoneInput from "@/components/PhoneInput";
import DocumentChecklist from "@/components/DocumentChecklist";

interface AppointmentAssistantProps {
  serviceSlug: string;
  onComplete?: (appointmentData: any) => void;
}

export default function AppointmentAssistant({ serviceSlug, onComplete }: AppointmentAssistantProps) {
  const [step, setStep] = useState(1);
  const [serviceInfo, setServiceInfo] = useState<any>(null);
  const [availableSlots, setAvailableSlots] = useState<Record<string, string[]>>({});
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    urgency: "normal" as "low" | "normal" | "high" | "urgent",
    notes: "",
  });

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case "name":
        if (!value || value.trim().length < 2) {
          newErrors.name = "Nome deve ter pelo menos 2 caracteres";
        } else {
          delete newErrors.name;
        }
        break;
      case "email":
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Email inválido";
        } else {
          delete newErrors.email;
        }
        break;
      case "phone":
        const phoneValidation = validatePhoneNumber(value);
        if (!phoneValidation.isValid) {
          newErrors.phone = phoneValidation.error || "Telefone inválido";
        } else {
          delete newErrors.phone;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  useEffect(() => {
    // Validação: verificar se o serviço é agendável
    if (!isServiceBookable(serviceSlug)) {
      console.error(`[AppointmentAssistant] Serviço "${serviceSlug}" não está disponível para agendamento online`);
      setErrors({ 
        general: "Este serviço não está disponível para agendamento online. Por favor, contacte-nos diretamente." 
      });
      return;
    }

    const info = getServiceInfo(serviceSlug);
    const bookableInfo = getBookableService(serviceSlug);
    
    if (!info) {
      console.error(`[AppointmentAssistant] Informações do serviço "${serviceSlug}" não encontradas`);
      setErrors({ 
        general: "Erro ao carregar informações do serviço. Por favor, tente novamente." 
      });
      return;
    }

    setServiceInfo(info);
    
    // Log para debug (remover em produção se necessário)
    if (bookableInfo?.requiresPayment) {
      console.log(`[AppointmentAssistant] Serviço "${serviceSlug}" requer pagamento prévio`);
    }
    
    fetchAvailableSlots();
  }, [serviceSlug]);

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/appointments/slots?days=14");
      if (res.ok) {
        const data = await res.json();
        setAvailableSlots(data.slots || {});
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const validateForm = (): string | null => {
    // Validar dados pessoais
    if (!formData.name || formData.name.trim().length < 2) {
      return "Por favor, insira um nome válido (mínimo 2 caracteres)";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Por favor, insira um email válido";
    }

    const phoneValidation = validatePhoneNumber(formData.phone);
    if (!phoneValidation.isValid) {
      return phoneValidation.error || "Por favor, insira um telefone válido";
    }

    // Validar data e hora
    if (!selectedDate || !selectedTime) {
      return "Por favor, selecione data e hora";
    }

    // Validar formato da data (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(selectedDate)) {
      return "Formato de data inválido. Por favor, selecione uma data válida.";
    }

    // Validar formato da hora (HH:MM)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(selectedTime)) {
      return "Formato de hora inválido. Por favor, selecione uma hora válida.";
    }

    // Validar se a data/hora não é no passado
    try {
      const dateTimeString = `${selectedDate}T${selectedTime}:00`;
      const appointmentDateTime = new Date(dateTimeString);
      
      if (isNaN(appointmentDateTime.getTime())) {
        return "Data ou hora inválida. Por favor, verifique os dados selecionados.";
      }

      // Verificar se não é no passado (com margem de 30 minutos)
      const now = new Date();
      now.setMinutes(now.getMinutes() - 30);
      
      if (appointmentDateTime < now) {
        return "Não é possível agendar no passado. Por favor, selecione uma data e hora futuras.";
      }
    } catch (error) {
      return "Erro ao validar data e hora. Por favor, tente novamente.";
    }

    return null;
  };

  const handleSubmit = async () => {
    // Validar antes de enviar
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setLoading(true);
    try {
      // Garantir formato correto
      const formattedDate = selectedDate; // Já está em YYYY-MM-DD
      const formattedTime = selectedTime.includes(':') 
        ? selectedTime.split(':').slice(0, 2).join(':') // Garantir HH:MM
        : selectedTime;

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: normalizePhoneNumber(formData.phone), // Normalizar telefone antes de enviar
          serviceSlug,
          appointmentDate: formattedDate,
          appointmentTime: formattedTime,
          urgency: formData.urgency,
          notes: formData.notes?.trim() || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        
        // Criar checklist automaticamente após agendamento
        if (data.appointment?.id) {
          try {
            await fetch(`/api/checklists/${data.appointment.id}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            });
          } catch (checklistError) {
            console.error("Error creating checklist:", checklistError);
            // Não bloquear o fluxo se o checklist falhar
          }
        }
        
        setStep(5); // Tela de sucesso
        if (onComplete) {
          onComplete(data.appointment);
        }
      } else {
        const error = await res.json();
        let errorMessage = "Erro ao criar agendamento";
        
        if (error.error) {
          errorMessage = error.error;
          if (error.details) {
            errorMessage += `: ${error.details}`;
          }
        }
        
        console.error("Error details:", error);
        
        // Se for erro de conflito (409), recarregar slots disponíveis
        if (res.status === 409) {
          alert(errorMessage + "\n\nAtualizando horários disponíveis...");
          fetchAvailableSlots();
          // Voltar para seleção de data/hora
          setStep(2);
        } else {
          alert(errorMessage);
        }
      }
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      alert(error?.message || "Erro ao criar agendamento. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const documents = getDocumentsForService(serviceSlug);
  const preparationNotes = getPreparationNotes(serviceSlug);

  // Obter próximas datas disponíveis (filtrar datas passadas)
  const today = new Date().toISOString().split('T')[0];
  const availableDates = Object.keys(availableSlots)
    .filter(date => date >= today) // Apenas datas futuras ou hoje
    .sort()
    .slice(0, 7);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > s ? "bg-primary-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>Serviço</span>
          <span>Data/Hora</span>
          <span>Dados</span>
          <span>Confirmação</span>
        </div>
      </div>

      {/* Step 1: Service Info */}
      {step === 1 && serviceInfo && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">{serviceInfo.name}</h2>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-600" />
              Documentos Necessários
            </h3>
            <ul className="space-y-2">
              {documents.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className={doc.required ? "text-red-500" : "text-gray-400"}>
                    {doc.required ? "●" : "○"}
                  </span>
                  <span className={doc.required ? "font-medium" : ""}>
                    {doc.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary-600" />
              Notas de Preparação
            </h3>
            <ul className="space-y-2">
              {preparationNotes.map((note, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Date & Time Selection */}
      {step === 2 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Selecione Data e Hora</h2>

          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-600" />
              <p className="mt-2 text-gray-600">A carregar horários...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Data</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableDates.map((date) => {
                    const dateObj = new Date(date);
                    const isSelected = selectedDate === date;
                    const dayName = dateObj.toLocaleDateString("pt-PT", { weekday: "short" });
                    const dayNumber = dateObj.getDate();
                    const month = dateObj.toLocaleDateString("pt-PT", { month: "short" });

                    return (
                      <button
                        key={date}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime("");
                        }}
                        className={`p-3 rounded-lg border-2 text-sm ${
                          isSelected
                            ? "border-primary-600 bg-primary-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="font-semibold">{dayName}</div>
                        <div className="text-lg font-bold">{dayNumber}</div>
                        <div className="text-xs text-gray-500">{month}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedDate && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">Hora</label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {availableSlots[selectedDate]?.filter((time) => {
                      // Filtrar horários passados se for hoje
                      const today = new Date().toISOString().split('T')[0];
                      if (selectedDate === today) {
                        const formattedTime = time.includes(':') 
                          ? time.split(':').slice(0, 2).join(':')
                          : time;
                        const [hour, minute] = formattedTime.split(':').map(Number);
                        const now = new Date();
                        const slotTime = new Date();
                        slotTime.setHours(hour, minute, 0, 0);
                        
                        // Adicionar margem de 30 minutos
                        const margin = new Date(now.getTime() + 30 * 60000);
                        return slotTime >= margin;
                      }
                      return true;
                    }).map((time) => {
                      // Garantir formato HH:MM (sem segundos)
                      const formattedTime = time.includes(':') 
                        ? time.split(':').slice(0, 2).join(':')
                        : time;
                      
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(formattedTime)}
                          className={`p-2 rounded-lg border text-sm ${
                            selectedTime === formattedTime
                              ? "border-primary-600 bg-primary-50 text-primary-700 font-medium"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {formattedTime}
                        </button>
                      );
                    })}
                  </div>
                  {selectedDate === new Date().toISOString().split('T')[0] && 
                   availableSlots[selectedDate]?.filter((time) => {
                     const today = new Date().toISOString().split('T')[0];
                     if (selectedDate === today) {
                       const formattedTime = time.includes(':') 
                         ? time.split(':').slice(0, 2).join(':')
                         : time;
                       const [hour, minute] = formattedTime.split(':').map(Number);
                       const now = new Date();
                       const slotTime = new Date();
                       slotTime.setHours(hour, minute, 0, 0);
                       const margin = new Date(now.getTime() + 30 * 60000);
                       return slotTime >= margin;
                     }
                     return true;
                   }).length === 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Não há mais horários disponíveis hoje. Por favor, selecione outro dia.
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={handleBack}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Voltar
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedDate || !selectedTime}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 3: Personal Information */}
      {step === 3 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Seus Dados</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome completo *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  validateField("name", e.target.value);
                }}
                onBlur={(e) => validateField("name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary-500"
                }`}
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  validateField("email", e.target.value);
                }}
                onBlur={(e) => validateField("email", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary-500"
                }`}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <PhoneInput
              value={formData.phone}
              onChange={(value) => {
                setFormData({ ...formData, phone: value });
                validateField("phone", value);
              }}
              onBlur={() => validateField("phone", formData.phone)}
              error={errors.phone}
              required
            />

            <div>
              <label className="block text-sm font-medium mb-1">Urgência</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Baixa</option>
                <option value="normal">Normal</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Observações (opcional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800"
            >
              Voltar
            </button>
            <button
              onClick={handleNext}
              disabled={
                !formData.name || 
                !formData.email || 
                !formData.phone ||
                Object.keys(errors).length > 0
              }
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Confirmar Agendamento</h2>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-primary-600" />
              <div>
                <div className="text-sm text-gray-600">Data</div>
                <div className="font-semibold">
                  {new Date(selectedDate).toLocaleDateString("pt-PT", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-primary-600" />
              <div>
                <div className="text-sm text-gray-600">Hora</div>
                <div className="font-semibold">{selectedTime}</div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Serviço</div>
              <div className="font-semibold">{serviceInfo?.name}</div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Dados de Contacto</div>
              <div className="font-semibold">{formData.name}</div>
              <div className="text-sm text-gray-600">{formData.email}</div>
              <div className="text-sm text-gray-600">{formData.phone}</div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-gray-900">Documentos Necessários</h3>
            <p className="text-sm text-gray-600 mb-4">
              Após confirmar, você terá acesso a um checklist interativo para se preparar para a consulta.
            </p>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <ul className="text-sm text-primary-800 space-y-1">
                {documents.filter(d => d.required).slice(0, 3).map((doc, idx) => (
                  <li key={idx}>• {doc.name}</li>
                ))}
                {documents.filter(d => d.required).length > 3 && (
                  <li className="text-primary-600">+ {documents.filter(d => d.required).length - 3} mais</li>
                )}
              </ul>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="text-gray-600 hover:text-gray-800"
            >
              Voltar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? "A processar..." : "Confirmar Agendamento"}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Success */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Agendamento Confirmado!</h2>
            <p className="text-gray-600 mb-6">
              Receberá um email de confirmação com todos os detalhes e lembretes de documentos.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = "/agendar"}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Ver Meus Agendamentos
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
          
          {/* Checklist após confirmação */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-2">
              💡 <strong>Dica:</strong> Acesse "Meus Agendamentos" para ver o checklist interativo de documentos e se preparar para sua consulta.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

