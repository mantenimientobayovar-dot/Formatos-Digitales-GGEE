import * as XLSX from 'xlsx'
import { GPPRegistroDia, CasaFuerzaRegistroDia, HORAS_24, HORAS_4H, GPPDataHora } from '../types'

/**
 * Exporta el formato oficial GPP-FOR-021 idéntico a la plantilla de planta
 */
export function exportGPPToExcel(data: GPPRegistroDia): void {
  const wb = XLSX.utils.book_new()
  const wsData: any[][] = []

  // Filas 1-5: Encabezado Oficial
  wsData.push([]) // Fila 1 vacía
  wsData.push(['', '', '', '', 'PROCESO DE PRODUCCIÓN HARINA Y ACEITE', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Código', 'GPP-FOR-021'])
  wsData.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Sede', data.sede || 'BAYOVAR'])
  wsData.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Versión', '1'])
  wsData.push(['', '', '', '', 'Registro de Operaciones de Grupos Electrógenos', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'Página', '01 de 01'])
  wsData.push([])
  wsData.push([])
  // Fila 8: Datos de Operadores y Fecha
  wsData.push(['', 'Operador A', data.operadorA || '', '', '', '', '', '', '', 'Operador B', data.operadorB || '', '', '', '', '', '', '', '', '', 'FECHA', data.fecha])
  wsData.push([])

  // Fila 10: Títulos de Grupos Electrógenos
  const row10 = ['', '', 'GRUPO ELECTROGENO N° 1', '', '', '', '', '', '', 'GRUPO ELECTROGENO N° 2', '', '', '', '', '', '', 'GRUPO ELECTROGENO N° 3']
  wsData.push(row10)

  // Fila 11: Encabezados de Parámetros
  const row11 = [
    '', 'HORA',
    'Presion de aceite', 'T° del agua de refrig.', 'Veloc. del motor', 'Frecuencia', 'Amperaje', 'Factor de potencia', 'Energia',
    'Presion de aceite', 'T° del agua de refrig.', 'Veloc. del motor', 'Frecuencia', 'Amperaje', 'Factor de potencia', 'Energia',
    'Presion de aceite', 'T° del agua de refrig.', 'Veloc. del motor', 'Frecuencia', 'Amperaje', 'Factor de potencia', 'Energia'
  ]
  wsData.push(row11)

  // Fila 12: Unidades de Medida
  const row12 = [
    '', '',
    'psi', '°C', 'rpm', 'Hz', 'A', 'Cos φ', 'KWH',
    'psi', '°C', 'rpm', 'Hz', 'A', 'Cos φ', 'KWH',
    'psi', '°C', 'rpm', 'Hz', 'A', 'Cos φ', 'KWH'
  ]
  wsData.push(row12)

  // Filas 13 a 36: Horas 01:00 a 00:00
  HORAS_24.forEach(hora => {
    const g1: Partial<GPPDataHora> = data.grupos?.G1?.lecturas?.[hora] || {}
    const g2: Partial<GPPDataHora> = data.grupos?.G2?.lecturas?.[hora] || {}
    const g3: Partial<GPPDataHora> = data.grupos?.G3?.lecturas?.[hora] || {}

    const row = [
      '',
      hora,
      g1.presionAceite ?? '',
      g1.tempAgua ?? '',
      g1.velocidadMotor ?? '',
      g1.frecuencia ?? '',
      g1.amperaje ?? '',
      g1.factorPotencia ?? '',
      g1.energia ?? '',
      g2.presionAceite ?? '',
      g2.tempAgua ?? '',
      g2.velocidadMotor ?? '',
      g2.frecuencia ?? '',
      g2.amperaje ?? '',
      g2.factorPotencia ?? '',
      g2.energia ?? '',
      g3.presionAceite ?? '',
      g3.tempAgua ?? '',
      g3.velocidadMotor ?? '',
      g3.frecuencia ?? '',
      g3.amperaje ?? '',
      g3.factorPotencia ?? '',
      g3.energia ?? ''
    ]
    wsData.push(row)
  })

  // Filas finales de Observaciones y Firmas
  wsData.push([])
  wsData.push(['', 'OBSERVACIONES GENERALES:'])
  wsData.push(['', data.observaciones || 'Sin observaciones registradas durante la guardia.'])
  wsData.push([])
  wsData.push([])
  wsData.push(['', 'OPERADOR TURNO "A"', '', '', '', '', 'OPERADOR TURNO "B"', '', '', '', '', 'VºBº JEFE DE PLANTA', '', '', '', '', '', '', 'VºBº SUPERINTENDENTE'])
  wsData.push(['', data.operadorA || '___________________', '', '', '', '', data.operadorB || '___________________', '', '', '', '', data.voboJefe ? '[APROBADO]' : '___________________', '', '', '', '', '', '', data.voboSuperintendente ? '[APROBADO]' : '___________________'])

  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Configurar anchos de columna para legibilidad industrial
  ws['!cols'] = [
    { wch: 3 },  // margen A
    { wch: 10 }, // HORA
    { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, // G1
    { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, // G2
    { wch: 14 }, { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, // G3
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'GPP-FOR-021')
  XLSX.writeFile(wb, `GPP-FOR-021_Registro_GGEE_${data.fecha}.xlsx`)
}

/**
 * Exporta el formato oficial de Casa de Fuerza
 */
export function exportCasaFuerzaToExcel(data: CasaFuerzaRegistroDia): void {
  const wb = XLSX.utils.book_new()

  // Hoja 1: Registro de Funcionamiento Equipos
  const equiposData: any[][] = [
    ['', 'MANTENIMIENTO PLANTA HARINA', '', '', '', '', '', '', 'SEDE', data.sede || 'BAYOVAR'],
    ['', 'REGISTRO DE FUNCIONAMIENTO - SERVICIOS GENERALES - CASA FUERZA'],
    [],
    ['RESPONSABLE :', data.responsable || 'OPERADOR DE GRUPOS', '', '', '', '', '', '', 'FECHA DE EMISION :', data.fecha],
    [],
    ['HORAS DE FUNCIONAMIENTO Y ESTADO DE EQUIPOS'],
    [],
    ['ITEM', 'CODIGO SAP', 'PUNTO MEDIDA', 'EQUIPO', '', 'CONSUMO DIESEL (GLN)', 'DE 00:00 A 08:00', 'DE 08:00 A 19:00', 'DE 19:00 A 00:00', 'TOTAL HORAS FUNCIONAMIENTO']
  ]

  data.equipos.forEach(eq => {
    const h1 = Number(eq.horasTurno1) || 0
    const h2 = Number(eq.horasTurno2) || 0
    const h3 = Number(eq.horasTurno3) || 0
    const total = (h1 + h2 + h3) || eq.totalHoras || 0

    equiposData.push([
      eq.item,
      eq.codigoSap || '-',
      eq.puntoMedida || '-',
      eq.nombre,
      '',
      eq.consumoDieselGln ?? '',
      eq.horasTurno1 ?? '',
      eq.horasTurno2 ?? '',
      eq.horasTurno3 ?? '',
      total > 0 ? total : ''
    ])
  })

  equiposData.push([])
  equiposData.push(['FALLAS OBSERVADAS EN EQUIPO:'])
  equiposData.push(['TURNO DIA:', data.fallasTurnoDia || 'Sin fallas reportadas.'])
  equiposData.push(['TURNO NOCHE:', data.fallasTurnoNoche || 'Sin fallas reportadas.'])

  const wsEquipos = XLSX.utils.aoa_to_sheet(equiposData)
  XLSX.utils.book_append_sheet(wb, wsEquipos, 'Funcionamiento_Equipos')

  XLSX.writeFile(wb, `Casa_de_Fuerza_${data.fecha}.xlsx`)
}
