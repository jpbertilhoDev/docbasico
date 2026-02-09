/**
 * Geração de PDF do Checklist para envio via WhatsApp
 */

import { getServiceInfo } from "@/lib/services-documents";

interface ChecklistPDFOptions {
  serviceSlug: string;
  serviceName: string;
  clientName: string;
  appointmentDate: string;
  appointmentTime: string;
  documents: Array<{
    name: string;
    required: boolean;
    checked: boolean;
    description?: string;
  }>;
}

/**
 * Gera PDF do checklist usando html2canvas e jsPDF
 */
export async function generateChecklistPDF(options: ChecklistPDFOptions): Promise<Buffer> {
  try {
    const { default: html2canvas } = await import("html2canvas");
    const { default: jsPDF } = await import("jspdf");

    // Criar HTML temporário para o PDF
    const htmlContent = createChecklistHTML(options);
    
    // Criar elemento temporário
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.width = "210mm"; // A4 width
    document.body.appendChild(tempDiv);

    // Gerar canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      width: 794, // A4 width in pixels (210mm at 96dpi)
    });

    // Remover elemento temporário
    document.body.removeChild(tempDiv);

    // Criar PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Converter para Buffer
    const pdfBlob = pdf.output("arraybuffer");
    return Buffer.from(pdfBlob);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}

/**
 * Cria HTML do checklist para PDF
 */
