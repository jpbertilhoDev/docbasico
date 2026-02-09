"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, FileText, AlertCircle, X, Check, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistDocument {
  id: string;
  document_name: string;
  document_description?: string;
  required: boolean;
  checked: boolean;
  verified_by_staff: boolean;
  staff_notes?: string;
  client_notes?: string;
}

interface ChecklistVerificationProps {
  appointmentId: string;
  serviceSlug: string;
  clientName: string;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function ChecklistVerification({
  appointmentId,
  serviceSlug,
  clientName,
  onClose,
  onUpdate,
}: ChecklistVerificationProps) {
  const [documents, setDocuments] = useState<ChecklistDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    loadChecklist();
  }, [appointmentId]);

  const loadChecklist = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/checklists/${appointmentId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.documents) {
          setDocuments(data.documents);
          // Inicializar notas
          const initialNotes: Record<string, string> = {};
          data.documents.forEach((doc: ChecklistDocument) => {
            if (doc.staff_notes) {
              initialNotes[doc.id] = doc.staff_notes;
            }
          });
          setNotes(initialNotes);
        }
      }
    } catch (error) {
      console.error("Error loading checklist:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (documentId: string) => {
    if (saving) return;

    const updated = documents.map((doc) =>
      doc.id === documentId
        ? {
            ...doc,
            verified_by_staff: !doc.verified_by_staff,
            verified_at: !doc.verified_by_staff ? new Date().toISOString() : undefined,
          }
        : doc
    );

    setDocuments(updated);
    await saveVerification(documentId, !documents.find((d) => d.id === documentId)?.verified_by_staff);
  };

  const saveVerification = async (documentId: string, verified: boolean) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/checklists/documents/${documentId}/verify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verified_by_staff: verified,
          staff_notes: notes[documentId] || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar verificação");
      }

      onUpdate?.();
    } catch (error) {
      console.error("Error saving verification:", error);
    } finally {
      setSaving(false);
    }
  };

  const saveNotes = async (documentId: string) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/checklists/documents/${documentId}/verify`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staff_notes: notes[documentId] || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar notas");
      }
    } catch (error) {
      console.error("Error saving notes:", error);
    } finally {
      setSaving(false);
    }
  };

  const verifiedCount = documents.filter((d) => d.verified_by_staff).length;
  const requiredCount = documents.filter((d) => d.required).length;
  const verifiedRequired = documents.filter((d) => d.required && d.verified_by_staff).length;
  const allRequiredVerified = documents.filter((d) => d.required).every((d) => d.verified_by_staff);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Verificação de Documentos</h2>
            <p className="text-sm text-gray-600 mt-1">Cliente: {clientName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Documentos verificados: {verifiedCount} de {documents.length}
            </span>
            <span className="text-sm font-bold text-primary-600">
              {requiredCount > 0 ? `${verifiedRequired}/${requiredCount} obrigatórios` : ""}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                allRequiredVerified
                  ? "bg-green-500"
                  : verifiedCount > 0
                  ? "bg-primary-500"
                  : "bg-gray-300"
              )}
              style={{
                width: `${documents.length > 0 ? (verifiedCount / documents.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Documents List */}
        <div className="p-6 space-y-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={cn(
                "border rounded-lg p-4 transition-all",
                doc.verified_by_staff
                  ? "bg-green-50 border-green-200"
                  : doc.required
                  ? "bg-red-50 border-red-200"
                  : "bg-gray-50 border-gray-200"
              )}
            >
              <div className="flex items-start gap-4">
                {/* Verification Button */}
                <button
                  onClick={() => toggleVerification(doc.id)}
                  disabled={saving}
                  className={cn(
                    "flex-shrink-0 mt-0.5 transition-all",
                    saving ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"
                  )}
                >
                  {doc.verified_by_staff ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </button>

                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4
                          className={cn(
                            "font-semibold",
                            doc.verified_by_staff ? "text-green-800" : "text-gray-900"
                          )}
                        >
                          {doc.document_name}
                        </h4>
                        {doc.required && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                            Obrigatório
                          </span>
                        )}
                        {doc.verified_by_staff && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Verificado
                          </span>
                        )}
                      </div>
                      {doc.document_description && (
                        <p className="text-sm text-gray-600 mb-2">{doc.document_description}</p>
                      )}
                      {doc.client_notes && (
                        <p className="text-xs text-blue-600 mb-2">
                          <strong>Nota do cliente:</strong> {doc.client_notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Staff Notes */}
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Notas do atendente:
                    </label>
                    <textarea
                      value={notes[doc.id] || ""}
                      onChange={(e) => {
                        setNotes({ ...notes, [doc.id]: e.target.value });
                      }}
                      onBlur={() => saveNotes(doc.id)}
                      placeholder="Adicione notas sobre este documento..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {allRequiredVerified ? (
              <span className="text-green-600 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Todos os documentos obrigatórios foram verificados
              </span>
            ) : (
              <span className="text-orange-600 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Faltam {requiredCount - verifiedRequired} documento(s) obrigatório(s)
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

