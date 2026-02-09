import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";
import { getServiceInfo } from "@/lib/services-documents";

/**
 * GET /api/checklists/[appointmentId]
 * Busca checklist de um agendamento
 */
export async function GET(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  try {
    const { appointmentId } = params;

    // Buscar checklist
    const { data: checklist, error: checklistError } = await (supabase.from("document_checklists") as any)
      .select("*")
      .eq("appointment_id", appointmentId)
      .maybeSingle();

    if (checklistError) {
      console.error("Error fetching checklist:", checklistError);
      return NextResponse.json(
        { error: "Erro ao buscar checklist" },
        { status: 500 }
      );
    }

    // Se não existe, retornar estrutura vazia
    if (!checklist) {
      return NextResponse.json({
        checklist: null,
        documents: [],
      });
    }

    // Buscar documentos do checklist
    const { data: documents, error: documentsError } = await (supabase.from("checklist_documents") as any)
      .select("*")
      .eq("checklist_id", checklist.id)
      .order("document_order", { ascending: true });

    if (documentsError) {
      console.error("Error fetching documents:", documentsError);
      return NextResponse.json(
        { error: "Erro ao buscar documentos" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checklist,
      documents: documents || [],
    });
  } catch (error: any) {
    console.error("Error in GET checklist API:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/checklists/[appointmentId]
 * Atualiza checklist de um agendamento
 */
export async function PUT(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  try {
    const { appointmentId } = params;
    const body = await request.json();
    const { documents } = body;

    if (!documents || !Array.isArray(documents)) {
      return NextResponse.json(
        { error: "Lista de documentos é obrigatória" },
        { status: 400 }
      );
    }

    // Buscar agendamento para obter informações do serviço
    const { data: appointment, error: appointmentError } = await (supabase.from("appointments") as any)
      .select("service_slug, service_name, name, email, phone")
      .eq("id", appointmentId)
      .maybeSingle();

    if (appointmentError || !appointment) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    // Buscar ou criar checklist
    let { data: checklist, error: checklistError } = await (supabase.from("document_checklists") as any)
      .select("*")
      .eq("appointment_id", appointmentId)
      .maybeSingle();

    if (checklistError && checklistError.code !== "PGRST116") {
      console.error("Error fetching checklist:", checklistError);
      return NextResponse.json(
        { error: "Erro ao buscar checklist" },
        { status: 500 }
      );
    }

    // Se não existe, criar
    if (!checklist) {
      const serviceInfo = getServiceInfo(appointment.service_slug);
      const totalDocs = documents.length;
      const checkedDocs = documents.filter((d: any) => d.checked).length;
      const progress = totalDocs > 0 ? Math.round((checkedDocs / totalDocs) * 100) : 0;

      const { data: newChecklist, error: createError } = await (supabase.from("document_checklists") as any)
        .insert({
          appointment_id: appointmentId,
          service_slug: appointment.service_slug,
          service_name: appointment.service_name,
          client_name: appointment.name,
          client_email: appointment.email,
          client_phone: appointment.phone,
          total_documents: totalDocs,
          checked_documents: checkedDocs,
          progress_percentage: progress,
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating checklist:", createError);
        return NextResponse.json(
          { error: "Erro ao criar checklist" },
          { status: 500 }
        );
      }

      checklist = newChecklist;
    }

    // Atualizar documentos
    // Primeiro, deletar documentos existentes
    const { error: deleteError } = await (supabase.from("checklist_documents") as any)
      .delete()
      .eq("checklist_id", checklist.id);

    if (deleteError) {
      console.error("Error deleting documents:", deleteError);
    }

    // Inserir novos documentos
    const documentsToInsert = documents.map((doc: any, index: number) => ({
      checklist_id: checklist.id,
      document_name: doc.name,
      document_description: doc.description || null,
      required: doc.required !== false,
      document_order: index,
      checked: doc.checked || false,
      checked_at: doc.checked ? new Date().toISOString() : null,
      client_notes: doc.clientNotes || null,
    }));

    const { error: insertError } = await (supabase.from("checklist_documents") as any)
      .insert(documentsToInsert);

    if (insertError) {
      console.error("Error inserting documents:", insertError);
      return NextResponse.json(
        { error: "Erro ao salvar documentos" },
        { status: 500 }
      );
    }

    // Atualizar progresso do checklist
    const totalDocs = documents.length;
    const checkedDocs = documents.filter((d: any) => d.checked).length;
    const progress = totalDocs > 0 ? Math.round((checkedDocs / totalDocs) * 100) : 0;

    const { error: updateError } = await (supabase.from("document_checklists") as any)
      .update({
        checked_documents: checkedDocs,
        progress_percentage: progress,
        total_documents: totalDocs,
        updated_at: new Date().toISOString(),
      })
      .eq("id", checklist.id);

    if (updateError) {
      console.error("Error updating checklist:", updateError);
    }

    return NextResponse.json({
      success: true,
      checklist: {
        ...checklist,
        checked_documents: checkedDocs,
        progress_percentage: progress,
        total_documents: totalDocs,
      },
    });
  } catch (error: any) {
    console.error("Error in PUT checklist API:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/checklists/[appointmentId]
 * Cria checklist inicial para um agendamento
 */
export async function POST(
  request: Request,
  { params }: { params: { appointmentId: string } }
) {
  try {
    const { appointmentId } = params;

    // Buscar agendamento
    const { data: appointment, error: appointmentError } = await (supabase.from("appointments") as any)
      .select("service_slug, service_name, name, email, phone")
      .eq("id", appointmentId)
      .maybeSingle();

    if (appointmentError || !appointment) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se já existe checklist
    const { data: existing } = await (supabase.from("document_checklists") as any)
      .select("id")
      .eq("appointment_id", appointmentId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Checklist já existe para este agendamento" },
        { status: 400 }
      );
    }

    // Obter documentos do serviço
    const serviceInfo = getServiceInfo(appointment.service_slug);
    if (!serviceInfo) {
      return NextResponse.json(
        { error: "Serviço não encontrado" },
        { status: 404 }
      );
    }

    // Criar checklist
    const totalDocs = serviceInfo.documents.length;
    const { data: checklist, error: createError } = await (supabase.from("document_checklists") as any)
      .insert({
        appointment_id: appointmentId,
        service_slug: appointment.service_slug,
        service_name: appointment.service_name,
        client_name: appointment.name,
        client_email: appointment.email,
        client_phone: appointment.phone,
        total_documents: totalDocs,
        checked_documents: 0,
        progress_percentage: 0,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating checklist:", createError);
      return NextResponse.json(
        { error: "Erro ao criar checklist" },
        { status: 500 }
      );
    }

    // Criar documentos
    const documentsToInsert = serviceInfo.documents.map((doc, index) => ({
      checklist_id: checklist.id,
      document_name: doc.name,
      document_description: doc.description || null,
      required: doc.required !== false,
      document_order: index,
      checked: false,
    }));

    const { error: insertError } = await (supabase.from("checklist_documents") as any)
      .insert(documentsToInsert);

    if (insertError) {
      console.error("Error inserting documents:", insertError);
      return NextResponse.json(
        { error: "Erro ao criar documentos" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      checklist,
    });
  } catch (error: any) {
    console.error("Error in POST checklist API:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

