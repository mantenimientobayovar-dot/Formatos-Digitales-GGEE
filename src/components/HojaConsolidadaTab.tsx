'use client'

import React, { useState } from 'react'
import { GPPRegistroDia, HORAS_24, GRUPOS_OFICIALES, GPPDataHora } from '../types'
import { FileDown, FileSpreadsheet, Zap } from 'lucide-react'
import { exportGPPToExcel } from '../services/excelExport'

interface HojaConsolidadaTabProps {
  data: GPPRegistroDia
  onDownloadPDF: () => void
}

export const HojaConsolidadaTab: React.FC<HojaConsolidadaTabProps> = ({ data, onDownloadPDF }) => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>(['G1', 'G3', 'G4', 'G5', 'G6', 'G7', 'G9', 'G10', 'G11'])

  const toggleGroup = (gid: string) => {
    if (selectedGroups.includes(gid)) {
      if (selectedGroups.length > 1) setSelectedGroups(selectedGroups.filter(g => g !== gid))
    } else {
      setSelectedGroups([...selectedGroups, gid])
    }
  }

  const selectAll = () => {
    setSelectedGroups(GRUPOS_OFICIALES.map(g => g.id))
  }

  const visibleGroups = GRUPOS_OFICIALES.filter(g => selectedGroups.includes(g.id))

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6">
      {/* Encabezado Superior */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            Consolidado Oficial de Grupos Electrógenos — GPP-FOR-021
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hoja completa de 24 horas y los 9 Grupos Electrógenos sincronizada en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportGPPToExcel(data)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition shadow-sm"
            title="Exportar archivo Excel oficial"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Exportar Excel</span>
          </button>

          <button
            onClick={onDownloadPDF}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b424c] hover:bg-[#08333b] text-white text-xs sm:text-sm font-bold transition shadow-sm active:scale-[0.98]"
          >
            <FileDown className="w-4 h-4" />
            <span>Descargar PDF</span>
          </button>
        </div>
      </div>

      {/* Selector Rápido de Columnas Visibles de los 9 Grupos */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold text-slate-500 mr-1 uppercase">VER GRUPOS:</span>
          {GRUPOS_OFICIALES.map(gDef => {
            const isChecked = selectedGroups.includes(gDef.id)
            return (
              <button
                key={gDef.id}
                onClick={() => toggleGroup(gDef.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                  isChecked
                    ? 'bg-[#0b424c] text-white border-[#0b424c]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {gDef.nombre}
              </button>
            )
          })}
        </div>

        <button
          onClick={selectAll}
          className="text-xs font-bold text-[#0b424c] hover:underline whitespace-nowrap"
        >
          Mostrar los 9 Grupos
        </button>
      </div>

      {/* Tabla Oficial de 24 Horas y los 9 Grupos Electrógenos */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[700px]">
          <table className="w-full text-xs text-center border-collapse">
            {/* Header Nivel 1: Títulos de Grupos */}
            <thead className="bg-[#0b424c] text-white font-bold sticky top-0 z-20">
              <tr>
                <th rowSpan={2} className="py-3 px-3 text-center border-r border-[#08333b] sticky left-0 z-30 bg-[#0b424c] min-w-[70px]">
                  HORA
                </th>
                {visibleGroups.map((gDef, idx) => (
                  <th 
                    key={gDef.id} 
                    colSpan={7} 
                    className={`py-2.5 px-2 border-r border-[#08333b] tracking-wider uppercase ${
                      idx % 2 === 0 ? 'bg-[#0f4c5c]' : 'bg-[#0b424c]'
                    }`}
                  >
                    {gDef.nombre}
                  </th>
                ))}
              </tr>

              {/* Header Nivel 2: Parámetros */}
              <tr className="bg-[#08333b] text-slate-200 text-[10px] sm:text-[11px] font-semibold border-t border-[#0b424c]/40">
                {visibleGroups.map(gDef => (
                  <React.Fragment key={gDef.id}>
                    <th className="py-2 px-2 border-r border-slate-700/50">PRESIÓN ACEITE (PSI)</th>
                    <th className="py-2 px-2 border-r border-slate-700/50">TEMP. °C</th>
                    <th className="py-2 px-2 border-r border-slate-700/50">VELOC. RPM</th>
                    <th className="py-2 px-2 border-r border-slate-700/50">FREQ. HZ</th>
                    <th className="py-2 px-2 border-r border-slate-700/50">AMPERAJE (A)</th>
                    <th className="py-2 px-2 border-r border-slate-700/50">FACTOR POT. (COS Φ)</th>
                    <th className="py-2 px-2 border-r border-[#0f4c5c] text-amber-300 font-bold">ENERGÍA (KWH)</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>

            {/* Filas 01:00 a 00:00 */}
            <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
              {HORAS_24.map((hora) => (
                <tr key={hora} className="hover:bg-slate-50 transition">
                  {/* Hora fija a la izquierda */}
                  <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50 border-r border-slate-200 sticky left-0 z-10">
                    {hora}
                  </td>

                  {/* Celdas para cada grupo visible */}
                  {visibleGroups.map(gDef => {
                    const lec = (data.grupos?.[gDef.id]?.lecturas?.[hora] || {}) as Partial<GPPDataHora>
                    return (
                      <React.Fragment key={gDef.id}>
                        <td className="py-2.5 px-2 border-r border-slate-100">{lec.presionAceite ?? '-'}</td>
                        <td className="py-2.5 px-2 border-r border-slate-100">{lec.tempAgua ?? '-'}</td>
                        <td className="py-2.5 px-2 border-r border-slate-100">{lec.velocidadMotor ?? '-'}</td>
                        <td className="py-2.5 px-2 border-r border-slate-100">{lec.frecuencia ?? '-'}</td>
                        <td className="py-2.5 px-2 border-r border-slate-100">{lec.amperaje ?? '-'}</td>
                        <td className="py-2.5 px-2 border-r border-slate-100">{lec.factorPotencia ?? '-'}</td>
                        <td className="py-2.5 px-2 border-r border-slate-200 font-bold text-[#0b424c] bg-teal-50/20">
                          {lec.energia ? lec.energia.toLocaleString() : '-'}
                        </td>
                      </React.Fragment>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
