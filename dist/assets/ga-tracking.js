(() => {
  const endpoint = "/.netlify/functions/track-event";

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

  document.addEventListener("click", handleClick, true);
})();
