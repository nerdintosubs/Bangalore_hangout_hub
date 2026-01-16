import crypto from 'node:crypto';
import { getStore } from '@netlify/blobs';

const ALLOWED_TYPES = new Set(['customer', 'therapist']);
const MAX_TEXT = 500;

const trimText = (value, max = MAX_TEXT) => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().slice(0, max);
};

const trimArray = (value, max = 20) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => trimText(item, 120))
    .filter(Boolean)
    .slice(0, max);
};

const buildMetadata = (payload) => ({
  utm_source: trimText(payload.utm_source, 120),
  utm_medium: trimText(payload.utm_medium, 120),
  utm_campaign: trimText(payload.utm_campaign, 120),
  utm_content: trimText(payload.utm_content, 120),
  utm_term: trimText(payload.utm_term, 120),
  gclid: trimText(payload.gclid, 120),
  fbclid: trimText(payload.fbclid, 120),
  msclkid: trimText(payload.msclkid, 120),
  referrer: trimText(payload.referrer, 500),
  landing_path: trimText(payload.landing_path, 200),
  page_location: trimText(payload.page_location, 200),
  page_title: trimText(payload.page_title, 200),
  session_id: trimText(payload.session_id, 120),
});

const buildCustomer = (payload) => ({
  name: trimText(payload.name, 120),
  phone: trimText(payload.phone, 60),
  area: trimText(payload.area, 120),
  date: trimText(payload.date, 40),
});

  const buildTherapist = (payload) => ({
    name: trimText(payload.name, 120),
    phone: trimText(payload.phone, 60),
    residency: trimText(payload.residency, 120),
    relocate: trimText(payload.relocate, 120),
    fresher: Boolean(payload.fresher),
    experience: trimText(payload.experience, 40),
    specialties: trimText(payload.specialties, 200),
    certifications: trimText(payload.certifications, 200),
    language: trimText(payload.language, 120),
    zones: trimArray(payload.zones),
    shifts: trimArray(payload.shifts),
  });

const withCors = (statusCode, body) => ({
  statusCode,
  body: body ? JSON.stringify(body) : '',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Lead-Token',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  },
});

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return withCors(204);
  }

  if (event.httpMethod !== 'POST') {
    return withCors(405, { error: 'Method Not Allowed' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (error) {
    return withCors(400, { error: 'Invalid JSON' });
  }

  const type = trimText(payload.type, 40).toLowerCase();
  if (!ALLOWED_TYPES.has(type)) {
    return withCors(400, { error: 'Unsupported lead type' });
  }

  const now = new Date();
  const id = crypto.randomUUID();
  const source = trimText(payload.source, 120);
  const data =
    type === 'customer' ? buildCustomer(payload) : buildTherapist(payload);
  const metadata = buildMetadata(payload);

  const entry = {
    id,
    type,
    source,
    created_at: now.toISOString(),
    data,
    metadata,
    context: {
      ip: event.headers['x-nf-client-connection-ip'] || '',
      user_agent: event.headers['user-agent'] || '',
    },
  };

  const store = getStore({ name: 'leads' });
  const datePrefix = now.toISOString().slice(0, 10);
  const safeTime = now.toISOString().replace(/[:.]/g, '-');
  const key = `${type}/${datePrefix}/${safeTime}-${id}.json`;

  try {
    await store.setJSON(key, entry, {
      metadata: { type, created_at: entry.created_at },
    });
    return withCors(200, { ok: true, id });
  } catch (error) {
    console.error('lead-capture error', error);
    return withCors(500, { error: 'Server error' });
  }
};
