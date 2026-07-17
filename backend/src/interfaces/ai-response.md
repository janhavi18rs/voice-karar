# AI Response Interface

This document defines the structured JSON contract returned by the AI engine after parsing the speech/transcript data.

## Response Payload

```json
{
  "success": true,
  "data": {
    "transcript": "We agreed today that John from ABC Corp will purchase 100 widgets from Mary at XYZ LLC. The price per widget is $15. Delivery must be done by next Thursday, July 23rd, and payment is due 30 days after delivery via bank transfer.",
    "agreement": {
      "title": "Purchase of Widgets - ABC Corp & XYZ LLC",
      "parties": [
        {
          "name": "John",
          "organization": "ABC Corp",
          "role": "Buyer"
        },
        {
          "name": "Mary",
          "organization": "XYZ LLC",
          "role": "Seller"
        }
      ],
      "parameters": [
        {
          "key": "product",
          "value": "widgets",
          "category": "Scope"
        },
        {
          "key": "quantity",
          "value": "100",
          "category": "Scope"
        },
        {
          "key": "price_per_unit",
          "value": "$15",
          "category": "Financial"
        },
        {
          "key": "delivery_date",
          "value": "2026-07-23",
          "category": "Timeline"
        },
        {
          "key": "payment_terms",
          "value": "Net 30, bank transfer",
          "category": "Financial"
        }
      ],
      "rawSummary": "John (ABC Corp) purchases 100 widgets from Mary (XYZ LLC) for $15 each. Delivery by 2026-07-23. Payment within 30 days of delivery."
    },
    "confidenceScore": 0.94
  }
}
```
