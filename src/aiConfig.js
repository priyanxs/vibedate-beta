/* Live AI (optional). The built-in assistant always works with no setup.

   To switch on live Gemini answers WITHOUT putting a key in the website, deploy the small proxy in /worker
   (it keeps your key as a server-side secret) and paste its URL here, e.g.
     export const AI_PROXY_URL = 'https://vibedate-ai.<your-subdomain>.workers.dev'
   The proxy URL is not a secret. NEVER paste an API key into this file or any other file in the repository —
   anything shipped to a browser can be read by every visitor. */
export const AI_PROXY_URL = ''
