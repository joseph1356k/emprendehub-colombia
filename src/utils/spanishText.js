const EXACT_TEXT = {
  Formalizacion: 'Formalización',
  Validacion: 'Validación',
  Traccion: 'Tracción',
  Inversion: 'Inversión',
  Financiacion: 'Financiación',
  Aceleracion: 'Aceleración',
  Credito: 'Crédito',
  Tecnologia: 'Tecnología',
  Direccion: 'Dirección',
  'Registro en Camara de Comercio': 'Registro en Cámara de Comercio',
  'Definir canales de adquisicion': 'Definir canales de adquisición',
  'Disenar identidad de marca basica': 'Diseñar identidad de marca básica',
  'Armar proyecciones financieras basicas': 'Armar proyecciones financieras básicas',
  'Identificar fuentes de financiacion': 'Identificar fuentes de financiación',
  'Aplicar a una convocatoria publica': 'Aplicar a una convocatoria pública',
  'Formalizacion legal de tu empresa': 'Formalización legal de tu empresa',
};

const PHRASE_REPLACEMENTS = [
  [/\bDiagnostico\b/g, 'Diagnóstico'],
  [/\bdiagnostico\b/g, 'diagnóstico'],
  [/\bcontrasena\b/g, 'contraseña'],
  [/\bContrasena\b/g, 'Contraseña'],
  [/\bsesion\b/g, 'sesión'],
  [/\bSesion\b/g, 'Sesión'],
  [/\baccion\b/g, 'acción'],
  [/\bAccion\b/g, 'Acción'],
  [/\bAun\b/g, 'Aún'],
  [/\baun\b/g, 'aún'],
  [/\bProximo\b/g, 'Próximo'],
  [/\bproximo\b/g, 'próximo'],
  [/\bComite\b/g, 'Comité'],
  [/\bcomite\b/g, 'comité'],
  [/\bDireccion\b/g, 'Dirección'],
  [/\bdireccion\b/g, 'dirección'],
  [/\bTecnologia\b/g, 'Tecnología'],
  [/\btecnologia\b/g, 'tecnología'],
  [/\bFinanciacion\b/g, 'Financiación'],
  [/\bfinanciacion\b/g, 'financiación'],
  [/\bCredito\b/g, 'Crédito'],
  [/\bcredito\b/g, 'crédito'],
  [/\bvalidacion\b/g, 'validación'],
  [/\bValidacion\b/g, 'Validación'],
  [/\btraccion\b/g, 'tracción'],
  [/\bTraccion\b/g, 'Tracción'],
  [/\bInversion\b/g, 'Inversión'],
  [/\binversion\b/g, 'inversión'],
  [/\bpequeno\b/g, 'pequeño'],
  [/\bpequenos\b/g, 'pequeños'],
  [/\bbasica\b/g, 'básica'],
  [/\bbasicas\b/g, 'básicas'],
  [/\bpublica\b/g, 'pública'],
  [/\bcamara\b/g, 'cámara'],
  [/\bCamara\b/g, 'Cámara'],
];

export function spanishText(value) {
  if (value === null || value === undefined) return value;
  const source = String(value);
  let text = EXACT_TEXT[source] || source;
  for (const [pattern, replacement] of PHRASE_REPLACEMENTS) {
    text = text.replace(pattern, replacement);
  }
  return text;
}
