# RenovAI — scan/deviz + catalog-search backend starter (v2)

## Included
- `public/index.html`: mobile-first app with video preview, confirmed room measurements, area calculation, labor/material estimate, product-search UI and material list.
- `backend/server.js`: Express API proxy to configured Apify actors. The token remains on the server.
- `.env.example`: environment settings template (no real token).

## Honest status
- Video preview is implemented; video-based AI dimension/work recognition is NOT implemented. Confirm dimensions using calibrated references or actual measurements.
- The product-search UI is implemented, but live search requires the backend to be deployed and a token/provider configured. No demo/fake prices are displayed.
- Community scraping actors are not official retailer APIs. Review each actor's terms, the retailer's terms, legality, country coverage and pricing before using it. Brico/Hubo/GAMMA actors are community integrations. The listed Hornbach actor targets Germany; it is disabled by default and does not confirm Belgian pricing.
- Product actor schemas can change. This starter expects common fields (`searchQuery`, `maxResults`, `language`) and normalizes a small set of common output names. Actor-specific inputs/outputs may require adjustment.

## 1. Deploy the backend
1. Create a separate Node.js service on a provider that supports Node/Express (e.g. Render, Railway, or another host). GitHub Pages cannot run Node server code.
2. Upload the contents of `backend/` to that service or deploy the backend folder from a separate repo.
3. Run `npm install`, then set the service start command to `npm start`.
4. In the service environment settings, set `APIFY_TOKEN`, `ALLOWED_ORIGINS` to your GitHub Pages URL, and the actor variables from `.env.example`. Do not paste the token into the HTML or public GitHub repository.
5. Review the actors' terms and costs before enabling them. Configure only sources you are allowed to use. Hornbach is intentionally disabled until Belgium coverage is confirmed.
6. Test `https://YOUR-BACKEND/api/health`. The `enabledStores` array should list active sources.

## 2. Publish the front-end on GitHub Pages
1. Upload `public/index.html` to the RenovAI repo root as `index.html` (replace existing file).
2. Commit the change and wait for Pages to deploy.
3. Open the Pages site, enter your backend URL in `Backend RenovAI (URL)` and tap `Salvează URL`.
4. Tap `Verifică backend`. If it responds, search a material. Results must show a price, source and timestamp returned by the actor; verify product prices on the retailer page before relying on them.

## Security and limitations
- Token is server-only, not in `public/index.html`.
- CORS, rate limiting, Helmet and a 60-second search cache are included. The synchronous actor call is limited by server timeout; for production use, a queued asynchronous API and stronger cache/monitoring are recommended.
- Never commit `.env`. Use `.env.example` only.
