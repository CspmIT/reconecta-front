// node test/regresion.mjs  → compara los veredictos del fixture con el esperado (snapshot).
// node test/regresion.mjs --actualizar  → regraba el esperado después de cambiar reglas a conciencia.
import fs from 'fs';
import { setCatalogo, procesar } from '../../src/utils/eventosConcluidos/motor.js';
setCatalogo(JSON.parse(fs.readFileSync(new URL('../../src/utils/eventosConcluidos/catalogo.json', import.meta.url), 'utf8')));

const dir = new URL('./fixtures/', import.meta.url);
let fallas = 0;
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.json') && !n.endsWith('.esperado.json'))) {
  const fx = JSON.parse(fs.readFileSync(new URL(f, dir), 'utf8'));
  const enUtc = (f) => (typeof f === 'string' && !/(Z|[+-]\d{2}:?\d{2})$/.test(f) ? f + 'Z' : f);
  const filas = fx.registros.map((r) => ({ ts: enUtc(r.fecha), id: r.idEvento, version: fx.version, equipo: fx.equipo }));
  const salida = procesar(filas, { gapSegundos: 2 }).map((e) => ({ inicio: e.inicio.toISOString(), severidad: e.severidad, categoria: e.categoria, veredicto: e.veredicto, detalle: e.detalle, crudos: e.crudos.length }));
  const esperadoPath = new URL(f.replace('.json', '.esperado.json'), dir);
  if (process.argv.includes('--actualizar') || !fs.existsSync(esperadoPath)) { fs.writeFileSync(esperadoPath, JSON.stringify(salida, null, 1)); console.log(`${f}: esperado grabado (${salida.length} eventos)`); continue; }
  const esperado = JSON.parse(fs.readFileSync(esperadoPath, 'utf8'));
  const ok = JSON.stringify(esperado) === JSON.stringify(salida);
  console.log(`${f}: ${ok ? 'OK' : 'DIFIERE'} (${salida.length} eventos)`);
  if (!ok) { fallas++; salida.forEach((s, i) => { if (JSON.stringify(s) !== JSON.stringify(esperado[i])) console.log('  ', i, s.veredicto, '\n     esperado:', esperado[i]?.veredicto); }); }
}
process.exit(fallas ? 1 : 0);
