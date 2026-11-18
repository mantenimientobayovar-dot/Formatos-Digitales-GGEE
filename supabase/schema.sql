-- =========================================================================
-- ESQUEMA DE BASE DE DATOS SUPABASE - FORMATOS DIGITALES GGEE & CASA FUERZA
-- Ejecuta este script en el SQL Editor de tu panel de Supabase
-- =========================================================================

-- 1. Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla para Formato GPP-FOR-021 (Registro de Operaciones de Grupos Electrógenos)
CREATE TABLE IF NOT EXISTS public.gpp_registros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fecha DATE NOT NULL UNIQUE,
    sede VARCHAR(100) NOT NULL DEFAULT 'BAYOVAR',
    proceso VARCHAR(255) DEFAULT 'PROCESO DE PRODUCCIÓN HARINA Y ACEITE',
    operador_a VARCHAR(150),
    operador_b VARCHAR(150),
    observaciones TEXT,
    vobo_jefe BOOLEAN DEFAULT FALSE,
    vobo_superintendente BOOLEAN DEFAULT FALSE,
    datos JSONB NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla para Formato Casa de Fuerza (Parámetros y Horómetros)
CREATE TABLE IF NOT EXISTS public.casa_fuerza_registros (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fecha DATE NOT NULL UNIQUE,
    sede VARCHAR(100) NOT NULL DEFAULT 'BAYOVAR',
    responsable VARCHAR(150) DEFAULT 'OPERADOR DE GRUPOS',
    datos JSONB NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabla de Catálogo de Equipos y Puntos SAP
CREATE TABLE IF NOT EXISTS public.equipos_catalogo (
    id VARCHAR(50) PRIMARY KEY,
    item INTEGER NOT NULL,
    codigo_sap VARCHAR(50),
    punto_medida VARCHAR(50),
    nombre VARCHAR(255) NOT NULL,
    potencia_kw NUMERIC,
    activo BOOLEAN DEFAULT TRUE
);

-- Índices para búsqueda rápida por fecha
CREATE INDEX IF NOT EXISTS idx_gpp_fecha ON public.gpp_registros(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_cf_fecha ON public.casa_fuerza_registros(fecha DESC);

-- Políticas RLS (Seguridad a Nivel de Fila)
ALTER TABLE public.gpp_registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.casa_fuerza_registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipos_catalogo ENABLE ROW LEVEL SECURITY;

-- Permitir lectura y escritura anónima o autenticada para los operadores de planta
CREATE POLICY "Permitir acceso publico para gpp_registros" ON public.gpp_registros
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir acceso publico para casa_fuerza_registros" ON public.casa_fuerza_registros
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir lectura de catalogo" ON public.equipos_catalogo
    FOR SELECT USING (true);
