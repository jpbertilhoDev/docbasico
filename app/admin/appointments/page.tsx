"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Calendar, Clock, User, Mail, Phone, FileText, CheckCircle2, XCircle, AlertCircle, Filter, Trash2, ClipboardCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useDialog } from "@/hooks/useDialog";
import { useToast } from "@/hooks/useToast";
import ChecklistVerification from "@/components/ChecklistVerification";

type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";
type Urgency = "low" | "normal" | "high" | "urgent";

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_slug: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  urgency: Urgency;
  status: AppointmentStatus;
  notes: string | null;
  documents_reminder: any;
  preparation_notes: string | null;
  created_at: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null); // ID do agendamento sendo excluído
  const [filter, setFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [verifyingChecklist, setVerifyingChecklist] = useState<string | null>(null);
  const dialog = useDialog();
  const toast = useToast();

  useEffect(() => {
    fetchAppointments();
  }, [filter, dateFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("appointments")
        .select("*")
        .order("appointment_date", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      if (dateFilter === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        query = query
          .gte("appointment_date", today.toISOString())
          .lt("appointment_date", tomorrow.toISOString());
      } else if (dateFilter === "week") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        query = query
          .gte("appointment_date", today.toISOString())
          .lt("appointment_date", nextWeek.toISOString());
      } else if (dateFilter === "month") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        query = query
          .gte("appointment_date", today.toISOString())
          .lt("appointment_date", nextMonth.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching appointments:", error);
        toast.error(`Erro ao buscar agendamentos: ${error.message}`);
        throw error;
      }

      console.log("Appointments fetched:", data);
      setAppointments(data || []);
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
      if (error?.message) {
        toast.error(`Erro: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: AppointmentStatus) => {
    try {
      // Usar o cliente Supabase diretamente (já autenticado)
      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error("Error updating status:", error);
        throw new Error(error.message || 'Erro ao atualizar status');
      }

      fetchAppointments();
      toast.success("Status atualizado com sucesso!");
    } catch (error: any) {
      console.error("Error updating status:", error);
      toast.error(`Erro ao atualizar status: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const deleteAppointment = async (id: string) => {
    console.log('[DELETE] ========================================');
    console.log('[DELETE] Iniciando exclusão do agendamento:', id);
    console.log('[DELETE] ========================================');

    setDeleting(id); // Marcar como deletando

    try {
      // Verificar sessão antes de deletar
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('[DELETE] Sessão do usuário:', session ? 'Autenticado' : 'Não autenticado');
      console.log('[DELETE] User ID:', session?.user?.id);
      console.log('[DELETE] Email:', session?.user?.email);

      if (sessionError) {
        console.error('[DELETE] Erro ao obter sessão:', sessionError);
        throw new Error('Erro ao verificar autenticação');
      }

      if (!session) {
        throw new Error('Usuário não autenticado. Por favor, faça login novamente.');
      }

      console.log('[DELETE] Chamando Supabase delete...');
      console.log('[DELETE] ID do agendamento:', id);

      // Verificar se o agendamento existe antes
      const { data: beforeDelete } = await supabase
        .from('appointments')
        .select('id, name')
        .eq('id', id)
        .maybeSingle();

      console.log('[DELETE] Agendamento antes de deletar:', beforeDelete);

      if (!beforeDelete) {
        console.log('[DELETE] ⚠️ Agendamento não encontrado, removendo da lista mesmo assim');
        setAppointments(prev => prev.filter(apt => apt.id !== id));
        return;
      }

      // Usar o cliente Supabase diretamente (já autenticado)
      // Deletar usando select para ver o que foi deletado
      const { data: deletedData, error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)
        .select();

      console.log('[DELETE] Resposta do Supabase DELETE:', { deletedData, error });

      if (error) {
        console.error("[DELETE] ❌ Erro do Supabase:", error);
        console.error("[DELETE] Detalhes do erro:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        throw new Error(error.message || 'Erro ao excluir agendamento');
      }

      // Verificar se realmente deletou algo
      if (deletedData && deletedData.length > 0) {
        console.log('[DELETE] ✅ DELETE executado com sucesso! Registros deletados:', deletedData.length);
        console.log('[DELETE] IDs deletados:', (deletedData as any[]).map((d: any) => d.id));
      } else {
        console.warn('[DELETE] ⚠️ DELETE retornou sucesso, mas nenhum registro foi deletado!');
        console.warn('[DELETE] Isso pode indicar problema com políticas RLS');

        // Verificar se ainda existe
        const { data: checkData, error: checkError } = await supabase
          .from('appointments')
          .select('id')
          .eq('id', id)
          .maybeSingle();

        console.log('[DELETE] Verificação pós-DELETE:', { checkData, checkError });

        if (checkData) {
          console.error('[DELETE] ❌ Agendamento ainda existe no banco após DELETE!');
          console.error('[DELETE] Isso indica problema com políticas RLS ou permissões');
          throw new Error('Não foi possível excluir o agendamento. O DELETE não teve efeito. Verifique as políticas RLS no Supabase.');
        } else {
          console.log('[DELETE] ✅ Agendamento não existe mais, considerando exclusão bem-sucedida');
        }
      }

      // Remover da lista localmente para feedback imediato
      setAppointments(prev => {
        const filtered = prev.filter(apt => apt.id !== id);
        console.log('[DELETE] Lista atualizada. Antes:', prev.length, 'Depois:', filtered.length);
        return filtered;
      });

      console.log('[DELETE] ✅ Exclusão concluída com sucesso!');

      toast.success("Agendamento excluído com sucesso!");
    } catch (error: any) {
      console.error("[DELETE] ❌ Erro ao excluir agendamento:", error);
      console.error("[DELETE] Stack trace:", error.stack);
      toast.error(`Erro ao excluir agendamento: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setDeleting(null); // Remover estado de deletando
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
      completed: "bg-blue-100 text-blue-700",
    };

    const labels = {
      pending: "Pendente",
      confirmed: "Confirmado",
      cancelled: "Cancelado",
      completed: "Concluído",
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getUrgencyBadge = (urgency: Urgency) => {
    const styles = {
      low: "bg-gray-100 text-gray-700",
      normal: "bg-blue-100 text-blue-700",
      high: "bg-orange-100 text-orange-700",
      urgent: "bg-red-100 text-red-700",
    };

    const labels = {
      low: "Baixa",
      normal: "Normal",
      high: "Alta",
      urgent: "Urgente",
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[urgency]}`}>
        {labels[urgency]}
      </span>
    );
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    thisMonth: appointments.filter((a) => {
      const aptDate = new Date(a.appointment_date);
      const now = new Date();
      return (
        aptDate.getMonth() === now.getMonth() &&
        aptDate.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
        <p className="text-gray-600 mt-2">
          Gerencie todos os agendamentos e acompanhe os leads
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pendentes</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Confirmados</p>
              <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Este Mês</p>
              <p className="text-3xl font-bold text-primary-600">{stats.thisMonth}</p>
            </div>
            <div className="bg-primary-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Todos os Status</option>
            <option value="pending">Pendentes</option>
            <option value="confirmed">Confirmados</option>
            <option value="cancelled">Cancelados</option>
            <option value="completed">Concluídos</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Todas as Datas</option>
            <option value="today">Hoje</option>
            <option value="week">Próximos 7 dias</option>
            <option value="month">Próximos 30 dias</option>
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Lista de Agendamentos ({appointments.length})
          </h2>
        </div>

        {appointments.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Nenhum agendamento encontrado</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {appointments.map((appointment) => {
              const appointmentDate = new Date(appointment.appointment_date);
              const isPast = appointmentDate < new Date();

              return (
                <div
                  key={appointment.id}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {appointment.service_name}
                        </h3>
                        {getStatusBadge(appointment.status)}
                        {getUrgencyBadge(appointment.urgency)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
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
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                          <strong>Observações:</strong> {appointment.notes}
                        </div>
                      )}

                      {appointment.documents_reminder && (
                        <div className="mt-2 p-2 bg-primary-50 rounded text-xs">
                          <strong className="text-primary-900">Documentos necessários:</strong>
                          <ul className="mt-1 space-y-1 text-primary-800">
                            {Array.isArray(appointment.documents_reminder) &&
                              appointment.documents_reminder
                                .filter((doc: any) => doc.required)
                                .slice(0, 3)
                                .map((doc: any, idx: number) => (
                                  <li key={idx}>• {doc.name}</li>
                                ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* Botão para verificar documentos */}
                      {appointment.status !== "cancelled" && (
                        <button
                          onClick={() => setVerifyingChecklist(appointment.id)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <ClipboardCheck className="w-4 h-4" />
                          Verificar Documentos
                        </button>
                      )}

                      {appointment.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(appointment.id, "confirmed")}
                            className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Confirmar
                          </button>
                          <button
                            onClick={async () => {
                              const confirmed = await dialog.confirm(
                                "Cancelar Agendamento",
                                "Tem certeza que deseja cancelar este agendamento?",
                                "danger"
                              );
                              if (confirmed) {
                                updateStatus(appointment.id, "cancelled");
                              }
                            }}
                            className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancelar
                          </button>
                        </>
                      )}

                      {appointment.status === "confirmed" && !isPast && (
                        <button
                          onClick={async () => {
                            const confirmed = await dialog.confirm(
                              "Concluir Agendamento",
                              "Marcar como concluído?",
                              "success"
                            );
                            if (confirmed) {
                              updateStatus(appointment.id, "completed");
                            }
                          }}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Concluir
                        </button>
                      )}

                      {isPast && appointment.status !== "completed" && (
                        <span className="px-3 py-1.5 bg-gray-200 text-gray-600 rounded text-sm text-center">
                          Passado
                        </span>
                      )}

                      {/* Botão para excluir permanentemente - sempre visível */}
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('[DELETE] ========================================');
                          console.log('[DELETE] Botão clicado para agendamento:', appointment.id);
                          console.log('[DELETE] Nome:', appointment.name);
                          console.log('[DELETE] ========================================');

                          const confirmed = await dialog.confirm(
                            "Excluir Agendamento",
                            `Tem CERTEZA ABSOLUTA que deseja EXCLUIR PERMANENTEMENTE este agendamento?\n\nCliente: ${appointment.name}\nServiço: ${appointment.service_name}\n\nEsta ação não pode ser desfeita!`,
                            "danger"
                          );

                          console.log('[DELETE] Confirmação:', confirmed);

                          if (confirmed) {
                            console.log('[DELETE] Usuário confirmou exclusão, chamando deleteAppointment...');
                            deleteAppointment(appointment.id);
                          } else {
                            console.log('[DELETE] Usuário cancelou exclusão');
                          }
                        }}
                        disabled={deleting === appointment.id}
                        className={`px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-2 mt-2 ${deleting === appointment.id
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                          }`}
                        title="Excluir permanentemente do banco de dados"
                        type="button"
                      >
                        {deleting === appointment.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Excluindo...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <dialog.DialogRenderer />
      <toast.ToastRenderer />

      {/* Modal de Verificação de Documentos */}
      {verifyingChecklist && (
        <ChecklistVerification
          appointmentId={verifyingChecklist}
          serviceSlug={appointments.find(a => a.id === verifyingChecklist)?.service_slug || ""}
          clientName={appointments.find(a => a.id === verifyingChecklist)?.name || ""}
          onClose={() => {
            setVerifyingChecklist(null);
            fetchAppointments(); // Recarregar para atualizar status
          }}
          onUpdate={() => {
            fetchAppointments(); // Recarregar após atualização
          }}
        />
      )}
    </div>
  );
}

