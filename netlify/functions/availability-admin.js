const { getStore } = require("@netlify/blobs");

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

function getAuthToken(event) {
  const header = event.headers && (event.headers.authorization || event.headers.Authorization);
  if (header && header.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }
  const qp = event.queryStringParameters && event.queryStringParameters.token;
  return qp || "";
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  const expected = process.env.AVAILABILITY_ADMIN_TOKEN || "";
  const provided = getAuthToken(event);

  if (!expected || provided !== expected) {
    return json(401, { error: "Unauthorized." });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (err) {
    return json(400, { error: "Invalid JSON body." });
  }

  const { date, pass, therapists, note } = payload;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return json(400, { error: "Invalid or missing date." });
  }
  if (!pass || typeof pass !== "string") {
    return json(400, { error: "Missing access code." });
  }
  if (!Array.isArray(therapists)) {
    return json(400, { error: "Therapists must be an array." });
  }

  try {
    const store = getStore("availability");
    await store.set(date, { pass, therapists, note: note || "" });
    return json(200, { ok: true, date });
  } catch (err) {
    return json(500, { error: "Server error. Please try again." });
  }
};
