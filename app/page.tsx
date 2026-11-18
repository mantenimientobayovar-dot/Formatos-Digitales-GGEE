'use client'

import dynamic from 'next/dynamic'

// Dynamic import with SSR disabled to guarantee smooth client-only storage and PDF generation
const App = dynamic(() => import('../src/App').then((mod) => mod.App), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#f3f6f9] flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#0b424c] border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-xs font-bold text-[#0b424c] uppercase tracking-wider">Cargando Sistema Copeinca...</p>
    </div>
  )
})

export default function Page() {
  return <App />
}
