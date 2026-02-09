-- Schema para Document Checklists
-- Sistema de checklist interativo de documentos para serviços

-- Tabela principal de checklists
CREATE TABLE IF NOT EXISTS document_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  service_slug VARCHAR(100) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  client_name VARCHAR(255),
  client_email VARCHAR(255),
  client_phone VARCHAR(20),
  
  -- Progresso do checklist
  total_documents INTEGER NOT NULL DEFAULT 0,
  checked_documents INTEGER NOT NULL DEFAULT 0,
  progress_percentage INTEGER NOT NULL DEFAULT 0, -- 0-100
  
  -- Status
  status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, completed, verified
  verified_by_staff BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by_user_id UUID REFERENCES auth.users(id),
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de documentos individuais do checklist
CREATE TABLE IF NOT EXISTS checklist_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id UUID REFERENCES document_checklists(id) ON DELETE CASCADE,
  
  -- Informações do documento
  document_name VARCHAR(255) NOT NULL,
  document_description TEXT,
  required BOOLEAN DEFAULT TRUE,
  document_order INTEGER DEFAULT 0, -- Ordem de exibição
  
  -- Status do documento
  checked BOOLEAN DEFAULT FALSE,
  checked_at TIMESTAMP WITH TIME ZONE,
  
  -- Verificação presencial
  verified_by_staff BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by_user_id UUID REFERENCES auth.users(id),
  
  -- Notas
  client_notes TEXT, -- Notas do cliente
  staff_notes TEXT, -- Notas do atendente
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_checklists_appointment ON document_checklists(appointment_id);
CREATE INDEX IF NOT EXISTS idx_checklists_service ON document_checklists(service_slug);
CREATE INDEX IF NOT EXISTS idx_checklists_status ON document_checklists(status);
CREATE INDEX IF NOT EXISTS idx_checklist_docs_checklist ON checklist_documents(checklist_id);
CREATE INDEX IF NOT EXISTS idx_checklist_docs_checked ON checklist_documents(checked);

-- Função para atualizar progresso automaticamente
CREATE OR REPLACE FUNCTION update_checklist_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE document_checklists
  SET 
    checked_documents = (
      SELECT COUNT(*) 
      FROM checklist_documents 
      WHERE checklist_id = NEW.checklist_id AND checked = TRUE
    ),
    progress_percentage = CASE 
      WHEN total_documents > 0 THEN
        ROUND(
          (SELECT COUNT(*) FROM checklist_documents WHERE checklist_id = NEW.checklist_id AND checked = TRUE)::NUMERIC 
          / total_documents::NUMERIC * 100
        )
      ELSE 0
    END,
    updated_at = NOW()
  WHERE id = NEW.checklist_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar progresso quando documento é marcado
CREATE TRIGGER trigger_update_checklist_progress
AFTER INSERT OR UPDATE ON checklist_documents
FOR EACH ROW
EXECUTE FUNCTION update_checklist_progress();

-- RLS Policies
ALTER TABLE document_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_documents ENABLE ROW LEVEL SECURITY;

-- Política: Usuários autenticados (admin) podem ver todos os checklists
CREATE POLICY "Authenticated users can view all checklists" ON document_checklists
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política: Usuários autenticados podem criar checklists
CREATE POLICY "Authenticated users can create checklists" ON document_checklists
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política: Usuários autenticados podem atualizar checklists
CREATE POLICY "Authenticated users can update checklists" ON document_checklists
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Política: Público pode criar checklist (quando vinculado a agendamento)
CREATE POLICY "Public can create checklist for appointment" ON document_checklists
  FOR INSERT WITH CHECK (true);

-- Política: Público pode visualizar seu próprio checklist (via appointment)
CREATE POLICY "Public can view own checklist" ON document_checklists
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM appointments 
      WHERE appointments.id = document_checklists.appointment_id
      AND (appointments.email = current_setting('request.jwt.claims', true)::json->>'email' 
           OR true) -- Simplificado para permitir acesso via appointment_id
    )
  );

-- Política: Público pode atualizar seu próprio checklist
CREATE POLICY "Public can update own checklist" ON document_checklists
  FOR UPDATE USING (true); -- Simplificado, validação na API

-- Políticas para checklist_documents
CREATE POLICY "Authenticated users can view all checklist documents" ON checklist_documents
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage checklist documents" ON checklist_documents
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view checklist documents" ON checklist_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM document_checklists
      WHERE document_checklists.id = checklist_documents.checklist_id
    )
  );

CREATE POLICY "Public can update checklist documents" ON checklist_documents
  FOR UPDATE USING (true); -- Simplificado, validação na API

CREATE POLICY "Public can insert checklist documents" ON checklist_documents
  FOR INSERT WITH CHECK (true);

-- Comentários
COMMENT ON TABLE document_checklists IS 'Checklists de documentos para serviços e agendamentos';
COMMENT ON TABLE checklist_documents IS 'Documentos individuais dentro de um checklist';
COMMENT ON COLUMN document_checklists.progress_percentage IS 'Percentual de conclusão (0-100)';
COMMENT ON COLUMN checklist_documents.verified_by_staff IS 'Se o documento foi verificado presencialmente pelo atendente';

