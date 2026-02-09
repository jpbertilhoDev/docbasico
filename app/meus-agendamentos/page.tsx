"use client";

import { useState, useCallback, lazy, Suspense, memo } from "react";
import { Calendar, Clock, User, Mail, Phone, FileText, XCircle, Search, AlertCircle, CheckCircle2, ClipboardList, Info } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useDialog } from "@/hooks/useDialog";
import { useToast } from "@/hooks/useToast";

// Lazy load do DocumentChecklist (componente pesado)
const DocumentChecklist = lazy(() => import("@/components/DocumentChecklist"));

type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_slug: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  notes: string | null;
  documents_reminder: any;
  created_at: string;
}

// Componente memoizado para o card de agendamento
const AppointmentCard = memo(function AppointmentCard({
  appointment,
  onCancel,
  onToggleChecklist,
  viewingChecklist,
  cancelling,
  getStatusBadge,
  canCancel,
  toast,
}: any) {
  const appointmentDate = new Date(appointment.appointment_date);
  const isPast = appointmentDate < new Date();

  return (
    <div className="px-6 py-6 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {appointment.service_name}
            </h3>
            {getStatusBadge(appointment.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{appointment.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>{appointment.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{appointment.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {appointmentDate.toLocaleDateString("pt-PT", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{appointment.appointment_time}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="text-xs">
                Criado em {formatDate(appointment.created_at)}
              </span>
            </div>
          </div>

          {appointment.notes && (
            <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
              <strong>Observações:</strong> {appointment.notes}
            </div>
          )}

          {appointment.documents_reminder &&
            Array.isArray(appointment.documents_reminder) &&
            appointment.documents_reminder.filter(
              (doc: any) => doc.required
            ).length > 0 && (
              <div className="mt-3 p-3 bg-primary-50 rounded text-sm">
                <strong className="text-primary-900">
                  Documentos necessários:
                </strong>
                <ul className="mt-1 space-y-1 text-primary-800">
                  {appointment.documents_reminder
                    .filter((doc: any) => doc.required)
                    .slice(0, 5)
                    .map((doc: any, idx: number) => (
                      <li key={idx}>• {doc.name}</li>
                    ))}
                </ul>
              </div>
            )}

          {isPast && appointment.status !== "completed" && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Este agendamento já passou.
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {!isPast && appointment.status !== "cancelled" && (
            <button
              onClick={() => onToggleChecklist(appointment.id)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              {viewingChecklist === appointment.id ? "Ocultar Checklist" : "Ver Checklist"}
            </button>
          )}
          
          {canCancel(appointment.status, appointment.appointment_date) && (
            <button
              onClick={() => onCancel(appointment.id)}
              disabled={cancelling === appointment.id}
              className={`px-4 py-2 ${
                cancelling === appointment.id
                  ? "bg-gray-400"
                  : "bg-red-600 hover:bg-red-700"
              } text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed`}
            >
              {cancelling === appointment.id ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Cancelando...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Cancelar
                </>
              )}
            </button>
          )}

          {appointment.status === "cancelled" && (
            <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm text-center">
              Cancelado
            </div>
          )}

          {appointment.status === "completed" && (
            <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Concluído
            </div>
          )}
        </div>
      </div>
      
      {viewingChecklist === appointment.id && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Suspense fallback={
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                <span className="text-gray-600">Carregando checklist...</span>
              </div>
            </div>
          }>
            <DocumentChecklist
              serviceSlug={appointment.service_slug}
              appointmentId={appointment.id}
              onProgressChange={(progress) => {
                if (progress === 100) {
                  toast.success("Todos os documentos obrigatórios estão prontos!");
                }
              }}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
});

export default function MeusAgendamentosPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewingChecklist, setViewingChecklist] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const dialog = useDialog();
  const toast = useToast();

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSearched(false);

    try {
      const response = await fetch("/api/appointments/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), phone: phone.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar agendamentos");
      }

      setAppointments(data.appointments || []);
      setSearched(true);

      if (data.appointments.length === 0) {
        setError("Nenhum agendamento encontrado com esses dados.");
      }
    } catch (err: any) {
      console.error("Error searching appointments:", err);
      setError(err.message || "Erro ao buscar agendamentos. Verifique seus dados e tente novamente.");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [email, phone]);

  const handleCancel = useCallback(async (appointmentId: string) => {
    const confirmed = await dialog.confirm(
      "Cancelar Agendamento",
      "Tem certeza que deseja cancelar este agendamento?",
      "danger"
    );

    if (!confirmed) {
      return;
    }

    setCancelling(appointmentId);
    setError(null);

    try {
      const response = await fetch(`/api/appointments/${appointmentId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cancelar agendamento");
      }

      // Atualizar status localmente
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId
            ? { ...apt, status: "cancelled" as AppointmentStatus }
            : apt
        )
      );

      toast.success("Agendamento cancelado com sucesso!");
    } catch (err: any) {
      console.error("Error cancelling appointment:", err);
      toast.error(err.message || "Erro ao cancelar agendamento. Tente novamente.");
    } finally {
      setCancelling(null);
    }
  }, [email, phone, dialog, toast]);

  const getStatusBadge = useCallback((status: AppointmentStatus) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      confirmed: "bg-green-100 text-green-700 border-green-300",
      cancelled: "bg-red-100 text-red-700 border-red-300",
      completed: "bg-blue-100 text-blue-700 border-blue-300",
    };

    const labels = {
      pending: "Pendente",
      confirmed: "Confirmado",
      cancelled: "Cancelado",
      completed: "Concluído",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  }, []);

  const canCancel = useCallback((status: AppointmentStatus, appointmentDate: string) => {
    if (status === "cancelled" || status === "completed") {
      return false;
    }
    // Permitir cancelar até 2 horas antes do agendamento
    const aptDate = new Date(appointmentDate);
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    return aptDate > twoHoursFromNow;
  }, []);

  // Skeleton Loading Component
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="h-12 bg-gray-200 rounded-xl"></div>
        <div className="h-12 bg-gray-200 rounded-xl"></div>
      </div>
      <div className="h-14 bg-gray-200 rounded-xl"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Section Profissional - Compacto */}
      <div className="bg-white border-b border-gray-200 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary-50 rounded-xl mb-6">
            <Search className="w-6 h-6 text-primary-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
            Meus <span className="text-primary-600">Agendamentos</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Consulte o status dos seus processos, veja detalhes e gerencie seus agendamentos de forma simples e rápida.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Search Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8 relative z-10">
          
          {/* Botão de Informação (Tooltip) */}
          <div className="absolute top-4 right-4 z-20">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                onMouseEnter={() => setShowHelp(true)}
                onMouseLeave={() => setShowHelp(false)}
                className="text-gray-400 hover:text-primary-600 transition-colors p-2"
                aria-label="Como funciona"
              >
                <Info className="w-5 h-5" />
              </button>

              {/* O Tooltip Flutuante */}
              {showHelp && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 animate-fade-in z-30 text-left">
                  <h4 className="font-bold text-gray-900 mb-2 text-sm flex items-center gap-2">
                    <Info className="w-3 h-3 text-primary-600" />
                    Como funciona
                  </h4>
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li>• Use o email e telefone do cadastro.</li>
                    <li>• Consulte status e detalhes.</li>
                    <li>• Cancele até 2h antes.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-700"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-bold text-gray-700"
                >
                  Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                    placeholder="+351..."
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-800 animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-primary-700 hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[0px] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Buscar Agendamentos
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {appointments.length === 0
                  ? "Nenhum agendamento encontrado"
                  : `${appointments.length} agendamento${appointments.length !== 1 ? "s" : ""} encontrado${appointments.length !== 1 ? "s" : ""}`}
              </h2>
            </div>

            {appointments.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onCancel={handleCancel}
                    onToggleChecklist={(id: string) => setViewingChecklist(viewingChecklist === id ? null : id)}
                    viewingChecklist={viewingChecklist}
                    cancelling={cancelling}
                    getStatusBadge={getStatusBadge}
                    canCancel={canCancel}
                    toast={toast}
                  />
                ))}
              </div>
                ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Nenhum agendamento encontrado com esses dados.</p>
                <p className="text-sm mt-2">
                  Verifique se o email e telefone estão corretos.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <dialog.DialogRenderer />
      <toast.ToastRenderer />
    </div>
  );
}

