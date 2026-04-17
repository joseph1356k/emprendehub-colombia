export const DEFAULT_TASKS = [
  { section: 'Formalización', title: 'Registrar RUT en DIAN', priority: 'Alta', due_in_days: 4 },
  { section: 'Formalización', title: 'Crear empresa (SAS o Persona Natural)', priority: 'Alta', due_in_days: 6 },
  { section: 'Formalización', title: 'Registro en Cámara de Comercio', priority: 'Alta', due_in_days: 8 },
  { section: 'Formalización', title: 'Abrir cuenta bancaria empresarial', priority: 'Media', due_in_days: 12 },
  { section: 'Producto / Servicio', title: 'Definir propuesta de valor', priority: 'Alta', due_in_days: 5 },
  { section: 'Producto / Servicio', title: 'Construir o definir MVP', priority: 'Alta', due_in_days: 10 },
  { section: 'Producto / Servicio', title: 'Realizar 10 entrevistas de usuario', priority: 'Alta', due_in_days: 14 },
  { section: 'Producto / Servicio', title: 'Iterar producto con feedback recibido', priority: 'Media', due_in_days: 17 },
  { section: 'Mercadeo', title: 'Definir buyer persona', priority: 'Alta', due_in_days: 9 },
  { section: 'Mercadeo', title: 'Crear perfiles en redes sociales', priority: 'Media', due_in_days: 11 },
  { section: 'Mercadeo', title: 'Definir canales de adquisición', priority: 'Media', due_in_days: 13 },
  { section: 'Mercadeo', title: 'Diseñar identidad de marca básica', priority: 'Baja', due_in_days: 18 },
  { section: 'Financiero', title: 'Definir modelo de ingresos', priority: 'Alta', due_in_days: 7 },
  { section: 'Financiero', title: 'Armar proyecciones financieras básicas', priority: 'Alta', due_in_days: 9 },
  { section: 'Financiero', title: 'Calcular punto de equilibrio', priority: 'Media', due_in_days: 15 },
  { section: 'Inversión', title: 'Elaborar pitch deck', priority: 'Media', due_in_days: 10 },
  { section: 'Inversión', title: 'Identificar fuentes de financiación', priority: 'Media', due_in_days: 16 },
  { section: 'Inversión', title: 'Aplicar a una convocatoria pública', priority: 'Baja', due_in_days: 20 }
];

export const TASK_DOCUMENT_RULES = {
  'Elaborar pitch deck': { docType: 'Pitch deck', category: 'Comercial' },
  'Armar proyecciones financieras básicas': { docType: 'Modelo financiero', category: 'Financiero' },
  'Definir propuesta de valor': { docType: 'Business Model Canvas', category: 'Comercial' },
  'Diseñar identidad de marca básica': { docType: 'Registro de marca', category: 'Legal' }
};

