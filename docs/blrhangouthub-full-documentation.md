# BLR Hangout Hub — Full Documentation (Current State)

This document captures everything implemented to bring the project to its current state, including features, code structure, data flow, automation, SEO, and operational procedures. It is the single reference for blrhangouthub.com’s present implementation.

---------------------------------------------------------------------

## 1) Project Overview

- Purpose: Female-only, KYC-verified doorstep massage service in Bengaluru with fast WhatsApp booking, daily availability (gated), and therapist onboarding (freshers preferred).
- Tech stack: React + Vite, vanilla CSS (no heavy UI libs), JSON data sources.
- Design goals: Trust-focused, mobile-first UX with sticky CTA, pleasing gradients, and subtle animations.

---------------------------------------------------------------------

## 2) Key Features Implemented

1) Female-only therapists
   - File: src/data/therapists.json
   - All male listings removed. Displayed throughout the site via TherapistsGrid and TherapistCard.

2) Aesthetic overhaul
   - Styles: src/styles/main.css and src/styles/availability.css
   - Elements: Gradient branding, hero background, trust badges, wave dividers, refined cards, rounded corners, mobile-responsiveness, subtle animations.
   - Components:
     - Trust badges (Female-only, Consent-first, Fast Booking, Near You): src/components/TrustBadges.jsx
     - Wave dividers for section separation: src/components/WaveDivider.jsx

3) Conversion and navigation UX
   - Sticky bottom CTA (WhatsApp + Call) on all pages: src/components/StickyCTA.jsx (auto-inserted in App.jsx)
   - Header anchors for smooth in-page navigation: Home, Therapists, Services, Get Code, Customer Area, FAQ, For Providers.

4) Therapists listing + filters
   - Grid and filters: src/components/TherapistsGrid.jsx
     - Filter by zone and specialty
     - Deep link support: #zone=Koramangala applies filter on load
   - Card details: src/components/TherapistCard.jsx
     - Photo, bio, specialties, zones, years, certifications, star rating, and WhatsApp CTA

5) Gated Customer Area (daily availability)
   - Availability data: src/data/availability.json
   - Component: src/components/Availability.jsx
     - Per-day access code required (pass)
     - Code can be prefilled via URL hash/query (?pass=CODE or #pass=CODE)
     - Session-based unlock (sessionStorage)
     - Shows only the therapists listed for the selected date
   - CustomerSignup to request daily pass: src/components/CustomerSignup.jsx

6) Provider signup (freshers + BLR preference)
   - Extended fields: Residency, willingness to relocate, fresher flag, preferred zones (Bengaluru), available shifts, specialties/certs.
   - WhatsApp-based submission payload includes these fields.
   - File: src/components/ProviderSignup.jsx

7) WhatsApp attribution
   - All WhatsApp links include a “Source” tag so that the message itself indicates lead origin:
     - Hero: src=hero
     - Header “Book Now”: src=header
     - Sticky CTA: source=sticky-cta
     - TherapistCard: Source: therapist-card
     - ProviderSignup: Source: provider-signup-v2
     - CustomerSignup: Source: customer-signup

8) SEO foundation + Schema
   - Root index.html contains:
     - Canonical pointing to https://blrhangouthub.com
     - Open Graph / Twitter cards
     - JSON-LD: LocalBusiness, Service (with example offer), FAQPage
   - File: index.html

---------------------------------------------------------------------

## 3) Code Structure

