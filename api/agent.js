import { agentResponseSchema } from './_lib/aiSchemas.js';
import { methodGuard, publicError, readBody, sendJson } from './_lib/http.js';
import { generateStructuredResponse } from './_lib/openai.js';
import { canUseTable, getAuthenticatedClient, safeInsert } from './_lib/supabase.js';
import { MOCK_OPPORTUNITIES } from '../src/data/mockData.js';

const MODEL = process.env.OPENAI_MODEL_DAILY || 'gpt-5.4-mini';

async function loadUserContext(supabase, userId) {
  const [profileResult, diagnosticResult, runResult, taskResult, documentResult, eventResult, savedOppResult] =
    await Promise.all([
      supabase.from('entrepreneur_profiles').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('diagnostic_answers').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('diagnostic_runs').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('route_tasks').select('*').eq('user_id', userId).order('created_at', { ascending: true }),
      supabase.from('documents').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
      supabase.from('activity_events').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
      supabase.from('saved_opportunities').select('opportunity_id').eq('user_id', userId),
    ]);

  const savedIds = (savedOppResult.data || []).map((item) => item.opportunity_id);
  const opportunities = MOCK_OPPORTUNITIES.filter((item) => savedIds.includes(item.id) || item.stages?.includes(profileResult.data?.stage || 'Idea')).slice(0, 8);

  return {
    profile: profileResult.data || null,
    diagnostic: diagnosticResult.data?.answers || null,
    latestDiagnosticRun: canUseTable(runResult.error) ? runResult.data : null,
    tasks: (taskResult.data || []).filter((task) => !task.archived).slice(0, 30),
    documents: canUseTable(documentResult.error) ? documentResult.data || [] : [],
    activityEvents: canUseTable(eventResult.error) ? eventResult.data || [] : [],
    opportunities,
  };
}

function fallbackAgent(message, context) {
  const pending = (context.tasks || []).filter((task) => task.status !== 'completado');
  const firstTask = pending[0];
  const text = firstTask
    ? `La siguiente prioridad no debería ser abrir más frentes: empieza por "${firstTask.title}". La razón es simple: ya está dentro de tu plan y moverla reduce ruido operativo. Si hoy solo tienes una hora, define el resultado esperado y cierra un avance verificable.`
    : 'No veo tareas pendientes activas. El mejor siguiente paso es actualizar el diagnóstico para que SOE reconstruya tu plan con prioridades reales.';

  const actions = firstTask
    ? [
        {
          id: `open-${firstTask.id}`,
          type: 'open_route',
          label: 'Abrir esta tarea',
          description: `Ir al plan de acción y trabajar en "${firstTask.title}".`,
          payload: { route: '/ruta', taskId: firstTask.id, opportunityId: null, status: null, docType: null, task: null },
        },
      ]
    : [
        {
          id: 'open-diagnostic',
          type: 'open_route',
          label: 'Actualizar diagnóstico',
          description: 'Reconstruir el plan de acción con contexto actualizado.',
          payload: { route: '/diagnostico', taskId: null, opportunityId: null, status: null, docType: null, task: null },
        },
      ];

  return { assistantMessage: text, actions, model: 'deterministic-fallback', userMessage: message };
}

async function persistMessages(supabase, userId, message, response) {
  const rows = [
    { user_id: userId, role: 'user', content: message, actions: [] },
    { user_id: userId, role: 'assistant', content: response.assistantMessage, actions: response.actions || [] },
  ];

  const { error, unsupported } = await safeInsert(supabase, 'agent_messages', rows[0]);
  if (!unsupported && !error) {
    await supabase.from('agent_messages').insert(rows[1]);
  } else if (error && canUseTable(error)) {
    console.error('agent_messages insert error:', error);
  }
}

export default async function handler(req, res) {
  if (!methodGuard(req, res)) return;

  try {
    const auth = await getAuthenticatedClient(req);
    if (auth.error) return sendJson(res, auth.status, { error: auth.error });

    const { message } = readBody(req);
    if (!message || typeof message !== 'string') {
      return sendJson(res, 400, { error: 'Falta el mensaje para SOE.' });
    }

    const context = await loadUserContext(auth.supabase, auth.user.id);
    let response = fallbackAgent(message, context);
    let model = response.model;

    if (process.env.OPENAI_API_KEY) {
      try {
        response = await generateStructuredResponse({
          model: MODEL,
          name: 'soe_agent_response',
          schema: agentResponseSchema,
          instructions: [
            'Eres SOE, un agente de dirección estratégica para emprendedores y pequeños negocios.',
            'No eres coach, mentor, agencia ni curso. Eres una junta directiva cercana: claro, útil y accionable.',
            'Usa el contexto real del usuario. Recomienda máximo tres acciones y pide aprobación antes de cambiar datos.',
            'Si falta información, haz una pregunta concreta y sugiere el siguiente paso más útil.',
            'Las acciones permitidas son create_task, update_task_status, request_document, open_route y open_opportunity.',
          ].join('\n'),
          input: JSON.stringify({
            message,
            context,
            today: new Date().toISOString().slice(0, 10),
          }),
        });
        model = MODEL;
      } catch (error) {
        console.error('OpenAI agent fallback:', error);
      }
    }

    await persistMessages(auth.supabase, auth.user.id, message, response);
    return sendJson(res, 200, { ...response, model });
  } catch (error) {
    return sendJson(res, 500, publicError(error, 'No se pudo responder desde SOE.'));
  }
}
