# See2Shop API

Cloud backend for the See2Shop browser extension.

## Current API

### Health

GET `/health`

### Vision

POST `/api/v1/vision/analyze`

Request:

```json
{
  "image": "data:image/jpeg;base64,..."
}

