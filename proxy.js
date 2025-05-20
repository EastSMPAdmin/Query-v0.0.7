const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: 'Invalid JSON',
    };
  }

  const url = body.url;
  if (!url || !/^https?:\/\//i.test(url)) {
    return {
      statusCode: 400,
      body: 'Invalid or missing URL',
    };
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'text/plain';
    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
      },
      body: text,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Failed to fetch URL: ' + error.message,
    };
  }
};