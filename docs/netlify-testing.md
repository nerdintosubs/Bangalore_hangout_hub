# Netlify Function Testing (track-event)

Use these to verify `/.netlify/functions/track-event` after setting `GA4_MEASUREMENT_ID` and `GA4_API_SECRET` in Netlify.

## Live site check (replace `<your-site>`)
```sh
curl -X POST https://<your-site>.netlify.app/.netlify/functions/track-event \
  -H "Content-Type: application/json" \
  -d "{\"event\":\"whatsapp_click\",\"event_category\":\"engagement\",\"event_label\":\"test\",\"link_url\":\"https://wa.me/9187351205\",\"page_location\":\"/\"}"
```
- Expected: HTTP 204 (no content). Then check GA4 DebugView for `whatsapp_click`.

## Local check (Netlify Dev)
- Run: `npx netlify dev --edge-handlers=false`
- Then call:
```sh
curl -X POST http://localhost:8888/.netlify/functions/track-event \
  -H "Content-Type: application/json" \
  -d "{\"event\":\"whatsapp_click\",\"event_category\":\"engagement\",\"event_label\":\"test\",\"link_url\":\"https://wa.me/9187351205\",\"page_location\":\"/\"}"
```
- Expected: HTTP 204; if GA4 creds are in a local `.env`, also check GA4 DebugView.

## Notes
- Allowed events: `whatsapp_click`, `call_click`.
- If you get 500/502, verify env vars in Netlify (and locally if testing dev).
- Edge/Deno issues on Windows: try `--edge-handlers=false` or clear `%AppData%/netlify/Config/deno-cli`.
