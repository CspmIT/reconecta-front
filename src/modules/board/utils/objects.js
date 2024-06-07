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
  { id: 1, name: "Grupo activo", type: "circles" },
  { id: 2, name: "Protección", type: "switch", checked: true },
  { id: 3, name: "Recierre", type: "switch" },
  { id: 4, name: "Falla a tierra", type: "switch" },
  { id: 5, name: "Carga en frío", type: "switch" },
  { id: 6, name: "Falla a tierra sensible", type: "switch" },
  { id: 7, name: "Línea viva", type: "switch" },
  { id: 8, name: "Protección de tensión", type: "switch" },
  { id: 9, name: "Disparo por frecuencia", type: "switch" },
  { id: 10, name: "Disparo por armónicos", type: "switch" },
  { id: 11, name: "Protección por admitancia N", type: "switch" },
  { id: 12, name: "Disparo rápido", type: "switch" },
];

export const boardMetrology = [
  { id: 1, name: "Corrientes", children: [{ name: "A" }, { name: "B" }, { name: "C" }, { name: "N" }] },
  { id: 2, name: "Tensión ABC", children: [{ name: "A" }, { name: "AB" }, { name: "B" }, { name: "BC" }, { name: "C" }, { name: "CA" }] },
  { id: 3, name: "Tensión SRT", children: [{ name: "R" }, { name: "RS" }, { name: "S" }, { name: "ST" }, { name: "T" }, { name: "TR" }] },
  { id: 4, name: "Potencia", children: [{ name: "S" }, { name: "FP A" }, { name: "P" }, { name: "FP B" }, { name: "Q" }, { name: "FP C" }] },
  { id: 5, name: "UPS", children: [{ name: "Tensión de batería" }, { name: "Corriente de carga" }, { name: "Carga efectiva" }] },
];
