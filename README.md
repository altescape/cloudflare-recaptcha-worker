# Google reCAPTCHA v3 serverless Cloudflare Worker
A server side site verification function for reCAPTCHA v3 using serverless Cloudflare Workers based on [hr/recaptcha-worker](https://github.com/HR/recaptcha-worker), includes some fixes.

## Installation

This requires you to have a Cloudflare Workers account and have the Workers CLI installed. If you haven't already, follow this https://developers.cloudflare.com/workers/get-started/guide

1. Deploy it

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/altescape/cloudflare-recaptcha-worker)

2. Set your [reCAPTCHA secret key](https://developers.google.com/recaptcha/intro) `RECAPTCHA_SECRET` environment variable

```
$ wrangler secret put RECAPTCHA_SECRET --env recaptcha-worker
```

3. Write the client-side request code (see Usage)

## Usage

### Request

1. See [example](example/index.html) and replace `RECAPTCHA_SITE_KEY` and `YOUR_WORKER_URL` with your own values.

### Response

- `202 Accepted`: Verification succeeded, request isn't from a bot. Response body will be `reCAPTCHA passed`.

- `400 Bad Request`: Verification failed due to a configuration problem. Test your Worker/settings in your Worker quick edit dashboard screen. Response body will be `reCAPTCHA failed`.

- `418 I'm a teapot`: Verification failed, reCAPTCHA suspects the request was from a bot. Response body will be `reCAPTCHA failed`.

- `500 Internal Server Error`: A more serious error occurred. Response will contain the error stack.
