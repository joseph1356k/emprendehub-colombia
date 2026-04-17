import OpenAI from 'openai';

let cachedClient = null;

function getClient() {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!cachedClient) cachedClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return cachedClient;
}

export async function generateStructuredResponse({ model, instructions, input, schema, name }) {
  const client = getClient();
  if (!client) throw new Error('OPENAI_API_KEY is not configured');

  const response = await client.responses.create({
    model,
    instructions,
    input,
    max_output_tokens: 2400,
    text: {
      format: {
        type: 'json_schema',
        name,
        strict: true,
        schema,
      },
    },
  });

  const text = response.output_text;
  if (!text) throw new Error('OpenAI response did not include output_text');
  return JSON.parse(text);
}