export const MOCK_OPPORTUNITIES = [
  {
    id: 'opp-1',
    title: 'Fondo Emprender SENA',
    organization: 'SENA',
    description: 'Capital semilla no reembolsable para equipos en etapa temprana con validación inicial.',
    type: 'Financiación',
    status: 'Abierta',
    stages: ['Idea', 'Validacion'],
    amount: 'Hasta $180M COP',
    deadline: '15 Abr 2026',
    deadlineDate: '2026-04-15',
    tags: ['Capital Semilla', 'Nacional', 'SENA'],
    link: 'https://www.fondoemprender.com'
  },
  {
    id: 'opp-2',
    title: 'iNNpulsa Impulsa+',
    organization: 'iNNpulsa Colombia',
    description: 'Programa de escalamiento con capital, criterio externo y conexiones comerciales.',
    type: 'Aceleración',
    status: 'Abierta',
    stages: ['Traccion', 'Crecimiento'],
    amount: 'Hasta $400M COP + dirección',
    deadline: '28 Mar 2026',
    deadlineDate: '2026-03-28',
    tags: ['Escalamiento', 'Nacional', 'iNNpulsa'],
    link: 'https://www.innpulsacolombia.com'
  },
  {
    id: 'opp-3',
    title: 'Apps.co Cohorte 2026',
    organization: 'MinTIC',
    description: 'Acompañamiento para negocios digitales en etapa de producto temprano.',
    type: 'Aceleración',
    status: 'Abierta',
    stages: ['Idea', 'Validacion'],
    amount: 'Servicios y acompañamiento',
    deadline: '10 May 2026',
    deadlineDate: '2026-05-10',
    tags: ['Tecnología', 'Digital', 'MinTIC'],
    link: 'https://apps.co'
  },
  {
    id: 'opp-4',
    title: 'Bancoldex Capital Productivo',
    organization: 'Bancoldex',
    description: 'Crédito para empresas en crecimiento con necesidad de capital productivo.',
    type: 'Crédito',
    status: 'Abierta',
    stages: ['Traccion', 'Crecimiento', 'Escalamiento'],
    amount: 'Desde $50M hasta $2.000M COP',
    deadline: 'Permanente',
    deadlineDate: null,
    tags: ['Crédito', 'Nacional', 'Bancoldex'],
    link: 'https://www.bancoldex.com'
  },
  {
    id: 'opp-5',
    title: 'Colfuturo Becas Empresariales',
    organization: 'Colfuturo',
    description: 'Becas para fundadores que buscan formación de alto impacto en negocios.',
    type: 'Beca',
    status: 'Próximamente',
    stages: ['Crecimiento', 'Escalamiento'],
    amount: 'Hasta USD 40.000',
    deadline: '1 Jun 2026',
    deadlineDate: '2026-06-01',
    tags: ['Formación', 'Internacional'],
    link: 'https://www.colfuturo.org'
  },
  {
    id: 'opp-6',
    title: 'Convocatoria Endeavor Colombia',
    organization: 'Endeavor',
    description: 'Proceso para emprendimientos de alto impacto con red de dirección y potencial global.',
    type: 'Red experta',
    status: 'Abierta',
    stages: ['Traccion', 'Crecimiento', 'Escalamiento'],
    amount: 'Red + inversión potencial',
    deadline: '20 Abr 2026',
    deadlineDate: '2026-04-20',
    tags: ['Alto Impacto', 'Global', 'Endeavor'],
    link: 'https://www.endeavor.org.co'
  }
];

export const MOCK_COURSES = [
  {
    id: 'course-1',
    title: 'Cómo validar tu idea de negocio',
    description: 'Aprende a validar hipótesis, hacer entrevistas y construir un MVP efectivo.',
    category: 'Validación',
    duration: '2h 30min',
    lessons: 8,
    level: 'Básico',
    instructor: 'Ana Martínez · Dirección de producto',
    tags: ['MVP', 'Investigación', 'Validación'],
    stages: ['Idea', 'Validacion']
  },
  {
    id: 'course-2',
    title: 'Finanzas para emprendedores',
    description: 'Proyecciones, flujo de caja, punto de equilibrio y métricas clave.',
    category: 'Finanzas',
    duration: '3h',
    lessons: 10,
    level: 'Intermedio',
    instructor: 'Carlos Ruiz · CFO SOE',
    tags: ['Finanzas', 'Métricas', 'Proyecciones'],
    stages: ['Validacion', 'Traccion']
  },
  {
    id: 'course-3',
    title: 'Cómo armar un Pitch Deck ganador',
    description: 'Estructura, diseño y presentación de tu deck para inversionistas.',
    category: 'Inversión',
    duration: '1h 45min',
    lessons: 6,
    level: 'Intermedio',
    instructor: 'Laura Gómez · Inversiónista Ángel',
    tags: ['Pitch', 'Inversión', 'Storytelling'],
    stages: ['Validacion', 'Traccion']
  },
  {
    id: 'course-4',
    title: 'Marketing digital con $0 de presupuesto',
    description: 'Estrategias orgánicas para crecer en redes y SEO básico.',
    category: 'Marketing',
    duration: '2h 15min',
    lessons: 9,
    level: 'Básico',
    instructor: 'Daniela Torres · Growth Marketing',
    tags: ['Marketing', 'Redes Sociales', 'Growth'],
    stages: ['Idea', 'Validacion', 'Traccion']
  },
  {
    id: 'course-5',
    title: 'Formalización legal de tu empresa',
    description: 'SAS, persona natural, RUT y cámara de comercio en pasos simples.',
    category: 'Legal',
    duration: '1h 20min',
    lessons: 5,
    level: 'Básico',
    instructor: 'Andrés Mejía · Abogado Corporativo',
    tags: ['Legal', 'Registro', 'Formal'],
    stages: ['Idea', 'Validacion']
  },
  {
    id: 'course-6',
    title: 'Cómo conseguir tus primeros 100 clientes',
    description: 'Estrategias prácticas de ventas y adquisición de clientes para B2B y B2C.',
    category: 'Ventas',
    duration: '2h',
    lessons: 7,
    level: 'Intermedio',
    instructor: 'Sebastián López · Co-fundador SalesHack',
    tags: ['Ventas', 'Clientes', 'B2B', 'B2C'],
    stages: ['Validacion', 'Traccion']
  }
];

