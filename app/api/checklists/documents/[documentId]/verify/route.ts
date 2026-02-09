import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/server";

/**
 * PUT /api/checklists/documents/[documentId]/verify
 * Atualiza verificação presencial de um documento
 */
export async function PUT(
  request: Request,
  { params }: { params: { documentId: string } }
) {
  try {
    const { documentId } = params;
    const body = await request.json();
    const { verified_by_staff, staff_notes } = body;

    // Verificar se o documento existe
    const { data: document, error: fetchError } = await (supabase.from("checklist_documents") as any)
      .select("id, checklist_id")
      .eq("id", documentId)
      .maybeSingle();

    if (fetchError || !document) {
      return NextResponse.json(
        { error: "Documento não encontrado" },
        { status: 404 }
      );
    }

    // Atualizar documento
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (verified_by_staff !== undefined) {
      updateData.verified_by_staff = verified_by_staff;
      updateData.verified_at = verified_by_staff ? new Date().toISOString() : null;
    }

    if (staff_notes !== undefined) {
      updateData.staff_notes = staff_notes || null;
    }

    const { error: updateError } = await (supabase.from("checklist_documents") as any)
      .update(updateData)
      .eq("id", documentId);

    if (updateError) {
      console.error("Error updating document:", updateError);
      return NextResponse.json(
        { error: "Erro ao atualizar documento" },
        { status: 500 }
      );
    }

    // Atualizar status do checklist se todos os obrigatórios foram verificados
    const { data: checklistDocs } = await (supabase.from("checklist_documents") as any)
      .select("required, verified_by_staff")
      .eq("checklist_id", document.checklist_id);

    if (checklistDocs) {
      const allRequiredVerified = checklistDocs
        .filter((d) => d.required)
        .every((d) => d.verified_by_staff);

      if (allRequiredVerified) {
        await (supabase.from("document_checklists") as any)
          .update({
            status: "verified",
            verified_by_staff: true,
            verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", document.checklist_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in verify document API:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

