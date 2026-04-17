export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'etapa',
    label: '¿En qué etapa se encuentra tu negocio?',
    helper: 'Esto define qué tan táctico o estructural debe ser el plan.',
    options: [
      { value: 'idea', label: 'Idea en construcción', desc: 'Estoy definiendo la oferta y todavía no vendo.' },
      { value: 'validando', label: 'Validando mercado', desc: 'Tengo conversaciones, prototipo o primeras pruebas.' },
      { value: 'vendiendo', label: 'Ya estoy vendiendo', desc: 'Tengo clientes que pagan, aunque todavía falta orden.' },
      { value: 'creciendo', label: 'Creciendo con equipo', desc: 'Hay operación, clientes y decisiones que ordenar.' },
      { value: 'escalando', label: 'Escalando', desc: 'Busco capital, nuevos mercados o estructura directiva.' },
    ],
  },
  {
    id: 'oferta',
    label: '¿Qué tan clara está tu oferta?',
    helper: 'SOE necesita saber si primero debe ordenar el producto o la ejecución.',
    options: [
      { value: 'difusa', label: 'Todavía cambia mucho', desc: 'Me cuesta explicar exactamente qué vendo.' },
      { value: 'parcial', label: 'Clara para algunos clientes', desc: 'Funciona en ciertos casos, pero falta enfoque.' },
      { value: 'clara', label: 'Clara y vendible', desc: 'Puedo explicar problema, solución y resultado.' },
      { value: 'sistematizada', label: 'Clara y repetible', desc: 'Está empaquetada, documentada y se puede delegar.' },
    ],
  },
  {
    id: 'cliente_ideal',
    label: '¿Qué tan definido está tu cliente ideal?',
    helper: 'Sin cliente concreto, el plan debe priorizar entrevistas y foco comercial.',
    options: [
      { value: 'no-definido', label: 'No lo tengo definido', desc: 'Estoy intentando venderle a muchas personas.' },
      { value: 'hipotesis', label: 'Tengo una hipótesis', desc: 'Creo saber quién compra, pero falta evidencia.' },
      { value: 'validado', label: 'Tengo señales claras', desc: 'Ya sé quién responde y por qué compra.' },
      { value: 'segmentado', label: 'Tengo segmentos priorizados', desc: 'Sé a quién atacar primero y con qué mensaje.' },
    ],
  },
  {
    id: 'ventas',
    label: '¿Cómo están las ventas hoy?',
    helper: 'Esto separa tareas de validación, ventas, caja y crecimiento.',
    options: [
      { value: 'cero', label: 'Aún no vendo', desc: 'No hay ingresos todavía.' },
      { value: 'primeras', label: 'Primeras ventas', desc: 'Hay ventas puntuales o pilotos.' },
      { value: 'recurrentes', label: 'Ventas recurrentes', desc: 'Tengo clientes que pagan con cierta regularidad.' },
      { value: 'creciendo', label: 'Ventas creciendo', desc: 'La demanda existe y el reto es ordenar escala.' },
    ],
  },
  {
    id: 'canal',
    label: '¿Cuál es tu canal principal de adquisición?',
    helper: 'El agente debe saber dónde conviene concentrar energía esta semana.',
    options: [
      { value: 'ninguno', label: 'No tengo canal definido', desc: 'Consigo clientes de forma ocasional.' },
      { value: 'referidos', label: 'Referidos y red cercana', desc: 'La venta depende de contactos personales.' },
      { value: 'organico', label: 'Contenido u orgánico', desc: 'Uso redes, comunidad, SEO o eventos.' },
      { value: 'pago', label: 'Pauta o prospección', desc: 'Uso anuncios, outbound o campañas directas.' },
      { value: 'alianzas', label: 'Alianzas', desc: 'Dependo de partners, distribuidores o convenios.' },
    ],
  },
  {
    id: 'caja',
    label: '¿Qué tan controlada está la caja?',
    helper: 'Si la caja está desordenada, el plan debe proteger liquidez antes que crecer.',
    options: [
      { value: 'sin-control', label: 'No tengo visibilidad', desc: 'No sé con precisión cuánto entra, sale o queda.' },
      { value: 'mes-a-mes', label: 'Vivo mes a mes', desc: 'Tengo control parcial, pero poca anticipación.' },
      { value: 'ordenada', label: 'Caja ordenada', desc: 'Sé gastos, ingresos y runway aproximado.' },
      { value: 'proyectada', label: 'Caja proyectada', desc: 'Tengo presupuesto, escenarios y decisiones claras.' },
    ],
  },
  {
    id: 'margen',
    label: '¿Qué tan claro tienes el margen?',
    helper: 'Precios y rentabilidad cambian radicalmente las tareas recomendadas.',
    options: [
      { value: 'desconocido', label: 'No lo sé', desc: 'No tengo claro cuánto gano por venta.' },
      { value: 'bajo', label: 'Margen bajo o presionado', desc: 'Vendo, pero queda poco o no sé si alcanza.' },
      { value: 'saludable', label: 'Margen saludable', desc: 'Tengo margen suficiente para operar.' },
      { value: 'alto', label: 'Margen alto', desc: 'Hay espacio para invertir en crecimiento.' },
    ],
  },
  {
    id: 'formalizacion',
    label: '¿Qué tan formalizado está el negocio?',
    helper: 'La formalización desbloquea bancos, contratos, convocatorias y alianzas.',
    options: [
      { value: 'ninguna', label: 'Sin formalización', desc: 'Aún no tengo RUT ni matrícula mercantil.' },
      { value: 'en-proceso', label: 'En proceso', desc: 'Ya inicié trámites o tengo algunos documentos.' },
      { value: 'parcial', label: 'Parcialmente formal', desc: 'Puedo operar, pero faltan piezas importantes.' },
      { value: 'completa', label: 'Formalización completa', desc: 'Tengo documentos principales al día.' },
    ],
  },
  {
    id: 'operacion',
    label: '¿Cómo funciona la operación diaria?',
    helper: 'SOE debe detectar si el cuello de botella es vender o ejecutar.',
    options: [
      { value: 'improvisada', label: 'Improvisada', desc: 'Todo depende de memoria, urgencias y mensajes sueltos.' },
      { value: 'listas', label: 'Con listas básicas', desc: 'Hay tareas, pero falta seguimiento real.' },
      { value: 'repetible', label: 'Repetible', desc: 'Tengo procesos básicos y puedo medir avance.' },
      { value: 'delegada', label: 'Delegada', desc: 'Hay responsables, reuniones y control de ejecución.' },
    ],
  },
  {
    id: 'equipo',
    label: '¿Cómo está armado tu equipo?',
    helper: 'El plan debe ajustarse a tu capacidad real de ejecución.',
    options: [
      { value: 'solo', label: 'Solo por ahora', desc: 'Yo concentro la mayoría de decisiones y ejecución.' },
      { value: 'cofundadores', label: 'Equipo fundador pequeño', desc: 'Tengo una o dos personas clave.' },
      { value: 'pequeno', label: 'Equipo operativo pequeño', desc: 'Hay 3 a 5 personas ejecutando.' },
      { value: 'establecido', label: 'Equipo establecido', desc: 'Hay roles definidos y capacidad de delegar.' },
    ],
  },
  {
    id: 'bloqueo_principal',
    label: '¿Cuál es el bloqueo principal ahora?',
    helper: 'Esto define la prioridad del mes.',
    options: [
      { value: 'claridad', label: 'Falta claridad', desc: 'No sé qué priorizar ni qué decisión tomar.' },
      { value: 'ventas', label: 'Faltan ventas', desc: 'Necesito clientes, conversaciones o cierre.' },
      { value: 'caja', label: 'Caja o financiación', desc: 'La liquidez o el capital me limita.' },
      { value: 'operacion', label: 'Operación desordenada', desc: 'Hay demasiadas tareas y poco seguimiento.' },
      { value: 'equipo', label: 'Equipo o roles', desc: 'No sé qué delegar, contratar o tercerizar.' },
      { value: 'capital', label: 'Capital para crecer', desc: 'Necesito preparar inversión, crédito o convocatoria.' },
    ],
  },
  {
    id: 'objetivo_30_dias',
    label: '¿Qué resultado quieres lograr en los próximos 30 días?',
    helper: 'SOE convertirá esto en tareas con criterio de completado.',
    options: [
      { value: 'validar', label: 'Validar la oferta', desc: 'Quiero evidencia clara de problema, cliente y solución.' },
      { value: 'vender', label: 'Conseguir más ventas', desc: 'Quiero conversaciones y cierres concretos.' },
      { value: 'ordenar', label: 'Ordenar ejecución', desc: 'Quiero foco, tablero y responsabilidades.' },
      { value: 'financiar', label: 'Preparar financiación', desc: 'Quiero estar listo para crédito, inversión o convocatoria.' },
      { value: 'contratar', label: 'Decidir equipo', desc: 'Quiero saber qué delegar, contratar o tercerizar.' },
      { value: 'escalar', label: 'Escalar canal', desc: 'Quiero repetir un canal que ya funciona.' },
    ],
  },
  {
    id: 'tiempo_disponible',
    label: '¿Cuánto tiempo real puedes dedicar esta semana?',
    helper: 'Un buen plan respeta tu capacidad actual.',
    options: [
      { value: 'bajo', label: 'Menos de 4 horas', desc: 'Necesito pocas acciones de alto impacto.' },
      { value: 'medio', label: '4 a 10 horas', desc: 'Puedo ejecutar un plan semanal realista.' },
      { value: 'alto', label: 'Más de 10 horas', desc: 'Puedo mover varias prioridades en paralelo.' },
    ],
  },
  {
    id: 'recurso_urgente',
    label: '¿Qué recurso destrabaría más avance?',
    helper: 'Esto ayuda al agente a recomendar tareas, documentos u oportunidades.',
    options: [
      { value: 'herramientas', label: 'Herramientas y plantillas', desc: 'Necesito bajar ideas a ejecución.' },
      { value: 'red', label: 'Red y alianzas', desc: 'Necesito abrir conversaciones correctas.' },
      { value: 'financiacion', label: 'Financiación', desc: 'Necesito oportunidades de capital o crédito.' },
      { value: 'formacion', label: 'Aprendizaje práctico', desc: 'Necesito fortalecer una habilidad concreta.' },
      { value: 'criterio', label: 'Criterio externo', desc: 'Necesito decidir con alguien que ordene el ruido.' },
    ],
  },
  {
    id: 'decision_critica',
    label: '¿Qué decisión necesitas destrabar primero?',
    helper: 'El agente usará esto para darte criterio más preciso.',
    options: [
      { value: 'precios', label: 'Precios', desc: 'No sé si cobrar más, menos o cambiar el paquete.' },
      { value: 'canal', label: 'Canal de ventas', desc: 'No sé dónde enfocar adquisición.' },
      { value: 'producto', label: 'Producto u oferta', desc: 'No sé qué mantener, eliminar o mejorar.' },
      { value: 'contratar', label: 'Contratar o tercerizar', desc: 'No sé si sumar equipo o proveedores.' },
      { value: 'capital', label: 'Capital', desc: 'No sé si buscar crédito, inversión o convocatoria.' },
      { value: 'prioridades', label: 'Prioridades', desc: 'No sé qué hacer primero esta semana.' },
    ],
  },
];

