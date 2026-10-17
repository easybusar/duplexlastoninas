-- ================================================================
-- DUPLEX LAS TONINAS - ESQUEMA SUPABASE COMPLETO
-- ================================================================
-- Ejecutá este script en: Supabase Dashboard → SQL Editor → New Query → Run

-- 1. Eliminar tablas previas si existen (limpieza controlada)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 2. TABLA PROPIEDADES (ID como TEXT para 'duplex-1', 'depto-1', etc.)
CREATE TABLE properties (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  type            TEXT NOT NULL DEFAULT 'duplex',
  description     TEXT,
  capacity        INT NOT NULL DEFAULT 6,
  price_per_night NUMERIC(10,2) NOT NULL,
  seasonal_rates  JSONB DEFAULT '[]'::jsonb,
  images          TEXT[] DEFAULT '{}',
  amenities       TEXT[] DEFAULT '{}',
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA RESERVAS
CREATE TABLE bookings (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id     TEXT REFERENCES properties(id) ON DELETE RESTRICT,
  guest_name      TEXT NOT NULL,
  guest_phone     TEXT NOT NULL,
  guest_residence TEXT DEFAULT 'No especificado',
  guest_notes     TEXT,
  check_in        DATE NOT NULL,
  check_out       DATE NOT NULL,
  guests          INT NOT NULL DEFAULT 1,
  nights          INT GENERATED ALWAYS AS (check_out - check_in) STORED,
  total_amount    NUMERIC(10,2) NOT NULL,
  deposit_paid    NUMERIC(10,2) DEFAULT 0,
  payment_method  TEXT DEFAULT 'Transferencia',
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','confirmed','checked_in','checked_out','completed','cancelled')),
  source          TEXT DEFAULT 'web',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA PAGOS
CREATE TABLE payments (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id     UUID REFERENCES bookings(id) ON DELETE CASCADE,
  amount         NUMERIC(10,2) NOT NULL,
  type           TEXT NOT NULL DEFAULT 'deposit'
                 CHECK (type IN ('deposit','balance','full','refund')),
  method         TEXT NOT NULL DEFAULT 'transfer'
                 CHECK (method IN ('cash','transfer','mercadopago','card','other')),
  notes          TEXT,
  registered_by  TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 5. POLÍTICAS DE ACCESO PÚBLICO / RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "properties_all" ON properties FOR ALL USING (true);
CREATE POLICY "bookings_all" ON bookings FOR ALL USING (true);
CREATE POLICY "payments_all" ON payments FOR ALL USING (true);

-- 6. CARGA INICIAL DE LAS 5 UNIDADES CON FOTOS Y TARIFAS DE TEMPORADA
INSERT INTO properties (id, name, type, description, capacity, price_per_night, seasonal_rates, images, amenities) VALUES
(
  'duplex-1',
  'Dúplex 1',
  'duplex',
  'Luminoso dúplex de dos plantas completamente equipado en Calle 12 Nº 495. Zona de parrilla individual, cochera y a solo 400 metros de las playas amplias con escolleras.',
  6,
  45000,
  '[{"id":"rate-d1-ene","name":"Temporada Alta Enero","startDate":"2025-01-01","endDate":"2025-01-31","pricePerNight":70000},{"id":"rate-d1-feb","name":"Temporada Alta Febrero","startDate":"2025-02-01","endDate":"2025-02-28","pricePerNight":60000}]'::jsonb,
  ARRAY[
    '/fotos/FRENTE/DUPLEX1.jpg',
    '/fotos/DUPLEX/LT DUPLEX 13.jpg',
    '/fotos/DUPLEX/LT DUPLEX 14.jpg',
    '/fotos/DUPLEX/LT DUPLEX 8.jpg',
    '/fotos/DUPLEX/LT DUPLEX 4.jpg',
    '/fotos/DUPLEX/LT DUPLEX 2.jpg'
  ],
  ARRAY['WiFi','Aire Acondicionado','Calefacción','Cocina Equipada','Smart TV','Estacionamiento','Parrilla']
),
(
  'duplex-2',
  'Dúplex 2',
  'duplex',
  'Dúplex ideal para familias a 400m de la playa. Ambientes amplios, cocina completa, patio propio y parrilla individual incluida.',
  6,
  45000,
  '[{"id":"rate-d2-ene","name":"Temporada Alta Enero","startDate":"2025-01-01","endDate":"2025-01-31","pricePerNight":70000},{"id":"rate-d2-feb","name":"Temporada Alta Febrero","startDate":"2025-02-01","endDate":"2025-02-28","pricePerNight":60000}]'::jsonb,
  ARRAY[
    '/fotos/FRENTE/DUPLEX2.JPG',
    '/fotos/DUPLEX/LT DUPLEX 12.jpg',
    '/fotos/DUPLEX/LT DUPLEX 3.jpg',
    '/fotos/DUPLEX/LT DUPLEX 7.jpg',
    '/fotos/DUPLEX/100085073_892639904547016_3812533114496876544_n.jpg',
    '/fotos/DUPLEX/101459021_246880323393933_6864321130237263872_n.jpg'
  ],
  ARRAY['WiFi','Aire Acondicionado','Calefacción','Cocina Equipada','Smart TV','Estacionamiento','Parrilla']
),
(
  'duplex-3',
  'Dúplex 3',
  'duplex',
  'Cómodo dúplex de dos plantas con dos dormitorios, baño completo, cocina equipada, living-comedor integrado y cochera.',
  6,
  45000,
  '[{"id":"rate-d3-ene","name":"Temporada Alta Enero","startDate":"2025-01-01","endDate":"2025-01-31","pricePerNight":70000},{"id":"rate-d3-feb","name":"Temporada Alta Febrero","startDate":"2025-02-01","endDate":"2025-02-28","pricePerNight":60000}]'::jsonb,
  ARRAY[
    '/fotos/FRENTE/DUPLEX3.JPG',
    '/fotos/DUPLEX/LT DUPLEX 8.jpg',
    '/fotos/DUPLEX/101395951_1017869315281973_6020210364078096384_n.jpg',
    '/fotos/DUPLEX/101673128_1331273097069440_5941149795799269376_n.jpg',
    '/fotos/DUPLEX/100731088_248916043210969_6265887694614691840_n.jpg'
  ],
  ARRAY['WiFi','Aire Acondicionado','Calefacción','Cocina Equipada','Smart TV','Estacionamiento','Parrilla']
),
(
  'duplex-4',
  'Dúplex 4',
  'duplex',
  'Espacioso dúplex con amplias habitaciones, living luminoso y zona de parrilla privada. Ideal para descansar cerca del mar.',
  6,
  45000,
  '[{"id":"rate-d4-ene","name":"Temporada Alta Enero","startDate":"2025-01-01","endDate":"2025-01-31","pricePerNight":70000},{"id":"rate-d4-feb","name":"Temporada Alta Febrero","startDate":"2025-02-01","endDate":"2025-02-28","pricePerNight":60000}]'::jsonb,
  ARRAY[
    '/fotos/FRENTE/DUPLEX4.jpg',
    '/fotos/DUPLEX/101181759_591098334851980_7757318008728453120_n.jpg',
    '/fotos/DUPLEX/101405420_923929474726045_4672883478419734528_n.jpg',
    '/fotos/DUPLEX/99424582_763869581020458_7135901223852441600_n.jpg',
    '/fotos/DUPLEX/99294744_3433262796693572_5767960118670917632_n.jpg'
  ],
  ARRAY['WiFi','Aire Acondicionado','Calefacción','Cocina Equipada','Smart TV','Estacionamiento','Parrilla']
),
(
  'depto-1',
  'Departamento',
  'departamento',
  'Departamento ubicado en primer piso con acceso por escalera en Calle 12 Nº 495. Cómodo y totalmente equipado para hasta 5 personas.',
  5,
  35000,
  '[{"id":"rate-dep-ene","name":"Temporada Alta Enero","startDate":"2025-01-01","endDate":"2025-01-31","pricePerNight":55000},{"id":"rate-dep-feb","name":"Temporada Alta Febrero","startDate":"2025-02-01","endDate":"2025-02-28","pricePerNight":48000}]'::jsonb,
  ARRAY[
    '/fotos/FRENTE/DEPARTAMENTO.jpg',
    '/fotos/DEPARTAMENTO/LT DEPTO 1.jpg',
    '/fotos/DEPARTAMENTO/LT DEPTO 2.jpg',
    '/fotos/DEPARTAMENTO/LT DEPTO 3.jpg',
    '/fotos/DEPARTAMENTO/LT DEPTO 4.jpg',
    '/fotos/DEPARTAMENTO/LT DEPTO 12.jpg'
  ],
  ARRAY['WiFi','Aire Acondicionado','Calefacción','Cocina Equipada','Smart TV']
);