export const MOCK_PROVIDERS = [
  {
    id: 'prov-1',
    initials: 'BB',
    name: 'Brandify Studio',
    category: 'Branding',
    description: 'Especialistas en claridad de marca para negocios digitales.',
    city: 'Medellín',
    rating: 4.8,
    email: 'hola@brandify.co',
    services: ['Naming', 'Identidad Visual', 'Branding Estratégico'],
    badgeColor: '#fce7f3',
    badgeText: '#be185d'
  },
  {
    id: 'prov-2',
    initials: 'LA',
    name: 'LegalApp Colombia',
    category: 'Legal',
    description: 'Abogados para emprendedores: constitución, marca y contratos.',
    city: 'Bogotá (Remoto)',
    rating: 4.9,
    email: 'legal@legalapp.co',
    services: ['Constitución de empresa', 'Registro de Marca', 'Contratos'],
    badgeColor: '#dbeafe',
    badgeText: '#1d4ed8'
  },
  {
    id: 'prov-3',
    initials: 'CF',
    name: 'ContaFlow',
    category: 'Contabilidad',
    description: 'Contabilidad y declaraciones para startups en todas las etapas.',
    city: 'Bogotá',
    rating: 4.7,
    email: 'info@contaflow.co',
    services: ['Contabilidad mensual', 'Declaraciones DIAN', 'Nómina'],
    badgeColor: '#d1fae5',
    badgeText: '#065f46'
  },
  {
    id: 'prov-4',
    initials: 'DW',
    name: 'DevWeb Colombia',
    category: 'Tecnología',
    description: 'Desarrollo de apps, MVPs y plataformas web para negocios en crecimiento.',
    city: 'Cali (Remoto)',
    rating: 4.6,
    email: 'dev@devweb.co',
    services: ['Apps Web', 'MVPs', 'E-commerce', 'APIs'],
    badgeColor: '#ede9fe',
    badgeText: '#6d28d9'
  },
  {
    id: 'prov-5',
    initials: 'GH',
    name: 'GrowthHack Studio',
    category: 'Marketing',
    description: 'Growth marketing y performance para negocios que quieren crecer con foco.',
    city: 'Bogotá',
    rating: 4.8,
    email: 'hello@growthhack.co',
    services: ['Paid Media', 'SEO', 'Email Marketing', 'Analytics'],
    badgeColor: '#fef9c3',
    badgeText: '#854d0e'
  },
  {
    id: 'prov-6',
    initials: 'MC',
    name: 'BoardCo Colombia',
    category: 'Dirección',
    description: 'Red de perfiles expertos en dirección, inversión y escalamiento.',
    city: 'Nacional (Remoto)',
    rating: 5.0,
    email: 'direccion@boardco.co',
    services: ['Comité de crecimiento', 'Criterio externo', 'Board Advisor'],
    badgeColor: '#ffedd5',
    badgeText: '#c2410c'
  }
];

export const STAGES = ['Idea', 'Validacion', 'Traccion', 'Crecimiento', 'Escalamiento'];
export const CATEGORIES = ['Todos', 'Branding', 'Legal', 'Contabilidad', 'Tecnología', 'Marketing', 'Dirección'];

export const NOTIFICATION_TYPES = {
  opportunity_match: 'Oportunidades',
  opportunity_deadline: 'Oportunidades',
  blocker_task: 'Tareas',
  missing_document: 'Tareas',
  diagnostic_reminder: 'Importantes',
  general: 'Todas'
};

