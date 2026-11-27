# RenovAI V5 — price-feed framework (BE/NL)

This package is a practical continuation of RenovAI V4. It keeps the manual photo-calibration workflow and estimate calculator, and adds a country selector (Belgium/Netherlands) plus a backend that imports operator-configured HTTPS CSV or JSON feeds into memory, refreshes them on a configurable interval, and searches the imported product data.

## Important status

- No retailer feed is preconfigured or supplied with this package.
- No prices are fabricated or shown as live until an authorized feed is configured, imported, and verified.
- A feed refresh timestamp means the backend last fetched the feed; it is not a retailer guarantee that every price was updated at that exact time.
- This package does not implement automatic AI recognition or video measurement. Photo calibration remains manual and requires a known reference, planar measurements, and confirmation with a tape measure.

## Retailer/source route researched

- **Praxis NL**: a publisher/affiliate program was found on Awin. Access to feed data depends on publisher approval and the feed available in the account.
- **GAMMA NL and Karwei NL**: TradeTracker has announced affiliate programs for these Intergamma brands. Feed access still depends on account/campaign approval and the feed format available to the publisher.
- **HORNBACH NL, Toolstation NL, Brico BE, Hubo BE, GAMMA BE, HORNBACH BE**: this run did not confirm an authorized, usable product-price feed/API for RenovAI. They remain listed as optional sources but disabled until a permitted feed/API is obtained.

## Frontend deployment (GitHub Pages, Android)

1. Download/extract this ZIP on your phone.
2. In the GitHub repository, open the root `index.html` file.
3. Use the pencil edit icon or delete/replace the old file via Upload files, depending on the GitHub mobile interface.
4. Upload the new `index.html` from this package to repository root and commit to `main`.
5. The frontend is static; live-feed search requires the backend to be deployed separately.
6. Open the Pages URL and configure the backend URL in the app's price-search section.

## Backend deploy

1. Deploy the `backend/` folder to a Node.js host (Render, Railway, Fly.io, or another server that supports Node).
2. Install dependencies and run `npm start`.
3. Set `ALLOWED_ORIGINS=https://ssoriniulian-lang.github.io` and choose a rate limit.
4. Configure only feed URLs and tokens you have permission to use. Feed URLs/tokens must be stored in server environment variables, never in the HTML or public repository.
5. The feed endpoint should return CSV or JSON. For JSON, use an array or `{ "results": [...] }` / `{ "items": [...] }`. For CSV, header row is required.
6. Product rows must have a name/title, price, explicit `currency=EUR`, and direct HTTPS product URL. The backend skips rows that do not have these fields.
7. Each feed is capped at 25 MB. Refresh frequency defaults to six hours (`FEED_REFRESH_HOURS`); search results show the backend's feed-fetch timestamp, not a guaranteed store update timestamp.
8. The backend accepts an optional Bearer token configured as a server-side environment variable per feed. The feed URL itself can also contain an authorized network token; keep it secret.

## Environment variables

See `backend/.env.example`. It contains BE and NL feed URL/token slots.

## API

- `GET /api/health`: feed configuration and import status for both markets.
- `GET /api/search?q=paint&market=NL`: searches imported products for the selected market.

## Feed row example (not a real price, not a retailer product)

The example is structural only and intentionally not included as a product/result in the app:

```json
{
  "name": "Example product (schema only)",
  "price": 0,
  "currency": "EUR",
  "url": "https://example.invalid/product"
}
```

Do not use the schema example as a real price. The host, product, and value are placeholders.

## Verification in this run

- Backend JavaScript syntax checked with Node.js.
- Frontend script extracted and syntax checked with Node.js.
- HTML structure inspected for market selector and backend search integration.
- Manual-calibration ratio arithmetic checked separately.
- No browser/mobile end-to-end test, no live feed import, and no Pages deployment were performed in this run.
