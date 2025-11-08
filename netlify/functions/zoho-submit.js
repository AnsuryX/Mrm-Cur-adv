// Zoho integration has been removed.
// This function remained in the repository for historical reasons and is now a stub.
// Contact form submissions are handled directly by Formspree via the client-side JS.

exports.handler = async (event, context) => {
  return {
    statusCode: 410,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success: false,
      error: 'Zoho integration removed. Use Formspree endpoint from the client.'
    })
  };
};

