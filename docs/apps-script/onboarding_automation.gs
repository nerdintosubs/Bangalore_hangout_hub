/**
 * BLR Hangout Hub — Google Apps Script automation for therapist onboarding
 * Attach this script to the Google Sheet that collects Google Form responses.
 * Menu: Extensions > Apps Script, paste this file, set triggers as noted below.
 *
 * SHEET STRUCTURE (Therapists):
 * Timestamp | Name | Phone (WhatsApp) | Residency | Willing to Relocate | Fresher | Experience (years) |
 * Zones | Shifts | Specialties | Certifications | Source | Status | Recruiter | Screening Score | KYC Verified | Onboarded Date | Notes
 *
 * AUX SHEETS:
 * ZoneRecruiters: Zone | RecruiterName | RecruiterPhone | RecruiterEmail
 * MessageTemplates (optional): Key | TemplateText
 *
 * TRIGGERS:
 * - Installable trigger: On form submit -> onFormSubmit
 *
 * ENV: Fill placeholders below.
 */

const CFG = {
  SHEET_THERAPISTS: 'Therapists',
  SHEET_RECRUITERS: 'ZoneRecruiters',
  SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/REPLACE/ME', // put your Slack Incoming Webhook URL
  SCREENING_LINK: 'https://calendly.com/REPLACE/10min',             // optional
  KYC_FORM_LINK: 'https://forms.gle/REPLACE',                        // optional
  EMAIL_FROM: 'ops@blrhangouthub.com',                               // optional
  PRIORITY_ZONES: ['Koramangala','Indiranagar','HSR Layout','Jayanagar'],
  EVENING_SHIFT_LABEL: 'Evening (5–10)'
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('BLR Automations')
    .addItem('Process All New', 'processAllNew')
    .addItem('Test Slack Notification', 'testSlack')
    .addToUi();
}

/**
 * Triggered via Google Form submit.
 */
function onFormSubmit(e) {
  try {
    const sh = SpreadsheetApp.getActive().getSheetByName(CFG.SHEET_THERAPISTS);
    const row = e && e.range ? e.range.getRow() : sh.getLastRow();
    processRow(sh, row);
  } catch (err) {
    Logger.log(err);
  }
}

/**
 * Manual reprocessing of all rows with blank Status or "New".
 */
function processAllNew() {
  const sh = SpreadsheetApp.getActive().getSheetByName(CFG.SHEET_THERAPISTS);
  const data = getData_(sh);
  data.rows.forEach((r, idx) => {
    const status = (r.Status || '').toString().trim();
    if (!status || status === 'New') {
      processRow(sh, data.startRow + idx);
    }
  });
}

/**
 * Core row processing: triage, recruiter assignment, notifications.
 */
function processRow(sh, row) {
  const data = getData_(sh);
  const record = rowToObject_(data.headers, sh.getRange(row, 1, 1, data.headers.length).getValues()[0]);

  // Normalize fields
  const residency = (record['Residency'] || '').toString().trim();
  const willRelocate = (record['Willing to Relocate'] || '').toString().trim();
  const fresher = ((record['Fresher'] || '').toString().trim().toLowerCase() === 'yes');
  const zones = csvToList_(record['Zones']);
  const shifts = csvToList_(record['Shifts']);
  const phone = sanitizePhone_(record['Phone (WhatsApp)']);

  // Immediate rejection if not BLR / not relocating
  if (residency === 'Outside Bangalore (not relocating)') {
    const update = {
      'Status': 'Rejected',
      'Notes': appendNote_(record['Notes'], 'Auto: Not BLR / will not relocate')
    };
    writeBack_(sh, row, data.headers, update);
    notifySlack_({
      text: `Rejected (Non-BLR/No Relocation): ${record.Name} ${phone ? ' | ' + phone : ''}`
    });
    return;
  }

  const score = priorityScore_({ fresher, residency, willRelocate, zones, shifts });

  // Assign recruiter by first matching zone
  const recruiter = findRecruiterByZone_(zones);
  const status = 'Screening';

  const update = {
    'Status': status,
    'Recruiter': recruiter ? recruiter.name : '',
    'Screening Score': score
  };
  writeBack_(sh, row, data.headers, update);

  // Notify Slack
  const zStr = zones.join(', ') || 'NA';
  const sStr = shifts.join(', ') || 'NA';
  notifySlack_({
    text: `New ${fresher ? 'Fresher ' : ''}Candidate (${status}) — ${record.Name} (${phone || 'no phone'})\n` +
          `Residency: ${residency} | WillRelocate: ${willRelocate}\nZones: ${zStr} | Shifts: ${sStr}\n` +
          `Score: ${score} | Recruiter: ${recruiter ? recruiter.name : 'Unassigned'}\n` +
          (CFG.SCREENING_LINK ? `Screening: ${CFG.SCREENING_LINK}` : '')
  });

  // Optional email to recruiter
  if (recruiter && recruiter.email && CFG.EMAIL_FROM) {
    MailApp.sendEmail({
      to: recruiter.email,
      name: 'BLR Hangout Hub Bot',
      from: CFG.EMAIL_FROM,
      subject: `New ${fresher ? 'Fresher ' : ''}Therapist — ${record.Name} (${residency})`,
      htmlBody:
        `<p><b>${record.Name}</b> (${phone || 'no phone'})</p>` +
        `<p>Residency: ${residency} | Will Relocate: ${willRelocate}</p>` +
        `<p>Zones: ${zStr}<br/>Shifts: ${sStr}</p>` +
        `<p>Score: ${score}</p>` +
        (CFG.SCREENING_LINK ? `<p>Screening: <a href="${CFG.SCREENING_LINK}">${CFG.SCREENING_LINK}</a></p>` : '')
    });
  }
}

