'use client'

import React, { useState } from 'react'
import { 
  GPPRegistroDia, 
  HORAS_24, 
  HORAS_TURNO_A, 
  HORAS_TURNO_B,
  GPPDataHora
} from '../types'
import { 
  Clock, 
  User, 
  Copy, 
  Zap, 
  Check,
  Edit3, 
  FileText
} from 'lucide-react'

interface RegistroPorHoraTabProps {
  data: GPPRegistroDia
  onChange: (updated: GPPRegistroDia) => void
}

export const RegistroPorHoraTab: React.FC<RegistroPorHoraTabProps> = ({ data, onChange }) => {
  // Inicializar en la hora actual o 23:00 (como en la última imagen adjunta)
  const currentHourNum = new Date().getHours()
  const defaultHour = HORAS_24[currentHourNum === 0 ? 23 : currentHourNum - 1] || '23:00'
  const [selectedHora, setSelectedHora] = useState<string>(defaultHour)
  const [editingOperator, setEditingOperator] = useState(false)

  // Determinar turno según la hora seleccionada
  const isTurnoA = HORAS_TURNO_A.includes(selectedHora)
  const currentTurnoNombre = isTurnoA ? 'TURNO A' : 'TURNO B'
  const currentOperador = isTurnoA ? (data.operadorA || 'Juan Sanchez') : (data.operadorB || 'Luis Rumiche Anton')

  // Grupos activos en la hora seleccionada
  const activeGroupIds: string[] = data.gruposActivosPorHora?.[selectedHora] || ['G1']

  // Conteo de horas completadas
  const horasRegistradasCount = HORAS_24.filter(h => {
    return Object.values(data.grupos || {}).some(grp => {
      const lec = grp.lecturas?.[h]
      return lec && lec.presionAceite !== null && lec.presionAceite !== undefined
    })
  }).length

  // Activar / desactivar un grupo en la hora actual
  const toggleGroupForHour = (gid: string) => {
    const currentList = [...activeGroupIds]
    const idx = currentList.indexOf(gid)
    if (idx >= 0) {
      currentList.splice(idx, 1)
    } else {
      currentList.push(gid)
    }

    onChange({
      ...data,
      gruposActivosPorHora: {
        ...data.gruposActivosPorHora,
        [selectedHora]: currentList
      }
    })
  }

  // Seleccionar todos los grupos
  const handleSelectAllGroups = () => {
    const all = ['G1', 'G2', 'G3']
    const isAllSelected = all.every(g => activeGroupIds.includes(g))
    onChange({
      ...data,
      gruposActivosPorHora: {
        ...data.gruposActivosPorHora,
        [selectedHora]: isAllSelected ? [] : all
      }
    })
  }

  // Modificar valor de lectura
  const handleFieldChange = (gid: string, field: keyof GPPDataHora, val: string) => {
    const num = val === '' ? null : parseFloat(val)
    const grp = data.grupos?.[gid]
    if (!grp) return

    const updatedLecturas = {
      ...grp.lecturas,
      [selectedHora]: {
        ...(grp.lecturas?.[selectedHora] || { hora: selectedHora }),
        [field]: num
      }
    }

    onChange({
      ...data,
      grupos: {
        ...data.grupos,
        [gid]: {
          ...grp,
          lecturas: updatedLecturas
        }
      }
    })
  }

  // Copiar lecturas de la hora anterior
  const handleCopyFromPreviousHour = () => {
    const idx = HORAS_24.indexOf(selectedHora)
    if (idx <= 0) return
    const prevHora = HORAS_24[idx - 1]

    const prevActiveGroups = data.gruposActivosPorHora?.[prevHora] || []
    const updatedGrupos = { ...data.grupos }

    Object.keys(updatedGrupos).forEach(gid => {
      const prevData = updatedGrupos[gid]?.lecturas?.[prevHora]
      if (prevData) {
        updatedGrupos[gid] = {
          ...updatedGrupos[gid],
          lecturas: {
            ...updatedGrupos[gid].lecturas,
            [selectedHora]: {
              ...prevData,
              hora: selectedHora
            }
          }
        }
      }
    })

    onChange({
      ...data,
      gruposActivosPorHora: {
        ...data.gruposActivosPorHora,
        [selectedHora]: [...prevActiveGroups]
      },
      grupos: updatedGrupos
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ========================================================================= */}
      {/* COLUMNA IZQUIERDA: TURNO, OPERADOR Y SELECTOR DE 24 HORAS                */}
      {/* ========================================================================= */}
      <div className="lg:col-span-4 space-y-5">
        {/* Card 1: Turno y Operador de Guardia */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
            Turno y Operador de Guardia
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-3">
            {/* Turno A Card */}
            <div 
              onClick={() => onChange({ ...data, turnoActivo: 'A' })}
              className={`p-3 rounded-xl border-2 cursor-pointer transition ${
                data.turnoActivo === 'A'
                  ? 'border-[#0b424c] bg-slate-50/80 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-900">Turno A</span>
                {data.turnoActivo === 'A' && (
                  <span className="text-[10px] font-bold uppercase bg-[#0b424c] text-white px-2 py-0.5 rounded-md">
                    Activo
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-medium truncate">
                {data.operadorA || 'Juan Sanchez'}
              </p>
            </div>

            {/* Turno B Card */}
            <div 
              onClick={() => onChange({ ...data, turnoActivo: 'B' })}
              className={`p-3 rounded-xl border-2 cursor-pointer transition ${
                data.turnoActivo === 'B'
                  ? 'border-[#0b424c] bg-slate-50/80 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-900">Turno B</span>
                {data.turnoActivo === 'B' && (
                  <span className="text-[10px] font-bold uppercase bg-[#0b424c] text-white px-2 py-0.5 rounded-md">
                    Activo
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-medium truncate">
                {data.operadorB || 'Luis Rumiche Anton'}
              </p>
            </div>
          </div>

          {/* Selector de Nombre de Operador */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 flex-1 mr-2">
              <User className="w-4 h-4 text-slate-400" />
              {editingOperator ? (
                <input
                  type="text"
                  autoFocus
                  value={data.turnoActivo === 'A' ? data.operadorA : data.operadorB}
                  onChange={(e) => {
                    if (data.turnoActivo === 'A') {
                      onChange({ ...data, operadorA: e.target.value })
                    } else {
                      onChange({ ...data, operadorB: e.target.value })
                    }
                  }}
                  onBlur={() => setEditingOperator(false)}
                  className="text-xs font-bold text-slate-900 border-b border-slate-400 outline-none w-full bg-transparent"
                />
              ) : (
                <span className="text-xs font-bold text-slate-800">
                  {data.turnoActivo === 'A' ? data.operadorA : data.operadorB}
                </span>
              )}
            </div>
            <button
              onClick={() => setEditingOperator(!editingOperator)}
              className="text-slate-400 hover:text-slate-600 p-1"
              title="Editar nombre"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: Selector de 24 Horas */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>HORAS ({horasRegistradasCount}/24)</span>
            </div>
            <button
              onClick={() => {
                const nowHour = new Date().getHours()
                const target = HORAS_24[nowHour === 0 ? 23 : nowHour - 1] || '23:00'
                setSelectedHora(target)
              }}
              className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-[#0b424c] transition"
            >
              <Clock className="w-3 h-3" />
              <span>Hora actual</span>
            </button>
          </div>

          {/* Grilla 4x6 de 24 Horas */}
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
            {HORAS_24.map(h => {
              const isSelected = selectedHora === h
              const hasData = Object.values(data.grupos || {}).some(g => g.lecturas?.[h]?.presionAceite)

              return (
                <button
                  key={h}
                  onClick={() => setSelectedHora(h)}
                  className={`py-2 text-center text-xs font-bold rounded-lg transition ${
                    isSelected
                      ? 'bg-[#0b424c] text-white shadow-sm ring-2 ring-[#0b424c]/20'
                      : hasData
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                  }`}
                >
                  {h}
                </button>
              )
            })}
          </div>

          {/* Botón Copiar Lecturas de Hora Anterior */}
          <button
            onClick={handleCopyFromPreviousHour}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-dashed border-slate-300 hover:border-[#0b424c] hover:bg-slate-50 text-slate-600 hover:text-[#0b424c] text-xs font-bold transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copiar lecturas de la hora anterior</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COLUMNA DERECHA: REGISTRO DE MEDICIONES COMPACTO (EXACTO A LA IMAGEN)      */}
      {/* ========================================================================= */}
      <div className="lg:col-span-8 space-y-5">
        {/* Encabezado de la Hora Seleccionada */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {selectedHora}
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                {currentTurnoNombre}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                Operador responsable: <strong className="text-slate-800">{currentOperador}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Registro de generación en curso</span>
            </div>
          </div>

          {/* Barra de Grupos en Operación (Idéntica a la Imagen con Check ✓) */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-tight">
                  GRUPOS EN OPERACIÓN A LAS {selectedHora}
                </span>
              </div>
              <button
                onClick={handleSelectAllGroups}
                className="text-xs font-bold text-slate-500 hover:text-[#0b424c] transition"
              >
                {activeGroupIds.length === 3 ? 'Desmarcar todas' : 'Seleccionar todas'}
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Selecciona los grupos activos para desplegar sus formularios de medición.
            </p>

            {/* Píldoras con Checkmark ✓ cuando están activas */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {(['G1', 'G2', 'G3'] as const).map(gid => {
                const isActive = activeGroupIds.includes(gid)
                const label = gid === 'G1' ? 'GRUPO 01' : gid === 'G2' ? 'GRUPO 02' : 'GRUPO 03'

                return (
                  <button
                    key={gid}
                    onClick={() => toggleGroupForHour(gid)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition ${
                      isActive
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Zap className={`w-3.5 h-3.5 ${isActive ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                    <span>{label}</span>
                    {isActive && <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* FORMULARIOS COMPACTOS EXACTOS A LA IMAGEN ADJUNTA                       */}
        {/* ======================================================================= */}
        {activeGroupIds.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-10 sm:p-14 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4 border border-amber-200/60 shadow-inner">
              <Zap className="w-8 h-8 text-amber-500 fill-amber-500" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1.5">
              Ningún grupo seleccionado a las {selectedHora}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Toca en los botones de Grupos en Operación arriba para activar los que están en marcha y registrar sus mediciones.
            </p>
          </div>
        ) : (
          /* Cuadrícula de Formularios Compactos */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-start">
            {activeGroupIds.map(gid => {
              const grp = data.grupos?.[gid]
              const lec = (grp?.lecturas?.[selectedHora] || {}) as Partial<GPPDataHora>
              const groupLabel = gid === 'G1' ? 'GRUPO 01' : gid === 'G2' ? 'GRUPO 02' : 'GRUPO 03'

              return (
                <div 
                  key={gid} 
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition max-w-md w-full"
                >
                  {/* Cabecera Oscura Idéntica a la Imagen */}
                  <div className="bg-[#152336] px-4 py-3.5 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <h4 className="font-extrabold text-sm sm:text-base uppercase tracking-wider">
                        {groupLabel}
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold bg-[#22354e] text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700/60">
                      Operando
                    </span>
                  </div>

                  {/* Cuerpo Compacto con Campos Centrados */}
                  <div className="p-4 sm:p-5 space-y-3.5">
                    {/* 1. Presión de Aceite */}
                    <div>
                      <div className="flex items-center justify-between mb-1 text-slate-700 text-xs font-semibold">
                        <span>Presión de Aceite</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">PSI</span>
                      </div>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="0.0"
                        value={lec.presionAceite ?? ''}
                        onChange={(e) => handleFieldChange(gid, 'presionAceite', e.target.value)}
                        className="w-full bg-[#f8fafc] border border-slate-200/90 rounded-xl py-2 px-3 text-center text-base sm:text-lg font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0b424c] focus:ring-1 focus:ring-[#0b424c] focus:outline-none transition shadow-inner"
                      />
                    </div>

                    {/* 2. Temperatura Agua de Refrigeración */}
                    <div>
                      <div className="flex items-center justify-between mb-1 text-slate-700 text-xs font-semibold">
                        <span>T° del Agua de Refrig.</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">°C</span>
                      </div>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="0.0"
                        value={lec.tempAgua ?? ''}
                        onChange={(e) => handleFieldChange(gid, 'tempAgua', e.target.value)}
                        className="w-full bg-[#f8fafc] border border-slate-200/90 rounded-xl py-2 px-3 text-center text-base sm:text-lg font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0b424c] focus:ring-1 focus:ring-[#0b424c] focus:outline-none transition shadow-inner"
                      />
                    </div>

                    {/* 3. Velocidad del Motor */}
                    <div>
                      <div className="flex items-center justify-between mb-1 text-slate-700 text-xs font-semibold">
                        <span>Veloc. del Motor</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">RPM</span>
                      </div>
                      <input
                        type="number"
                        step="1"
                        placeholder="0.0"
                        value={lec.velocidadMotor ?? ''}
                        onChange={(e) => handleFieldChange(gid, 'velocidadMotor', e.target.value)}
                        className="w-full bg-[#f8fafc] border border-slate-200/90 rounded-xl py-2 px-3 text-center text-base sm:text-lg font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0b424c] focus:ring-1 focus:ring-[#0b424c] focus:outline-none transition shadow-inner"
                      />
                    </div>

                    {/* 4. Frecuencia */}
                    <div>
                      <div className="flex items-center justify-between mb-1 text-slate-700 text-xs font-semibold">
                        <span>Frecuencia</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">HZ</span>
                      </div>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="0.0"
                        value={lec.frecuencia ?? ''}
                        onChange={(e) => handleFieldChange(gid, 'frecuencia', e.target.value)}
                        className="w-full bg-[#f8fafc] border border-slate-200/90 rounded-xl py-2 px-3 text-center text-base sm:text-lg font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0b424c] focus:ring-1 focus:ring-[#0b424c] focus:outline-none transition shadow-inner"
                      />
                    </div>

                    {/* 5. Amperaje */}
                    <div>
                      <div className="flex items-center justify-between mb-1 text-slate-700 text-xs font-semibold">
                        <span>Amperaje</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">A</span>
                      </div>
                      <input
                        type="number"
                        step="1"
                        placeholder="0.0"
                        value={lec.amperaje ?? ''}
                        onChange={(e) => handleFieldChange(gid, 'amperaje', e.target.value)}
                        className="w-full bg-[#f8fafc] border border-slate-200/90 rounded-xl py-2 px-3 text-center text-base sm:text-lg font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0b424c] focus:ring-1 focus:ring-[#0b424c] focus:outline-none transition shadow-inner"
                      />
                    </div>

                    {/* 6. Factor de Potencia */}
                    <div>
                      <div className="flex items-center justify-between mb-1 text-slate-700 text-xs font-semibold">
                        <span>Factor de Potencia</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">COS Φ</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={lec.factorPotencia ?? ''}
                        onChange={(e) => handleFieldChange(gid, 'factorPotencia', e.target.value)}
                        className="w-full bg-[#f8fafc] border border-slate-200/90 rounded-xl py-2 px-3 text-center text-base sm:text-lg font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0b424c] focus:ring-1 focus:ring-[#0b424c] focus:outline-none transition shadow-inner"
                      />
                    </div>

                    {/* 7. Energía Acumulada */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between mb-1 text-[#0b424c] text-xs font-bold">
                        <span>Energía Acumulada</span>
                        <span className="text-[10px] text-teal-700 font-extrabold uppercase">KWH</span>
                      </div>
                      <input
                        type="number"
                        step="1"
                        placeholder="0.0"
                        value={lec.energia ?? ''}
                        onChange={(e) => handleFieldChange(gid, 'energia', e.target.value)}
                        className="w-full bg-teal-50/40 border border-teal-200/80 rounded-xl py-2 px-3 text-center text-base sm:text-lg font-extrabold text-[#0b424c] placeholder-teal-300 focus:bg-white focus:border-[#0b424c] focus:ring-1 focus:ring-[#0b424c] focus:outline-none transition shadow-inner"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Card de Observaciones Generales (Exacto a la Imagen) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-tight">
              Observaciones Generales
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Novedades de grupos electrógenos, paradas, variaciones de presión o temperatura
          </p>

          <textarea
            rows={3}
            placeholder="Escriba aquí las observaciones del turno o de la operación del día..."
            value={data.observaciones}
            onChange={(e) => onChange({ ...data, observaciones: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0b424c] focus:ring-1 focus:ring-[#0b424c] resize-none"
          />
        </div>
      </div>
    </div>
  )
}
