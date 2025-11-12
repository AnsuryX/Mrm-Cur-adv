const {google} = require('googleapis');

// Create an event for a selected slot.
// Required environment variables:
// - GOOGLE_CLIENT_EMAIL
// - GOOGLE_PRIVATE_KEY (literal newline characters must be preserved)
// - CALENDAR_ID
// - TZ (e.g. 'Africa/Nairobi')

exports.handler = async function(event){
  try{
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
    const body = JSON.parse(event.body || '{}');
    const { name, email, phone, date, slot } = body;
    if (!name || !email || !date || !slot) return { statusCode: 400, body: JSON.stringify({ error: 'name, email, date and slot are required' }) };

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

    const calendar = google.calendar({version:'v3', auth});

    // build start and end ISO strings (hour slot -> 1 hour duration)
    const startISO = `${date}T${slot}:00`;
    // compute end by adding 1 hour
    const [hh,mm] = slot.split(':');
    const endHour = String(parseInt(hh,10) + 1).padStart(2,'0');
    const endISO = `${date}T${endHour}:${mm}:00`;

    // Check availability for the requested slot
    const busyResp = await calendar.freebusy.query({ requestBody: {
      timeMin: new Date(startISO).toISOString(),
      timeMax: new Date(endISO).toISOString(),
      items: [{ id: calendarId }]
    }});

    const busy = busyResp.data.calendars[calendarId].busy || [];
    if (busy.length > 0) {
      return { statusCode: 409, body: JSON.stringify({ error: 'Slot not available' }) };
    }

    const event = {
      summary: `Consultation — ${name}`,
      description: `Client: ${name}\nPhone: ${phone || 'N/A'}\nEmail: ${email}`,
      start: { dateTime: startISO, timeZone: tz },
      end: { dateTime: endISO, timeZone: tz },
      attendees: [ { email } ],
      // set transparency to opaque so it blocks time
      transparency: 'opaque'
    };

    const insertResp = await calendar.events.insert({ calendarId, requestBody: event });

    return { statusCode: 200, body: JSON.stringify({ id: insertResp.data.id, htmlLink: insertResp.data.htmlLink, summary: insertResp.data.summary }) };
  }catch(err){
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
