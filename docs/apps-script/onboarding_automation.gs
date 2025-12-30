/**
 * BLR Hangout Hub — Google Apps Script automation for therapist onboarding
 * Attach this script to the Google Sheet that collects Google Form responses.
 * Menu: Extensions > Apps Script, paste this file, set triggers as noted below.
 *
 * SHEETS REQUIRED
 * 1) Therapists (Form responses target) — EXACT columns in this order:
 *    Timestamp | Name | Phone (WhatsApp) | Residency | Willing to Relocate | Fresher | Experience (years) |
 *    Zones | Shifts | Specialties | Certifications | Source | Status | Recruiter | Screening Score | KYC Verified | Onboarded Date | Notes
 * 2) ZoneRecruiters:
 *    Zone | RecruiterName | RecruiterPhone | RecruiterEmail
 * 3) (Optional) MessageTemplates:
 *    Key | TemplateText
 * 4) Config (NEW - optional; overrides CFG defaults):
 *    Key | Value
 *    - SLACK_WEBHOOK_URL
 *    - SCREENING_LINK
 *    - KYC_FORM_LINK
 *    - REPLY_TO_EMAIL
 *
 * TRIGGERS:
 * - Installable trigger: On form submit -> onFormSubmit
 *
 * NOTE:
 * - This version avoids using a "from" email alias to prevent MailApp errors.
 * - It supports a Config sheet so you can change endpoints without editing code.
 */

const CFG = {
  SHEET_THERAPISTS: 'Therapists',
  SHEET_RECRUITERS: 'ZoneRecruiters',
  SHEET_CONFIG: 'Config',
  SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/REPLACE/ME', // overridden by Config if present
  SCREENING_LINK: 'https://calendly.com/REPLACE/10min',             // optional, overridden by Config
  KYC_FORM_LINK: 'https://forms.gle/REPLACE',                        // optional, overridden by Config
  REPLY_TO_EMAIL: '',                                                // optional, overridden by Config
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

function onFormSubmit(e) {
  try {
    const sh = SpreadsheetApp.getActive().getSheetByName(CFG.SHEET_THERAPISTS);
    const row = e && e.range ? e.range.getRow() : sh.getLastRow();
    processRow(sh, row);
  } catch (err) {
    Logger.log(err);
  }
}

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

  // Slack notify
  const zStr = zones.join(', ') || 'NA';
  const sStr = shifts.join(', ') || 'NA';
  const screeningLink = getConfig_('SCREENING_LINK', CFG.SCREENING_LINK);
  notifySlack_({
    text:
      `New ${fresher ? 'Fresher ' : ''}Candidate (${status}) — ${record.Name} (${phone || 'no phone'})\n` +
      `Residency: ${residency} | WillRelocate: ${willRelocate}\n` +
      `Zones: ${zStr} | Shifts: ${sStr}\n` +
      `Score: ${score} | Recruiter: ${recruiter ? recruiter.name : 'Unassigned'}\n` +
      (screeningLink && screeningLink.indexOf('REPLACE') === -1 ? `Screening: ${screeningLink}` : '')
  });

  // Optional email to recruiter (from default script account; reply-to can be set)
  if (recruiter && recruiter.email) {
    const replyTo = getConfig_('REPLY_TO_EMAIL', CFG.REPLY_TO_EMAIL);
    const subject = `New ${fresher ? 'Fresher ' : ''}Therapist — ${record.Name} (${residency})`;
    const body =
      `<p><b>${record.Name}</b> (${phone || 'no phone'})</p>` +
      `<p>Residency: ${residency} | Will Relocate: ${willRelocate}</p>` +
      `<p>Zones: ${zStr}<br/>Shifts: ${sStr}</p>` +
      `<p>Score: ${score}</p>` +
      (screeningLink && screeningLink.indexOf('REPLACE') === -1 ? `<p>Screening: <a href="${screeningLink}">${screeningLink}</a></p>` : '');
    const options = { name: 'BLR Hangout Hub Bot', htmlBody: body };
    if (replyTo) options.replyTo = replyTo;
    MailApp.sendEmail(recruiter.email, subject, 'HTML only', options);
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
 * Slack notification (uses Config sheet override).
 */
function notifySlack_(payload) {
  const url = getConfig_('SLACK_WEBHOOK_URL', CFG.SLACK_WEBHOOK_URL);
  if (!url || url.indexOf('REPLACE') !== -1) return;
  try {
    UrlFetchApp.fetch(url, {
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

/**
 * Config helper: read from "Config" sheet (Key, Value), fallback to CFG
 */
function getConfig_(key, fallback) {
  const sh = SpreadsheetApp.getActive().getSheetByName(CFG.SHEET_CONFIG);
  if (!sh) return fallback;
  const values = sh.getDataRange().getValues();
  values.shift(); // headers
  for (const [k, v] of values) {
    if ((k || '').toString().trim() === key) {
      return (v || '').toString().trim() || fallback;
    }
  }
  return fallback;
}

/**
 * Helpers
 */
function getData_(sh) {
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(String);
  const data = sh.getRange(2, 1, Math.max(sh.getLastRow() - 1, 0), headers.length).getValues();
  const rows = data.map(r => rowToObject_(headers, r));
  return { headers, rows, startRow: 2 };
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
    if (map[key]) sh.getRange(row, map[key]).setValue(val);
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