# Bitácora Cronológica: Paso a Paso de Desarrollo y Despliegue
### Sistema de Formatos Digitales GGEE & Casa de Fuerza — Copeinca (Sede Bayóvar)

Esta bitácora documenta todo el proceso de transformación digital, registrando **cada uno de tus mensajes exactos**, los requerimientos solicitados, las acciones técnicas ejecutadas, los errores resueltos y los comandos utilizados hasta lograr el despliegue en producción en **Vercel** y **GitHub**.

---

## 📌 Hito 1: Digitalización del Formato Excel y Replicación Visual

### 📩 Tu Mensaje Exacto:
> *"QUIERO QUE EL FORMATO 'C:\Users\Hans\Desktop\FORMATOS DIGITALES GGEE\GPP-FOR-021 Registro de Operaciones de Grupos Electrógenos v01.xlsx' TENGA LA ESTRUCTURA DE LAS IMAGENES QUE ESTOY COMPARTIENDO, QUE SEA SIMILAR EN DONDE SE PUEDA SELLECIONAR EL OPERADOR DE TURNO, LAS 24 HORAS UNA A UNA, QUE TENGA LAS MISMAS IMAGENES, AGREGA ICONOS INTERACTIVOS, MANTÉN LOS COLORES, QUE EL LOGO DE COPEINCA TAMBIÉN ESTE TAL CUAL, LAS LETRAS UN POCO MÁS GRANDES Y LEGIBLES, EN LA PESTAÑA HOJA CONSOLIDADA MANTÉN TAMBIÉN EL DISEÑO, ADEMÁS MANTEN LA OPCIÓN DE DESCARGAR EN PDF EN DONDE MANTIENES EL REGISTRO QUE TE PASE EN EXCEL Y QUE LA ESTRCUTURA SEA LA MISMA, POR ULTIMO TAMBIÉN MANTEN LA ESTRUCTURA DE LA PESTAÑA GRAFICOS POR HORA MANTENIENDO EL MISMO FORMATO, TE HE COMPARTIDO EL LOGO EN UNA IMAGEN APARTE DE BUENA CALIDAD, AHORA EMPIEZA Y OBTENGAMOS EL MEJOR PERFORMANCE"*

### ⚙️ Acciones Técnicas Ejecutadas:
1. **Inspección del Excel Original:** Se analizó la estructura del archivo `GPP-FOR-021 Registro de Operaciones de Grupos Electrógenos v01.xlsx` y `Formato de casa de fuerza..xls`, extrayendo las variables: Presión de Aceite (PSI), Temperatura de Agua (°C), Velocidad (RPM), Frecuencia (Hz), Amperaje (A), Cos φ y Energía (kWh).
2. **Análisis de Capturas (`plant-vision-copeinca`):** Se identificó la paleta oficial (Teal oscuro `#0b424c`, fondo `#f3f6f9`, tarjetas oscuras `#152336`).
3. **Instalación de Entorno Portátil:** Se configuró Node.js v20.18.0 y npm para Windows.
4. **Diseño de las 3 Pestañas:**
   - *Registro por Hora:* Selector de 24 horas y selector de operador.
   - *Hoja Consolidada:* Matriz 24h x parámetros.
   - *Gráficos por Hora:* Gráficas de evolución y KPIs promedio/máx/mín.
5. **Exportación PDF:** Implementación con `jspdf` y `jspdf-autotable` replicando el membrete y cuadros de VoBo oficial.

---

## 📌 Hito 2: Migración a Next.js y Tarjetas Compactas

### 📩 Tu Mensaje Exacto:
> *"QUIERO QUE USES NEXT.JS PARA QUE HAGAS UNA INTERFACE MÁS DINÁMICA COPIANDO TAL CUAL LO DE LA IMAGENA DJUNTA Y QUE LOS FORMULARIOS S EVEAN COMPACTOS COMO LA IMAGEN"*

### ⚙️ Acciones Técnicas Ejecutadas:
1. **Configuración de Next.js 14 (App Router):** Se inicializó el proyecto en `C:\Users\Hans\Desktop\FORMATOS DIGITALES GGEE` con `app/layout.tsx`, `app/page.tsx`, `app/globals.css` y `tailwind.config.js`.
2. **Diseño de Tarjetas Compactas:** Se crearon las tarjetas estilo pastilla (*pill inputs*) con fondo `#f8fafc`, bordes redondeados, unidad flotante a la derecha (`PSI`, `°C`, `RPM`, etc.) y cabecera azul marino (`#152336`) con badge "Operando".

---

## 📌 Hito 3: Logo de Copeinca sin Fondo y Tamaño Mayor

### 📩 Tu Mensaje Exacto:
> *"QUIERO QUE EL LOGO SEA MÁS GRANDE Y LE QUITES EL FONDO ,"*

