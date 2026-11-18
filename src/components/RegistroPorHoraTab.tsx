import React, { useState } from 'react'
import { 
  GPPRegistroDia, 
  HORAS_24, 
  HORAS_TURNO_A, 
  HORAS_TURNO_B,
  OPERADORES_PREDEFINIDOS,
  GPPDataHora
} from '../types'
import { 
  Clock, 
  User, 
  Copy, 
  Zap, 
  CheckCircle2, 
  Edit3, 
  FileText,
  AlertCircle
} from 'lucide-react'

interface RegistroPorHoraTabProps {
  data: GPPRegistroDia
  onChange: (updated: GPPRegistroDia) => void
}

export const RegistroPorHoraTab: React.FC<RegistroPorHoraTabProps> = ({ data, onChange }) => {
  // Inicializar en la hora actual o 22:00 (como en la captura)
  const currentHourNum = new Date().getHours()
  const defaultHour = HORAS_24[currentHourNum === 0 ? 23 : currentHourNum - 1] || '22:00'
  const [selectedHora, setSelectedHora] = useState<string>(defaultHour)
  const [editingOperator, setEditingOperator] = useState(false)

  // Determinar turno según la hora seleccionada
  const isTurnoA = HORAS_TURNO_A.includes(selectedHora)
  const currentTurnoNombre = isTurnoA ? 'TURNO A' : 'TURNO B'
  const currentOperador = isTurnoA ? (data.operadorA || 'Juan Sanchez') : (data.operadorB || 'Luis Rumiche Anton')

  // Grupos activos en la hora seleccionada
  const activeGroupIds: string[] = data.gruposActivosPorHora?.[selectedHora] || []

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
                const target = HORAS_24[nowHour === 0 ? 23 : nowHour - 1] || '22:00'
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
      {/* COLUMNA DERECHA: REGISTRO DE MEDICIONES DEL GRUPO EN OPERACIÓN             */}
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

          {/* Barra de Grupos en Operación */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2.5">
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

            {/* Píldoras Interactivas de Equipos */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {(['G1', 'G2', 'G3'] as const).map(gid => {
                const isActive = activeGroupIds.includes(gid)
                const grp = data.grupos?.[gid]
                const label = gid === 'G1' ? 'GRUPO 01' : gid === 'G2' ? 'GRUPO 02' : 'GRUPO 03'

                return (
                  <button
                    key={gid}
                    onClick={() => toggleGroupForHour(gid)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition ${
                      isActive
                        ? 'border-[#0b424c] bg-teal-50/50 text-[#0b424c] shadow-sm'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Zap className={`w-3.5 h-3.5 ${isActive ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* FORMULARIOS DE MEDICIÓN (O EMPTY STATE SI NINGUNO ESTÁ SELECCIONADO)      */}
        {/* ======================================================================= */}
        {activeGroupIds.length === 0 ? (
          /* Empty State Exacto de la Imagen 1 */
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
          /* Formularios de Medición para cada grupo activo */
          <div className="space-y-4">
            {activeGroupIds.map(gid => {
              const grp = data.grupos?.[gid]
              const lec = (grp?.lecturas?.[selectedHora] || {}) as Partial<GPPDataHora>
              const groupTitle = gid === 'G1' ? 'GRUPO 01 - BURMEISTER' : gid === 'G2' ? 'GRUPO 02 - BURMEISTER' : 'GRUPO 03 - BURMEISTER'

              return (
                <div key={gid} className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-teal-50 text-[#0b424c]">
                        <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
                        {groupTitle}
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase bg-slate-100 px-2.5 py-1 rounded-md">
                      1000 KW Nominal
                    </span>
                  </div>

                  {/* Campos Numéricos con Tipografía Grande y Legible */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                    {/* Presión de Aceite */}
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                        Presión Aceite (psi)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="55.0"
                        value={lec.presionAceite ?? ''}
                        onChange={(e) => handleFieldChange(gid, 'presionAceite', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-base sm:text-lg font-bold text-slate-900 focus:outline-none focus:border-[#0b424c] focus:ring-1 focus:ring-[#0b424c]"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Rango: 40 - 70 psi</span>
                    </div>

                    {/* Temperatura Refrigerante */}
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                        T° Agua (°C)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="78.0"
                        value={lec.tempAgua ?? ''}
                        onChange={(e) => handleFieldChange(gid, 'tempAgua', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-base sm:text-lg font-bold text-slate-900 focus:outline-none focus:border-[#0b424c] focus:ring-1 focus:ring-[#0b424c]"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Rango: 70 - 85 °C</span>
                    </div>

                    {/* Velocidad del Motor */}
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                        Veloc. Motor (rpm)
                      </label>
                      <input
                        type="number"
                        step="1"
                        placeholder="1800"
                        value={lec.velocidadMotor ?? ''}
                        onChange={(e) => handleFieldChange(gid, 'velocidadMotor', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-base sm:text-lg font-bold text-slate-900 focus:outline-none focus:border-[#0b424c] focus:ring-1 focus:ring-[#0b424c]"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Nominal: 1800 rpm</span>
                    </div>

                    {/* Frecuencia */}
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                        Frecuencia (Hz)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="60.0"
                        value={lec.frecuencia ?? ''}
                        onChange={(e) => handleFieldChange(gid, 'frecuencia', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-base sm:text-lg font-bold text-slate-900 focus:outline-none focus:border-[#0b424c] focus:ring-1 focus:ring-[#0b424c]"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Nominal: 60.0 Hz</span>
                    </div>

                    {/* Amperaje */}
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                        Amperaje (A)
                      </label>
                      <input
                        type="number"
                        step="1"
                        placeholder="450"
                        value={lec.amperaje ?? ''}
                        onChange={(e) => handleFieldChange(gid, 'amperaje', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-base sm:text-lg font-bold text-slate-900 focus:outline-none focus:border-[#0b424c] focus:ring-1 focus:ring-[#0b424c]"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Carga de fase</span>
                    </div>

                    {/* Factor de Potencia */}
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
                      <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                        Factor Potencia (Cos φ)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.88"
                        value={lec.factorPotencia ?? ''}
                        onChange={(e) => handleFieldChange(gid, 'factorPotencia', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-base sm:text-lg font-bold text-slate-900 focus:outline-none focus:border-[#0b424c] focus:ring-1 focus:ring-[#0b424c]"
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Deseable: 0.85 - 0.98</span>
                    </div>

                    {/* Energía Acumulada */}
                    <div className="bg-teal-50/60 p-3 rounded-xl border border-teal-200/60 sm:col-span-2">
                      <label className="text-[11px] font-bold text-[#0b424c] uppercase block mb-1">
                        Energía Acumulada (KWH)
                      </label>
                      <input
                        type="number"
                        step="1"
                        placeholder="Lectura medidor KWH"
                        value={lec.energia ?? ''}
                        onChange={(e) => handleFieldChange(gid, 'energia', e.target.value)}
                        className="w-full bg-white border border-teal-300 rounded-lg px-3 py-1.5 text-base sm:text-lg font-bold text-[#0b424c] focus:outline-none focus:border-[#0b424c] focus:ring-1 focus:ring-[#0b424c]"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">Totalizador medidor de energía</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Card de Observaciones Generales (Exacto a la Imagen 1) */}
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
