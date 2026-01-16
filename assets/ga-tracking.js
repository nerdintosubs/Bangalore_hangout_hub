(() => {
  const endpoint = "/.netlify/functions/track-event";
  const leadEndpoint = "/.netlify/functions/lead-capture";
  const metaStorageKey = "blr_lead_meta";
  const sessionStorageKey = "blr_lead_session";
  const metaTtlMs = 1000 * 60 * 60 * 24 * 30;

  function sendToGA4(name, params) {
    if (typeof gtag === "function") {
      gtag("event", name, params);
    }
  }

  function sendToFunction(name, params) {
    try {
      const payload = {
        event: name,
        ...params,
      };
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      navigator.sendBeacon?.(endpoint, blob);
    } catch (_) {}
  }

  function readStorage(key, fallback) {
    try {
      const raw = window.localStorage?.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      window.localStorage?.setItem(key, JSON.stringify(value));
    } catch (_) {}
  }

  function readSession(key, fallback) {
    try {
      const raw = window.sessionStorage?.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (_) {
      return fallback;
    }
  }

  function writeSession(key, value) {
    try {
      window.sessionStorage?.setItem(key, JSON.stringify(value));
    } catch (_) {}
  }

  function getSessionId() {
    const cached = readSession(sessionStorageKey, null);
    if (cached && cached.id) return cached.id;
    const id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    writeSession(sessionStorageKey, { id });
    return id;
  }

  function captureAttribution() {
    try {
      const params = new URLSearchParams(window.location.search);
      const updates = {};
      const keys = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
        "gclid",
        "fbclid",
        "msclkid",
      ];

      keys.forEach((key) => {
        const value = params.get(key);
        if (value) {
          updates[key] = value.slice(0, 200);
        }
      });

      if (document.referrer && !document.referrer.includes(location.hostname)) {
        updates.referrer = document.referrer.slice(0, 500);
      }

      if (Object.keys(updates).length === 0) return;

      const now = Date.now();
      const existing = readStorage(metaStorageKey, {});
      const merged = {
        ...existing,
        ...updates,
        landing_path:
          existing.landing_path || `${location.pathname}${location.search}`,
        first_seen: existing.first_seen || now,
        last_seen: now,
      };

      writeStorage(metaStorageKey, merged);
    } catch (_) {}
  }

  function getAttribution() {
    const data = readStorage(metaStorageKey, {});
    if (!data || !data.last_seen) return {};
    if (Date.now() - data.last_seen > metaTtlMs) {
      writeStorage(metaStorageKey, {});
      return {};
    }
    return data;
  }

  function sendLead(payload) {
    try {
      const body = JSON.stringify(payload);
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(leadEndpoint, blob);
      } else {
        fetch(leadEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        });
      }
    } catch (_) {}
  }

  function buildLeadPayload(type, data, source) {
    const attribution = getAttribution();
    return {
      type,
      source,
      session_id: getSessionId(),
      page_location: `${location.pathname}${location.search}`,
      page_title: document.title,
      landing_path: attribution.landing_path,
      referrer: attribution.referrer,
      utm_source: attribution.utm_source,
      utm_medium: attribution.utm_medium,
      utm_campaign: attribution.utm_campaign,
      utm_content: attribution.utm_content,
      utm_term: attribution.utm_term,
      gclid: attribution.gclid,
      fbclid: attribution.fbclid,
      msclkid: attribution.msclkid,
      ...data,
    };
  }

  function handleLeadSubmit(e) {
    try {
      const form = e.target;
      if (!form || form.nodeName !== "FORM") return;

      const formData = new FormData(form);
      const isTherapistForm = form.id === "signup-form";
      const isCustomerForm = Boolean(form.closest("#customer-signup"));

      if (!isTherapistForm && !isCustomerForm) return;

      if (isTherapistForm) {
        const payload = buildLeadPayload(
          "therapist",
          {
            name: String(formData.get("name") || ""),
            phone: String(formData.get("phone") || ""),
            residency: String(formData.get("residency") || ""),
            relocate: String(formData.get("relocate") || ""),
            fresher: Boolean(form.querySelector('input[name="fresher"]')?.checked),
            experience: String(formData.get("experience") || ""),
            specialties: String(formData.get("specialties") || ""),
            certifications: String(formData.get("certifications") || ""),
            zones: formData.getAll("zones").map(String),
            shifts: formData.getAll("shifts").map(String),
          },
          "provider-signup"
        );
        sendLead(payload);
        return;
      }

      if (isCustomerForm) {
        const payload = buildLeadPayload(
          "customer",
          {
            name: String(formData.get("name") || ""),
            phone: String(formData.get("phone") || ""),
            area: String(formData.get("area") || ""),
            date: String(formData.get("date") || ""),
          },
          "customer-signup"
        );
        sendLead(payload);
      }
    } catch (_) {}
  }

  function handleClick(e) {
    try {
      const a = e.target.closest("a");
      if (!a || !a.href) return;
      const href = a.href;
      const text = (a.textContent || "").trim();
      const page_location = window.location.pathname;

      if (href.indexOf("wa.me") !== -1) {
        const params = {
          event_category: "engagement",
          event_label: text || href,
          link_url: href,
          page_location,
        };
        sendToGA4("whatsapp_click", params);
        sendToFunction("whatsapp_click", params);
      }

      if (href.indexOf("tel:+") !== -1) {
        const tel_number = href.replace("tel:+", "+");
        const params = {
          event_category: "engagement",
          event_label: text || href,
          tel_number,
          page_location,
        };
        sendToGA4("call_click", params);
        sendToFunction("call_click", params);
      }
    } catch (_) {}
  }

  captureAttribution();
  document.addEventListener("click", handleClick, true);
  document.addEventListener("submit", handleLeadSubmit, true);
})();