const STAGE_LABELS = {
  idea: 'Idea',
  validando: 'Validacion',
  vendiendo: 'Traccion',
  creciendo: 'Crecimiento',
  escalando: 'Escalamiento',
};

const BLOCKER_LABELS = {
  claridad: 'Falta claridad estratégica',
  ventas: 'Necesitas más conversaciones y cierres',
  caja: 'La caja necesita control inmediato',
  operacion: 'La operación está absorbiendo foco',
  equipo: 'Hay decisiones pendientes de equipo o roles',
  capital: 'Necesitas preparar financiación con evidencia',
};

const RISK_LABELS = {
  claridad: 'Tomar decisiones dispersas sin evidencia suficiente.',
  ventas: 'Invertir tiempo en operación sin validar demanda semanal.',
  caja: 'Crecer o vender sin saber si la caja aguanta.',
  operacion: 'Acumular tareas sin responsables ni cierre.',
  equipo: 'Delegar tarde o contratar sin rol claro.',
  capital: 'Buscar dinero sin narrativa, números ni documentos listos.',
};

const SCORE_RULES = {
  oferta: {
    difusa: { Claridad: 2, Foco: 2 },
    parcial: { Claridad: 5, Foco: 5 },
    clara: { Claridad: 8, Foco: 7 },
    sistematizada: { Claridad: 9, Foco: 9, Operaciones: 8 },
  },
  cliente_ideal: {
    'no-definido': { Claridad: 2, Ventas: 2, Foco: 2 },
    hipotesis: { Claridad: 5, Ventas: 4 },
    validado: { Claridad: 8, Ventas: 7 },
    segmentado: { Claridad: 9, Ventas: 8, Foco: 8 },
  },
  ventas: {
    cero: { Ventas: 2, Finanzas: 2 },
    primeras: { Ventas: 5, Finanzas: 4 },
    recurrentes: { Ventas: 7, Finanzas: 6 },
    creciendo: { Ventas: 9, Finanzas: 7, Operaciones: 6 },
  },
  canal: {
    ninguno: { Ventas: 2, Foco: 3 },
    referidos: { Ventas: 5 },
    organico: { Ventas: 6 },
    pago: { Ventas: 7, Finanzas: 5 },
    alianzas: { Ventas: 7, Foco: 6 },
  },
  caja: {
    'sin-control': { Finanzas: 2 },
    'mes-a-mes': { Finanzas: 4 },
    ordenada: { Finanzas: 7 },
    proyectada: { Finanzas: 9 },
  },
  margen: {
    desconocido: { Finanzas: 2, Claridad: 4 },
    bajo: { Finanzas: 4 },
    saludable: { Finanzas: 7 },
    alto: { Finanzas: 9 },
  },
  formalizacion: {
    ninguna: { Formalización: 2 },
    'en-proceso': { Formalización: 4 },
    parcial: { Formalización: 6 },
    completa: { Formalización: 9 },
  },
  operacion: {
    improvisada: { Operaciones: 2, Foco: 3 },
    listas: { Operaciones: 5 },
    repetible: { Operaciones: 7 },
    delegada: { Operaciones: 9, Foco: 8 },
  },
};

