import { diagnosticPlanSchema } from './_lib/aiSchemas.js';
import { methodGuard, publicError, readBody, sendJson } from './_lib/http.js';
import { generateStructuredResponse } from './_lib/openai.js';
import { canUseTable, getAuthenticatedClient, safeInsert } from './_lib/supabase.js';
import { buildDeterministicPlan, normalizeRecommendedTask } from '../src/data/diagnostic.js';

const MODEL = process.env.OPENAI_MODEL_DIAGNOSTIC || 'gpt-5.4';

function normalizePlan(plan, fallback) {
  const source = plan || fallback;
  return {
    ...fallback,
    ...source,
    scores: source.scores || fallback.scores,
    snapshot: source.snapshot || fallback.snapshot,
    recommendedTasks: (source.recommendedTasks || fallback.recommendedTasks)
      .slice(0, 12)
      .map((item, index) => normalizeRecommendedTask(item, index)),
  };
}

async function persistRun(supabase, userId, answers, plan, model) {
  const { data, error, unsupported } = await safeInsert(supabase, 'diagnostic_runs', {
    user_id: userId,
    answers,
    scores: plan.scores,
    snapshot: plan.snapshot,
    recommended_tasks: plan.recommendedTasks,
    model,
  });

  if (error && canUseTable(error)) console.error('diagnostic_runs insert error:', error);
  return unsupported || error ? plan.runId : data?.id || plan.runId;
}

export default async function handler(req, res) {
  if (!methodGuard(req, res)) return;

  try {
    const auth = await getAuthenticatedClient(req);
    if (auth.error) return sendJson(res, auth.status, { error: auth.error });

    const { answers } = readBody(req);
    if (!answers || typeof answers !== 'object') {
      return sendJson(res, 400, { error: 'Faltan respuestas del diagnóstico.' });
    }

    const fallback = buildDeterministicPlan(answers);
    let plan = fallback;
    let model = fallback.model;

    if (process.env.OPENAI_API_KEY) {
      try {
        const generated = await generateStructuredResponse({
          model: MODEL,
          name: 'soe_diagnostic_plan',
          schema: diagnosticPlanSchema,
          instructions: [
            'Eres SOE, una junta directiva cercana para emprendedores y pequeños negocios.',
            'Tu tarea es convertir un diagnóstico en una radiografía práctica y un plan de acción de 30 días.',
            'No uses tono de coaching, agencia ni curso. Usa dirección estratégica, criterio externo y ejecución.',
            'Las tareas deben ser concretas, medibles, útiles esta semana y escritas en español colombiano neutro.',
            'No inventes métricas financieras exactas si el usuario no las dio; pide tareas para conseguirlas.',
          ].join('\n'),
          input: JSON.stringify({
            answers,
            deterministicBaseline: fallback,
            today: new Date().toISOString().slice(0, 10),
          }),
        });
        plan = normalizePlan(generated, fallback);
        model = MODEL;
      } catch (error) {
        console.error('OpenAI diagnostic fallback:', error);
      }
    }

    const runId = await persistRun(auth.supabase, auth.user.id, answers, plan, model);
    return sendJson(res, 200, { ...plan, runId, model });
  } catch (error) {
    return sendJson(res, 500, publicError(error, 'No se pudo generar el plan diagnóstico.'));
  }
}
