'use client'

import React, { useState } from 'react'
import { 
  GPPRegistroDia, 
  HORAS_24, 
  HORAS_TURNO_A, 
  HORAS_TURNO_B,
  GRUPOS_OFICIALES,
  GPPDataHora
} from '../types'
import { 
  FileText, 
  Calendar, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  BarChart3,
  LineChart,
  AreaChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface GraficosPorHoraTabProps {
  data: GPPRegistroDia
  fecha: string
  setFecha: (f: string) => void
  onGoToRegistro: () => void
}

type MetricaTipo = 'presionAceite' | 'tempAgua' | 'velocidadMotor' | 'frecuencia' | 'amperaje' | 'factorPotencia' | 'energia'

export const GraficosPorHoraTab: React.FC<GraficosPorHoraTabProps> = ({
  data,
  fecha,
  setFecha,
  onGoToRegistro
}) => {
  const [rangoTurno, setRangoTurno] = useState<'dia' | 'turnoA' | 'turnoB'>('dia')
  const [selectedMetrica, setSelectedMetrica] = useState<MetricaTipo>('presionAceite')
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line')
  const [activeGroups, setActiveGroups] = useState<string[]>(['G1', 'G3', 'G4'])

  // Filtrar horas según el rango seleccionado
  const horasFiltradas = rangoTurno === 'turnoA' 
    ? HORAS_TURNO_A 
    : rangoTurno === 'turnoB' 
    ? HORAS_TURNO_B 
    : HORAS_24

  // Calcular estadísticas de la métrica seleccionada
  const valores: number[] = []
  activeGroups.forEach(gid => {
    const grp = data.grupos?.[gid]
    if (grp) {
      horasFiltradas.forEach(h => {
        const val = (grp.lecturas?.[h] as any)?.[selectedMetrica]
        if (typeof val === 'number' && !isNaN(val)) {
          valores.push(val)
        }
      })
    }
  })

  const promedio = valores.length > 0 ? (valores.reduce((a, b) => a + b, 0) / valores.length).toFixed(1) : '--'
  const maximo = valores.length > 0 ? Math.max(...valores).toFixed(1) : '--'
  const minimo = valores.length > 0 ? Math.min(...valores).toFixed(1) : '--'
  const totalLecturas = valores.length

  const metricaMeta = {
    presionAceite: { label: 'Presión de Aceite', unidad: 'psi', optimo: '40 - 70 psi' },
    tempAgua: { label: 'T° Agua Refrig.', unidad: '°C', optimo: '70 - 85 °C' },
    velocidadMotor: { label: 'Veloc. del Motor', unidad: 'rpm', optimo: '1800 rpm' },
    frecuencia: { label: 'Frecuencia', unidad: 'Hz', optimo: '59.8 - 60.2 Hz' },
    amperaje: { label: 'Amperaje', unidad: 'A', optimo: '300 - 800 A' },
    factorPotencia: { label: 'Factor de Potencia', unidad: 'Cos φ', optimo: '0.85 - 0.98' },
    energia: { label: 'Energía Acumulada', unidad: 'KWH', optimo: 'Acumulado KWH' }
  }[selectedMetrica]

  // Paleta de colores distintiva para los 9 grupos
  const palette = [
    { stroke: '#0284c7', fill: 'rgba(2, 132, 199, 0.1)', dot: 'bg-sky-500' },
    { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.1)', dot: 'bg-emerald-500' },
    { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.1)', dot: 'bg-amber-500' },
    { stroke: '#8b5cf6', fill: 'rgba(139, 92, 246, 0.1)', dot: 'bg-purple-500' },
    { stroke: '#ec4899', fill: 'rgba(236, 72, 153, 0.1)', dot: 'bg-pink-500' },
    { stroke: '#06b6d4', fill: 'rgba(6, 182, 212, 0.1)', dot: 'bg-cyan-500' },
    { stroke: '#ef4444', fill: 'rgba(239, 68, 68, 0.1)', dot: 'bg-red-500' },
    { stroke: '#84cc16', fill: 'rgba(132, 204, 22, 0.1)', dot: 'bg-lime-500' },
    { stroke: '#6366f1', fill: 'rgba(99, 102, 241, 0.1)', dot: 'bg-indigo-500' }
  ]

  const groupColors: Record<string, { stroke: string; fill: string; dot: string; label: string }> = {}
  GRUPOS_OFICIALES.forEach((gDef, idx) => {
    groupColors[gDef.id] = {
      ...palette[idx % palette.length],
      label: gDef.nombre
    }
  })

  const toggleGroup = (gid: string) => {
    if (activeGroups.includes(gid)) {
      if (activeGroups.length > 1) setActiveGroups(activeGroups.filter(g => g !== gid))
    } else {
      setActiveGroups([...activeGroups, gid])
    }
  }

  // Dimensiones del gráfico SVG
  const svgWidth = 900
  const svgHeight = 280
  const padLeft = 55
  const padRight = 30
  const padTop = 25
  const padBottom = 40
  const chartW = svgWidth - padLeft - padRight
  const chartH = svgHeight - padTop - padBottom

  const minValNumeric = valores.length > 0 ? Math.min(...valores) * 0.9 : 0
  const maxValNumeric = valores.length > 0 ? Math.max(...valores) * 1.1 : 100
  const ySpan = (maxValNumeric - minValNumeric) || 1

  const getYPos = (val: number) => {
    const norm = (val - minValNumeric) / ySpan
    return padTop + chartH - (norm * chartH)
  }

  const getXPos = (index: number) => {
    return padLeft + (index / (horasFiltradas.length - 1 || 1)) * chartW
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Subheader Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Lado Izquierdo: Botón Ver Hoja de Registro */}
        <button
          onClick={onGoToRegistro}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold transition shadow-sm"
        >
          <FileText className="w-4 h-4 text-purple-600" />
          <span>Ver Hoja de Registro</span>
        </button>

        {/* Centro: Navegador de Fecha */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl px-2 py-1">
          <button
            onClick={() => {
              const d = new Date(fecha)
              d.setDate(d.getDate() - 1)
              setFecha(d.toISOString().split('T')[0])
            }}
            className="p-1 rounded hover:bg-slate-100 text-slate-500"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5 px-2.5 text-xs sm:text-sm font-bold text-slate-800">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{fecha}</span>
          </div>
          <button
            onClick={() => {
              const d = new Date(fecha)
              d.setDate(d.getDate() + 1)
              setFecha(d.toISOString().split('T')[0])
            }}
            className="p-1 rounded hover:bg-slate-100 text-slate-500"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setFecha(new Date().toISOString().split('T')[0])}
            className="ml-1 bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-lg"
          >
            Hoy
          </button>
          <button
            onClick={() => window.location.reload()}
            className="p-1 ml-1 text-slate-400 hover:text-slate-600"
            title="Sincronizar"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Lado Derecho: Filtro de Turnos */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setRangoTurno('dia')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              rangoTurno === 'dia' ? 'bg-[#0b424c] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Día Planta (01:00 - 00:00)
          </button>
          <button
            onClick={() => setRangoTurno('turnoA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              rangoTurno === 'turnoA' ? 'bg-[#0b424c] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Turno A (07:00 - 18:00)
          </button>
          <button
            onClick={() => setRangoTurno('turnoB')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              rangoTurno === 'turnoB' ? 'bg-[#0b424c] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Turno B (19:00 - 06:00)
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Promedio */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {metricaMeta.label} PROMEDIO
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-[#0b424c]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {promedio} <span className="text-sm font-semibold text-slate-400">{metricaMeta.unidad}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Media de mediciones registradas</p>
        </div>

        {/* Card 2: Valor Máximo */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              VALOR MÁXIMO
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {maximo} <span className="text-sm font-semibold text-slate-400">{metricaMeta.unidad}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Pico máximo en el rango</p>
        </div>

        {/* Card 3: Valor Mínimo */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              VALOR MÍNIMO
            </span>
            <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {minimo} <span className="text-sm font-semibold text-slate-400">{metricaMeta.unidad}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Valor más bajo detectado</p>
        </div>

        {/* Card 4: Puntos Registrados */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              PUNTOS REGISTRADOS
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {totalLecturas} <span className="text-sm font-semibold text-slate-400">lecturas</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 truncate">
            Operador A: {data.operadorA} | B: {data.operadorB}
          </p>
        </div>
      </div>

      {/* Selector de Métricas */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {(['presionAceite', 'tempAgua', 'frecuencia', 'amperaje', 'factorPotencia', 'energia'] as const).map(mKey => {
            const isSelected = selectedMetrica === mKey
            const label = {
              presionAceite: 'Presión de Aceite (psi)',
              tempAgua: 'T° Agua Refrig. (°C)',
              frecuencia: 'Frecuencia (Hz)',
              amperaje: 'Amperaje (A)',
              factorPotencia: 'Factor de Potencia',
              energia: 'Energía (KWH)'
            }[mKey]

            return (
              <button
                key={mKey}
                onClick={() => setSelectedMetrica(mKey)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                  isSelected
                    ? 'bg-[#0b424c] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Tipo de Gráfico */}
        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setChartType('line')}
            className={`p-1.5 rounded-lg transition ${chartType === 'line' ? 'bg-[#0b424c] text-white' : 'text-slate-500 hover:text-slate-900'}`}
            title="Gráfico de Líneas"
          >
            <LineChart className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-1.5 rounded-lg transition ${chartType === 'bar' ? 'bg-[#0b424c] text-white' : 'text-slate-500 hover:text-slate-900'}`}
            title="Gráfico de Barras"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`p-1.5 rounded-lg transition ${chartType === 'area' ? 'bg-[#0b424c] text-white' : 'text-slate-500 hover:text-slate-900'}`}
            title="Gráfico de Área"
          >
            <AreaChart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selector de los 9 Grupos Electrógenos */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-3.5 px-4 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase mr-1">GRUPOS:</span>
          {GRUPOS_OFICIALES.map(gDef => {
            const isChecked = activeGroups.includes(gDef.id)
            const color = groupColors[gDef.id]

            return (
              <button
                key={gDef.id}
                onClick={() => toggleGroup(gDef.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                  isChecked
                    ? 'bg-slate-50 border-slate-300 text-slate-800'
                    : 'bg-white border-transparent text-slate-400 opacity-60'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                <span>{gDef.nombre}</span>
              </button>
            )
          })}
        </div>

        <button
          onClick={() => {
            if (activeGroups.length === GRUPOS_OFICIALES.length) setActiveGroups(['G1'])
            else setActiveGroups(GRUPOS_OFICIALES.map(g => g.id))
          }}
          className="text-xs font-bold text-[#0b424c] hover:underline whitespace-nowrap"
        >
          {activeGroups.length === GRUPOS_OFICIALES.length ? 'Solo Grupo 1' : 'Seleccionar Todas'}
        </button>
      </div>

      {/* Área del Gráfico Interactivo SVG */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-sm space-y-4">
        {/* Título del Gráfico y Badge Rango Óptimo */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0b424c]" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Comportamiento Horario: {metricaMeta.label}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Evolución curva a curva durante la jornada ({fecha}) &bull; Valores en {metricaMeta.unidad}
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Rango Óptimo: {metricaMeta.optimo}</span>
          </div>
        </div>

        {/* Gráfico SVG Responsivo */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full min-w-[650px] h-auto font-sans select-none"
          >
            {/* Cuadrícula horizontal */}
            {[0, 0.25, 0.5, 0.75, 1].map((step, idx) => {
              const y = padTop + (step * chartH)
              const valLabel = (maxValNumeric - (step * ySpan)).toFixed(0)
              return (
                <g key={idx}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={svgWidth - padRight}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1"
                  />
                  <text
                    x={padLeft - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#94a3b8"
                    fontFamily="monospace"
                  >
                    {valLabel}
                  </text>
                </g>
              )
            })}

            {/* Etiquetas de eje X (Horas) */}
            {horasFiltradas.map((h, idx) => {
              const x = getXPos(idx)
              const showLabel = idx % 2 === 0 || idx === horasFiltradas.length - 1
              return (
                <g key={h}>
                  <line
                    x1={x}
                    y1={padTop}
                    x2={x}
                    y2={padTop + chartH}
                    stroke="#f8fafc"
                    strokeWidth="1"
                  />
                  {showLabel && (
                    <text
                      x={x}
                      y={svgHeight - 12}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#64748b"
                      fontWeight="600"
                    >
                      {h}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Curvas de datos para cada grupo activo */}
            {activeGroups.map(gid => {
              const grp = data.grupos?.[gid]
              if (!grp) return null
              const color = groupColors[gid]

              const points: { x: number; y: number; val: number }[] = []
              horasFiltradas.forEach((h, idx) => {
                const val = (grp.lecturas?.[h] as any)?.[selectedMetrica]
                if (typeof val === 'number' && !isNaN(val)) {
                  points.push({
                    x: getXPos(idx),
                    y: getYPos(val),
                    val
                  })
                }
              })

              if (points.length === 0) return null

              const pathD = points.reduce((acc, p, i) => {
                return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
              }, '')

              const areaD = `${pathD} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`

              return (
                <g key={gid}>
                  {chartType === 'area' && (
                    <path
                      d={areaD}
                      fill={color.fill}
                    />
                  )}

                  {(chartType === 'line' || chartType === 'area') && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke={color.stroke}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {chartType === 'bar' && points.map((p, pIdx) => (
                    <rect
                      key={pIdx}
                      x={p.x - 6}
                      y={p.y}
                      width={12}
                      height={padTop + chartH - p.y}
                      fill={color.stroke}
                      rx="2"
                    />
                  ))}

                  {points.map((p, pIdx) => (
                    <g key={pIdx}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="3.5"
                        fill="#ffffff"
                        stroke={color.stroke}
                        strokeWidth="2"
                      />
                      <title>{`${color.label} - ${horasFiltradas[pIdx]}: ${p.val} ${metricaMeta.unidad}`}</title>
                    </g>
                  ))}
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}