const TASK_LIBRARY = {
  claridad: [
    task('Producto / Servicio', 'Escribir una propuesta de valor en una frase', 'Alta', 'Alinear problema, cliente y resultado antes de ejecutar.', 'Una frase clara que explique cliente, problema, solución y resultado.', 'La propuesta se entiende en menos de 20 segundos.'),
    task('Producto / Servicio', 'Definir el cliente ideal prioritario', 'Alta', 'Reducir dispersión comercial y enfocar mensajes.', 'Un segmento principal con señales de dolor, presupuesto y urgencia.', 'Existe una lista de 20 prospectos que encajan con el segmento.'),
    task('Mercadeo', 'Elegir un canal principal para los próximos 14 días', 'Media', 'Evitar repartir energía entre demasiados canales.', 'Un canal con hipótesis, meta semanal y actividad definida.', 'El canal tiene meta, frecuencia y responsable.'),
  ],
  ventas: [
    task('Mercadeo', 'Crear lista de 30 prospectos calificados', 'Alta', 'Convertir intención comercial en pipeline real.', 'Base de prospectos con nombre, contacto, necesidad y prioridad.', 'Hay 30 prospectos con criterio de calificación.'),
    task('Mercadeo', 'Enviar 10 mensajes de prospección esta semana', 'Alta', 'Generar conversaciones reales de venta.', '10 contactos hechos con mensaje personalizado.', 'Se registran respuestas, objeciones y siguiente paso.'),
    task('Producto / Servicio', 'Documentar las 5 objeciones comerciales más repetidas', 'Media', 'Ajustar oferta y mensaje con evidencia.', 'Lista de objeciones y respuesta recomendada.', 'Cada objeción tiene una respuesta o cambio de oferta asociado.'),
  ],
  caja: [
    task('Financiero', 'Armar flujo de caja de 30 días', 'Alta', 'Proteger liquidez antes de tomar decisiones de crecimiento.', 'Vista simple de entradas, salidas y saldo esperado.', 'El flujo muestra saldo semanal y gastos críticos.'),
    task('Financiero', 'Calcular punto de equilibrio mensual', 'Alta', 'Saber cuánto debe vender el negocio para sostenerse.', 'Meta mínima de ventas mensual y semanal.', 'La meta incluye costos fijos, variables y margen.'),
    task('Financiero', 'Definir tres decisiones para mejorar caja esta semana', 'Media', 'Convertir diagnóstico financiero en acción inmediata.', 'Tres acciones priorizadas por impacto y rapidez.', 'Cada acción tiene responsable y fecha.'),
  ],
  operacion: [
    task('Operaciones', 'Crear tablero semanal de prioridades', 'Alta', 'Pasar de urgencias sueltas a ejecución visible.', 'Tablero con pendientes, bloqueos y responsables.', 'Cada tarea tiene estado, prioridad y fecha.'),
    task('Operaciones', 'Definir ritual semanal de seguimiento', 'Media', 'Evitar que el plan se pierda después de crear tareas.', 'Reunión o revisión fija con agenda corta.', 'Existe horario, agenda y criterio de cierre.'),
    task('Operaciones', 'Eliminar o delegar tres tareas de bajo impacto', 'Media', 'Liberar foco para la prioridad del mes.', 'Lista de tareas eliminadas, delegadas o pospuestas.', 'Cada tarea tiene decisión explícita.'),
  ],
  equipo: [
    task('Operaciones', 'Mapear roles necesarios para el próximo mes', 'Alta', 'Distinguir entre contratar, tercerizar o esperar.', 'Mapa de roles, responsabilidades y carga actual.', 'Cada rol tiene razón, costo estimado y urgencia.'),
    task('Operaciones', 'Definir qué se debe delegar primero', 'Media', 'Evitar que el fundador siga siendo cuello de botella.', 'Lista priorizada de tareas delegables.', 'La primera tarea delegable tiene instrucciones claras.'),
    task('Financiero', 'Calcular costo de contratar vs tercerizar', 'Media', 'Tomar la decisión con números, no ansiedad.', 'Comparación simple de costo, riesgo y tiempo.', 'La decisión tiene presupuesto máximo y criterio de éxito.'),
  ],
  capital: [
    task('Inversión', 'Actualizar pitch deck con problema, tracción y uso de fondos', 'Alta', 'Preparar una narrativa creíble para capital o convocatorias.', 'Pitch deck base con historia y números principales.', 'El deck responde problema, mercado, solución, tracción y uso de fondos.'),
    task('Financiero', 'Preparar modelo financiero simple', 'Alta', 'Sostener solicitudes de capital con números defendibles.', 'Modelo con ingresos, costos, margen y escenario de 12 meses.', 'El modelo explica cuánto dinero se necesita y para qué.'),
    task('Inversión', 'Seleccionar tres fuentes de financiación viables', 'Media', 'Evitar aplicar a todo sin criterio.', 'Lista corta de convocatorias, crédito o inversión.', 'Cada fuente tiene requisitos, fecha y siguiente paso.'),
  ],
};