### ⚙️ Acciones Técnicas Ejecutadas:
1. **Procesamiento de Imagen con Python/Pillow:** Se tomó el archivo de imagen de alta resolución del logo Copeinca, se aplicó algoritmo de remoción de fondo blanco (RGBA con canal alfa) y se recortó el margen sobrante (*bounding box*).
2. **Reemplazo en Web y PDF:** Se guardó como `public/copeinca-logo.png` y se aumentó su dimensión visual en `HeaderCopeinca.tsx` a `h-10 md:h-12` con texto en proporción aumentada y legible.

---

## 📌 Hito 4: Definición de los 9 Grupos Oficiales de Planta

### 📩 Tu Mensaje Exacto:
> *"EN LO QUE CORRESPONDE A LA CANTIDAD DE GRUPOS ELECTROGENOS SON 9. QUIERO QUE EN VEZ DE 3 APAREZCAN LOS 9 Y SOLO DEBA SELECIONAR CUALQUIERA DE ELLOS Y COMPLETAR LA INFORMACIÓN, TE DETALLARÉ LA ESCRITURA DE LOS 9 GRUPOS PARA QUE QUEDE CLARO SU NOMENCLATURA:
> GRUPO 1 - BURMEISTER
> GRUPO 3 - BURMEISTER
> GRUPO 4 - KTA 19
> GRUPO 5 - CAT C18
> GRUPO 6 - KTA 50
> GRUPO 7 - CAT 3306
> GRUPO 9 - PERKINS 
> GRUPO 10 - CAT 3512 (PIS)
> GRUPO 11 - CAT 3512 B"*

### ⚙️ Acciones Técnicas Ejecutadas:
1. **Actualización de `src/types/index.ts`:** Se creó la constante oficial `GRUPOS_OFICIALES` con los 9 IDs exactos (`G1`, `G3`, `G4`, `G5`, `G6`, `G7`, `G9`, `G10`, `G11`).
2. **Generación de Estado Dinámico:** Se adaptó `RegistroPorHoraTab.tsx` para generar botones táctiles con checkmark de selección para los 9 grupos.
3. **Consolidado y PDF para los 9 Grupos:** La hoja consolidada y el reporte PDF se recalcularon para desplegar columnas exactas para los 9 grupos.

---

## 📌 Hito 5: Solución al Error de Caché de Webpack (`138.js`)

### 📩 Tu Mensaje Exacto:
> *"Error: Cannot find module './138.js'
> Require stack:
> - C:\Users\Hans\Desktop\FORMATOS DIGITALES GGEE\.next\server\webpack-runtime.js
> - C:\Users\Hans\Desktop\FORMATOS DIGITALES GGEE\.next\server\app\_not-found\page.js..."*

### ⚙️ Diagnóstico y Solución:
* **Causa:** El servidor de desarrollo de Next.js mantuvo un archivo `.next` en caché desincronizado tras una recarga en caliente (HMR).
* **Solución:** Se detuvo el proceso de Node, se purgó completamente la carpeta `.next/`, y se creó el script de inicio robusto `INICIAR_SISTEMA_LOCAL.bat`.

---

## 📌 Hito 6: Eliminación del Grupo 2

### 📩 Tu Mensaje Exacto:
> *"QUITAR ESTE GRUPO 2, YA QUE NO ESTA EN EL LISTADO DE SELECCIÓN DE MIS 9 GRUPOS"*

### ⚙️ Acciones Técnicas Ejecutadas:
1. Se depuraron todas las referencias a `G2` / `GRUPO 02` en:
   - `src/services/storage.ts`
   - `src/components/RegistroPorHoraTab.tsx`
   - `src/components/HojaConsolidadaTab.tsx`
   - `src/App.tsx` (con filtro de saneamiento automático de almacenamiento).

---

## 📌 Hito 7: Desactivación del Auto-Guardado y Control 100% Manual

### 📩 Tu Mensaje Exacto:
> *"OBSERVO QUE CUANDO SELECCIONÓ UN GRUPO EN AUTOMATICO SE GUARDA, Y ESO ES UN ERROR NO DEBERIA SER ASI, EL DAR CLICK EN GUARDAR SE HARÁ CUANDO SE COMPLETE EL LLENADO DE INFORMACIÓN Y ACCIONADO POR EL OPERADOR"*

### ⚙️ Acciones Técnicas Ejecutadas:
1. **Eliminación de hooks reactivos automáticos:** Se retiró el `useEffect` que guardaba con debounce al cambiar de grupo o valor.
2. **Botón Físico "Guardar Registro":** El guardado se condicionó exclusivamente al evento `onClick` del botón principal en `ToolbarCopeinca.tsx`.
3. **Feedback Visual:** Al guardar manualmente, se muestra durante 3 segundos un banner verde de confirmación con icono de check indicando que los datos quedaron asegurados.

---

## 📌 Hito 8: Subida al Repositorio Oficial en GitHub

