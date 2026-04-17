export const DEFAULT_TASKS = [
  { section: 'Formalizacion', title: 'Registrar RUT en DIAN', priority: 'Alta', due_in_days: 4 },
  { section: 'Formalizacion', title: 'Crear empresa (SAS o Persona Natural)', priority: 'Alta', due_in_days: 6 },
  { section: 'Formalizacion', title: 'Registro en Camara de Comercio', priority: 'Alta', due_in_days: 8 },
  { section: 'Formalizacion', title: 'Abrir cuenta bancaria empresarial', priority: 'Media', due_in_days: 12 },
  { section: 'Producto / Servicio', title: 'Definir propuesta de valor', priority: 'Alta', due_in_days: 5 },
  { section: 'Producto / Servicio', title: 'Construir o definir MVP', priority: 'Alta', due_in_days: 10 },
  { section: 'Producto / Servicio', title: 'Realizar 10 entrevistas de usuario', priority: 'Alta', due_in_days: 14 },
  { section: 'Producto / Servicio', title: 'Iterar producto con feedback recibido', priority: 'Media', due_in_days: 17 },
  { section: 'Mercadeo', title: 'Definir buyer persona', priority: 'Alta', due_in_days: 9 },
  { section: 'Mercadeo', title: 'Crear perfiles en redes sociales', priority: 'Media', due_in_days: 11 },
  { section: 'Mercadeo', title: 'Definir canales de adquisicion', priority: 'Media', due_in_days: 13 },
  { section: 'Mercadeo', title: 'Disenar identidad de marca basica', priority: 'Baja', due_in_days: 18 },
  { section: 'Financiero', title: 'Definir modelo de ingresos', priority: 'Alta', due_in_days: 7 },
  { section: 'Financiero', title: 'Armar proyecciones financieras basicas', priority: 'Alta', due_in_days: 9 },
  { section: 'Financiero', title: 'Calcular punto de equilibrio', priority: 'Media', due_in_days: 15 },
  { section: 'Inversion', title: 'Elaborar pitch deck', priority: 'Media', due_in_days: 10 },
  { section: 'Inversion', title: 'Identificar fuentes de financiacion', priority: 'Media', due_in_days: 16 },
  { section: 'Inversion', title: 'Aplicar a una convocatoria publica', priority: 'Baja', due_in_days: 20 }
];

export const TASK_DOCUMENT_RULES = {
  'Elaborar pitch deck': { docType: 'Pitch deck', category: 'Comercial' },
  'Armar proyecciones financieras basicas': { docType: 'Modelo financiero', category: 'Financiero' },
  'Definir propuesta de valor': { docType: 'Business Model Canvas', category: 'Comercial' },
  'Disenar identidad de marca basica': { docType: 'Registro de marca', category: 'Legal' }
};

export const MOCK_OPPORTUNITIES = [
  {
    id: 'opp-1',
    title: 'Fondo Emprender SENA',
    organization: 'SENA',
    description: 'Capital semilla no reembolsable para equipos en etapa temprana con validacion inicial.',
    type: 'Financiacion',
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
    type: 'Aceleracion',
    status: 'Abierta',
    stages: ['Traccion', 'Crecimiento'],
    amount: 'Hasta $400M COP + direccion',
    deadline: '28 Mar 2026',
    deadlineDate: '2026-03-28',
    tags: ['Escalamiento', 'Nacional', 'iNNpulsa'],
    link: 'https://www.innpulsacolombia.com'
  },
  {
    id: 'opp-3',
    title: 'Apps.co Cohorte 2026',
    organization: 'MinTIC',
    description: 'Acompanamiento para negocios digitales en etapa de producto temprano.',
    type: 'Aceleracion',
    status: 'Abierta',
    stages: ['Idea', 'Validacion'],
    amount: 'Servicios y acompanamiento',
    deadline: '10 May 2026',
    deadlineDate: '2026-05-10',
    tags: ['Tecnologia', 'Digital', 'MinTIC'],
    link: 'https://apps.co'
  },
  {
    id: 'opp-4',
    title: 'Bancoldex Capital Productivo',
    organization: 'Bancoldex',
    description: 'Credito para empresas en crecimiento con necesidad de capital productivo.',
    type: 'Credito',
    status: 'Abierta',
    stages: ['Traccion', 'Crecimiento', 'Escalamiento'],
    amount: 'Desde $50M hasta $2.000M COP',
    deadline: 'Permanente',
    deadlineDate: null,
    tags: ['Credito', 'Nacional', 'Bancoldex'],
    link: 'https://www.bancoldex.com'
  },
  {
    id: 'opp-5',
    title: 'Colfuturo Becas Empresariales',
    organization: 'Colfuturo',
    description: 'Becas para fundadores que buscan formacion de alto impacto en negocios.',
    type: 'Beca',
    status: 'Proximamente',
    stages: ['Crecimiento', 'Escalamiento'],
    amount: 'Hasta USD 40.000',
    deadline: '1 Jun 2026',
    deadlineDate: '2026-06-01',
    tags: ['Formacion', 'Internacional'],
    link: 'https://www.colfuturo.org'
  },
  {
    id: 'opp-6',
    title: 'Convocatoria Endeavor Colombia',
    organization: 'Endeavor',
    description: 'Proceso para emprendimientos de alto impacto con red de direccion y potencial global.',
    type: 'Red experta',
    status: 'Abierta',
    stages: ['Traccion', 'Crecimiento', 'Escalamiento'],
    amount: 'Red + inversion potencial',
    deadline: '20 Abr 2026',
    deadlineDate: '2026-04-20',
    tags: ['Alto Impacto', 'Global', 'Endeavor'],
    link: 'https://www.endeavor.org.co'
  }
];

