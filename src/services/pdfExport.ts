import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { GPPRegistroDia, HORAS_24, GRUPOS_OFICIALES, GPPDataHora } from '../types'

export function exportGPPToPDF(data: GPPRegistroDia) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Determinar grupos que tuvieron operación hoy o los primeros 3
  const activeIdsSet = new Set<string>()
  Object.values(data.gruposActivosPorHora || {}).forEach(arr => arr.forEach(id => activeIdsSet.add(id)))
  
  // Si no hay ninguno explícito, incluir al menos G1, G3, G4
  if (activeIdsSet.size === 0) {
    activeIdsSet.add('G1')
    activeIdsSet.add('G3')
    activeIdsSet.add('G4')
  }

  const groupsToExport = GRUPOS_OFICIALES.filter(g => activeIdsSet.has(g.id))

  // 1. Encabezado Oficial Copeinca
  doc.setDrawColor(30, 41, 59)
  doc.setLineWidth(0.4)
  doc.rect(10, 8, pageWidth - 20, 24)

  // Nombre Copeinca
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(11, 66, 76)
  doc.text('copeinca', 16, 20)

  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.setFont('helvetica', 'normal')
  doc.text('PLANTA INDUSTRIAL', 16, 25)

  doc.line(55, 8, 55, 32)

  // Título central
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(15, 23, 42)
  doc.text('PROCESO DE PRODUCCIÓN HARINA Y ACEITE', (pageWidth / 2) - 5, 17, { align: 'center' })
  doc.setFontSize(12)
  doc.setTextColor(11, 66, 76)
  doc.text('Registro de Operaciones de Grupos Electrógenos', (pageWidth / 2) - 5, 25, { align: 'center' })

  doc.line(pageWidth - 65, 8, pageWidth - 65, 32)

  // Metadatos oficiales a la derecha
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('Código:', pageWidth - 62, 14)
  doc.setFont('helvetica', 'normal')
  doc.text('GPP-FOR-021', pageWidth - 35, 14)

  doc.setFont('helvetica', 'bold')
  doc.text('Sede:', pageWidth - 62, 19)
  doc.setFont('helvetica', 'normal')
  doc.text(data.sede || 'BAYOVAR', pageWidth - 35, 19)

  doc.setFont('helvetica', 'bold')
  doc.text('Versión:', pageWidth - 62, 24)
  doc.setFont('helvetica', 'normal')
  doc.text('01', pageWidth - 35, 24)

  doc.setFont('helvetica', 'bold')
  doc.text('Página:', pageWidth - 62, 29)
  doc.setFont('helvetica', 'normal')
  doc.text('01 de 01', pageWidth - 35, 29)

  // 2. Barra de Operadores y Fecha
  doc.setFillColor(241, 245, 249)
  doc.rect(10, 34, pageWidth - 20, 8, 'F')
  doc.rect(10, 34, pageWidth - 20, 8, 'S')

  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('Operador Turno A:', 14, 39.5)
  doc.setFont('helvetica', 'normal')
  doc.text(data.operadorA || 'Juan Sanchez', 45, 39.5)

  doc.setFont('helvetica', 'bold')
  doc.text('Operador Turno B:', 110, 39.5)
  doc.setFont('helvetica', 'normal')
  doc.text(data.operadorB || 'Luis Rumiche Anton', 142, 39.5)

  doc.setFont('helvetica', 'bold')
  doc.text('FECHA:', pageWidth - 55, 39.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(11, 66, 76)
  doc.text(data.fecha, pageWidth - 38, 39.5)

  // 3. Tabla de Grupos
  const headRow1: any[] = [
    { content: 'HORA', rowSpan: 2, styles: { halign: 'center', valign: 'middle', fillColor: [11, 66, 76] } }
  ]
  const headRow2: any[] = []

  groupsToExport.forEach(gDef => {
    headRow1.push({
      content: gDef.nombre,
      colSpan: 7,
      styles: { halign: 'center', fillColor: [11, 66, 76] }
    })
    headRow2.push(
      { content: 'P. Aceite\n(psi)', styles: { halign: 'center' } },
      { content: 'T° Agua\n(°C)', styles: { halign: 'center' } },
      { content: 'Veloc.\n(rpm)', styles: { halign: 'center' } },
      { content: 'Freq.\n(Hz)', styles: { halign: 'center' } },
      { content: 'Amp.\n(A)', styles: { halign: 'center' } },
      { content: 'PF\n(Cos φ)', styles: { halign: 'center' } },
      { content: 'Energía\n(KWH)', styles: { halign: 'center' } }
    )
  })

  const body = HORAS_24.map(h => {
    const row: any[] = [h]
    groupsToExport.forEach(gDef => {
      const lec = (data.grupos?.[gDef.id]?.lecturas?.[h] || {}) as Partial<GPPDataHora>
      row.push(
        lec.presionAceite ?? '-',
        lec.tempAgua ?? '-',
        lec.velocidadMotor ?? '-',
        lec.frecuencia ?? '-',
        lec.amperaje ?? '-',
        lec.factorPotencia ?? '-',
        lec.energia ?? '-'
      )
    })
    return row
  })

  autoTable(doc, {
    head: [headRow1, headRow2] as any,
    body: body as any,
    startY: 44,
    margin: { left: 10, right: 10 },
    theme: 'grid',
    styles: {
      fontSize: 6.5,
      cellPadding: 1,
      halign: 'center',
      valign: 'middle',
      lineColor: [203, 213, 225],
      lineWidth: 0.2
    },
    headStyles: {
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fillColor: [11, 66, 76]
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 14, fillColor: [248, 250, 252] }
    }
  })

  const finalY = (doc as any).lastAutoTable.finalY || 160

  // 4. Observaciones Generales
  const obsY = Math.min(finalY + 3, pageHeight - 35)
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('OBSERVACIONES GENERALES:', 10, obsY)
  
  doc.setFont('helvetica', 'normal')
  doc.rect(10, obsY + 2, pageWidth - 20, 10)
  doc.text(data.observaciones || 'Sin observaciones reportadas en la guardia.', 13, obsY + 6, {
    maxWidth: pageWidth - 26
  })

  // 5. Bloque de Firmas Oficiales
  const signY = obsY + 16
  const colW = (pageWidth - 20) / 4

  const firmas = [
    { label: 'OPERADOR TURNO "A"', name: data.operadorA || 'Juan Sanchez' },
    { label: 'OPERADOR TURNO "B"', name: data.operadorB || 'Luis Rumiche Anton' },
    { label: 'VºBº JEFE DE PLANTA', name: data.voboJefe ? '[APROBADO EN SISTEMA]' : 'Firma y Sello' },
    { label: 'VºBº SUPERINTENDENTE', name: data.voboSuperintendente ? '[APROBADO EN SISTEMA]' : 'Firma y Sello' }
  ]

  firmas.forEach((f, idx) => {
    const x = 10 + (idx * colW)
    doc.line(x + 5, signY + 7, x + colW - 5, signY + 7)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(15, 23, 42)
    doc.text(f.label, x + (colW / 2), signY + 10, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(71, 85, 105)
    doc.text(f.name, x + (colW / 2), signY + 13, { align: 'center' })
  })

  doc.save(`GPP-FOR-021_${data.fecha}_Copeinca.pdf`)
}
