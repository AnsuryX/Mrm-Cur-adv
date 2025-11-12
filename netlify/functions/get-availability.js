const {google} = require('googleapis');

// This function returns busy slots (hours) for a given calendar and date.
// Required environment variables:
// - GOOGLE_CLIENT_EMAIL
// - GOOGLE_PRIVATE_KEY (literal newline characters must be preserved)
// - CALENDAR_ID
// - TZ (e.g. 'Africa/Nairobi')

exports.handler = async function(event) {
  try {
    const { date } = event.queryStringParameters || {};
    if (!date) return { statusCode: 400, body: JSON.stringify({ error: 'date required (YYYY-MM-DD)' }) };

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
    const calendarId = process.env.CALENDAR_ID;
    const tz = process.env.TZ || 'Africa/Nairobi';

    if (!clientEmail || !privateKey || !calendarId) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing Google service account credentials in environment' }) };
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/calendar']
    });

    const calendar = google.calendar({version: 'v3', auth});

    // Build timeMin/timeMax for the target date in TZ
    const start = new Date(date + 'T00:00:00');
    const end = new Date(date + 'T23:59:59');

    const resp = await calendar.freebusy.query({
      requestBody: {
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        items: [{ id: calendarId }]
      }
    });

    const busy = resp.data.calendars[calendarId].busy || [];
    // Convert busy ranges to hour slots (e.g., '09:00')
    const busyHours = new Set();
    busy.forEach(b => {
      const s = new Date(b.start);
      const e = new Date(b.end);
      for (let t = new Date(s); t < e; t.setHours(t.getHours()+1)){
        const hh = String(t.getHours()).padStart(2,'0') + ':00';
        busyHours.add(hh);
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ busySlots: Array.from(busyHours) })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
