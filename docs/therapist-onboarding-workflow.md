# BLR Hangout Hub — Bangalore-first Therapist Outreach & Onboarding Automation (Freshers Preferred)

This plan prioritizes Bangalore-based (or relocating) female therapists, optimizes for zone efficiency, and minimizes manual effort. It is plug-and-play using Google Forms/Sheets + Apps Script + WhatsApp (Cloud API or manual via web), with clear SLAs and metrics.

---

## 0) Objectives

- Maximize supply in high-demand BLR zones (Koramangala, Indiranagar, HSR, Jayanagar, Whitefield, Marathahalli, MG Road, Domlur).
- Prefer freshers (0–1 yr) while maintaining basic standards (KYC, consent-first policy).
- Fast, automated triage → screening → onboarding → first-session.
- Keep routing efficient: zone clustering, shift alignment, travel-minimization.

---

## 1) Funnel Overview

Sources → Landing → Capture → Automations → Screening → Onboarding → Live

- Sources
  - FB/IG Reels, WhatsApp groups (women-only), spa academies, salons, yoga instructors, co-living (Stanza/Zolo), local job boards.
- Landing
  - ProviderSignup on website (already added, collects Fresher, Residency, Relocation, Zones, Shifts).
  - Mirror it as a Google Form as well (ensures direct Sheets ingestion even when WhatsApp-based submissions are manual).
- Capture
  - Primary: Google Form → Google Sheet (Therapists DB).
  - Secondary: WhatsApp messages from ProviderSignup (parse manually or via WA Cloud API webhook if enabled).
- Automations (Apps Script)
  - New row triage: reject non-BLR/not-relocating; prioritize freshers; assign recruiter by zone.
  - Send screening form & slot link; update status.
  - Post to Slack channel for daily review.
- Screening
  - 10-min video/voice check: professionalism, consent understanding, availability, zone familiarity.
- Onboarding
  - KYC verification, policy acceptance, kit (FAQs, pricing, safety SOP).
  - Add to internal roster by zone & shift; publish to daily availability only when verified.
- Live
  - First 3 sessions monitored; feedback & coaching. If fresher scores > threshold, graduate to Preferred.

---

## 2) Data Model (Google Sheet: “Therapists”)

Columns (create exactly in this order for the provided Apps Script):

- Timestamp
- Name
- Phone (WhatsApp)
- Residency (Bangalore Resident / Relocating to Bangalore / Outside Bangalore)
- Willing to Relocate (Yes/No)
- Fresher (Yes/No)
- Experience (years)
- Zones (comma-separated)
- Shifts (comma-separated)
- Specialties
- Certifications
- Source (utm/source or “provider-signup-v2”)
- Status (New / Screening / KYC / Onboarded / Rejected)
- Recruiter (auto-assigned by zone)
- Screening Score (0–10)
- KYC Verified (Yes/No)
- Onboarded Date
- Notes

Optional auxiliary sheets:
- “ZoneRecruiters”: Zone | RecruiterName | RecruiterPhone
- “MessageTemplates”: Key | TemplateText

---

## 3) Triage Logic (Apps Script Rules)

1) Reject immediately:
   - Residency = “Outside Bangalore (not relocating)” → Status = Rejected, Notes: “Not BLR/won’t relocate”
2) Priority scoring (freshers first):
   - Fresher Yes → +3
   - Residency “Bangalore Resident” → +2
   - “Relocating to Bangalore” with Willing to Relocate = Yes → +1
   - Zones include tier-1 zones (Koramangala/Indiranagar/HSR/Jayanagar) → +2
   - Shifts include Evening (5–10) → +1
3) Assign Recruiter by zones (first preferred zone match in ZoneRecruiters sheet).
4) Update Status = Screening; send screening link/templates via email/WA; Slack notify recruiter.

---

## 4) Screening & Onboarding SOP

- Screening (10 min)
  - Verify ID match, communication, consent-first understanding, safety SOP comprehension, punctuality, city familiarity.
  - Record Screening Score (0–10). If <7: hold; otherwise proceed.