- src/App.jsx — Top-level layout and section composition
- src/main.jsx — React entry, imports for main.css and availability.css
- src/components/
  - Header.jsx — Navigation with anchors and a Book Now CTA
  - Hero.jsx — Landing banner with WhatsApp CTA
  - TrustBadges.jsx — Trust signals (icons and copy)
  - WaveDivider.jsx — Decorative waves between sections
  - TherapistsGrid.jsx — Filterable therapists list + deep link (#zone=)
  - TherapistCard.jsx — Therapist detail card with WhatsApp CTA
  - Services.jsx — Service descriptions and sample pricing
  - FAQ.jsx — Frequently asked questions
  - Safety.jsx — Safety & professional standards
  - CustomerSignup.jsx — Collects info to request daily access code
  - Availability.jsx — Password-gated daily availability section
  - ProviderSignup.jsx — Extended form for BLR/freshers/zones/shifts; WhatsApp payload
  - StickyCTA.jsx — Floating WhatsApp/Call bar site-wide
  - Footer.jsx — Footer info
- src/data/
  - therapists.json — Female therapist profiles
  - availability.json — Per-day availability with pass and listed therapist IDs
- src/styles/
  - main.css — Global theming, layout, cards, hero, sticky CTA, etc.
  - availability.css — Availability, trust badges, animations
- docs/
  - therapist-onboarding-workflow.md — Freshers-first BLR onboarding playbook
  - apps-script/onboarding_automation.gs — Google Apps Script automation
  - automation-setup-checklist.md — Setup instructions and CSV templates

---------------------------------------------------------------------

## 4) Data Flow

- Display data
  - TherapistsGrid imports src/data/therapists.json
  - Availability imports src/data/availability.json and resolves therapist IDs for the selected date
- Gating logic (client-side)
  - Users input daily access code (pass) per date
  - Unlock persists for the date via sessionStorage
  - Deep links (?pass=CODE or #pass=CODE) prefill the code if it matches

---------------------------------------------------------------------

## 5) Daily Operations (Runbook)

- Nightly step (publish tomorrow’s availability)
  1. Open src/data/availability.json
  2. Add tomorrow’s block:
     ```
     "YYYY-MM-DD": {
       "pass": "BLR<DDMM>",
       "therapists": ["t1","t3"],
       "note": "Any note for customers (e.g., Limited slots today)."
     }
     ```
  3. Share the pass to signed-up customers via WhatsApp broadcast.
  4. Customers open: https://blrhangouthub.com/#availability?pass=YOURPASS (then pick the date in the selector).

- Zone deep links for ads
  - Use #zone=<Area> to prefilter, e.g., https://blrhangouthub.com/#zone=Koramangala

---------------------------------------------------------------------

## 6) Therapist Onboarding Automation (Freshers-first, BLR)

- Docs: 
  - docs/therapist-onboarding-workflow.md (playbook)
  - docs/automation-setup-checklist.md (how to set it up fast)
  - docs/apps-script/onboarding_automation.gs (triage + Slack/email automation)
- Flow summary:
  1. Google Form mirrors ProviderSignup fields → Google Sheet (“Therapists”)
  2. Apps Script on form submit → triage + recruiter assignment (by zone) + set Status=Screening + priority score + Slack notification (and optional email)
  3. Screening call (10 min) → if pass, collect KYC → onboard → publish to availability when KYC Verified
- Apps Script config-driven
  - Reads a “Config” sheet in the Google Sheet for:
    - SLACK_WEBHOOK_URL
    - SCREENING_LINK (Calendly)
    - KYC_FORM_LINK
    - REPLY_TO_EMAIL (optional for recruiter emails)
  - Avoids hardcoding secrets; no email alias requirement
- Triage defaults (editable in script)
  - Freshers: +3
  - Residency “Bangalore Resident”: +2
  - Relocating & willing to relocate: +1
  - Priority zones (Koramangala, Indiranagar, HSR Layout, Jayanagar): +2
  - Evening shift (5–10): +1

---------------------------------------------------------------------

## 7) SEO & Schema

- index.html
  - Canonical: https://blrhangouthub.com
  - OG/Twitter images and description
  - JSON-LD blocks:
    - LocalBusiness: name, phone, address, areaServed, priceRange
    - Service: “Doorstep Massage”, sample offer for 60-minute session
    - FAQPage: Mirrors the on-page FAQ entries

---------------------------------------------------------------------

## 8) Analytics & Ads (placeholders ready)

- Add GA4/GTM/Meta Pixel
  - Insert script tags or use GTM container in index.html
  - Track conversions on WhatsApp link clicks (selectors by class or href)
- Use attribution already in WhatsApp messages (Source: header/hero/sticky-cta/therapist-card/customer-signup/provider-signup-v2)
- Ads best practice
  - Search (Google Ads) per zone; route to matching deep links (#zone=)
  - Instagram Reels with female-only safety message and a strong WhatsApp CTA

---------------------------------------------------------------------

## 9) Development & Deployment

- Local development
  - npm run dev
  - Vite serves locally (typically http://localhost:5173 or next free port)
- Deployment (recommended)
  - Vercel/Netlify static hosting
  - Set canonical domain to https://blrhangouthub.com
  - Ensure index.html remains the single-page entry point (Vite default)

---------------------------------------------------------------------

## 10) Security Note

- Current Customer Area gating is client-side (suitable as “hidden” content).
- For stronger protection (true auth + server-verified access):
  - Phase 2: Firebase Auth + Firestore + Cloud Functions (serve daily availability securely)
  - Rotate pass automatically and broadcast to verified customers through an API

---------------------------------------------------------------------

## 11) Maintenance Tasks

- Editing therapists
  - src/data/therapists.json → add or remove entries (IDs must be unique)
- Updating availability
  - src/data/availability.json → daily pass + therapist IDs list + note
- Styling
  - src/styles/main.css and src/styles/availability.css → colors, spacing, animations

---------------------------------------------------------------------

## 12) Commit History Summary (Key Changes)

- 8df7f10 — Initial aesthetic upgrades, removal of male therapists, detailed cards, filters, services & FAQ improvements
- 6ad9ed0 — Sticky CTA, anchors, WhatsApp source tags, zone deep-linking, SEO + JSON-LD
- 292fa8e — Password-gated Availability, CustomerSignup, TrustBadges, added availability styles
- dd7ef07 — Wave dividers, extended ProviderSignup for BLR/freshers/zones/shifts, onboarding docs + Apps Script scaffolding
- 68b59f2 — Automation setup checklist; config-driven Apps Script (Config sheet overrides, no email alias dependency)

(See repository for full diff and files.)

---------------------------------------------------------------------

## 13) Roadmap (Recommended Next Steps)

- Add Google Analytics (GA4), GTM, and Meta Pixel IDs; track WhatsApp clicks and section interactions.
- Deploy to Vercel/Netlify; set up domain DNS for https://blrhangouthub.com.
- Implement backend auth for Customer Area (optional Phase 2).
- Replace placeholder photos with brand images; add review widgets and social proof.
- Build zone-specific landing pages (/koramangala, /indiranagar, etc.) for SEO.
- Create UTM governance for ads and WhatsApp broadcast campaigns.
- Automate daily availability generation from the Google Sheet.

---------------------------------------------------------------------

## 14) Quick Links (Files in Repo)

- UX/Features:
  - src/App.jsx
  - src/components/StickyCTA.jsx
  - src/components/TrustBadges.jsx
  - src/components/WaveDivider.jsx
  - src/components/TherapistsGrid.jsx
  - src/components/TherapistCard.jsx
  - src/components/Availability.jsx
  - src/components/CustomerSignup.jsx
  - src/components/ProviderSignup.jsx
  - src/styles/main.css, src/styles/availability.css
  - src/data/therapists.json, src/data/availability.json
- SEO:
  - index.html (meta tags, canonical, JSON-LD)
- Automation:
  - docs/therapist-onboarding-workflow.md
  - docs/automation-setup-checklist.md
  - docs/apps-script/onboarding_automation.gs

This documentation reflects the current, deployed-ready state of blrhangouthub.com, the implemented features, and how to operate and grow it.