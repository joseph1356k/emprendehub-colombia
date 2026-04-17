import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['src/pages', 'src/components', 'src/context', 'src/data', 'index.html'];
const EXTENSIONS = new Set(['.js', '.jsx', '.html']);

const FORBIDDEN = [
  ['\\bSoe\\b', 'Usa SOE en mayúsculas.', ''],
  ['\\bcontrasena\\b', 'Usa contraseña.'],
  ['\\bsesion\\b', 'Usa sesión.'],
  ['\\baccion\\b', 'Usa acción.'],
  ['\\bmas\\b', 'Usa más cuando sea adverbio de cantidad.'],
  ['\\baun\\b', 'Usa aún cuando signifique todavía.'],
  ['\\bproximo\\b', 'Usa próximo.'],
  ['\\bcomite\\b', 'Usa comité.'],
  ['\\bdireccion\\b', 'Usa dirección.'],
  ['\\bestrategica\\b', 'Usa estratégica.'],
  ['\\bdiagnostico\\b', 'Usa diagnóstico.'],
  ['\\bacompanamiento\\b', 'Usa acompañamiento.'],
  ['\\bpequenos?\\b', 'Usa pequeño/pequeños.'],
  ['\\belectronico\\b', 'Usa electrónico.'],
  ['\\bminimo\\b', 'Usa mínimo.'],
  ['\\butiles\\b', 'Usa útiles.'],
  ['\\bleid[ao]\\b', 'Usa leído/leída.'],
  ['\\bnavegacion\\b', 'Usa navegación.'],
  ['\\btelefono\\b', 'Usa teléfono.'],
  ['\\btecnologia\\b', 'Usa tecnología.'],
  ['\\bfinanciacion\\b', 'Usa financiación.'],
  ['\\bcredito\\b', 'Usa crédito.'],
  ['\\badquisicion\\b', 'Usa adquisición.'],
  ['\\bbasicas?\\b', 'Usa básica/básicas.'],
  ['\\bdisenar\\b', 'Usa diseñar.'],
  ['\\bcamara\\b', 'Usa cámara.'],
  ['\\bpublica\\b', 'Usa pública.'],
  ['\\bcomparacion\\b', 'Usa comparación.'],
  ['\\bsuscripcion\\b', 'Usa suscripción.'],
  ['[\\u00c2\\u00c3\\u00e2]', 'Posible mojibake/encoding roto.'],
].map(([pattern, message, flags = 'i']) => [new RegExp(pattern, flags), message]);

function walk(target) {
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  return fs.readdirSync(target).flatMap((entry) => {
    if (['node_modules', 'dist', 'Desktop', '.git', 'utils'].includes(entry)) return [];
    return walk(path.join(target, entry));
  });
}

function stripTechnicalText(line) {
  return line
    .replace(/https?:[^'"\s)]+/g, '')
    .replace(/[\w.+-]+@[\w.-]+/g, '')
    .replace(/['"]\/[A-Za-z0-9/_-]+['"]/g, '')
    .replace(/#[A-Za-z0-9_-]+/g, '')
    .replace(/\b(id|href|to|path)=["'][^"']+["']/g, '')
    .replace(/\b(id|value|key|to|route|path|type):\s*['"][^'"]+['"]/g, '')
    .replace(/from\(['"][^'"]+['"]\)/g, '')
    .replace(/import\s+.*from\s+['"][^'"]+['"]/g, '');
}

const files = ROOTS.flatMap(walk).filter((file) => EXTENSIONS.has(path.extname(file)));
const findings = [];

for (const file of files) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    const visibleCandidate = stripTechnicalText(line);
    for (const [pattern, message] of FORBIDDEN) {
      if (pattern.test(visibleCandidate)) {
        findings.push(`${file}:${index + 1} ${message}\n  ${line.trim()}`);
      }
    }
  });
}

if (findings.length > 0) {
  console.error('Spanish UI text check failed:\n');
  console.error(findings.join('\n'));
  process.exit(1);
}

console.log('Spanish UI text check passed.');