- Onboarding
  - KYC doc upload (Aadhar/ID), selfie-photo for profile (optional blurred display).
  - Acceptance of Safety & Professional Standards.
  - Add to internal roster (by Zone + Shift).
  - Publish to daily availability when “Onboarded” and KYC Verified = Yes.

---

## 5) WhatsApp & Communication

- If using WhatsApp Cloud API:
  - Create Business App, phone number, templates (screening invite, KYC request, welcome pack).
  - Webhook → Apps Script (via a webhook receiver; or use external service if needed).
- If not using API (MVP):
  - Recruiters copy-paste template from sheet/Slack to WhatsApp Web.
  - Use consistent templates with dynamic fields (Name/Zone/Date).

Templates (examples):
- Screening Invite:
  “Hi {{Name}}, thanks for applying to BLR Hangout Hub. Quick screening call (10 min) today? Choose a slot: {{CalendlyLink}}. — Team BLR”
- KYC Request:
  “Hi {{Name}}, please upload ID here: {{FormLink}}. This is required for safety and verification. — Team BLR”
- Welcome:
  “Welcome aboard, {{Name}}! You’re set for {{Zone}}/{{Shift}}. We’ll route bookings. Safety SOP: {{Link}}”

---

## 6) Location Efficiency & Routing

- Maintain roster by (Zone, Shift).
- Daily availability generator:
  - Pull all Onboarded + KYC Verified with matching day + shift coverage.
  - Apply max travel constraint (neighboring zones only).
  - Write therapist IDs to `src/data/availability.json` for that day.
- Re-balance weekly based on demand: shift therapists to zones with higher bookings.

---

## 7) Metrics (Weekly Dashboard)

- Supply: New signups, Screening pass %, KYC %; Onboarded count by zone.
- Efficiency: Time-to-screen, Time-to-first-session, No-show rate.
- Allocation: Sessions by zone/shift; Travel distance proxy (zone hops).
- Quality: CSAT/NPS, Rebook %, First 3 sessions success for freshers.

---

## 8) Implementation Steps (Today → 7 Days)

- Day 0–1: Create Google Form (mirror ProviderSignup fields), link to Google Sheet. Import ZoneRecruiters sheet.
- Day 2: Add Apps Script (see file in `docs/apps-script/onboarding_automation.gs`); set triggers on form submit; test Slack/Email.
- Day 3–4: Launch freshers-targeted outreach (academies, IG Reels, WhatsApp groups); add UTM in links.
- Day 5: Start daily availability pipeline; publish code to customers.
- Day 6–7: Review metrics and refine triage scoring and zone recruiter mapping.

---

## 9) Website Touchpoints (Already Updated)

- ProviderSignup collects:
  - Residency, Relocation willingness, Fresher flag, Zones, Shifts.
- Customer Area is gated with per-day pass codes.
- Attribution tags on all WhatsApp links.

---

## 10) Optional: Backend Upgrade (Phase 2)

- Firebase Auth for real login to Customer Area, Cloud Functions to serve daily availability securely.
- Firestore for therapists roster, automated daily selections.
- Cron job to rotate pass and WhatsApp broadcast via WA Cloud API.

---

## 11) Google Sheet Schema Example

Create Sheets:
- “Therapists” with the columns above.
- “ZoneRecruiters” with rows such as:
  - Koramangala | Ananya | +9198xxxxxxx
  - Indiranagar | Priya | +9197xxxxxxx
- “MessageTemplates” with keys: SCREEN_INVITE, KYC_REQUEST, WELCOME

---

## 12) Daily Workflow (Operator Checklist)

- Morning:
  - Check new rows; triage auto-assigns.
  - Send screening invites (automation).
- Noon/Evening:
  - Complete screenings; set Status to KYC for passes.
- 8pm:
  - Confirm next-day availability & generate `availability.json` block with pass “BLR<DDMM>”.
  - Share pass with signed-up customers via WhatsApp broadcast list.

---

If you want, we can add the Apps Script (webhook/automation) file and a Google Form export next. Replace placeholders with your IDs/links and set triggers.