export const MOCK_COURSES = [
  {
    id: 'course-1',
    title: 'Como validar tu idea de negocio',
    description: 'Aprende a validar hipotesis, hacer entrevistas y construir un MVP efectivo.',
    category: 'Validacion',
    duration: '2h 30min',
    lessons: 8,
    level: 'Basico',
    instructor: 'Ana Martinez · Direccion de producto',
    tags: ['MVP', 'Investigacion', 'Validacion'],
    stages: ['Idea', 'Validacion']
  },
  {
    id: 'course-2',
    title: 'Finanzas para emprendedores',
    description: 'Proyecciones, flujo de caja, punto de equilibrio y metricas clave.',
    category: 'Finanzas',
    duration: '3h',
    lessons: 10,
    level: 'Intermedio',
    instructor: 'Carlos Ruiz · CFO Soe',
    tags: ['Finanzas', 'Metricas', 'Proyecciones'],
    stages: ['Validacion', 'Traccion']
  },
  {
    id: 'course-3',
    title: 'Como armar un Pitch Deck ganador',
    description: 'Estructura, diseno y presentacion de tu deck para inversionistas.',
    category: 'Inversion',
    duration: '1h 45min',
    lessons: 6,
    level: 'Intermedio',
    instructor: 'Laura Gomez · Inversionista Angel',
    tags: ['Pitch', 'Inversion', 'Storytelling'],
    stages: ['Validacion', 'Traccion']
  },
  {
    id: 'course-4',
    title: 'Marketing digital con $0 de presupuesto',
    description: 'Estrategias organicas para crecer en redes y SEO basico.',
    category: 'Marketing',
    duration: '2h 15min',
    lessons: 9,
    level: 'Basico',
    instructor: 'Daniela Torres · Growth Marketing',
    tags: ['Marketing', 'Redes Sociales', 'Growth'],
    stages: ['Idea', 'Validacion', 'Traccion']
  },
  {
    id: 'course-5',
    title: 'Formalizacion legal de tu empresa',
    description: 'SAS, persona natural, RUT y camara de comercio en pasos simples.',
    category: 'Legal',
    duration: '1h 20min',
    lessons: 5,
    level: 'Basico',
    instructor: 'Andres Mejia · Abogado Corporativo',
    tags: ['Legal', 'Registro', 'Formal'],
    stages: ['Idea', 'Validacion']
  },
  {
    id: 'course-6',
    title: 'Como conseguir tus primeros 100 clientes',
    description: 'Estrategias practicas de ventas y adquisicion de clientes para B2B y B2C.',
    category: 'Ventas',
    duration: '2h',
    lessons: 7,
    level: 'Intermedio',
    instructor: 'Sebastian Lopez · Co-fundador SalesHack',
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
    city: 'Medellin',
    rating: 4.8,
    email: 'hola@brandify.co',
    services: ['Naming', 'Identidad Visual', 'Branding Estrategico'],
    badgeColor: '#fce7f3',
    badgeText: '#be185d'
  },
  {
    id: 'prov-2',
    initials: 'LA',
    name: 'LegalApp Colombia',
    category: 'Legal',
    description: 'Abogados para emprendedores: constitucion, marca y contratos.',
    city: 'Bogota (Remoto)',
    rating: 4.9,
    email: 'legal@legalapp.co',
    services: ['Constitucion de empresa', 'Registro de Marca', 'Contratos'],
    badgeColor: '#dbeafe',
    badgeText: '#1d4ed8'
  },
  {
    id: 'prov-3',
    initials: 'CF',
    name: 'ContaFlow',
    category: 'Contabilidad',
    description: 'Contabilidad y declaraciones para startups en todas las etapas.',
    city: 'Bogota',
    rating: 4.7,
    email: 'info@contaflow.co',
    services: ['Contabilidad mensual', 'Declaraciones DIAN', 'Nomina'],
    badgeColor: '#d1fae5',
    badgeText: '#065f46'
  },
  {
    id: 'prov-4',
    initials: 'DW',
    name: 'DevWeb Colombia',
    category: 'Tecnologia',
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
    city: 'Bogota',
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
    category: 'Direccion',
    description: 'Red de perfiles expertos en direccion, inversion y escalamiento.',
    city: 'Nacional (Remoto)',
    rating: 5.0,
    email: 'direccion@boardco.co',
    services: ['Comite de crecimiento', 'Criterio externo', 'Board Advisor'],
    badgeColor: '#ffedd5',
    badgeText: '#c2410c'
  }
];

export const STAGES = ['Idea', 'Validacion', 'Traccion', 'Crecimiento', 'Escalamiento'];
export const CATEGORIES = ['Todos', 'Branding', 'Legal', 'Contabilidad', 'Tecnologia', 'Marketing', 'Direccion'];

export const NOTIFICATION_TYPES = {
  opportunity_match: 'Oportunidades',
  opportunity_deadline: 'Oportunidades',
  blocker_task: 'Tareas',
  missing_document: 'Tareas',
  diagnostic_reminder: 'Importantes',
  general: 'Todas'
};

