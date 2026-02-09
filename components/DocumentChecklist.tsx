"use client";

import { useState, useEffect, memo } from "react";
import { CheckCircle2, Circle, FileText, AlertCircle, Download, Printer, Info, Check } from "lucide-react";
import { getServiceInfo, type ServiceDocument } from "@/lib/services-documents";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/useToast";

interface DocumentChecklistProps {
  serviceSlug: string;
  appointmentId?: string;
  readonly?: boolean; // Para visualização no admin
  onProgressChange?: (progress: number) => void;
  onComplete?: () => void;
}

interface ChecklistDocument extends ServiceDocument {
  checked: boolean;
  checkedAt?: string;
  verifiedByStaff?: boolean;
  clientNotes?: string;
  staffNotes?: string;
}

const DocumentChecklist = memo(function DocumentChecklist({
  serviceSlug,
  appointmentId,
  readonly = false,
  onProgressChange,
  onComplete,
}: DocumentChecklistProps) {
  const serviceInfo = getServiceInfo(serviceSlug);
  const [documents, setDocuments] = useState<ChecklistDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  // Inicializar documentos do serviço
  useEffect(() => {
    if (serviceInfo) {
      const initialDocs: ChecklistDocument[] = serviceInfo.documents.map((doc) => ({
        ...doc,
        checked: false,
      }));
      setDocuments(initialDocs);
    }
  }, [serviceInfo]);

  // Carregar checklist salvo se houver appointmentId
  useEffect(() => {
    if (appointmentId) {
      loadChecklist();
    }
  }, [appointmentId]);

  const loadChecklist = async () => {
    if (!appointmentId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/checklists/${appointmentId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.checklist && data.documents) {
          setDocuments(data.documents);
          const progress = calculateProgress(data.documents);
          onProgressChange?.(progress);
        }
      }
    } catch (error) {
      console.error("Error loading checklist:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (docs: ChecklistDocument[]): number => {
    if (docs.length === 0) return 0;
    const checked = docs.filter((d) => d.checked).length;
    return Math.round((checked / docs.length) * 100);
  };

  const toggleDocument = async (index: number) => {
    if (readonly || saving) return;

    const updated = [...documents];
    updated[index].checked = !updated[index].checked;
    updated[index].checkedAt = updated[index].checked
      ? new Date().toISOString()
      : undefined;

    setDocuments(updated);
    const progress = calculateProgress(updated);
    onProgressChange?.(progress);

    // Salvar automaticamente
    if (appointmentId) {
      await saveChecklist(updated);
    }

    // Verificar se todos os obrigatórios estão marcados
    const allRequiredChecked = updated
      .filter((d) => d.required)
      .every((d) => d.checked);
    
    if (allRequiredChecked && onComplete) {
      onComplete();
    }
  };

  const saveChecklist = async (docs: ChecklistDocument[]) => {
    if (!appointmentId) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/checklists/${appointmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documents: docs.map((doc) => ({
            name: doc.name,
            description: doc.description,
            required: doc.required,
            checked: doc.checked,
            clientNotes: doc.clientNotes,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar checklist");
      }
    } catch (error) {
      console.error("Error saving checklist:", error);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    // Mostrar loading
    toast.success("Gerando PDF...");
    
    try {
      // Lazy load dos pacotes pesados apenas quando necessário
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf")
      ]);

      const element = document.getElementById(`checklist-${appointmentId || serviceSlug}`);
      if (!element) {
        toast.error("Erro ao gerar PDF");
        return;
      }

      // Criar canvas com otimizações
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reduzido de 2 para 1.5 (mais rápido)
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.85); // JPEG em vez de PNG (menor)
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `checklist-${serviceInfo?.name || serviceSlug}-${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(fileName);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Erro ao gerar PDF. Tente novamente.");
    }
  };

  if (!serviceInfo) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Serviço não encontrado</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const progress = calculateProgress(documents);
  const requiredDocs = documents.filter((d) => d.required);
  const checkedRequired = requiredDocs.filter((d) => d.checked).length;
  const allRequiredChecked = requiredDocs.every((d) => d.checked);

  return (
    <div id={`checklist-${appointmentId || serviceSlug}`} className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Checklist de Documentos
              </h3>
              <p className="text-sm text-gray-600">{serviceInfo.name}</p>
            </div>
          </div>
          {!readonly && (
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                title="Imprimir"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownloadPDF}
                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                title="Download PDF"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700 font-medium">
              Progresso: {checkedRequired} de {requiredDocs.length} documentos obrigatórios
            </span>
            <span className="text-primary-600 font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                allRequiredChecked
                  ? "bg-green-500"
                  : progress >= 50
                  ? "bg-primary-500"
                  : "bg-yellow-500"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="p-6">
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start gap-4 p-4 rounded-lg border transition-all",
                doc.checked
                  ? "bg-green-50 border-green-200"
                  : doc.required
                  ? "bg-red-50 border-red-200"
                  : "bg-gray-50 border-gray-200"
              )}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleDocument(index)}
                disabled={readonly || saving}
                className={cn(
                  "flex-shrink-0 mt-0.5 transition-all",
                  readonly || saving ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"
                )}
              >
                {doc.checked ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </button>

              {/* Document Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(
                        "font-semibold",
                        doc.checked ? "text-green-800 line-through" : "text-gray-900"
                      )}>
                        {doc.name}
                      </h4>
                      {doc.required && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                          Obrigatório
                        </span>
                      )}
                      {!doc.required && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                          Opcional
                        </span>
                      )}
                    </div>
                    {doc.description && (
                      <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                    )}
                    {doc.checked && doc.checkedAt && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Marcado em {new Date(doc.checkedAt).toLocaleDateString("pt-PT")}
                      </p>
                    )}
                    {doc.verifiedByStaff && (
                      <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verificado presencialmente
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        {!allRequiredChecked && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">💡 Dicas importantes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Traga todos os documentos originais e cópias autenticadas</li>
                  <li>Verifique a validade dos documentos antes de vir</li>
                  <li>Organize os documentos na ordem do checklist</li>
                  {serviceInfo.preparationNotes.length > 0 && (
                    <>
                      {serviceInfo.preparationNotes.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {allRequiredChecked && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-1">✅ Todos os documentos obrigatórios estão prontos!</p>
                <p>Você está preparado para a sua consulta. Não se esqueça de trazer todos os documentos originais.</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <toast.ToastRenderer />
    </div>
  );
});

export default DocumentChecklist;

