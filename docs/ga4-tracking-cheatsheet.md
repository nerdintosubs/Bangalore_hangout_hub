# GA4 Tracking Cheatsheet (WhatsApp-First)

## Key Events to Track
- `whatsapp_click` (label: link text or source; param: `link_url`)
- `call_click` (param: `tel_number`)
- `cta_click` (param: `section`, `context`, e.g., hero/promo/pricing/sticky)
- `form_submit` (if any forms remain; param: `form_id`)
- `view_item` or `select_item` (optional: when a therapist card is opened)

## Suggested Parameters
- `page_location` (auto via GA4)
- `source` / `medium` / `campaign` (auto from UTMs)
- `section` (e.g., hero, pricing, sticky, footer, promo-strip, zone-page)
- `button_text`

## Event Mapping (Site CTAs)
- WA links: fire `whatsapp_click` with `section`, `button_text`, `link_url`
- Tel links: fire `call_click` with `section`, `tel_number`
- Sticky bar buttons: `cta_click` with `section=sticky-cta`, `button_text`

## Audiences (for Retargeting/Reports)
- WA clickers (event = `whatsapp_click`)
- High-intent: `whatsapp_click` + viewed pricing (or scrolled >50%)
- Call clickers (event = `call_click`)
- Zone viewers: page contains `/koramangala` or `/indiranagar`

## UTM Consistency
- `utm_source`: ig, fb, gbp, meta, partner, referral
- `utm_medium`: bio, post, reel, story, c2w, ad, wa, qr
- `utm_campaign`: pricing, safety, testimonial, zone-<area>, retargeting, promo-<mmYYYY>
- `utm_content`: optional creative variant (e.g., reel1, carousel2)
See `docs/utm-schema.md` for examples.

## Reporting (Weekly Snapshot)
- WA clicks by source/medium/campaign
- WA clicks → replies (if using WA CRM tags; otherwise proxy with session quality)
- Call clicks by source/medium/campaign
- GBP actions (from GBP Insights): calls, website visits, direction requests
- Paid: Cost per WA conversation (from Meta ads + GA4 WA clicks)

## Quick Setup Tips
- Enable GA4 debug view locally to verify `whatsapp_click` / `call_click`.
- Verify UTM tags on all outbound WA links (bio, GBP, ads, site CTAs).
- Create GA4 Explorations for: (a) WA clicks by campaign, (b) WA clicks by page/section.
