# See2Shop Extension

Initial YouTube proof of concept.

## Current flow

YouTube
→ user clicks "Shop this"
→ visible browser scene is captured
→ image is stored locally in Chrome extension storage
→ results page opens

## Security principles

- User initiated capture
- No background video recording
- No payment information
- No affiliate secrets in the extension
- No automated clicks/views
- No private account data collection

## Next stage

Add a secure server-side vision service and product matching.
