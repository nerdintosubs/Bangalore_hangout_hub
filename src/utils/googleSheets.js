// Utility to fetch availability data from Google Sheets
// This assumes the sheet is published as JSON via Google Sheets API or a third-party service

export async function fetchAvailabilityFromSheets() {
  try {
    // Example endpoint - replace with actual Google Sheets published JSON URL
    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets/YOUR_SHEET_ID/values/Sheet1!A1:Z100?key=YOUR_API_KEY');
    const data = await response.json();

    // Transform Google Sheets data to our format
    // Assuming columns: Date, Pass, Therapist IDs (comma-separated), Note
    const availability = {};
    data.values.slice(1).forEach(row => { // Skip header row
      const [date, pass, therapistsStr, note] = row;
      availability[date] = {
        pass,
        therapists: therapistsStr.split(',').map(id => id.trim()),
        note: note || ''
      };
    });

    return availability;
  } catch (error) {
    console.error('Failed to fetch availability from Google Sheets:', error);
    // Fallback to local data
    return null;
  }
}

// Alternative: Use Google Sheets published as CSV and convert to JSON
export async function fetchAvailabilityFromCSV() {
  try {
    const response = await fetch('https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv');
    const csvText = await response.text();

    // Parse CSV to availability object
    const lines = csvText.split('\n');
    const availability = {};

    lines.slice(1).forEach(line => { // Skip header
      const [date, pass, therapistsStr, note] = line.split(',');
      availability[date] = {
        pass,
        therapists: therapistsStr.split(';').map(id => id.trim()),
        note: note || ''
      };
    });

    return availability;
  } catch (error) {
    console.error('Failed to fetch availability from CSV:', error);
    return null;
  }
}