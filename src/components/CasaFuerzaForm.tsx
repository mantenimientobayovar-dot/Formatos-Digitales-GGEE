'use client'

import React, { useState } from 'react'
import { 
  CasaFuerzaRegistroDia, 
  EquipoCasaFuerza, 
  Parametros4H, 
  HORAS_4H 
} from '../types'
import { 
  Fuel, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  Zap, 
  Wrench, 
  Cpu,
  Gauge
} from 'lucide-react'

interface CasaFuerzaFormProps {
  data: CasaFuerzaRegistroDia
  onChange: (updated: CasaFuerzaRegistroDia) => void
}

export const CasaFuerzaForm: React.FC<CasaFuerzaFormProps> = ({ data, onChange }) => {
  const [subTab, setSubTab] = useState<'equipos' | 'parametros4h' | 'fallas'>('equipos')
  const [selectedEquipo4H, setSelectedEquipo4H] = useState<string>('G1')

  // Actualizar datos de un equipo en la tabla
  const handleEquipoChange = (index: number, field: keyof EquipoCasaFuerza, value: string) => {
    const numValue = value === '' ? null : parseFloat(value)
    const updatedEquipos = [...data.equipos]
    const eq = { ...updatedEquipos[index], [field]: numValue }

    // Recalcular total horas automáticamente si cambian los turnos
    if (field === 'horasTurno1' || field === 'horasTurno2' || field === 'horasTurno3') {
      const h1 = Number(field === 'horasTurno1' ? numValue : eq.horasTurno1) || 0
      const h2 = Number(field === 'horasTurno2' ? numValue : eq.horasTurno2) || 0
      const h3 = Number(field === 'horasTurno3' ? numValue : eq.horasTurno3) || 0
      eq.totalHoras = Number((h1 + h2 + h3).toFixed(2))
    }

    updatedEquipos[index] = eq
    onChange({ ...data, equipos: updatedEquipos })
  }

  // Actualizar parámetro eléctrico de 4H
  const handleParam4HChange = (hora: string, field: keyof Parametros4H, value: string) => {
    const numValue = value === '' ? null : parseFloat(value)
    const currList = data.parametrosElectricos?.[selectedEquipo4H] || []
    
    const updatedList = HORAS_4H.map(h => {
      const existing = currList.find(p => p.hora === h) || { hora: h }
      if (h === hora) {
        return { ...existing, [field]: numValue }
      }
      return existing
    })

    onChange({
      ...data,
      parametrosElectricos: {
        ...data.parametrosElectricos,
        [selectedEquipo4H]: updatedList
      }
    })
  }

  // Totales generales calculados
  const totalDieselGln = data.equipos.reduce((acc, eq) => acc + (Number(eq.consumoDieselGln) || 0), 0)
  const totalHorasPlanta = data.equipos.reduce((acc, eq) => acc + (Number(eq.totalHoras) || 0), 0)

  return (
    <div className="space-y-6 pb-12">
      {/* Sub-navegación dentro de Casa de Fuerza */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('equipos')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              subTab === 'equipos'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Horas & Combustible ({data.equipos.length} Equipos)</span>
          </button>

          <button
            onClick={() => setSubTab('parametros4h')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              subTab === 'parametros4h'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Parámetros Eléctricos (4 Horas)</span>
          </button>

          <button
            onClick={() => setSubTab('fallas')}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
              subTab === 'fallas'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Fallas & Turnos</span>
          </button>
        </div>

        {/* Resumen rápido de totales */}
        <div className="flex items-center gap-4 text-xs font-semibold bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Fuel className="w-3.5 h-3.5" />
            <span>Diésel Total: {totalDieselGln.toLocaleString()} gln</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Horas Totales: {totalHorasPlanta.toFixed(1)} hrs</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-PESTAÑA 1: TABLA DE EQUIPOS, HORAS Y COMBUSTIBLE                      */}
      {/* ========================================================================= */}
      {subTab === 'equipos' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/60">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Mantenimiento Planta Harina - Casa de Fuerza
              </h2>
              <p className="text-xs text-slate-400">
                Puntos de Medida e Integración SAP para Grupos, Purificadores y Compresores
              </p>
            </div>
            <div className="text-xs text-slate-400">
              Responsable: <span className="font-semibold text-amber-400">{data.responsable}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-950 text-slate-300 uppercase font-bold sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-2 text-center w-10">Item</th>
                  <th className="py-3 px-3 min-w-[200px]">Equipo</th>
                  <th className="py-3 px-2 text-center">Código SAP</th>
                  <th className="py-3 px-2 text-center">Punto Medida</th>
                  <th className="py-3 px-2 text-center bg-amber-950/30 text-amber-300">Consumo Diésel (GLN)</th>
                  <th className="py-3 px-2 text-center">00:00 - 08:00 (h)</th>
                  <th className="py-3 px-2 text-center">08:00 - 19:00 (h)</th>
                  <th className="py-3 px-2 text-center">19:00 - 00:00 (h)</th>
                  <th className="py-3 px-2 text-center bg-emerald-950/30 text-emerald-300 font-bold">Total Horas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {data.equipos.map((eq, idx) => (
                  <tr key={eq.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-2 text-center font-bold text-slate-400">
                      {eq.item}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-100">
                      {eq.nombre}
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-slate-400">
                      {eq.codigoSap}
                    </td>
                    <td className="py-2.5 px-2 text-center font-mono text-slate-400">
                      {eq.puntoMedida}
                    </td>
                    {/* Consumo Diesel */}
                    <td className="p-1 bg-amber-950/10">
                      <input
                        type="number"
                        step="0.5"
                        placeholder="0"
                        value={eq.consumoDieselGln ?? ''}
                        onChange={(e) => handleEquipoChange(idx, 'consumoDieselGln', e.target.value)}
                        className="w-full bg-slate-950/90 border border-slate-700/80 rounded px-2 py-1.5 text-center font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                      />
                    </td>
                    {/* Horas 00-08 */}
                    <td className="p-1">
                      <input
                        type="number"
                        step="0.1"
                        max="8"
                        placeholder="0"
                        value={eq.horasTurno1 ?? ''}
                        onChange={(e) => handleEquipoChange(idx, 'horasTurno1', e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded px-2 py-1.5 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </td>
                    {/* Horas 08-19 */}
                    <td className="p-1">
                      <input
                        type="number"
                        step="0.1"
                        max="11"
                        placeholder="0"
                        value={eq.horasTurno2 ?? ''}
                        onChange={(e) => handleEquipoChange(idx, 'horasTurno2', e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded px-2 py-1.5 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </td>
                    {/* Horas 19-00 */}
                    <td className="p-1">
                      <input
                        type="number"
                        step="0.1"
                        max="5"
                        placeholder="0"
                        value={eq.horasTurno3 ?? ''}
                        onChange={(e) => handleEquipoChange(idx, 'horasTurno3', e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded px-2 py-1.5 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </td>
                    {/* Total Horas Automático */}
                    <td className="py-2.5 px-2 text-center font-bold text-emerald-400 bg-emerald-950/10 font-mono">
                      {eq.totalHoras ? `${eq.totalHoras} h` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PESTAÑA 2: PARÁMETROS ELÉCTRICOS (CADA 4 HORAS)                       */}
      {/* ========================================================================= */}
      {subTab === 'parametros4h' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Lecturas de Parámetros Eléctricos (Intervalos de 4 Horas)
              </h3>
              <p className="text-xs text-slate-400">
                Tensiones de Fase, Corrientes, Potencia Activa/Reactiva y Factor de Potencia
              </p>
            </div>

            {/* Selector de Grupo para 4H */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Grupo:</span>
              {(['G1', 'G2', 'G3'] as const).map((gid) => (
                <button
                  key={gid}
                  onClick={() => setSelectedEquipo4H(gid)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedEquipo4H === gid
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Burmeister N° {gid.replace('G', '')}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-950 text-slate-300 uppercase font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3 text-center">Hora</th>
                  <th className="py-3 px-2 text-center">V1 (V)</th>
                  <th className="py-3 px-2 text-center">V2 (V)</th>
                  <th className="py-3 px-2 text-center">V3 (V)</th>
                  <th className="py-3 px-2 text-center">A1 (A)</th>
                  <th className="py-3 px-2 text-center">A2 (A)</th>
                  <th className="py-3 px-2 text-center">A3 (A)</th>
                  <th className="py-3 px-2 text-center">Potencia (W)</th>
                  <th className="py-3 px-2 text-center">PF (cos φ)</th>
                  <th className="py-3 px-2 text-center">Freq (Hz)</th>
                  <th className="py-3 px-2 text-center">Energía (KWh)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {HORAS_4H.map(h => {
                  const currList = data.parametrosElectricos?.[selectedEquipo4H] || []
                  const p = currList.find(item => item.hora === h) || { hora: h }
                  return (
                    <tr key={h} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-center font-bold text-amber-400 bg-slate-950/60">
                        {h}
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="1"
                          placeholder="440"
                          value={p.v1 ?? ''}
                          onChange={(e) => handleParam4HChange(h, 'v1', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="1"
                          placeholder="440"
                          value={p.v2 ?? ''}
                          onChange={(e) => handleParam4HChange(h, 'v2', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="1"
                          placeholder="440"
                          value={p.v3 ?? ''}
                          onChange={(e) => handleParam4HChange(h, 'v3', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="1"
                          placeholder="380"
                          value={p.a1 ?? ''}
                          onChange={(e) => handleParam4HChange(h, 'a1', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="1"
                          placeholder="380"
                          value={p.a2 ?? ''}
                          onChange={(e) => handleParam4HChange(h, 'a2', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="1"
                          placeholder="380"
                          value={p.a3 ?? ''}
                          onChange={(e) => handleParam4HChange(h, 'a3', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="10"
                          placeholder="KW"
                          value={p.w ?? ''}
                          onChange={(e) => handleParam4HChange(h, 'w', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.85"
                          value={p.pf ?? ''}
                          onChange={(e) => handleParam4HChange(h, 'pf', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="60.0"
                          value={p.hz ?? ''}
                          onChange={(e) => handleParam4HChange(h, 'hz', e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="1"
                          placeholder="KWh"
                          value={p.kwh ?? ''}
                          onChange={(e) => handleParam4HChange(h, 'kwh', e.target.value)}
                          className="w-full bg-slate-950 border border-amber-500/40 rounded px-2 py-1 text-center font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-PESTAÑA 3: REGISTRO DE FALLAS EN EQUIPO                               */}
      {/* ========================================================================= */}
      {subTab === 'fallas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Fallas Observadas en Equipo - Turno Día</span>
            </div>
            <textarea
              rows={6}
              placeholder="Describir si hubo fallas mecánicas, fugas de aceite o agua, problemas en disyuntor o anomalías en compresores/purificadores..."
              value={data.fallasTurnoDia}
              onChange={(e) => onChange({ ...data, fallasTurnoDia: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Fallas Observadas en Equipo - Turno Noche</span>
            </div>
            <textarea
              rows={6}
              placeholder="Describir novedades del turno de noche..."
              value={data.fallasTurnoNoche}
              onChange={(e) => onChange({ ...data, fallasTurnoNoche: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}