const OBJECTIVE_TASKS = {
  validar: [
    task('Producto / Servicio', 'Hacer 8 entrevistas de validación con clientes ideales', 'Alta', 'Validar problema y lenguaje antes de construir más.', 'Ocho entrevistas documentadas con patrones claros.', 'Cada entrevista registra problema, alternativa actual y disposición de pago.'),
  ],
  vender: [
    task('Mercadeo', 'Definir oferta comercial de la semana', 'Alta', 'Vender algo específico aumenta cierre y seguimiento.', 'Oferta con precio, beneficio y llamada a la acción.', 'La oferta se puede enviar por mensaje o presentar en reunión.'),
  ],
  ordenar: [
    task('Operaciones', 'Cerrar el top 3 de prioridades del mes', 'Alta', 'Reducir ruido y alinear ejecución.', 'Tres prioridades con métrica y fecha.', 'No hay más de tres prioridades activas.'),
  ],
  financiar: [
    task('Inversión', 'Crear carpeta de documentos para financiación', 'Alta', 'Reducir fricción cuando aparezca una oportunidad.', 'Carpeta con pitch, finanzas, Cámara de Comercio y RUT.', 'Cada documento está listo o marcado como faltante.'),
  ],
  contratar: [
    task('Operaciones', 'Crear scorecard del rol que más desbloquea avance', 'Alta', 'Contratar o tercerizar sin rol claro suele crear más ruido.', 'Perfil del rol con resultado esperado y tareas.', 'El rol tiene objetivo de 30 días y presupuesto.'),
  ],
  escalar: [
    task('Mercadeo', 'Documentar el canal que mejor convierte', 'Alta', 'Escalar exige saber qué repetir y qué medir.', 'Playbook simple del canal con pasos y métricas.', 'El canal tiene métrica de conversión y frecuencia semanal.'),
  ],
};

