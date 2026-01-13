const ALLOWED_EVENTS = new Set(["whatsapp_click", "call_click"]);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;
  if (!measurementId || !apiSecret) {
    return { statusCode: 500, body: "GA4 env vars missing" };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const eventName = payload.event;
  if (!ALLOWED_EVENTS.has(eventName)) {
    return { statusCode: 400, body: "Unsupported event" };
  }

  const pageLocation = payload.page_location || "/";
  const clientId =
    (event.headers["x-nf-client-connection-ip"] || "0.0.0.0") +
    "." +
    Date.now();
  const userAgent = event.headers["user-agent"] || "unknown";

  const params = {
    page_location: pageLocation,
    event_category: payload.event_category || "engagement",
    event_label: payload.event_label || "",
    link_url: payload.link_url,
    tel_number: payload.tel_number,
    user_agent: userAgent,
  };

  const body = {
    client_id: clientId,
    events: [
      {
        name: eventName,
        params,
      },
    ],
  };

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      return { statusCode: 502, body: "GA4 endpoint error" };
    }

    return { statusCode: 204, body: "" };
  } catch (err) {
    console.error("track-event error", err);
    return { statusCode: 500, body: "Server error" };
  }
};
