exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the form data
    const formData = JSON.parse(event.body);

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Get Zoho credentials from environment variables
    const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
    const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
    const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;

    if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN) {
      console.error('Missing Zoho credentials');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'Server configuration error. Please contact support.' 
        })
      };
    }

    // Step 1: Get access token
    const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        refresh_token: ZOHO_REFRESH_TOKEN,
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token'
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      console.error('Failed to get access token:', tokenData);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          success: false,
          error: 'Authentication failed. Please contact support.' 
        })
      };
    }

    // Step 2: Create lead in Zoho CRM
    const leadData = {
      data: [{
        First_Name: formData.firstName,
        Last_Name: formData.lastName,
        Email: formData.email,
        Phone: formData.phone || '',
        Company: formData.company || 'N/A',
        Lead_Source: 'Website',
        Description: `
Service Needed: ${formData.service || 'Not specified'}
Urgency: ${formData.urgency || 'Standard'}
Subject: ${formData.subject || ''}

Message:
${formData.message || ''}

Newsletter Subscription: ${formData.newsletter ? 'Yes' : 'No'}
        `.trim()
      }]
    };

    const crmResponse = await fetch('https://www.zohoapis.com/crm/v2/Leads', {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadData)
    });

    const crmData = await crmResponse.json();
    
    if (crmData.data && crmData.data[0].code === 'SUCCESS') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Your inquiry has been submitted successfully. We will contact you soon.',
          leadId: crmData.data[0].details.id
        })
      };
    } else {
      console.error('Failed to create lead:', crmData);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Failed to submit form. Please try again or contact us directly.'
        })
      };
    }

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to submit form. Please try again or contact us directly.',
        details: error.message
      })
    };
  }
};