function task(section, title, priority, rationale, expectedOutcome, acceptanceCriteria) {
  return { section, title, priority, rationale, expectedOutcome, acceptanceCriteria };
}

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function mergeScores(answers) {
  const areas = {
    Claridad: [],
    Ventas: [],
    Finanzas: [],
    Operaciones: [],
    Formalización: [],
    Foco: [],
  };

  Object.entries(SCORE_RULES).forEach(([questionId, options]) => {
    const answer = answers?.[questionId];
    const values = options[answer] || {};
    Object.entries(values).forEach(([area, score]) => areas[area]?.push(score));
  });

  return Object.fromEntries(
    Object.entries(areas).map(([area, values]) => {
      const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 5;
      return [area, Math.max(1, Math.min(10, Math.round(average)))];
    })
  );
}

function uniqueTasks(tasks) {
  const seen = new Set();
  return tasks.filter((item) => {
    const key = item.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function buildDeterministicPlan(answers = {}) {
  const scores = mergeScores(answers);
  const weakestArea = Object.entries(scores).sort((a, b) => a[1] - b[1])[0]?.[0] || 'Foco';
  const blocker = answers.bloqueo_principal || (weakestArea === 'Ventas' ? 'ventas' : weakestArea === 'Finanzas' ? 'caja' : 'claridad');
  const stage = STAGE_LABELS[answers.etapa] || 'Idea';
  const objective = answers.objetivo_30_dias || 'ordenar';
  const baseTasks = [
    ...(TASK_LIBRARY[blocker] || TASK_LIBRARY.claridad),
    ...(OBJECTIVE_TASKS[objective] || []),
    ...TASK_LIBRARY.claridad,
    ...TASK_LIBRARY.ventas,
    ...TASK_LIBRARY.caja,
    ...TASK_LIBRARY.operacion,
  ];

  const maxTasks = answers.tiempo_disponible === 'bajo' ? 8 : answers.tiempo_disponible === 'alto' ? 12 : 10;
  const recommendedTasks = uniqueTasks(baseTasks)
    .slice(0, maxTasks)
    .map((item, index) => ({
      ...item,
      status: 'pendiente',
      dueDate: addDays(index < 3 ? index + 2 : index * 2 + 2),
      orderIndex: index + 1,
      source: 'diagnostic_rules',
    }));

  return {
    runId: `local-${Date.now()}`,
    model: 'deterministic-fallback',
    scores,
    snapshot: {
      stage,
      weakestArea,
      mainBlocker: BLOCKER_LABELS[blocker] || BLOCKER_LABELS.claridad,
      currentRisk: RISK_LABELS[blocker] || RISK_LABELS.claridad,
      monthlyPriority: recommendedTasks[0]?.title || 'Definir la siguiente prioridad del negocio',
      agentRecommendation: `Esta semana conviene concentrarse en ${weakestArea.toLowerCase()} y cerrar evidencia concreta antes de abrir nuevas iniciativas.`,
    },
    recommendedTasks,
  };
}

export function normalizeRecommendedTask(item, index = 0) {
  return {
    section: item?.section || 'Operaciones',
    title: item?.title || `Prioridad recomendada ${index + 1}`,
    status: item?.status || 'pendiente',
    priority: ['Alta', 'Media', 'Baja'].includes(item?.priority) ? item.priority : index < 3 ? 'Alta' : 'Media',
    dueDate: item?.dueDate || item?.due_date || addDays(index + 3),
    rationale: item?.rationale || 'Tarea recomendada por el diagnóstico para mover el negocio con foco.',
    expectedOutcome: item?.expectedOutcome || item?.expected_outcome || 'Avance concreto y verificable.',
    acceptanceCriteria: item?.acceptanceCriteria || item?.acceptance_criteria || 'La tarea tiene evidencia de cierre.',
    orderIndex: item?.orderIndex || item?.order_index || index + 1,
    source: item?.source || 'diagnostic_ai',
  };
}
