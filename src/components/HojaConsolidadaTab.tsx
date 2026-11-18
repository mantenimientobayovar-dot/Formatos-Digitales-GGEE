import React from 'react'
import { GPPRegistroDia, HORAS_24, GPPDataHora } from '../types'
import { FileDown, FileSpreadsheet } from 'lucide-react'
import { exportGPPToExcel } from '../services/excelExport'

interface HojaConsolidadaTabProps {
  data: GPPRegistroDia
  onDownloadPDF: () => void
}

export const HojaConsolidadaTab: React.FC<HojaConsolidadaTabProps> = ({ data, onDownloadPDF }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm space-y-6">
      {/* Encabezado Superior (Exacto a la Imagen 2) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            Consolidado Oficial de Grupos Electrógenos — GPP-FOR-021
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hoja completa de 24 horas y Grupos Electrógenos sincronizada en tiempo real.
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

      {/* Tabla Oficial de 24 Horas y Grupos Electrógenos */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse">
            {/* Header Nivel 1: Títulos de Grupos */}
            <thead className="bg-[#0b424c] text-white font-bold">
              <tr>
                <th rowSpan={2} className="py-3 px-3 text-center border-r border-[#08333b] sticky left-0 z-20 bg-[#0b424c] min-w-[70px]">
                  HORA
                </th>
                <th colSpan={7} className="py-2.5 px-2 border-r border-[#08333b] bg-[#0f4c5c] tracking-wider uppercase">
                  GRUPO 01
                </th>
                <th colSpan={7} className="py-2.5 px-2 border-r border-[#08333b] bg-[#0b424c] tracking-wider uppercase">
                  GRUPO 02
                </th>
                <th colSpan={7} className="py-2.5 px-2 bg-[#0f4c5c] tracking-wider uppercase">
                  GRUPO 03
                </th>
              </tr>

              {/* Header Nivel 2: Parámetros */}
              <tr className="bg-[#08333b] text-slate-200 text-[10px] sm:text-[11px] font-semibold border-t border-[#0b424c]/40">
                {/* G1 */}
                <th className="py-2 px-2 border-r border-slate-700/50">PRESIÓN ACEITE (PSI)</th>
                <th className="py-2 px-2 border-r border-slate-700/50">TEMP. °C</th>
                <th className="py-2 px-2 border-r border-slate-700/50">VELOC. RPM</th>
                <th className="py-2 px-2 border-r border-slate-700/50">FREQ. HZ</th>
                <th className="py-2 px-2 border-r border-slate-700/50">AMPERAJE (A)</th>
                <th className="py-2 px-2 border-r border-slate-700/50">FACTOR POT. (COS Φ)</th>
                <th className="py-2 px-2 border-r border-[#0f4c5c] text-amber-300 font-bold">ENERGÍA (KWH)</th>

                {/* G2 */}
                <th className="py-2 px-2 border-r border-slate-700/50">PRESIÓN ACEITE (PSI)</th>
                <th className="py-2 px-2 border-r border-slate-700/50">TEMP. °C</th>
                <th className="py-2 px-2 border-r border-slate-700/50">VELOC. RPM</th>
                <th className="py-2 px-2 border-r border-slate-700/50">FREQ. HZ</th>
                <th className="py-2 px-2 border-r border-slate-700/50">AMPERAJE (A)</th>
                <th className="py-2 px-2 border-r border-slate-700/50">FACTOR POT. (COS Φ)</th>
                <th className="py-2 px-2 border-r border-[#0f4c5c] text-amber-300 font-bold">ENERGÍA (KWH)</th>

                {/* G3 */}
                <th className="py-2 px-2 border-r border-slate-700/50">PRESIÓN ACEITE (PSI)</th>
                <th className="py-2 px-2 border-r border-slate-700/50">TEMP. °C</th>
                <th className="py-2 px-2 border-r border-slate-700/50">VELOC. RPM</th>
                <th className="py-2 px-2 border-r border-slate-700/50">FREQ. HZ</th>
                <th className="py-2 px-2 border-r border-slate-700/50">AMPERAJE (A)</th>
                <th className="py-2 px-2 border-r border-slate-700/50">FACTOR POT. (COS Φ)</th>
                <th className="py-2 px-2 text-amber-300 font-bold">ENERGÍA (KWH)</th>
              </tr>
            </thead>

            {/* Filas 01:00 a 00:00 */}
            <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
              {HORAS_24.map((hora) => {
                const g1 = (data.grupos?.G1?.lecturas?.[hora] || {}) as Partial<GPPDataHora>
                const g2 = (data.grupos?.G2?.lecturas?.[hora] || {}) as Partial<GPPDataHora>
                const g3 = (data.grupos?.G3?.lecturas?.[hora] || {}) as Partial<GPPDataHora>

                return (
                  <tr key={hora} className="hover:bg-slate-50 transition">
                    {/* Hora fija a la izquierda */}
                    <td className="py-2.5 px-3 font-bold text-slate-900 bg-slate-50 border-r border-slate-200 sticky left-0 z-10">
                      {hora}
                    </td>

                    {/* Grupo 01 */}
                    <td className="py-2.5 px-2 border-r border-slate-100">{g1.presionAceite ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-100">{g1.tempAgua ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-100">{g1.velocidadMotor ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-100">{g1.frecuencia ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-100">{g1.amperaje ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-100">{g1.factorPotencia ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 font-bold text-[#0b424c] bg-teal-50/20">{g1.energia ? g1.energia.toLocaleString() : '-'}</td>

                    {/* Grupo 02 */}
                    <td className="py-2.5 px-2 border-r border-slate-100">{g2.presionAceite ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-100">{g2.tempAgua ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-100">{g2.velocidadMotor ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-100">{g2.frecuencia ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-100">{g2.amperaje ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-100">{g2.factorPotencia ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 font-bold text-[#0b424c] bg-teal-50/20">{g2.energia ? g2.energia.toLocaleString() : '-'}</td>

                    {/* Grupo 03 */}
                    <td className="py-2.5 px-2 border-r border-slate-100">{g3.presionAceite ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-100">{g3.tempAgua ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-100">{g3.velocidadMotor ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-100">{g3.frecuencia ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-100">{g3.amperaje ?? '-'}</td>
                    <td className="py-2.5 px-2 border-r border-slate-100">{g3.factorPotencia ?? '-'}</td>
                    <td className="py-2.5 px-2 font-bold text-[#0b424c] bg-teal-50/20">{g3.energia ? g3.energia.toLocaleString() : '-'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