function createChecklistHTML(options: ChecklistPDFOptions): string {
  const { serviceName, clientName, appointmentDate, appointmentTime, documents } = options;
  
  const checkedCount = documents.filter(d => d.checked).length;
  const requiredCount = documents.filter(d => d.required).length;
  const checkedRequired = documents.filter(d => d.required && d.checked).length;
  const progress = documents.length > 0 ? Math.round((checkedCount / documents.length) * 100) : 0;

  const dateStr = new Date(appointmentDate).toLocaleDateString("pt-PT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #2563eb;
          margin: 0;
          font-size: 24px;
        }
        .info {
          background: #f3f4f6;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .info p {
          margin: 5px 0;
        }
        .progress {
          background: #e5e7eb;
          border-radius: 10px;
          height: 20px;
          margin: 15px 0;
          overflow: hidden;
        }
        .progress-bar {
          background: #2563eb;
          height: 100%;
          width: ${progress}%;
          transition: width 0.3s;
        }
        .documents {
          margin-top: 20px;
        }
        .document {
          padding: 12px;
          margin: 8px 0;
          border-radius: 6px;
          border-left: 4px solid #d1d5db;
        }
        .document.required {
          background: #fef2f2;
          border-left-color: #ef4444;
        }
        .document.checked {
          background: #f0fdf4;
          border-left-color: #22c55e;
        }
        .document.required.checked {
          background: #f0fdf4;
          border-left-color: #22c55e;
        }
        .document-name {
          font-weight: bold;
          margin-bottom: 4px;
        }
        .document-status {
          font-size: 12px;
          color: #6b7280;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 Checklist de Documentos</h1>
        <p style="margin-top: 10px; color: #6b7280;">${serviceName}</p>
      </div>

      <div class="info">
        <p><strong>Cliente:</strong> ${clientName}</p>
        <p><strong>Data da Consulta:</strong> ${dateStr}</p>
        <p><strong>Hora:</strong> ${appointmentTime}</p>
      </div>

      <div>
        <p style="margin-bottom: 5px;"><strong>Progresso:</strong> ${checkedCount} de ${documents.length} documentos (${progress}%)</p>
        <div class="progress">
          <div class="progress-bar"></div>
        </div>
        <p style="font-size: 12px; color: #6b7280; margin-top: 5px;">
          Documentos obrigatórios: ${checkedRequired} de ${requiredCount}
        </p>
      </div>

      <div class="documents">
        <h2 style="font-size: 18px; margin-bottom: 15px;">Documentos Necessários</h2>
        ${documents.map((doc, index) => `
          <div class="document ${doc.required ? 'required' : ''} ${doc.checked ? 'checked' : ''}">
            <div class="document-name">
              ${doc.checked ? '✅' : '☐'} ${doc.name}
              ${doc.required ? '<span style="background: #ef4444; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-left: 8px;">OBRIGATÓRIO</span>' : '<span style="background: #6b7280; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px; margin-left: 8px;">OPCIONAL</span>'}
            </div>
            ${doc.description ? `<div class="document-status">${doc.description}</div>` : ''}
            ${doc.checked ? '<div class="document-status" style="color: #22c55e; margin-top: 4px;">✓ Marcado como obtido</div>' : ''}
          </div>
        `).join('')}
      </div>

      <div class="footer">
        <p>Gerado em ${new Date().toLocaleDateString("pt-PT")} às ${new Date().toLocaleTimeString("pt-PT")}</p>
        <p>Doc Basico - Serviços Burocráticos para Imigrantes</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Gera PDF do checklist no servidor (sem DOM)
 * Usa uma abordagem diferente para funcionar em API routes
 */
export async function generateChecklistPDFServer(options: ChecklistPDFOptions): Promise<Buffer> {
  try {
    const { default: jsPDF } = await import("jspdf");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Cores profissionais
    const primaryColor = [37, 99, 235]; // Azul corporativo
    const grayColor = [107, 114, 128]; // Cinza para textos secundários
    const redColor = [220, 38, 38]; // Vermelho para obrigatório

    // ===== CABEÇALHO PROFISSIONAL =====
    // Logo/Nome da empresa
    pdf.setFontSize(24);
    pdf.setFont(undefined, "bold");
    pdf.setTextColor(37, 99, 235);
    pdf.text("Doc Basico", 15, yPosition);
    
    // Linha divisória
    pdf.setDrawColor(37, 99, 235);
    pdf.setLineWidth(0.5);
    pdf.line(15, yPosition + 3, pageWidth - 15, yPosition + 3);
    
    yPosition += 10;
    
    // Título do documento
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text("CHECKLIST DE DOCUMENTOS", 15, yPosition);
    
    yPosition += 3;
    pdf.setFontSize(11);
    pdf.setTextColor(...grayColor);
    pdf.text(options.serviceName, 15, yPosition);
    
    yPosition += 12;

    // ===== INFORMAÇÕES DO CLIENTE =====
    // Box de informações
    pdf.setFillColor(248, 250, 252); // Cinza muito claro
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(15, yPosition, pageWidth - 30, 25, 2, 2, "FD");
    
    yPosition += 6;
    
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, "bold");
    pdf.text("Cliente:", 20, yPosition);
    pdf.setFont(undefined, "normal");
    pdf.text(options.clientName, 38, yPosition);
    
    yPosition += 6;
    
    const dateStr = new Date(options.appointmentDate).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    
    pdf.setFont(undefined, "bold");
    pdf.text("Data da Consulta:", 20, yPosition);
    pdf.setFont(undefined, "normal");
    pdf.text(`${dateStr} as ${options.appointmentTime}`, 53, yPosition);
    
    yPosition += 6;
    
    const totalDocs = options.documents.length;
    const requiredDocs = options.documents.filter(d => d.required).length;
    
    pdf.setFont(undefined, "bold");
    pdf.text("Total de Documentos:", 20, yPosition);
    pdf.setFont(undefined, "normal");
    pdf.text(`${totalDocs} (${requiredDocs} obrigatorios)`, 58, yPosition);
    
    yPosition += 12;

    // ===== AVISO IMPORTANTE =====
    pdf.setFillColor(254, 242, 242); // Vermelho muito claro
    pdf.setDrawColor(220, 38, 38);
    pdf.roundedRect(15, yPosition, pageWidth - 30, 12, 2, 2, "FD");
    
    yPosition += 4;
    
    pdf.setFontSize(9);
    pdf.setFont(undefined, "bold");
    pdf.setTextColor(220, 38, 38);
    pdf.text("IMPORTANTE:", 20, yPosition);
    pdf.setFont(undefined, "normal");
    pdf.text("Traga os documentos ORIGINAIS e copias autenticadas quando aplicavel.", 42, yPosition);
    
    yPosition += 16;

    // ===== LISTA DE DOCUMENTOS =====
    pdf.setFontSize(12);
    pdf.setFont(undefined, "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text("DOCUMENTOS NECESSARIOS", 15, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont(undefined, "normal");
    pdf.setTextColor(0, 0, 0);

    let docNumber = 1;
    for (const doc of options.documents) {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 25;
        
        // Repetir título na nova página
        pdf.setFontSize(12);
        pdf.setFont(undefined, "bold");
        pdf.text("DOCUMENTOS NECESSARIOS (continuacao)", 15, yPosition);
        yPosition += 10;
        pdf.setFontSize(10);
        pdf.setFont(undefined, "normal");
      }

      // Box para cada documento
      const boxHeight = doc.description ? 18 : 12;
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(15, yPosition - 3, pageWidth - 30, boxHeight, 1, 1, "D");
      
      // Número do documento
      pdf.setFillColor(37, 99, 235);
      pdf.circle(20, yPosition + 2, 3, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.text(docNumber.toString(), 20, yPosition + 2.5, { align: "center" });
      
      // Nome do documento
      pdf.setFontSize(10);
      pdf.setFont(undefined, "bold");
      pdf.setTextColor(0, 0, 0);
      const docName = doc.name;
      pdf.text(docName, 28, yPosition + 2);
      
      // Badge obrigatório/opcional
      const badgeX = pageWidth - 35;
      if (doc.required) {
        pdf.setFillColor(220, 38, 38);
        pdf.roundedRect(badgeX, yPosition - 1, 18, 6, 1, 1, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(7);
        pdf.setFont(undefined, "bold");
        pdf.text("OBRIGATORIO", badgeX + 9, yPosition + 2.5, { align: "center" });
      } else {
        pdf.setFillColor(148, 163, 184);
        pdf.roundedRect(badgeX, yPosition - 1, 16, 6, 1, 1, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(7);
        pdf.setFont(undefined, "bold");
        pdf.text("OPCIONAL", badgeX + 8, yPosition + 2.5, { align: "center" });
      }
      
      yPosition += 6;

      // Descrição (se existir)
      if (doc.description) {
        pdf.setFontSize(8);
        pdf.setFont(undefined, "normal");
        pdf.setTextColor(...grayColor);
        const lines = pdf.splitTextToSize(doc.description, pageWidth - 45);
        pdf.text(lines, 28, yPosition);
        yPosition += lines.length * 3.5;
      }

      yPosition += boxHeight - 3;
      docNumber++;
    }

    // ===== FOOTER PROFISSIONAL =====
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      // Linha divisória no footer
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.3);
      pdf.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
      
      // Texto do footer
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.setFont(undefined, "normal");
      
      // Esquerda: Data de geração
      pdf.text(
        `Gerado em ${new Date().toLocaleDateString("pt-PT")} as ${new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" })}`,
        15,
        pageHeight - 10
      );
      
      // Centro: Nome da empresa
      pdf.setFont(undefined, "bold");
      pdf.text("Doc Basico", pageWidth / 2, pageHeight - 10, { align: "center" });
      
      // Direita: Página
      pdf.setFont(undefined, "normal");
      pdf.text(`Pagina ${i} de ${totalPages}`, pageWidth - 15, pageHeight - 10, { align: "right" });
    }

    // Converter para Buffer
    const pdfBlob = pdf.output("arraybuffer");
    return Buffer.from(pdfBlob);
  } catch (error) {
    console.error("Error generating PDF on server:", error);
    throw error;
  }
}

