import { GPPRegistroDia, CasaFuerzaRegistroDia, HORAS_24, HORAS_4H, GRUPOS_OFICIALES } from '../types'
import { supabase, isSupabaseConfigured } from './supabase'

const GPP_STORAGE_KEY_PREFIX = 'ggee_gpp_'
const CASA_FUERZA_STORAGE_KEY_PREFIX = 'ggee_cf_'

export function getDefaultGPPRegistro(fecha: string = new Date().toISOString().split('T')[0]): GPPRegistroDia {
  const horasObj: Record<string, any> = {}
  HORAS_24.forEach(h => {
    horasObj[h] = {
      hora: h,
      presionAceite: null,
      tempAgua: null,
      velocidadMotor: null,
      frecuencia: null,
      amperaje: null,
      factorPotencia: null,
      energia: null
    }
  })

  // Activar Grupo 1 por defecto a las horas del día para visualización inicial
  const gruposActivosPorHora: Record<string, string[]> = {}
  HORAS_24.forEach(h => {
    gruposActivosPorHora[h] = ['G1']
  })

  // Inicializar los 9 Grupos Oficiales
  const gruposMap: Record<string, any> = {}
  GRUPOS_OFICIALES.forEach((gDef, idx) => {
    const lecturas = JSON.parse(JSON.stringify(horasObj))
    
    // Si es G1, precargar algunas lecturas de muestra
    if (gDef.id === 'G1') {
      ;['18:00', '19:00', '20:00', '21:00', '22:00', '23:00'].forEach(h => {
        lecturas[h] = {
          hora: h,
          presionAceite: 55.5,
          tempAgua: 78.0,
          velocidadMotor: 1800,
          frecuencia: 60.0,
          amperaje: 460,
          factorPotencia: 0.88,
          energia: 125430
        }
      })
    }

    gruposMap[gDef.id] = {
      id: gDef.id,
      nombre: gDef.nombre,
      codigoCorto: gDef.id,
      marcaModelo: gDef.nombre.replace(`GRUPO ${gDef.numero} - `, ''),
      activo: idx === 0,
      lecturas
    }
  })

  return {
    fecha,
    sede: 'BAYOVAR',
    proceso: 'PROCESO DE PRODUCCIÓN HARINA Y ACEITE',
    turnoActivo: 'A',
    operadorA: 'Juan Sanchez',
    operadorB: 'Luis Rumiche Anton',
    observaciones: '',
    voboJefe: false,
    voboSuperintendente: false,
    gruposActivosPorHora,
    grupos: gruposMap
  }
}

export function getDefaultCasaFuerzaRegistro(fecha: string = new Date().toISOString().split('T')[0]): CasaFuerzaRegistroDia {
  const equiposBase = [
    { item: 1, id: 'G1', codigoSap: '14000785', puntoMedida: '53', nombre: 'GRUPO 1 - BURMEISTER' },
    { item: 2, id: 'G3', codigoSap: '14000809', puntoMedida: '55', nombre: 'GRUPO 3 - BURMEISTER' },
    { item: 3, id: 'G4', codigoSap: '14000821', puntoMedida: '56', nombre: 'GRUPO 4 - KTA 19' },
    { item: 4, id: 'G5', codigoSap: '14000825', puntoMedida: '1106', nombre: 'GRUPO 5 - CAT C18' },
    { item: 5, id: 'G6', codigoSap: '14000829', puntoMedida: '58', nombre: 'GRUPO 6 - KTA 50' },
    { item: 6, id: 'G7', codigoSap: '14000833', puntoMedida: '1151', nombre: 'GRUPO 7 - CAT 3306' },
    { item: 7, id: 'G9', codigoSap: '14009834', puntoMedida: '-', nombre: 'GRUPO 9 - PERKINS' },
    { item: 8, id: 'G10', codigoSap: '-', puntoMedida: '-', nombre: 'GRUPO 10 - CAT 3512 (PIS)' },
    { item: 9, id: 'G11', codigoSap: '-', puntoMedida: '-', nombre: 'GRUPO 11 - CAT 3512 B' },
    { item: 10, id: 'P1', codigoSap: '14000840', puntoMedida: '38', nombre: 'PURIFICADOR CENTRIFUGO 1 ACEITE DE G.E' },
    { item: 11, id: 'P2', codigoSap: '14000842', puntoMedida: '39', nombre: 'PURIFICADOR CENTRIFUGO 2 ACEITE DE G.E' },
    { item: 12, id: 'C1', codigoSap: '14000844', puntoMedida: '22', nombre: 'COMPRESOR DE AIRE Nº 1 - GRUPOS ELECTROGENOS' },
    { item: 13, id: 'C2', codigoSap: '14000846', puntoMedida: '23', nombre: 'COMPRESOR DE AIRE Nº 2 - GRUPOS ELECTROGENOS' }
  ]

  const params4HBase: Record<string, any[]> = {}
  GRUPOS_OFICIALES.forEach(gDef => {
    params4HBase[gDef.id] = HORAS_4H.map(h => ({
      hora: h,
      v1: null, v2: null, v3: null,
      a1: null, a2: null, a3: null,
      va: null, pf: null, w: null, hz: null, varVal: null, kwh: null
    }))
  })

  return {
    fecha,
    responsable: 'OPERADOR DE GRUPOS',
    sede: 'BAYOVAR',
    equipos: equiposBase.map(e => ({
      ...e,
      consumoDieselGln: null,
      energiaInicial: null,
      energiaFinal: null,
      horasTurno1: null,
      horasTurno2: null,
      horasTurno3: null,
      totalHoras: null
    })),
    parametrosElectricos: params4HBase,
    fallasTurnoDia: '',
    fallasTurnoNoche: ''
  }
}

