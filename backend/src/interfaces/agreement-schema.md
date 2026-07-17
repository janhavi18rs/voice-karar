# Agreement Schema Interface

This details the structural schema representing an agreement as communicated between frontend, backend, and database models.

## Agreement JSON Contract

```json
{
  "id": "agr_81923091",
  "title": "Purchase of Widgets - ABC Corp & XYZ LLC",
  "creator": {
    "userId": "usr_92837492",
    "name": "Mary",
    "email": "mary@xyz.com"
  },
  "parties": [
    {
      "email": "john@abc.com",
      "name": "John",
      "organization": "ABC Corp",
      "role": "Buyer",
      "status": "pending" 
    },
    {
      "email": "mary@xyz.com",
      "name": "Mary",
      "organization": "XYZ LLC",
      "role": "Seller",
      "status": "accepted"
    }
  ],
  "parameters": [
    {
      "key": "product",
      "value": "widgets",
      "label": "Product Name"
    },
    {
      "key": "quantity",
      "value": "100",
      "label": "Quantity"
    },
    {
      "key": "price_per_unit",
      "value": "$15",
      "label": "Unit Price"
    }
  ],
  "status": "pending",
  "shareId": "c8f9a2e3b1d749",
  "shareUrl": "https://voicekarar.com/agreement/c8f9a2e3b1d749",
  "history": [
    {
      "action": "created",
      "timestamp": "2026-07-17T22:05:00Z",
      "performedBy": "usr_92837492",
      "details": "Agreement created from voice transcript."
    }
  ],
  "createdAt": "2026-07-17T22:05:00Z",
  "updatedAt": "2026-07-17T22:05:00Z"
}
```

### Status Lifecycles
- `pending`: Waiting for reviews/actions from other parties.
- `accepted`: All parties signed and accepted the agreement.
- `revision_requested`: A party requested alterations/modifications.
- `cancelled`: Cancelled by the owner.
