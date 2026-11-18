import React, { useState } from 'react'
import { 
  GPPRegistroDia, 
  HORAS_24, 
  LIMITES_OPERACIONALES,
  GPPDataHora
} from '../types'
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  FileText, 
  Activity,
  Zap,
  Tablet,
  LayoutGrid,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface GPPFormProps {
  data: GPPRegistroDia
  onChange: (updated: GPPRegistroDia) => void
}

export const GPPForm: React.FC<GPPFormProps> = ({ data, onChange }) => {
  const [selectedGroup, setSelectedGroup] = useState<'G1' | 'G2' | 'G3'>('G1')
  const [viewMode, setViewMode] = useState<'mobile' | 'table'>('mobile')
  
  // Para la vista móvil paso a paso
  const currentHourIndex = new Date().getHours()
  const defaultHora = HORAS_24[currentHourIndex === 0 ? 23 : currentHourIndex - 1] || '08:00'
  const [selectedHora, setSelectedHora] = useState<string>(defaultHora)

  const activeGroup = data.grupos?.[selectedGroup] || {
    id: selectedGroup,
    nombre: `GRUPO ELECTROGENO N° ${selectedGroup.replace('G', '')}`,
    activo: true,
    lecturas: {}
  }

  const currentLectura: GPPDataHora = activeGroup.lecturas?.[selectedHora] || {
    hora: selectedHora,
    presionAceite: null,
    tempAgua: null,
    velocidadMotor: null,
    frecuencia: null,
    amperaje: null,
    factorPotencia: null,
    energia: null
  }

  // Actualizar un campo de una hora específica
  const handleFieldChange = (hora: string, field: keyof GPPDataHora, value: string) => {
    const numValue = value === '' ? null : parseFloat(value)
    
    const updatedGrupos = {
      ...data.grupos,
      [selectedGroup]: {
        ...activeGroup,
        lecturas: {
          ...activeGroup.lecturas,
          [hora]: {
            ...(activeGroup.lecturas?.[hora] || { hora }),
            [field]: numValue
          }
        }
      }
    }

    onChange({
      ...data,
      grupos: updatedGrupos
    })
  }

  // Cambiar estado activo del grupo
  const toggleGroupActivo = () => {
    const updatedGrupos = {
      ...data.grupos,
      [selectedGroup]: {
        ...activeGroup,
        activo: !activeGroup.activo
      }
    }
    onChange({ ...data, grupos: updatedGrupos })
  }

  // Navegar horas en vista móvil
  const handlePrevHora = () => {
    const idx = HORAS_24.indexOf(selectedHora)
    if (idx > 0) setSelectedHora(HORAS_24[idx - 1])
  }
  const handleNextHora = () => {
    const idx = HORAS_24.indexOf(selectedHora)
    if (idx < HORAS_24.length - 1) setSelectedHora(HORAS_24[idx + 1])
  }

  // Helper para el semáforo visual de rangos
  const getFieldStatus = (field: string, val: number | null | undefined) => {
    if (val === null || val === undefined || isNaN(val)) return 'normal'
    const lim = (LIMITES_OPERACIONALES as any)[field]
    if (!lim) return 'normal'

    if ((lim.minDanger !== undefined && val <= lim.minDanger) || (lim.maxDanger !== undefined && val >= lim.maxDanger)) {
      return 'danger'
    }
    if ((lim.minWarn !== undefined && val <= lim.minWarn) || (lim.maxWarn !== undefined && val >= lim.maxWarn)) {
      return 'warn'
    }
    return 'ok'
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Selector de Grupo Electrógeno y Modo de Vista */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Pestañas de Grupo */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {(['G1', 'G2', 'G3'] as const).map((gid) => {
              const grp = data.grupos?.[gid]
              const isSelected = selectedGroup === gid
              return (
                <button
                  key={gid}
                  onClick={() => setSelectedGroup(gid)}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Grupo {gid.replace('G', '')}</span>
                  {grp?.activo ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Toggle de Estado del Grupo y Modo de Visualización */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <button
              onClick={toggleGroupActivo}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                activeGroup.activo
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${activeGroup.activo ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              <span>{activeGroup.activo ? 'En Servicio' : 'En Reserva / Parado'}</span>
            </button>

            {/* Alternar vista móvil / tabla */}
            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded-md transition ${viewMode === 'mobile' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                title="Vista Ronda Móvil (Paso a Paso)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition ${viewMode === 'table' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
                title="Vista Matriz Completa 24h"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: MODO RONDA RÁPIDA (Mobile / Tablet)                              */}
      {/* ========================================================================= */}
      {viewMode === 'mobile' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-6">
          {/* Navegador Horario Superior */}
          <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <button
              onClick={handlePrevHora}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              title="Hora anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <select
                value={selectedHora}
                onChange={(e) => setSelectedHora(e.target.value)}
                className="bg-transparent text-lg sm:text-xl font-bold text-amber-400 outline-none cursor-pointer tracking-wider"
              >
                {HORAS_24.map(h => (
                  <option key={h} value={h} className="bg-slate-900 text-white">
                    {h} hrs
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleNextHora}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              title="Hora siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Tarjetas de Parámetros de Operación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Presión de Aceite */}
            <div className={`p-4 rounded-xl border transition ${
              getFieldStatus('presionAceite', currentLectura.presionAceite) === 'danger'
                ? 'bg-rose-950/30 border-rose-500/60'
                : getFieldStatus('presionAceite', currentLectura.presionAceite) === 'warn'
                ? 'bg-amber-950/30 border-amber-500/60'
                : 'bg-slate-800/60 border-slate-700/60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Presión de Aceite</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400">psi</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.5"
                  placeholder="ej. 55"
                  value={currentLectura.presionAceite ?? ''}
                  onChange={(e) => handleFieldChange(selectedHora, 'presionAceite', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xl font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Rango seguro: 40 - 70 psi</span>
                {getFieldStatus('presionAceite', currentLectura.presionAceite) === 'danger' && (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> ¡Alarma!
                  </span>
                )}
              </div>
            </div>

            {/* Temperatura de Refrigerante */}
            <div className={`p-4 rounded-xl border transition ${
              getFieldStatus('tempAgua', currentLectura.tempAgua) === 'danger'
                ? 'bg-rose-950/30 border-rose-500/60'
                : getFieldStatus('tempAgua', currentLectura.tempAgua) === 'warn'
                ? 'bg-amber-950/30 border-amber-500/60'
                : 'bg-slate-800/60 border-slate-700/60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">T° Agua Refrig.</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400">°C</span>
              </div>
              <input
                type="number"
                step="0.5"
                placeholder="ej. 78"
                value={currentLectura.tempAgua ?? ''}
                onChange={(e) => handleFieldChange(selectedHora, 'tempAgua', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xl font-bold text-white focus:outline-none focus:border-amber-500"
              />
              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Rango seguro: 70 - 85 °C</span>
                {getFieldStatus('tempAgua', currentLectura.tempAgua) === 'danger' && (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> ¡Sobrecalentamiento!
                  </span>
                )}
              </div>
            </div>

            {/* Velocidad del Motor (RPM) */}
            <div className="p-4 rounded-xl border bg-slate-800/60 border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Velocidad Motor</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400">rpm</span>
              </div>
              <input
                type="number"
                step="1"
                placeholder="ej. 1800"
                value={currentLectura.velocidadMotor ?? ''}
                onChange={(e) => handleFieldChange(selectedHora, 'velocidadMotor', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xl font-bold text-white focus:outline-none focus:border-amber-500"
              />
              <div className="mt-2 text-[11px] text-slate-400">Nominal: 1800 rpm (60 Hz)</div>
            </div>

            {/* Frecuencia (Hz) */}
            <div className={`p-4 rounded-xl border transition ${
              getFieldStatus('frecuencia', currentLectura.frecuencia) === 'danger'
                ? 'bg-rose-950/30 border-rose-500/60'
                : 'bg-slate-800/60 border-slate-700/60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Frecuencia</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400">Hz</span>
              </div>
              <input
                type="number"
                step="0.1"
                placeholder="ej. 60.0"
                value={currentLectura.frecuencia ?? ''}
                onChange={(e) => handleFieldChange(selectedHora, 'frecuencia', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xl font-bold text-white focus:outline-none focus:border-amber-500"
              />
              <div className="mt-2 text-[11px] text-slate-400">Normal: 59.8 - 60.2 Hz</div>
            </div>

            {/* Amperaje (A) */}
            <div className="p-4 rounded-xl border bg-slate-800/60 border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Amperaje</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400">A</span>
              </div>
              <input
                type="number"
                step="1"
                placeholder="ej. 450"
                value={currentLectura.amperaje ?? ''}
                onChange={(e) => handleFieldChange(selectedHora, 'amperaje', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xl font-bold text-white focus:outline-none focus:border-amber-500"
              />
              <div className="mt-2 text-[11px] text-slate-400">Corriente de carga generador</div>
            </div>

            {/* Factor de Potencia (Cos φ) */}
            <div className="p-4 rounded-xl border bg-slate-800/60 border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Factor de Potencia</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-400">Cos φ</span>
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                placeholder="ej. 0.88"
                value={currentLectura.factorPotencia ?? ''}
                onChange={(e) => handleFieldChange(selectedHora, 'factorPotencia', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xl font-bold text-white focus:outline-none focus:border-amber-500"
              />
              <div className="mt-2 text-[11px] text-slate-400">Rango deseable: 0.80 - 1.00</div>
            </div>

            {/* Energía Acumulada (KWH) */}
            <div className="p-4 rounded-xl border bg-slate-800/60 border-slate-700/60 sm:col-span-2 lg:col-span-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Lectura de Energía Acumulada</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">KWH</span>
              </div>
              <input
                type="number"
                step="1"
                placeholder="Lectura totalizador de KWH en medidor"
                value={currentLectura.energia ?? ''}
                onChange={(e) => handleFieldChange(selectedHora, 'energia', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-2xl font-bold text-amber-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: MODO MATRIZ HORARIA COMPLETA (24h Desktop)                      */}
      {/* ========================================================================= */}
      {viewMode === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-950 text-slate-300 uppercase font-bold sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3 w-16 text-center bg-slate-950 sticky left-0 z-10 border-r border-slate-800">Hora</th>
                  <th className="py-3 px-2 text-center">Presión Aceite<br/><span className="text-[10px] text-slate-400">(psi)</span></th>
                  <th className="py-3 px-2 text-center">T° Agua<br/><span className="text-[10px] text-slate-400">(°C)</span></th>
                  <th className="py-3 px-2 text-center">Velocidad<br/><span className="text-[10px] text-slate-400">(rpm)</span></th>
                  <th className="py-3 px-2 text-center">Frecuencia<br/><span className="text-[10px] text-slate-400">(Hz)</span></th>
                  <th className="py-3 px-2 text-center">Amperaje<br/><span className="text-[10px] text-slate-400">(A)</span></th>
                  <th className="py-3 px-2 text-center">Cos φ<br/><span className="text-[10px] text-slate-400">(PF)</span></th>
                  <th className="py-3 px-2 text-center">Energía<br/><span className="text-[10px] text-amber-400">(KWH)</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {HORAS_24.map((hora) => {
                  const lec: Partial<GPPDataHora> = activeGroup.lecturas?.[hora] || {}
                  return (
                    <tr key={hora} className="hover:bg-slate-800/40 transition">
                      <td className="py-2 px-2 text-center font-bold text-amber-400 bg-slate-900/90 sticky left-0 z-10 border-r border-slate-800">
                        {hora}
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.5"
                          value={lec.presionAceite ?? ''}
                          onChange={(e) => handleFieldChange(hora, 'presionAceite', e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded px-2 py-1.5 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.5"
                          value={lec.tempAgua ?? ''}
                          onChange={(e) => handleFieldChange(hora, 'tempAgua', e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded px-2 py-1.5 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="1"
                          value={lec.velocidadMotor ?? ''}
                          onChange={(e) => handleFieldChange(hora, 'velocidadMotor', e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded px-2 py-1.5 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.1"
                          value={lec.frecuencia ?? ''}
                          onChange={(e) => handleFieldChange(hora, 'frecuencia', e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded px-2 py-1.5 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="1"
                          value={lec.amperaje ?? ''}
                          onChange={(e) => handleFieldChange(hora, 'amperaje', e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded px-2 py-1.5 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="0.01"
                          value={lec.factorPotencia ?? ''}
                          onChange={(e) => handleFieldChange(hora, 'factorPotencia', e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded px-2 py-1.5 text-center text-slate-100 focus:outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-1">
                        <input
                          type="number"
                          step="1"
                          value={lec.energia ?? ''}
                          onChange={(e) => handleFieldChange(hora, 'energia', e.target.value)}
                          className="w-full bg-slate-950/80 border border-amber-500/40 rounded px-2 py-1.5 text-center text-amber-400 font-bold focus:outline-none focus:border-amber-500"
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
      {/* SECCIÓN OPERADORES, OBSERVACIONES Y VISTOS BUENOS                        */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Operadores y Responsables */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <User className="w-4 h-4" />
            <span>Personal de Turno</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Operador Turno "A" (Día):</label>
              <input
                type="text"
                placeholder="Nombre y Apellidos del operador"
                value={data.operadorA}
                onChange={(e) => onChange({ ...data, operadorA: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Operador Turno "B" (Noche):</label>
              <input
                type="text"
                placeholder="Nombre y Apellidos del operador"
                value={data.operadorB}
                onChange={(e) => onChange({ ...data, operadorB: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Vistos Buenos */}
          <div className="pt-2 border-t border-slate-800 flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={data.voboJefe}
                onChange={(e) => onChange({ ...data, voboJefe: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              <span>VºBº Jefe de Planta</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={data.voboSuperintendente}
                onChange={(e) => onChange({ ...data, voboSuperintendente: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              <span>VºBº Superintendente</span>
            </label>
          </div>
        </div>

        {/* Observaciones Generales */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <FileText className="w-4 h-4" />
            <span>Observaciones Generales de la Guardia</span>
          </div>
          <textarea
            rows={4}
            placeholder="Reportar novedades mecánicas, paradas intempestivas, reposición de combustible o mantenimiento efectuado..."
            value={data.observaciones}
            onChange={(e) => onChange({ ...data, observaciones: e.target.value })}
            className="w-full flex-1 bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
          />
        </div>
      </div>
    </div>
  )
}
