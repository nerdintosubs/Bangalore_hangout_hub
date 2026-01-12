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

exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return json(405, { error: "Method not allowed." });
  }

  const url = event.rawUrl ? new URL(event.rawUrl) : null;
  const date =
    (url && url.searchParams.get("date")) ||
    (event.queryStringParameters && event.queryStringParameters.date);
  const pass =
    (url && url.searchParams.get("pass")) ||
    (event.queryStringParameters && event.queryStringParameters.pass);

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return json(400, { error: "Invalid or missing date." });
  }

  if (!pass) {
    return json(400, { error: "Missing access code." });
  }

  try {
    const store = getStore("availability");
    const record = await store.get(date, { type: "json" });

    if (!record) {
      return json(404, { error: "No availability published for this date." });
    }

    if (record.pass !== pass) {
      return json(401, { error: "Invalid access code. Please recheck." });
    }

    return json(200, {
      date,
      therapists: record.therapists || [],
      note: record.note || "",
    });
  } catch (err) {
    return json(500, { error: "Server error. Please try again." });
  }
};
