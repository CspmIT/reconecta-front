export const boardStatus = [
  { id: 1, name: "Alarma" },
  { id: 2, name: "Alerta" },
  { id: 3, name: "Malfunción" },
  { id: 4, name: "Bloqueo" },
];

export const boardFields = [
  { id: 1, name: "Nombre" },
  { id: 2, name: "Número" },
  { id: 3, name: "Nro de serie" },
  { id: 4, name: "Alimentación" },
  { id: 5, name: "MODO" },
];

export const boardControls = [
  { id: 1, name: "Grupo Activo", type: "circles" },
  { id: 2, name: "Protección", type: "switch" },
  { id: 3, name: "Recierre", type: "switch" },
  { id: 4, name: "Falla a Tierra", type: "switch" },
  { id: 5, name: "Carga en Frío", type: "switch" },
  { id: 6, name: "Falla a Tierra Sensible", type: "switch" },
  { id: 7, name: "Línea Viva", type: "switch" },
  { id: 8, name: "Falla de Tensión", type: "switch" },
  { id: 9, name: "Falla de frecuencia", type: "switch" },
  { id: 10, name: "Falla de Harmónicos", type: "switch" },
  { id: 11, name: "Falla de Admitancia N", type: "switch" },
  { id: 12, name: "Disparo Rápido", type: "switch" },
];

export const boardMetrology = [
  { id: 1, name: "Corrientes", children: [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "N" }] },
  { id: 2, name: "Tensión ABC", children: [{ name: "A" }, { name: "AB" }, { name: "B" }, { name: "BC" }, { name: "C" }, { name: "CA" }] },
  { id: 3, name: "Tensión SRT", children: [{ name: "R" }, { name: "RS" }, { name: "S" }, { name: "ST" }, { name: "T" }, { name: "TR" }] },
  { id: 4, name: "Potencia", children: [{ name: "S" }, { name: "FP A" }, { name: "P" }, { name: "FP A" }, { name: "Q" }, { name: "FP A" }] },
  { id: 5, name: "UPS", children: [{ name: "Tensión de Batería" }, { name: "Corriente de Carga" }, { name: "Carga Efectiva" }] },
];
