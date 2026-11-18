# ⚡ Sistema Digital de Grupos Electrógenos & Casa de Fuerza

Aplicación web moderna, responsive y multi-dispositivo diseñada para la digitalización y captura intuitiva de parámetros en planta para operadores de turnos.

---

## 🚀 Inicio Rápido Local

Para iniciar el sistema en tu computadora en cualquier momento:

1. Haz doble clic en el archivo **`INICIAR_SISTEMA_LOCAL.bat`** ubicado en esta carpeta.
2. Se abrirá automáticamente tu navegador en:
   - **Local:** [http://localhost:3000](http://localhost:3000)
   - **Móvil / Tablet en la misma red Wi-Fi:** `http://<IP_LOCAL>:3000`

---

## 🛠️ Arquitectura Implementada

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS (Diseño industrial ergonómico de alto contraste).
- **Iconografía:** Lucide React.
- **Exportación de Reportes:** SheetJS (`xlsx`) para generar archivos `.xlsx` oficiales idénticos a los formatos de planta.
- **Almacenamiento Local (Offline-first):** Guarda automáticamente cada cambio en `localStorage` con autoguardado en segundo plano. Nunca se pierden datos si se reinicia el navegador o se corta la red.
- **Preparado para Supabase:**
  - Script SQL listo en `supabase/schema.sql`.
  - Configuración rápida en `.env`.
- **Despliegue Vercel:** Proyecto 100% compatible con Git push a GitHub y enlace automático a Vercel con comando de build estándar (`npm run build`).

---

## 📋 Módulos del Sistema

### 1. Formato GPP-FOR-021 (Registro Horario 24h)
- Registro horario de 01:00 a 00:00 para Grupos Electrógenos (Burmeister 1, 2, 3, etc.).
- **Modo Ronda Rápida (Móvil / Tablet):** Selector horario grande con semáforo visual de advertencia y alarma:
  - Presión de aceite (psi) [Alarma < 35 psi]
  - Temperatura de agua (°C) [Alarma > 85 °C]
  - Velocidad (rpm) y Frecuencia (Hz) [60 Hz nominal]
  - Amperaje (A) y Factor de Potencia ($\cos\phi$)
  - Lectura de medidor de energía (KWH)
- **Modo Matriz Completa (Desktop):** Vista en tabla con las 24 horas y edición fluida tipo hoja de cálculo.
- Control de Operadores de Turno A y B, VºBº de Jefatura y Superintendente.
- Botón de **Exportación a Excel** con el formato oficial.

### 2. Casa de Fuerza (Servicios Generales & SAP)
- Control de 15 equipos críticos:
  - Grupos Electrógenos N° 1 al 11 (Burmeister, Cummins KTA 19/50/38, Caterpillar 3412/3306/C-18/3512, Perkins).
  - Purificadores centrífugos de aceite 1 y 2.
  - Compresores de aire 1 y 2.
- Registro de Puntos de Medida y Códigos SAP.
- Cálculo automático de horas de marcha por turno (00-08h, 08-19h, 19-00h) y total general.
- Consumo diario de combustible Diésel (GLN).
- Parámetros eléctricos cada 4 horas (V1, V2, V3, A1, A2, A3, W, PF, Hz, KWh).
- Reporte de fallas observadas en Turno Día y Turno Noche.
- Botón de **Exportación a Excel** idéntico a `Formato de casa de fuerza..xls`.

### 3. Monitoreo & Dashboard
- Tarjetas de KPIs en tiempo real: Grupos activos, consumo total de diésel, horómetros totales y contador de alarmas.
- Tacómetros del estado actual de la última ronda de inspección.

---

## ☁️ Pasos Siguientes para Subir a GitHub y Desplegar en Vercel + Supabase

1. **Crear repositorio en GitHub:**
   ```bash
   git remote add origin https://github.com/TU_USUARIO/formatos-digitales-ggee.git
   git branch -M main
   git push -u origin main
   ```

2. **Crear proyecto en Supabase (Opcional para sincronización en la nube):**
   - Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto gratuito.
   - En el menú **SQL Editor**, copia y pega el contenido de `supabase/schema.sql` y presiona **Run**.
   - En **Project Settings > API**, copia tu `Project URL` y `anon public key`.
   - Agrégalos a tu archivo `.env` o en las variables de entorno de Vercel.

3. **Desplegar en Vercel:**
   - Ve a [vercel.com](https://vercel.com) e importa tu repositorio de GitHub.
   - Vercel detectará automáticamente que es un proyecto Vite y lo desplegará en segundos.
