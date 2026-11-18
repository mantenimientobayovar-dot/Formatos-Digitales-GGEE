import { GPPRegistroDia, CasaFuerzaRegistroDia, HORAS_24, HORAS_4H } from '../types'
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

  // Por defecto a las 22:00 dejamos activo Grupo 01 con datos de ejemplo para que la UI se vea viva
  const gruposActivosPorHora: Record<string, string[]> = {}
  HORAS_24.forEach(h => {
    gruposActivosPorHora[h] = ['G1']
  })

  const g1Lecturas = JSON.parse(JSON.stringify(horasObj))
  // Inicializamos algunas lecturas de muestra en G1
  ;['18:00', '19:00', '20:00', '21:00', '22:00'].forEach(h => {
    g1Lecturas[h] = {
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
    grupos: {
      G1: {
        id: 'G1',
        nombre: 'GRUPO 01',
        marcaModelo: 'BURMEISTER N° 1',
        potenciaNominal: '1000 KW',
        activo: true,
        lecturas: g1Lecturas
      },
      G2: {
        id: 'G2',
        nombre: 'GRUPO 02',
        marcaModelo: 'BURMEISTER N° 2',
        potenciaNominal: '1000 KW',
        activo: false,
        lecturas: JSON.parse(JSON.stringify(horasObj))
      },
      G3: {
        id: 'G3',
        nombre: 'GRUPO 03',
        marcaModelo: 'BURMEISTER N° 3',
        potenciaNominal: '1000 KW',
        activo: false,
        lecturas: JSON.parse(JSON.stringify(horasObj))
      }
    }
  }
}

export function getDefaultCasaFuerzaRegistro(fecha: string = new Date().toISOString().split('T')[0]): CasaFuerzaRegistroDia {
  const equiposBase = [
    { item: 1, id: 'G1', codigoSap: '14000785', puntoMedida: '53', nombre: 'GRUPO ELECTROGENO N º1 - BURMEISTER' },
    { item: 2, id: 'G2', codigoSap: '14000797', puntoMedida: '54', nombre: 'GRUPO ELECTROGENO N º2 - BURMEISTER' },
    { item: 3, id: 'G3', codigoSap: '14000809', puntoMedida: '55', nombre: 'GRUPO ELECTROGENO N º3 - BURMEISTER' },
    { item: 4, id: 'G4', codigoSap: '14000821', puntoMedida: '56', nombre: 'GRUPO ELECTROGENO N º4 - CUMMINS KTA 19' },
    { item: 5, id: 'G5', codigoSap: '14000825', puntoMedida: '1106', nombre: 'GRUPO ELECTROGENO N º5 - CATERPILLAR 3412' },
    { item: 6, id: 'G6', codigoSap: '14000829', puntoMedida: '58', nombre: 'GRUPO ELECTROGENO N º6 - CUMMINS KTA 50' },
    { item: 7, id: 'G7', codigoSap: '14000833', puntoMedida: '1151', nombre: 'GRUPO ELECTROGENO N º7 - CATERPILLAR 3306' },
    { item: 8, id: 'G8', codigoSap: '14000837', puntoMedida: '60', nombre: 'GRUPO ELECTROGENO N º8 - PERKINS' },
    { item: 9, id: 'G9', codigoSap: '14009834', puntoMedida: '-', nombre: 'GRUPO ELECTROGENO N º9 - PERKINS GEPP 88-3' },
    { item: 10, id: 'G10', codigoSap: '-', puntoMedida: '-', nombre: 'GRUPO ELECTROGENO N º10 - CUMMINS KTA 38' },
    { item: 11, id: 'G11', codigoSap: '-', puntoMedida: '-', nombre: 'GRUPO ELECTROGENO N º11 - CATERPILLAR 3512' },
    { item: 12, id: 'P1', codigoSap: '14000840', puntoMedida: '38', nombre: 'PURIFICADOR CENTRIFUGO 1 ACEITE DE G.E' },
    { item: 13, id: 'P2', codigoSap: '14000842', puntoMedida: '39', nombre: 'PURIFICADOR CENTRIFUGO 2 ACEITE DE G.E' },
    { item: 14, id: 'C1', codigoSap: '14000844', puntoMedida: '22', nombre: 'COMPRESOR DE AIRE Nº 1 - GRUPOS ELECTROGENOS' },
    { item: 15, id: 'C2', codigoSap: '14000846', puntoMedida: '23', nombre: 'COMPRESOR DE AIRE Nº 2 - GRUPOS ELECTROGENOS' }
  ]

  const params4HBase: Record<string, any[]> = {}
  ;['G1', 'G2', 'G3'].forEach(gid => {
    params4HBase[gid] = HORAS_4H.map(h => ({
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
      // Asegurar valores por defecto si se creó con versión anterior
      if (!parsed.gruposActivosPorHora) parsed.gruposActivosPorHora = {}
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
