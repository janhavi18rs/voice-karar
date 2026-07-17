# AI Request Interface

This document defines the interface (JSON contract) when requesting information from the AI processing engine to convert audio or speech transcripts into a structured agreement format.

## Speech-to-Text & Processing Endpoint
**Request Method:** `POST`
**Headers:**
- `Content-Type: multipart/form-data` (if audio file upload) OR `application/json` (if text transcript)

### Scenario A: Raw Audio Input
When uploading the voice recording directly to the backend/AI service.

```json
{
  "audio": "[Binary Audio File]",
  "options": {
    "language": "en",
    "detectParties": true
  }
}
```

### Scenario B: Text Summary Input
When the speech transcript is already converted, and we request details extraction.

```json
{
  "transcript": "We agreed today that John from ABC Corp will purchase 100 widgets from Mary at XYZ LLC. The price per widget is $15. Delivery must be done by next Thursday, July 23rd, and payment is due 30 days after delivery via bank transfer.",
  "metadata": {
    "creatorId": "usr_92837492",
    "recordedAt": "2026-07-17T22:00:00Z"
  }
}
```
