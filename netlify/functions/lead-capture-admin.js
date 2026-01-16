import { getStore } from '@netlify/blobs';

const withCors = (statusCode, body) => ({
  statusCode,
  body: body ? JSON.stringify(body) : '',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  },
});

const normalizeLimit = (value) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return 50;
  }
  return Math.min(Math.max(parsed, 1), 200);
};

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return withCors(204);
  }

  if (event.httpMethod !== 'GET') {
    return withCors(405, { error: 'Method Not Allowed' });
  }

  const expectedToken = process.env.LEAD_ADMIN_TOKEN;
  const providedToken =
    event.headers['x-admin-token'] || event.headers['X-Admin-Token'];

  if (!expectedToken || providedToken !== expectedToken) {
    return withCors(401, { error: 'Unauthorized' });
  }

  const params = event.queryStringParameters || {};
  const type = params.type ? params.type.toLowerCase() : null;
  const include = params.include === '1';
  const limit = normalizeLimit(params.limit);

  const store = getStore({ name: 'leads' });
  const listOptions = type ? { prefix: `${type}/` } : undefined;

  try {
    const result = await store.list(listOptions);
    const keys = result.blobs.map((blob) => blob.key).sort().reverse();
    const selected = keys.slice(0, limit);

    if (!include) {
      return withCors(200, { items: selected, count: selected.length });
    }

    const items = [];
    for (const key of selected) {
      const data = await store.get(key, { type: 'json' });
      items.push({ key, data });
    }

    return withCors(200, { items, count: items.length });
  } catch (error) {
    console.error('lead-capture-admin error', error);
    return withCors(500, { error: 'Server error' });
  }
};
