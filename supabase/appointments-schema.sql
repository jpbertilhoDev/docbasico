-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL, -- Aceita números internacionais (até 15 dígitos + código de país)
  service_slug VARCHAR(255) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  appointment_time VARCHAR(10) NOT NULL,
  urgency VARCHAR(20) DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  documents_reminder JSONB, -- Lista de documentos necessários
  preparation_notes TEXT, -- Notas de preparação geradas pela IA
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create available_slots table (horários disponíveis)
CREATE TABLE IF NOT EXISTS available_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  time_slot VARCHAR(10) NOT NULL, -- Format: "09:00", "10:00", etc.
  is_available BOOLEAN DEFAULT true,
  max_appointments INTEGER DEFAULT 1,
  current_appointments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, time_slot)
);

-- Create index for appointments
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_service ON appointments(service_slug);
CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(email);

-- Create index for available_slots
CREATE INDEX IF NOT EXISTS idx_slots_date ON available_slots(date);
CREATE INDEX IF NOT EXISTS idx_slots_available ON available_slots(is_available, date);

-- Create trigger for appointments updated_at
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for available_slots updated_at
CREATE TRIGGER update_slots_updated_at BEFORE UPDATE ON available_slots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_slots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for appointments
-- Public can create appointments (formulário do site)
CREATE POLICY "Public can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

-- Authenticated users (admin) can view all appointments
CREATE POLICY "Authenticated users can view all appointments" ON appointments
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users (admin) can update appointments
CREATE POLICY "Authenticated users can update appointments" ON appointments
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users (admin) can delete appointments
CREATE POLICY "Authenticated users can delete appointments" ON appointments
  FOR DELETE USING (auth.role() = 'authenticated');

-- RLS Policies for available_slots (public can read)
CREATE POLICY "Public can view available slots" ON available_slots
  FOR SELECT USING (is_available = true AND date >= CURRENT_DATE);

-- Insert default available slots for next 30 days
-- Horários de trabalho: 09:00 às 18:00, de segunda a sexta
DO $$
DECLARE
  current_date DATE := CURRENT_DATE;
  end_date DATE := CURRENT_DATE + INTERVAL '30 days';
  slot_time TIME;
  time_slots TIME[] := ARRAY[
    '09:00'::TIME, '10:00'::TIME, '11:00'::TIME, '14:00'::TIME, 
    '15:00'::TIME, '16:00'::TIME, '17:00'::TIME
  ];
  check_date DATE;
  day_of_week INTEGER;
BEGIN
  FOR check_date IN SELECT generate_series(current_date, end_date, '1 day'::interval)::DATE
  LOOP
    day_of_week := EXTRACT(DOW FROM check_date);
    -- Apenas segunda a sexta (1-5)
    IF day_of_week BETWEEN 1 AND 5 THEN
      FOREACH slot_time IN ARRAY time_slots
      LOOP
        -- Formatar hora como HH:MM (sem segundos)
        INSERT INTO available_slots (date, time_slot, is_available)
        VALUES (check_date, TO_CHAR(slot_time, 'HH24:MI'), true)
        ON CONFLICT (date, time_slot) DO NOTHING;
      END LOOP;
    END IF;
  END LOOP;
END $$;

