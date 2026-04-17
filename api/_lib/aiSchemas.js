export const diagnosticPlanSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['scores', 'snapshot', 'recommendedTasks'],
  properties: {
    scores: {
      type: 'object',
      additionalProperties: false,
      required: ['Claridad', 'Ventas', 'Finanzas', 'Operaciones', 'Formalización', 'Foco'],
      properties: {
        Claridad: { type: 'integer', minimum: 1, maximum: 10 },
        Ventas: { type: 'integer', minimum: 1, maximum: 10 },
        Finanzas: { type: 'integer', minimum: 1, maximum: 10 },
        Operaciones: { type: 'integer', minimum: 1, maximum: 10 },
        Formalización: { type: 'integer', minimum: 1, maximum: 10 },
        Foco: { type: 'integer', minimum: 1, maximum: 10 },
      },
    },
    snapshot: {
      type: 'object',
      additionalProperties: false,
      required: ['stage', 'weakestArea', 'mainBlocker', 'currentRisk', 'monthlyPriority', 'agentRecommendation'],
      properties: {
        stage: { type: 'string' },
        weakestArea: { type: 'string' },
        mainBlocker: { type: 'string' },
        currentRisk: { type: 'string' },
        monthlyPriority: { type: 'string' },
        agentRecommendation: { type: 'string' },
      },
    },
    recommendedTasks: {
      type: 'array',
      minItems: 8,
      maxItems: 12,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['section', 'title', 'priority', 'dueDate', 'rationale', 'expectedOutcome', 'acceptanceCriteria'],
        properties: {
          section: { type: 'string' },
          title: { type: 'string' },
          priority: { type: 'string', enum: ['Alta', 'Media', 'Baja'] },
          dueDate: { type: 'string' },
          rationale: { type: 'string' },
          expectedOutcome: { type: 'string' },
          acceptanceCriteria: { type: 'string' },
        },
      },
    },
  },
};

export const agentResponseSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['assistantMessage', 'actions'],
  properties: {
    assistantMessage: { type: 'string' },
    actions: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'type', 'label', 'description', 'payload'],
        properties: {
          id: { type: 'string' },
          type: {
            type: 'string',
            enum: ['create_task', 'update_task_status', 'request_document', 'open_route', 'open_opportunity'],
          },
          label: { type: 'string' },
          description: { type: 'string' },
          payload: {
            type: 'object',
            additionalProperties: false,
            required: ['route', 'taskId', 'opportunityId', 'status', 'docType', 'task'],
            properties: {
              route: { type: ['string', 'null'] },
              taskId: { type: ['string', 'null'] },
              opportunityId: { type: ['string', 'null'] },
              status: { type: ['string', 'null'], enum: ['pendiente', 'en progreso', 'completado', 'bloqueado', null] },
              docType: { type: ['string', 'null'] },
              task: {
                type: ['object', 'null'],
                additionalProperties: false,
                required: ['section', 'title', 'priority', 'dueDate', 'rationale', 'expectedOutcome', 'acceptanceCriteria'],
                properties: {
                  section: { type: 'string' },
                  title: { type: 'string' },
                  priority: { type: 'string', enum: ['Alta', 'Media', 'Baja'] },
                  dueDate: { type: 'string' },
                  rationale: { type: 'string' },
                  expectedOutcome: { type: 'string' },
                  acceptanceCriteria: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },
};
