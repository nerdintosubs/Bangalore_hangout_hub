# Automation Setup Checklist (Google Sheets + Apps Script)

This guide prepares everything needed to initialize the onboarding automation and replace placeholders without editing code. Use the Config sheet to inject your secrets/links.

CONTENTS
- What you will provide
- Google Sheet structure (tabs + headers)
- Copy-paste CSV templates
- Apps Script deployment
- Sanity test and daily ops

WHAT YOU WILL PROVIDE
1) Google Sheet (editor access) for therapist responses and automations
   - Tabs needed: Therapists, ZoneRecruiters, Config (optional: MessageTemplates)
2) Google Form (editor access) linked to the Therapists tab
   - Mirrors ProviderSignup fields on site (Name, Phone, Residency, Relocate, Fresher, Zones, Shifts, Experience, Specialties, Certifications)
3) Slack Incoming Webhook URL (for recruiter notifications)
4) Calendly screening link (10-min slot) or leave blank
5) KYC form link (Google Form upload) or leave blank
6) Optional reply-to email for recruiter emails (Apps Script will use default sender; reply-to improves responses)

GOOGLE SHEET STRUCTURE

Create one Google Sheet with the following tabs:

A) Therapists (exact column order)
- Timestamp
- Name
- Phone (WhatsApp)
- Residency
- Willing to Relocate
- Fresher
- Experience (years)
- Zones
- Shifts
- Specialties
- Certifications
- Source
- Status
- Recruiter
- Screening Score
- KYC Verified
- Onboarded Date
- Notes

B) ZoneRecruiters
- Zone
- RecruiterName
- RecruiterPhone
- RecruiterEmail

C) Config (optional but recommended; overrides code defaults)
- Key
- Value

D) MessageTemplates (optional)
- Key
- TemplateText

COPY-PASTE CSV TEMPLATES

A) Therapists (headers only)
```
Timestamp,Name,Phone (WhatsApp),Residency,Willing to Relocate,Fresher,Experience (years),Zones,Shifts,Specialties,Certifications,Source,Status,Recruiter,Screening Score,KYC Verified,Onboarded Date,Notes
```

B) ZoneRecruiters (edit with your team)
```
Zone,RecruiterName,RecruiterPhone,RecruiterEmail
Koramangala,Ananya,+91XXXXXXXXXX,ananya@yourdomain.com
Indiranagar,Priya,+91XXXXXXXXXX,priya@yourdomain.com
HSR Layout,Kavya,+91XXXXXXXXXX,kavya@yourdomain.com
Jayanagar,Nisha,+91XXXXXXXXXX,nisha@yourdomain.com
Whitefield,Shreya,+91XXXXXXXXXX,shreya@yourdomain.com
Marathahalli,Divya,+91XXXXXXXXXX,divya@yourdomain.com
MG Road,Isha,+91XXXXXXXXXX,isha@yourdomain.com
Domlur,Meera,+91XXXXXXXXXX,meera@yourdomain.com
```

C) Config (put your real values; leave blank to skip features)
```
Key,Value
SLACK_WEBHOOK_URL,https://hooks.slack.com/services/REPLACE/ME
SCREENING_LINK,https://calendly.com/REPLACE/10min
KYC_FORM_LINK,https://forms.gle/REPLACE
REPLY_TO_EMAIL,ops@blrhangouthub.com
```

APPS SCRIPT DEPLOYMENT

1) Open your Google Sheet → Extensions → Apps Script
2) Paste the code from this repo:
   - docs/apps-script/onboarding_automation.gs
3) Save the project as “BLR Onboarding”
4) Set trigger:
   - Triggers → Add Trigger
   - Choose function: onFormSubmit
   - Event source: From form
   - Event type: On form submit
   - Save and authorize

No secrets in code: You can keep SLACK_WEBHOOK_URL/links blank in code because the Config tab overrides defaults.

SANITY TEST

1) Fill ZoneRecruiters with at least one recruiter per zone
2) Fill Config sheet with your Slack webhook (or leave blank to skip)
3) Submit a test response via the linked Google Form:
   - Use Residency=Bangalore Resident
   - Fresher=Yes
   - Zones=Koramangala
   - Shifts=Evening (5–10)
4) Result in Therapists tab should update:
   - Status becomes Screening
   - Recruiter assigned based on first matched zone
   - Screening Score computed (freshers + zones + shifts)
5) Slack message appears in your channel if webhook configured
6) Optional recruiter email is sent; reply-to uses Config.REPLY_TO_EMAIL if present

DAILY OPS: AVAILABILITY + PASS

- Each evening, add or update tomorrow’s entry in src/data/availability.json:
  ```
  "YYYY-MM-DD": {
    "pass": "BLR<DDMM>",
    "therapists": ["t1","t3"],
    "note": "Any note to show in Customer Area."
  }
  ```
- Share the pass privately with signed-up customers. They can access:
  - https://yourdomain/#availability?pass=YOURPASS
  - The Customer Area will unlock for that date.

TUNING TRIAGE (optional)

Defaults in code (docs/apps-script/onboarding_automation.gs):
- Freshers: +3
- Residency “Bangalore Resident”: +2
- Relocating to Bangalore & willing: +1
- Priority zones (Koramangala, Indiranagar, HSR, Jayanagar): +2
- Evening shift (5–10): +1

You can modify the arrays/constants in the script or keep as is.

SUPPORTING FILES IN REPO

- Automation script: docs/apps-script/onboarding_automation.gs
- Onboarding playbook: docs/therapist-onboarding-workflow.md

Once your Sheet/Form links, Slack webhook, and optional links (Calendly/KYC) are ready, the automation can go live immediately. The Config tab allows changing endpoints without code edits.