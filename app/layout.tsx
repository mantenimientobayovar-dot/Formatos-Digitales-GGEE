import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Control de Operaciones GGEE & Casa de Fuerza - Copeinca',
  description: 'Digitalización oficial de formatos de operación en planta para Grupos Electrógenos Copeinca',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/copeinca-logo.png" />
      </head>
      <body className="bg-[#f3f6f9] text-slate-800 antialiased font-sans selection:bg-[#0b424c] selection:text-white">
        {children}
      </body>
    </html>
  )
}