export async function saveGPPRegistro(data: GPPRegistroDia): Promise<void> {
  const key = `${GPP_STORAGE_KEY_PREFIX}${data.fecha}`
  const payload = {
    ...data,
    actualizadoEn: new Date().toISOString()
  }
  
  localStorage.setItem(key, JSON.stringify(payload))

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('gpp_registros').upsert({
        fecha: data.fecha,
        sede: data.sede,
        datos: payload,
        actualizado_en: payload.actualizadoEn
      }, { onConflict: 'fecha' })
    } catch (err) {
      console.warn('Error sincronizando Supabase:', err)
    }
  }
}

export async function loadGPPRegistro(fecha: string): Promise<GPPRegistroDia> {
  const key = `${GPP_STORAGE_KEY_PREFIX}${fecha}`
  const localData = localStorage.getItem(key)

  if (localData) {
    try {
      const parsed = JSON.parse(localData)
      const def = getDefaultGPPRegistro(fecha)

      // Asegurar que contenga los 9 grupos oficiales actualizados
      if (!parsed.grupos) parsed.grupos = {}
      GRUPOS_OFICIALES.forEach(gDef => {
        if (!parsed.grupos[gDef.id]) {
          parsed.grupos[gDef.id] = def.grupos[gDef.id]
        } else {
          // Mantener la nomenclatura oficial exacta
          parsed.grupos[gDef.id].nombre = gDef.nombre
        }
      })

      if (!parsed.gruposActivosPorHora) parsed.gruposActivosPorHora = def.gruposActivosPorHora
      if (!parsed.turnoActivo) parsed.turnoActivo = 'A'
      if (!parsed.operadorA) parsed.operadorA = 'Juan Sanchez'
      if (!parsed.operadorB) parsed.operadorB = 'Luis Rumiche Anton'
      return parsed
    } catch (e) {
      console.error('Error parseando registro local GPP:', e)
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('gpp_registros')
        .select('datos')
        .eq('fecha', fecha)
        .single()

      if (!error && data && data.datos) {
        localStorage.setItem(key, JSON.stringify(data.datos))
        return data.datos
      }
    } catch (err) {
      console.warn('Error consultando Supabase:', err)
    }
  }

  return getDefaultGPPRegistro(fecha)
}

export async function saveCasaFuerzaRegistro(data: CasaFuerzaRegistroDia): Promise<void> {
  const key = `${CASA_FUERZA_STORAGE_KEY_PREFIX}${data.fecha}`
  const payload = {
    ...data,
    actualizadoEn: new Date().toISOString()
  }

  localStorage.setItem(key, JSON.stringify(payload))

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('casa_fuerza_registros').upsert({
        fecha: data.fecha,
        sede: data.sede,
        datos: payload,
        actualizado_en: payload.actualizadoEn
      }, { onConflict: 'fecha' })
    } catch (err) {
      console.warn('Error sincronizando Casa de Fuerza con Supabase:', err)
    }
  }
}

export async function loadCasaFuerzaRegistro(fecha: string): Promise<CasaFuerzaRegistroDia> {
  const key = `${CASA_FUERZA_STORAGE_KEY_PREFIX}${fecha}`
  const localData = localStorage.getItem(key)

  if (localData) {
    try {
      return JSON.parse(localData)
    } catch (e) {
      console.error('Error parseando registro local Casa de Fuerza:', e)
    }
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('casa_fuerza_registros')
        .select('datos')
        .eq('fecha', fecha)
        .single()

      if (!error && data && data.datos) {
        localStorage.setItem(key, JSON.stringify(data.datos))
        return data.datos
      }
    } catch (err) {
      console.warn('Error consultando Supabase para Casa de Fuerza:', err)
    }
  }

  return getDefaultCasaFuerzaRegistro(fecha)
}