### 📩 Tu Mensaje Exacto:
> *"SUBE EL PROYECTO A ESTE REPOSITORIO https://github.com/mantenimientobayovar-dot/Formatos-Digitales-GGEE.git MI CUENTA ESTA ASOCIADA A ESTE CORREO mantenimiento.bayovar@gmail.com"*

### ⚙️ Acciones Técnicas Ejecutadas:
1. **Configuración de Git:** Se instaló Git portátil y se configuró el usuario:
   ```bash
   git config user.name "Mantenimiento Bayovar"
   git config user.email "mantenimiento.bayovar@gmail.com"
   ```
2. **Vinculación Remota:** Se enlazó el origen a `https://github.com/mantenimientobayovar-dot/Formatos-Digitales-GGEE.git`.
3. **Commit y Push Inicial:** Se subió la rama `main` y se creó el archivo de acceso rápido `SUBIR_A_GITHUB.bat`.

---

## 📌 Hito 9: Preparación para Vercel, Script SQL y Variables de Entorno

### 📩 Tu Mensaje Exacto:
> *"VOY HACER EL DEPLOY EN VERCEL Y QUIERO QUE GENERES EL CODIGO SQL PARA LAS TABLAS DE DATOS Y AYUDAME CON LAS VARIABLES DE ENTORNO"*

### ⚙️ Acciones Técnicas Ejecutadas:
1. **Creación del Script SQL DDL (`supabase/schema.sql`):**
   - Tablas `gpp_registros_dia` y `casa_fuerza_registros_dia`.
   - Índices de consulta rápida por fecha.
   - Triggers de actualización de `actualizado_en`.
   - Políticas RLS (*Row Level Security*) para lectura y escritura abierta de planta.
2. **Definición de Variables de Entorno:**
   - Creación de `.env.example` y cliente en `src/services/supabase.ts` con lectura de `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## 📌 Hito 10: Resolución del Error de Compilación en Vercel

### 📩 Tu Mensaje Exacto:
> *"01:42:34.117 Running build in Washington, D.C., USA (East) – iad1 ... Failed to compile. ./src/components/GPPForm.tsx:74:7 Type error: Type '{ ... }' is not assignable to type 'Record<string, GPPGrupo>' ... Property 'codigoCorto' is missing ... Error: [BUILD_UTILS_SPAWN_1] Command 'npm run build' exited with 1"*

### ⚙️ Diagnóstico y Solución Definitiva:
1. **Identificación:** `GPPForm.tsx` era el prototipo primario antes de diseñar `RegistroPorHoraTab.tsx`. Aunque ya no se usaba en la web, el compilador estricto de Next.js en Vercel lo detectó al analizar tipos.
2. **Eliminación y Depuración:**
   - Se eliminaron los prototipos no utilizados: `src/components/GPPForm.tsx`, `Header.tsx` y `DashboardView.tsx`.
   - Se flexibilizó `codigoCorto?: string` en `src/types/index.ts`.
   - Se corrigió el acceso a variables en `src/services/supabase.ts` eliminando dependencias directas a `import.meta`.
3. **Prueba de Build Local:** Se ejecutó `npm run build`:
   ```
   ✓ Compiled successfully
   Linting and checking validity of types ...
   ✓ Generating static pages (4/4)
   Finalizing page optimization ...
   Exit code: 0
   ```
4. **Push Automático a GitHub:**
   - Se enviaron los commits `671997e` y `9ae4420` a `origin/main`.

---

## 🚀 Cómo Obtener y Ver tu Link de Despliegue en Vercel

Dado que tu repositorio en GitHub ya tiene el código corregido y probado al 100%, sigue estos pasos en Vercel:

1. **Entra a tu Dashboard en Vercel:** [vercel.com/dashboard](https://vercel.com/dashboard).
2. **Selecciona el Proyecto:** Haz clic en `Formatos-Digitales-GGEE`.
3. **Pestaña Deployments:**
   - Verás el despliegue más reciente correspondiente al último commit.
   - Su estado cambiará a **Ready** (con un círculo verde).
4. **Obtén tu Link Público:**
   - En la tarjeta del despliegue verás el enlace oficial asignado por Vercel (por ejemplo: `https://formatos-digitales-ggee.vercel.app` o similar).
   - Puedes abrirlo desde cualquier PC, tablet o celular conectado a la red.

---

## 🔄 Flujo para Futuros Cambios (En 3 Pasos)

Cada vez que quieras hacer cualquier modificación en el futuro:
1. Realizas los cambios en tus archivos en `C:\Users\Hans\Desktop\FORMATOS DIGITALES GGEE`.
2. Haces doble clic en **`SUBIR_A_GITHUB.bat`**.
3. **Vercel compila y publica automáticamente** la nueva versión en internet en menos de 1 minuto sin que tengas que hacer nada adicional.
