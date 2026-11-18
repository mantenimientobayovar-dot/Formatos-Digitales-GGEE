-- =========================================================================
-- ESQUEMA OFICIAL SUPABASE - FORMATOS DIGITALES GGEE & CASA DE FUERZA COPEINCA
-- Instrucciones:
-- 1. Ve a tu proyecto en https://supabase.com
-- 2. Entra al menú "SQL Editor" en la barra lateral izquierda
-- 3. Pega todo este código y haz clic en "RUN"
-- =========================================================================

-- 1. Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: Registro de Operaciones de Grupos Electrógenos (GPP-FOR-021)
CREATE TABLE IF NOT EXISTS public.gpp_registros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fecha DATE NOT NULL UNIQUE,
    sede VARCHAR(100) NOT NULL DEFAULT 'BAYOVAR',
    proceso VARCHAR(255) DEFAULT 'PROCESO DE PRODUCCIÓN HARINA Y ACEITE',
    turno_activo VARCHAR(10) DEFAULT 'A',
    operador_a VARCHAR(150),
    operador_b VARCHAR(150),
    observaciones TEXT,
    vobo_jefe BOOLEAN DEFAULT FALSE,
    vobo_superintendente BOOLEAN DEFAULT FALSE,
    datos JSONB NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Comentarios explicativos
COMMENT ON TABLE public.gpp_registros IS 'Registros diarios del formato oficial GPP-FOR-021 para los 9 Grupos Electrógenos';
COMMENT ON COLUMN public.gpp_registros.datos IS 'Estructura JSON completa de las 24 horas y lecturas de los 9 grupos';

-- 3. TABLA: Casa de Fuerza y Servicios Generales (Horómetros & SAP)
CREATE TABLE IF NOT EXISTS public.casa_fuerza_registros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fecha DATE NOT NULL UNIQUE,
    sede VARCHAR(100) NOT NULL DEFAULT 'BAYOVAR',
    responsable VARCHAR(150) DEFAULT 'OPERADOR DE GRUPOS',
    datos JSONB NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA: Catálogo Maestro de los 9 Grupos Electrógenos Oficiales
CREATE TABLE IF NOT EXISTS public.grupos_catalogo (
    id VARCHAR(20) PRIMARY KEY,
    numero INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    etiqueta_corta VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Poblar el catálogo de los 9 grupos oficiales con la nomenclatura requerida
INSERT INTO public.grupos_catalogo (id, numero, nombre, etiqueta_corta, activo)
VALUES 
    ('G1', 1, 'GRUPO 1 - BURMEISTER', 'G1 BURMEISTER', true),
    ('G3', 3, 'GRUPO 3 - BURMEISTER', 'G3 BURMEISTER', true),
    ('G4', 4, 'GRUPO 4 - KTA 19', 'G4 KTA 19', true),
    ('G5', 5, 'GRUPO 5 - CAT C18', 'G5 CAT C18', true),
    ('G6', 6, 'GRUPO 6 - KTA 50', 'G6 KTA 50', true),
    ('G7', 7, 'GRUPO 7 - CAT 3306', 'G7 CAT 3306', true),
    ('G9', 9, 'GRUPO 9 - PERKINS', 'G9 PERKINS', true),
    ('G10', 10, 'GRUPO 10 - CAT 3512 (PIS)', 'G10 CAT 3512 (PIS)', true),
    ('G11', 11, 'GRUPO 11 - CAT 3512 B', 'G11 CAT 3512 B', true)
ON CONFLICT (id) DO UPDATE SET 
    nombre = EXCLUDED.nombre,
    etiqueta_corta = EXCLUDED.etiqueta_corta,
    activo = EXCLUDED.activo;

-- 5. TABLA: Catálogo de Equipos de Casa de Fuerza (Puntos SAP)
CREATE TABLE IF NOT EXISTS public.equipos_casa_fuerza_catalogo (
    item INTEGER PRIMARY KEY,
    id VARCHAR(20) NOT NULL,
    codigo_sap VARCHAR(50),
    punto_medida VARCHAR(50),
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) DEFAULT 'GENERADOR'
);

