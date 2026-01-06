# BLR Hangout Hub — Premium Doorstep Massage Service

Professional, certified therapists delivering home massage services in Bengaluru.

## Quick Start

```bash
npm ci
npm run dev
npm run build
```

## Features

- Premium, mobile-first React frontend (Vite) with dark theme
- 10+ certified female therapists with detailed profiles and modals
- Geo-specific landing pages (Koramangala, Indiranagar, HSR Layout)
- Automated availability updates from Google Sheets integration
- Loyalty program with tiered perks and referral system
- Customer reviews and testimonials section
- WhatsApp-first booking with UTM tracking and source attribution
- Provider signup form with BLR-specific fields
- Gated customer area with daily access codes
- Trust signals: Female-only, KYC-verified, Consent-first, On-time guarantee
- Accessibility-first design (WCAG 2.1 AA) with ARIA labels and alt text
- SEO-optimized with JSON-LD structured data and Meta Pixel tracking
- Analytics: GA4 + GTM + Meta Pixel for conversion tracking
- Docker & CI/CD ready (GitHub Actions)
- Static site (fast, secure, cheap to host)

## Architecture

```
blrhangouthub/
├─ public/
├─ src/
│  ├─ assets/
│  ├─ components/
│  ├─ data/
│  ├─ pages/
│  ├─ styles/
│  ├─ App.jsx
│  └─ main.jsx
├─ tests/
├─ Dockerfile
├─ docker-compose.yml
└─ package.json
```

## Contact & WhatsApp

All bookings and provider inquiries route to WhatsApp: **+91 70683 44125**

## Deployment

- **Hosting**: Netlify, Vercel, or S3+CloudFront
- **DNS**: Point domain to host provider
- **TLS**: Auto-provisioned by host

## Growth & Marketing

- See [Growth Playbook](docs/marketing-playbook.md) for a safety-first plan covering SEO, social/content, CRM, partnerships, loyalty/referrals, paid media, and measurement tailored to BLR Hangout Hub.

## Legal

See Terms of Service, Privacy Policy, and Safety guidelines in the site footer.

---

Built with React 18 + Vite. MIT License.