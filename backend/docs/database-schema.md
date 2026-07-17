# Database Schema Design

This document details the MongoDB schemas used by **Voice Karar** defined via Mongoose.

## Collections

### 1. Users (`users`)
Stores registered members of the platform.

| Field | Type | Required | Unique | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Yes | Auto-generated |
| `name` | String | Yes | No | Full Name |
| `email` | String | Yes | Yes | Trimmed, lowercase |
| `password` | String | Yes | No | Hashed using bcrypt |
| `createdAt` | Date | Yes | No | Timestamp |
| `updatedAt` | Date | Yes | No | Timestamp |

### 2. Agreements (`agreements`)
Stores generated business agreements extracted by AI or managed by users.

| Field | Type | Required | Unique | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Yes | Auto-generated |
| `title` | String | Yes | No | Title of agreement |
| `creator` | ObjectId | Yes | No | Reference to `users` |
| `parties` | Array | Yes | No | Subdocument: `[{ email, name, role, status }]` |
| `parameters` | Array | Yes | No | Subdocument: `[{ key, value, label }]` |
| `rawTranscript` | String | Yes | No | AI input text |
| `status` | String | Yes | No | Enum: `pending`, `accepted`, `revision_requested`, `cancelled` |
| `shareId` | String | Yes | Yes | Unique index for sharing |
| `history` | Array | No | No | Subdocument tracking updates |
| `createdAt` | Date | Yes | No | Timestamp |
| `updatedAt` | Date | Yes | No | Timestamp |

### 3. Confirmations (`confirmations`)
Tracks individual digital acceptances or signature records.

| Field | Type | Required | Unique | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `_id` | ObjectId | Yes | Yes | Auto-generated |
| `agreementId` | ObjectId | Yes | No | Reference to `agreements` |
| `email` | String | Yes | No | Party email confirming |
| `ipAddress` | String | No | No | IP metadata |
| `signatureText`| String | Yes | No | Written name signature |
| `confirmedAt` | Date | Yes | No | Timestamp |