/**
 * Priority scoring — freshers + BLR resident priority, evening shift, tier-1 zones.
 */
function priorityScore_({ fresher, residency, willRelocate, zones, shifts }) {
  let sc = 0;
  if (fresher) sc += 3;
  if (residency === 'Bangalore Resident') sc += 2;
  if (residency === 'Relocating to Bangalore' && (willRelocate || '').toLowerCase() === 'yes') sc += 1;
  if (zones.some(z => CFG.PRIORITY_ZONES.includes(z))) sc += 2;
  if (shifts.includes(CFG.EVENING_SHIFT_LABEL)) sc += 1;
  return sc;
}

/**
 * Recruiter lookup by zone (first match wins).
 */
function findRecruiterByZone_(zones) {
  const sh = SpreadsheetApp.getActive().getSheetByName(CFG.SHEET_RECRUITERS);
  if (!sh) return null;
  const rng = sh.getDataRange().getValues();
  const headers = rng.shift().map(String);
  const iZone = headers.indexOf('Zone');
  const iName = headers.indexOf('RecruiterName');
  const iPhone = headers.indexOf('RecruiterPhone');
  const iEmail = headers.indexOf('RecruiterEmail');
  for (const z of zones) {
    for (const row of rng) {
      if ((row[iZone] || '').toString().trim() === z) {
        return {
          zone: z,
          name: (row[iName] || '').toString().trim(),
          phone: (row[iPhone] || '').toString().trim(),
          email: (row[iEmail] || '').toString().trim()
        };
      }
    }
  }
  return null;
}

/**
 * Helpers
 */
function getData_(sh) {
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
  const startRow = 2;
  const lastRow = sh.getLastRow();
  return { headers, startRow, lastRow };
}

function rowToObject_(headers, row) {
  const o = {};
  headers.forEach((h, i) => o[h] = row[i]);
  return o;
}

function writeBack_(sh, row, headers, updateObj) {
  const map = {};
  headers.forEach((h, i) => map[h] = i + 1);
  const entries = Object.entries(updateObj);
  entries.forEach(([key, val]) => {
    if (map[key]) {
      sh.getRange(row, map[key]).setValue(val);
    }
  });
}

function csvToList_(val) {
  if (!val) return [];
  return val.toString().split(',').map(s => s.trim()).filter(Boolean);
}

function sanitizePhone_(p) {
  if (!p) return '';
  return p.toString().replace(/[^\d+]/g, '');
}

function appendNote_(prev, txt) {
  prev = (prev || '').toString();
  return prev ? (prev + ' | ' + txt) : txt;
}

function notifySlack_(payload) {
  if (!CFG.SLACK_WEBHOOK_URL || CFG.SLACK_WEBHOOK_URL.indexOf('REPLACE') !== -1) return;
  try {
    UrlFetchApp.fetch(CFG.SLACK_WEBHOOK_URL, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
  } catch (e) {
    Logger.log('Slack error: ' + e);
  }
}

function testSlack() {
  notifySlack_({ text: 'BLR Automations: Slack test OK.' });
}