INSERT INTO public.equipos_casa_fuerza_catalogo (item, id, codigo_sap, punto_medida, nombre, categoria)
VALUES
    (1, 'G1', '14000785', '53', 'GRUPO 1 - BURMEISTER', 'GENERADOR'),
    (2, 'G3', '14000809', '55', 'GRUPO 3 - BURMEISTER', 'GENERADOR'),
    (3, 'G4', '14000821', '56', 'GRUPO 4 - KTA 19', 'GENERADOR'),
    (4, 'G5', '14000825', '1106', 'GRUPO 5 - CAT C18', 'GENERADOR'),
    (5, 'G6', '14000829', '58', 'GRUPO 6 - KTA 50', 'GENERADOR'),
    (6, 'G7', '14000833', '1151', 'GRUPO 7 - CAT 3306', 'GENERADOR'),
    (7, 'G9', '14009834', '-', 'GRUPO 9 - PERKINS', 'GENERADOR'),
    (8, 'G10', '-', '-', 'GRUPO 10 - CAT 3512 (PIS)', 'GENERADOR'),
    (9, 'G11', '-', '-', 'GRUPO 11 - CAT 3512 B', 'GENERADOR'),
    (10, 'P1', '14000840', '38', 'PURIFICADOR CENTRIFUGO 1 ACEITE DE G.E', 'AUXILIAR'),
    (11, 'P2', '14000842', '39', 'PURIFICADOR CENTRIFUGO 2 ACEITE DE G.E', 'AUXILIAR'),
    (12, 'C1', '14000844', '22', 'COMPRESOR DE AIRE Nº 1 - GRUPOS ELECTROGENOS', 'COMPRESOR'),
    (13, 'C2', '14000846', '23', 'COMPRESOR DE AIRE Nº 2 - GRUPOS ELECTROGENOS', 'COMPRESOR')
ON CONFLICT (item) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    codigo_sap = EXCLUDED.codigo_sap,
    punto_medida = EXCLUDED.punto_medida;

-- 6. ÍNDICES DE RENDIMIENTO (Búsquedas instantáneas por fecha y sede)
CREATE INDEX IF NOT EXISTS idx_gpp_fecha ON public.gpp_registros(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_gpp_sede ON public.gpp_registros(sede);
CREATE INDEX IF NOT EXISTS idx_cf_fecha ON public.casa_fuerza_registros(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_cf_sede ON public.casa_fuerza_registros(sede);

-- 7. FUNCIÓN Y TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA DE TIMESTAMP
CREATE OR REPLACE FUNCTION public.actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_actualizar_timestamp_gpp ON public.gpp_registros;
CREATE TRIGGER trigger_actualizar_timestamp_gpp
    BEFORE UPDATE ON public.gpp_registros
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_timestamp();

DROP TRIGGER IF EXISTS trigger_actualizar_timestamp_cf ON public.casa_fuerza_registros;
CREATE TRIGGER trigger_actualizar_timestamp_cf
    BEFORE UPDATE ON public.casa_fuerza_registros
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_timestamp();

-- 8. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.gpp_registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casa_fuerza_registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grupos_catalogo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipos_casa_fuerza_catalogo ENABLE ROW LEVEL SECURITY;

-- Permitir lectura y escritura mediante la clave pública (anon) y autenticada de Vercel/Next.js
DROP POLICY IF EXISTS "Permitir acceso publico para gpp_registros" ON public.gpp_registros;
CREATE POLICY "Permitir acceso publico para gpp_registros" ON public.gpp_registros
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso publico para casa_fuerza_registros" ON public.casa_fuerza_registros;
CREATE POLICY "Permitir acceso publico para casa_fuerza_registros" ON public.casa_fuerza_registros
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura catalogo grupos" ON public.grupos_catalogo;
CREATE POLICY "Permitir lectura catalogo grupos" ON public.grupos_catalogo
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura catalogo casa fuerza" ON public.equipos_casa_fuerza_catalogo;
CREATE POLICY "Permitir lectura catalogo casa fuerza" ON public.equipos_casa_fuerza_catalogo
    FOR ALL USING (true) WITH CHECK (true);
