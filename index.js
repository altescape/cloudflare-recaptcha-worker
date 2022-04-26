addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Ensure recaptcha secret token is defined in env vars
  if (typeof RECAPTCHA_SECRET === 'undefined') {
    throw new Error('RECAPTCHA_SECRET secret not set')
  }

  const headers = setCorsHeaders(new Headers())

  // Allow CORS
  if (request.method === 'OPTIONS') {
    return new Response('', { headers })
  }
  
  // Ensure POST request
  if (request.method !== 'POST') {
    return new Response('Invalid request method', {
      status: 400,
      headers
    })
  }

  // Ensure recaptcha token is given
  const recaptchaToken = await request.text()
  if (!recaptchaToken) {
    return new Response('Request body not set', {
      status: 400,
      headers
    })
  }

  try {
    // Verify token
    const data = new URLSearchParams({
      secret: RECAPTCHA_SECRET,
      response: recaptchaToken
    })
    const recaptchaResponse = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data.toString()
      }
    )
    const recaptchaBody = await recaptchaResponse.json()
    console.log('recaptchaBody', recaptchaBody)

    // Handle failure
    if (!recaptchaBody.success) {
      let errorMsg = 'unknown'
      if (recaptchaBody['error-codes'].length) {
        errorMsg = recaptchaBody['error-codes'][0]
      }

      return new Response(`reCAPTCHA failed, error: "${errorMsg}"`, {
        status: 400,
        headers
      })
    }

    return new Response('reCAPTCHA passed', {
      status: 202,
      headers
    })
  } catch(e) {
    console.error(e)
    return new Response(e.stack, { status: 500, headers })
  }
}

function setCorsHeaders (headers) {
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Methods', 'POST')
  headers.set(
    'Access-Control-Allow-Headers',
    'access-control-allow-headers, g-recaptcha'
  )
  headers.set('Access-Control-Max-Age', 1728185)
  return headers
}
