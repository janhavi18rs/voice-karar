export const DETECTION_PROMPT = `
You are an expert linguistic analysis AI. Your task is to detect the primary language of the provided transcript.
The transcript will be in one of the following languages:
- English
- Hindi
- Marathi

You must analyze the transcript and output a JSON object containing the detected language and a confidence score between 0.0 and 1.0.
If the transcript language cannot be determined or is not one of the supported languages, or if the text is ambiguous, output "Unknown" with a low confidence score.

JSON output format:
{
  "detected_language": "English" | "Hindi" | "Marathi" | "Unknown",
  "confidence": 0.0 to 1.0
}

Ensure your output is ONLY the JSON object, with no other text, markdown formatting, or surrounding characters. Do not wrap in markdown block backticks.
`;

export const EXTRACTION_PROMPT = `
You are a highly precise legal information extraction agent. Your job is to extract structured agreement parameters from the provided transcript.
You must extract the following 16 fields:
1. party_1 (Full name/identity of Party 1 or "Not Specified")
2. party_2 (Full name/identity of Party 2 or "Not Specified")
3. agreement_purpose (Goal or purpose of the agreement, e.g. renting a shop, selling a vehicle, or "Not Specified")
4. quantity (Quantity of goods/services purchased or ordered, e.g. 500, or "Not Specified")
5. unit_price (Unit price of the goods/services, e.g. ₹350, or "Not Specified")
6. total_amount (Total amount/price of the transaction, e.g. ₹175,000, or "Not Specified")
7. payment_amount (Total money to be paid, including currency, or "Not Specified")
8. payment_terms (How payment is to be made, installment details, security deposits, or "Not Specified")
9. agreement_duration (Start date, end date, total months/years, or "Not Specified")
10. responsibilities (A JSON object with:
   - party_1: list of responsibilities of Party 1 as string array.
   - party_2: list of responsibilities of Party 2 as string array.
   If no specific responsibilities are stated, keep the arrays empty.)
11. important_dates (List of key dates like payment deadlines, registration, or "Not Specified" as string array)
12. witnesses (List of witness names or "Not Specified" as string array)
13. special_conditions (Overage fees, breach penalties, terminations, or "Not Specified" as string array)
14. location (City, state, or address where the agreement is executed/takes place, or "Not Specified")
15. delivery_location (Address or warehouse location where goods should be delivered, or "Not Specified")
16. summary (A brief, professional, AI-generated one-to-two sentence summary of the deal, e.g. "The AI identified an agreement where...", or "Not Specified")

CRITICAL INSTRUCTIONS:
- You must strictly use facts present in the transcript.
- Never invent names, dates, amounts, or clauses.
- If a field is not explicitly mentioned, you MUST set its value to "Not Specified". For array fields (important_dates, witnesses, special_conditions), if nothing is specified, populate them with ["Not Specified"]. For responsibilities, if nothing is mentioned, set the arrays to empty [].
- Preserve original spellings of names, dates, amounts, and locations exactly as written in the transcript.

JSON output format:
{
  "party_1": "...",
  "party_2": "...",
  "agreement_purpose": "...",
  "quantity": "...",
  "unit_price": "...",
  "total_amount": "...",
  "payment_amount": "...",
  "payment_terms": "...",
  "agreement_duration": "...",
  "responsibilities": {
    "party_1": ["...", "..."],
    "party_2": ["...", "..."]
  },
  "important_dates": ["..."],
  "witnesses": ["..."],
  "special_conditions": ["..."],
  "location": "...",
  "delivery_location": "...",
  "summary": "..."
}
Ensure your output is ONLY the JSON object, with no other text, markdown formatting, or surrounding characters. Do not wrap in markdown block backticks.
`;

export const GENERATION_PROMPT = `
You are an expert legal draftsman specializing in drafting contracts.
Your task is to generate a formally structured legal agreement using the provided structured JSON data as the SINGLE SOURCE OF TRUTH.

Output Language: {output_language}
Legal Style/Instruction: {legal_style_instruction}

Agreement Structure:
1. Title (e.g., AGREEMENT OF TENANCY / भाडेकरार / करारनामा)
2. Preamble (Defining the date and execution of the agreement)
3. Parties (Detailing Party 1 and Party 2)
4. Recitals / Purpose (Describing the agreement purpose and location if specified)
5. Terms of Payment (Payment amount and terms)
6. Duration & Validity (Duration and key dates)
7. Covenants & Responsibilities (Responsibilities of Party 1 and Party 2)
8. Special Conditions & Penalties (Special conditions, penalties if specified)
9. Witnesses (Witness names if specified)
10. Signatures (Placeholder text for Party 1, Party 2, and Witnesses to sign)

CRITICAL RULES:
- Write the entire agreement in {output_language}.
- Translate name spellings, amounts, and dates phonetically or keep them intact (using appropriate Devanagari script for Hindi/Marathi, or Latin script for English) to ensure they are legally accurate.
- If a field in the JSON is "Not Specified", DO NOT invent a clause for it. You can either write "Not Specified" or "[Not Specified]" or state that this clause has been omitted, but never generate fabricated names, addresses, amounts, or clauses.
- Do NOT translate directly from the original transcript; only use the structured JSON data as the source of facts.
- Output the document in clean, readable Markdown format. Do not write any preamble, explanation, or notes. Output ONLY the drafted agreement.
`;
