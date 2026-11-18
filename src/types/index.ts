export interface GPPDataHora {
  hora: string; // "01:00" .. "00:00"
  presionAceite?: number | null; // psi (Normal 40-70)
  tempAgua?: number | null;       // °C (Normal 70-85, Alarma >90)
  velocidadMotor?: number | null; // rpm (Normal 1780-1820 para 60Hz)
  frecuencia?: number | null;     // Hz (Normal 59.8 - 60.2)
  amperaje?: number | null;       // A
  factorPotencia?: number | null; // Cos φ (0.80 - 1.00)
  energia?: number | null;        // KWH acumulado
}

export interface GPPGrupo {
  id: string; // 'G1', 'G2', 'G3'
  nombre: string; // "GRUPO 01", "GRUPO 02", "GRUPO 03"
  marcaModelo?: string; // "BURMEISTER 1000 KW", etc.
  potenciaNominal?: string;
  activo: boolean; // Si está activo a nivel de día o por hora
  lecturas: Record<string, GPPDataHora>; // Key: "01:00", "02:00", ...
}

export interface GPPRegistroDia {
  id?: string;
  fecha: string; // YYYY-MM-DD
  sede: string; // e.g. "BAYOVAR", "CHIMBOTE", "TODAS"
  proceso: string; // "PROCESO DE PRODUCCIÓN HARINA Y ACEITE"
  turnoActivo: 'A' | 'B';
  operadorA: string;
  operadorB: string;
  observaciones: string;
  voboJefe: boolean;
  voboSuperintendente: boolean;
  // Grupos activos por hora: Key = hora (ej "22:00"), Value = array de group ids activos (ej ['G1', 'G2'])
  gruposActivosPorHora: Record<string, string[]>;
  grupos: Record<string, GPPGrupo>;
  creadoEn?: string;
  actualizadoEn?: string;
}

export const HORAS_24 = [
  '01:00', '02:00', '03:00', '04:00', '05:00', '06:00',
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00', '23:00', '00:00'
];

export const HORAS_TURNO_A = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const HORAS_TURNO_B = [
  '19:00', '20:00', '21:00', '22:00', '23:00', '00:00',
  '01:00', '02:00', '03:00', '04:00', '05:00', '06:00'
];

export const OPERADORES_PREDEFINIDOS = [
  'Juan Sanchez',
  'Luis Rumiche Anton',
  'Carlos Mendoza Silva',
  'Miguel Flores Ramirez',
  'Jose Benites Chavez'
];

export const LIMITES_OPERACIONALES = {
  presionAceite: { minWarn: 35, minDanger: 25, maxWarn: 75, maxDanger: 85, unidad: 'psi', optimo: '40 - 70 psi' },
  tempAgua: { minWarn: 65, minDanger: 50, maxWarn: 85, maxDanger: 95, unidad: '°C', optimo: '70 - 85 °C' },
  velocidadMotor: { minWarn: 1770, minDanger: 1740, maxWarn: 1830, maxDanger: 1860, unidad: 'rpm', optimo: '1800 rpm' },
  frecuencia: { minWarn: 59.5, minDanger: 58.5, maxWarn: 60.5, maxDanger: 61.5, unidad: 'Hz', optimo: '59.8 - 60.2 Hz' },
  amperaje: { minWarn: 100, minDanger: 50, maxWarn: 900, maxDanger: 1100, unidad: 'A', optimo: '300 - 800 A' },
  factorPotencia: { minWarn: 0.80, minDanger: 0.70, maxWarn: 1.00, maxDanger: 1.05, unidad: 'Cos φ', optimo: '0.85 - 0.98' },
  energia: { minWarn: 0, minDanger: 0, maxWarn: 9999999, maxDanger: 9999999, unidad: 'KWH', optimo: 'Totalizador KWH' }
};

// Mantenemos también los tipos de Casa de Fuerza para compatibilidad
export const HORAS_4H = ['03:00', '07:00', '11:00', '15:00', '19:00', '00:00'];

export interface Parametros4H {
  hora: string;
  v1?: number | null;
  v2?: number | null;
  v3?: number | null;
  a1?: number | null;
  a2?: number | null;
  a3?: number | null;
  va?: number | null;
  pf?: number | null;
  w?: number | null;
  hz?: number | null;
  varVal?: number | null;
  kwh?: number | null;
}

export interface EquipoCasaFuerza {
  item: number;
  id: string;
  codigoSap?: string;
  puntoMedida?: string;
  nombre: string;
  consumoDieselGln?: number | null;
  energiaInicial?: number | null;
  energiaFinal?: number | null;
  horasTurno1?: number | null;
  horasTurno2?: number | null;
  horasTurno3?: number | null;
  totalHoras?: number | null;
}

export interface CasaFuerzaRegistroDia {
  id?: string;
  fecha: string;
  responsable: string;
  sede: string;
  equipos: EquipoCasaFuerza[];
  parametrosElectricos: Record<string, Parametros4H[]>;
  fallasTurnoDia: string;
  fallasTurnoNoche: string;
  creadoEn?: string;
  actualizadoEn?: string;
}
