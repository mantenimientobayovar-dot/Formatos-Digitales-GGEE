import React from 'react'
import { 
  GPPRegistroDia, 
  CasaFuerzaRegistroDia, 
  HORAS_24,
  LIMITES_OPERACIONALES
} from '../types'
import { 
  Activity, 
  Fuel, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Gauge, 
  ShieldCheck,
  Server
} from 'lucide-react'

interface DashboardViewProps {
  gppData: GPPRegistroDia
  cfData: CasaFuerzaRegistroDia
  onGoToGPP: () => void
  onGoToCF: () => void
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  gppData,
  cfData,
  onGoToGPP,
  onGoToCF
}) => {
  // Encontrar la última hora registrada en GPP Grupo 1
  let ultimaHoraRegistrada = 'Sin lecturas'
  let ultimaPresion: number | null = null
  let ultimaTemp: number | null = null
  let ultimaFreq: number | null = null
  let ultimoAmp: number | null = null

  const g1Lecturas = gppData.grupos?.G1?.lecturas || {}
  for (let i = HORAS_24.length - 1; i >= 0; i--) {
    const h = HORAS_24[i]
    if (g1Lecturas[h]?.presionAceite !== null && g1Lecturas[h]?.presionAceite !== undefined) {
      ultimaHoraRegistrada = h
      ultimaPresion = g1Lecturas[h].presionAceite ?? null
      ultimaTemp = g1Lecturas[h].tempAgua ?? null
      ultimaFreq = g1Lecturas[h].frecuencia ?? null
      ultimoAmp = g1Lecturas[h].amperaje ?? null
      break
    }
  }

  // Contar alarmas en todas las horas registradas
  let totalAlarmas = 0
  Object.values(gppData.grupos || {}).forEach(grp => {
    Object.values(grp.lecturas || {}).forEach(lec => {
      if (lec.presionAceite && (lec.presionAceite < LIMITES_OPERACIONALES.presionAceite.minWarn || lec.presionAceite > LIMITES_OPERACIONALES.presionAceite.maxWarn)) totalAlarmas++
      if (lec.tempAgua && (lec.tempAgua > LIMITES_OPERACIONALES.tempAgua.maxWarn)) totalAlarmas++
      if (lec.frecuencia && (lec.frecuencia < LIMITES_OPERACIONALES.frecuencia.minWarn || lec.frecuencia > LIMITES_OPERACIONALES.frecuencia.maxWarn)) totalAlarmas++
    })
  })

  // Totales de Casa de Fuerza
  const totalDiesel = cfData.equipos.reduce((acc, eq) => acc + (Number(eq.consumoDieselGln) || 0), 0)
  const totalHoras = cfData.equipos.reduce((acc, eq) => acc + (Number(eq.totalHoras) || 0), 0)
  const equiposOperando = cfData.equipos.filter(eq => (Number(eq.totalHoras) || 0) > 0).length

  return (
    <div className="space-y-6 pb-12">
      {/* 4 KPIs Principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Grupos Activos */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Grupos en Marcha</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {Object.values(gppData.grupos || {}).filter(g => g.activo).length}
            <span className="text-sm font-normal text-slate-400 ml-2">de 3 GGEE</span>
          </div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Suministro de Planta Operativo
          </div>
        </div>

        {/* KPI 2: Consumo Diésel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Consumo Diésel</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Fuel className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400">
            {totalDiesel.toLocaleString()}
            <span className="text-sm font-normal text-slate-400 ml-2">GLN</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Reportado en Casa de Fuerza
          </div>
        </div>

        {/* KPI 3: Horas de Funcionamiento */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Horas Acumuladas</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {totalHoras.toFixed(1)}
            <span className="text-sm font-normal text-slate-400 ml-2">hrs</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {equiposOperando} de 15 equipos activos
          </div>
        </div>

        {/* KPI 4: Estado de Alarmas */}
        <div className={`border rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden ${
          totalAlarmas > 0 ? 'bg-rose-950/20 border-rose-500/40' : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Alertas de Parámetros</span>
            <div className={`p-2 rounded-xl ${totalAlarmas > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-bold ${totalAlarmas > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {totalAlarmas}
            <span className="text-sm font-normal text-slate-400 ml-2">anomalías</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            {totalAlarmas > 0 ? 'Requiere atención técnica' : 'Todos los parámetros en rango'}
          </div>
        </div>
      </div>

      {/* Vista de Estado del Grupo Principal en Operación */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-white tracking-tight">
                BURMEISTER N° 1 - Estado de la Última Ronda
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Hora: {ultimaHoraRegistrada}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Lecturas en vivo tomadas del formato oficial GPP-FOR-021
            </p>
          </div>

          <button
            onClick={onGoToGPP}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition"
          >
            Abrir Registro GPP-FOR-021
          </button>
        </div>

        {/* Indicadores Tipo Tacómetro / Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Presión de Aceite</span>
            <div className="text-2xl font-bold text-white font-mono">
              {ultimaPresion !== null ? `${ultimaPresion} psi` : '--'}
            </div>
            <span className={`text-[10px] font-semibold mt-1 inline-block px-2 py-0.5 rounded ${
              ultimaPresion && ultimaPresion >= 40 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
            }`}>
              {ultimaPresion ? (ultimaPresion >= 40 ? 'Normal' : 'Baja') : 'Sin dato'}
            </span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Temperatura Agua</span>
            <div className="text-2xl font-bold text-white font-mono">
              {ultimaTemp !== null ? `${ultimaTemp} °C` : '--'}
            </div>
            <span className={`text-[10px] font-semibold mt-1 inline-block px-2 py-0.5 rounded ${
              ultimaTemp && ultimaTemp <= 85 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
            }`}>
              {ultimaTemp ? (ultimaTemp <= 85 ? 'Óptima' : 'Alta') : 'Sin dato'}
            </span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Frecuencia de Red</span>
            <div className="text-2xl font-bold text-white font-mono">
              {ultimaFreq !== null ? `${ultimaFreq} Hz` : '--'}
            </div>
            <span className="text-[10px] font-semibold mt-1 inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              60.0 Hz Ref.
            </span>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block mb-1">Amperaje de Carga</span>
            <div className="text-2xl font-bold text-white font-mono">
              {ultimoAmp !== null ? `${ultimoAmp} A` : '--'}
            </div>
            <span className="text-[10px] font-semibold mt-1 inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
              Generando
            </span>
          </div>
        </div>
      </div>

      {/* Resumen de Equipos de Planta */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Estado de Grupos Electrógenos y Auxiliares (Casa de Fuerza)
            </h3>
          </div>
          <button
            onClick={onGoToCF}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
          >
            Ver todos los 15 equipos &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {cfData.equipos.slice(0, 9).map(eq => (
            <div key={eq.id} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block">SAP: {eq.codigoSap}</span>
                <span className="text-xs font-bold text-slate-200">{eq.nombre}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold font-mono text-emerald-400 block">
                  {eq.totalHoras ? `${eq.totalHoras} h` : 'Parado'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {eq.consumoDieselGln ? `${eq.consumoDieselGln} gln` : '-'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
