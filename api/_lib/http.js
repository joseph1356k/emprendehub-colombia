export function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function sendJson(res, status, payload) {
  setCors(res);
  res.status(status).json(payload);
}

export function methodGuard(req, res, method = 'POST') {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return false;
  }
  if (req.method !== method) {
    sendJson(res, 405, { error: `Método no permitido. Usa ${method}.` });
    return false;
  }
  return true;
}

export function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

export function publicError(error, fallback = 'No se pudo completar la solicitud.') {
  console.error(error);
  return { error: fallback };
}
