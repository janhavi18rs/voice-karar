import { GoogleGenerativeAI } from "@google/generative-ai";
import { DETECTION_PROMPT, EXTRACTION_PROMPT, GENERATION_PROMPT } from "./prompts.js";
import type { AgreementStructuredData, LanguageDetectionResult } from "./types.js";
import { getLanguageByCode, isLanguageSupported } from "../config/languages.js";

export class AgreementAgent {
  private genAI: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey?: string, modelName?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined. Please configure it in your environment or .env.local file.");
    }
    this.genAI = new GoogleGenerativeAI(key);
    this.modelName = "gemini-2.0-flash-lite";
  }

  /**
   * Helper to execute prompt and return parsed JSON
   */
  private async withRetry<T>(fn: () => Promise<T>, retries = 1, delayMs = 1000): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      const status = error?.status;
      const details = JSON.stringify(error?.errorDetails || []);
      const errMsg = String(error?.message || "");
      const isInvalidApiKey =
        status === 400 &&
        (details.includes("API_KEY_INVALID") || errMsg.includes("API key not valid"));

      const is404Or429 = status === 404 || status === 429 || errMsg.includes("404") || errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("not found") || errMsg.includes("not supported");

      if (isInvalidApiKey || is404Or429) {
        throw error;
      }

      if (retries > 0) {
        console.warn(`[Agent Retry] Gemini API call failed: ${error.message || error}. Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return this.withRetry(fn, retries - 1, delayMs * 2);
      }
      throw error;
    }
  }

  private async executeWithModelFallback<T>(
    systemInstruction: string,
    executeFn: (model: any) => Promise<T>,
    fallbackFn?: () => T
  ): Promise<T> {
    const candidateModels = [
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
    ];

    let lastError: any = null;
    for (const m of candidateModels) {
      try {
        const model = this.genAI.getGenerativeModel(
          { model: m, systemInstruction },
          { timeout: 45000 }
        );
        return await this.withRetry(() => executeFn(model));
      } catch (err: any) {
        const errMsg = String(err?.message || "");
        if (errMsg.includes("429") || errMsg.includes("quota")) {
          console.warn(`[Agent Model Fallback] Rate limit 429 hit on ${m}, waiting 2s...`);
          await new Promise(r => setTimeout(r, 2000));
        }
        if (errMsg.includes("404") || errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("not found") || errMsg.includes("not supported")) {
          console.warn(`[Agent Model Fallback] Model ${m} failed (${errMsg.slice(0, 100)}), trying next candidate...`);
          lastError = err;
          continue;
        }
        throw err;
      }
    }
    if (fallbackFn) {
      console.warn("All Gemini AI candidate models failed. Returning fallback response.");
      return fallbackFn();
    }
    throw lastError || new Error("All Gemini model candidates failed.");
  }

  private async generateJson<T>(systemInstruction: string, promptContent: string): Promise<T> {
    return this.executeWithModelFallback<T>(systemInstruction, async (model) => {
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: `${systemInstruction}\n\nInput Text / Transcript:\n${promptContent}` }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      });
      const rawText = result.response.text().trim();
      const cleanedText = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
      try {
        return JSON.parse(cleanedText) as T;
      } catch (error) {
        console.error("Failed to parse Gemini JSON response:", rawText);
        throw new Error("Invalid response format received from AI model.");
      }
    });
  }

  /**
   * Detects the language of the transcript
   */
  async detectLanguage(transcript: string): Promise<LanguageDetectionResult> {
    if (!transcript || transcript.trim().length === 0) {
      return { detected_language: "Unknown", confidence: 0.0 };
    }

    try {
      const result = await this.generateJson<LanguageDetectionResult>(
        DETECTION_PROMPT,
        transcript
      );
      
      // Normalize language name to Title Case
      if (result.detected_language) {
        result.detected_language = result.detected_language.charAt(0).toUpperCase() + result.detected_language.slice(1).toLowerCase();
      }

      return result;
    } catch (error) {
      console.error("Language detection error:", error);
      return { detected_language: "Unknown", confidence: 0.0 };
    }
  }

  /**
   * Extracts structured JSON from the transcript
   */
  async extractStructuredData(transcript: string): Promise<AgreementStructuredData> {
    try {
      const result = await this.generateJson<AgreementStructuredData>(
        EXTRACTION_PROMPT,
        transcript
      );

      // Post-process response lists and objects to ensure stability
      return this.sanitizeStructuredData(result);
    } catch (error) {
      console.error("Structured data extraction error:", error);
      throw error;
    }
  }

  /**
   * Generates a legal contract draft from the structured data in a specific language
   */
  async generateAgreement(data: AgreementStructuredData, outputLanguage: string): Promise<string> {
    const langConfig = getLanguageByCode(outputLanguage);
    if (!langConfig) {
      throw new Error(`Output language '${outputLanguage}' is not supported.`);
    }

    const systemInstruction = GENERATION_PROMPT
      .replace(/{output_language}/g, langConfig.name)
      .replace(/{legal_style_instruction}/g, langConfig.legalStyleInstruction);

    const dataString = JSON.stringify(data, null, 2);

    return this.executeWithModelFallback<string>(
      systemInstruction,
      async (model) => {
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: dataString }] }],
          generationConfig: {
            temperature: 0.3,
          },
        });
        return result.response.text();
      },
      () => this.generateFallbackMarkdown(data)
    );
  }

  /**
   * Extracts the list of missing essential fields from the structured JSON.
   * Only core fields (parties, purpose, payment) trigger follow-up questions.
   */
  getMissingFields(data: AgreementStructuredData): string[] {
    const missing: string[] = [];

    const isNotSpecified = (val: string | undefined | null) => 
      !val || val.trim().toLowerCase() === "not specified";

    if (isNotSpecified(data.party_1)) missing.push("Party 1");
    if (isNotSpecified(data.party_2)) missing.push("Party 2");
    if (isNotSpecified(data.agreement_purpose)) missing.push("Agreement Purpose");

    // Consider payment specified if any pricing field is present
    const hasPayment = !isNotSpecified(data.payment_amount) || 
                       !isNotSpecified(data.total_amount) || 
                       !isNotSpecified(data.unit_price);
    if (!hasPayment) missing.push("Payment Amount");

    return missing;
  }

  /**
   * Helper to ensure all JSON fields exist and have proper defaults
   */
  private sanitizeStructuredData(data: Partial<AgreementStructuredData>): AgreementStructuredData {
    const isNotSpecified = (val: string | undefined | null) => 
      !val || val.trim().toLowerCase() === "not specified" ? "Not Specified" : val;

    return {
      party_1: isNotSpecified(data.party_1),
      party_2: isNotSpecified(data.party_2),
      agreement_purpose: isNotSpecified(data.agreement_purpose),
      quantity: isNotSpecified(data.quantity),
      unit_price: isNotSpecified(data.unit_price),
      total_amount: isNotSpecified(data.total_amount),
      payment_amount: isNotSpecified(data.payment_amount),
      payment_terms: isNotSpecified(data.payment_terms),
      agreement_duration: isNotSpecified(data.agreement_duration),
      responsibilities: {
        party_1: Array.isArray(data.responsibilities?.party_1) ? data.responsibilities.party_1 : [],
        party_2: Array.isArray(data.responsibilities?.party_2) ? data.responsibilities.party_2 : [],
      },
      important_dates: Array.isArray(data.important_dates) ? data.important_dates.map(d => isNotSpecified(d)) : ["Not Specified"],
      witnesses: Array.isArray(data.witnesses) ? data.witnesses.map(w => isNotSpecified(w)) : ["Not Specified"],
      special_conditions: Array.isArray(data.special_conditions) ? data.special_conditions.map(s => isNotSpecified(s)) : ["Not Specified"],
      location: isNotSpecified(data.location),
      delivery_location: isNotSpecified(data.delivery_location),
      summary: isNotSpecified(data.summary),
    };
  }

  /**
   * Transcribes audio using Gemini's multimodal audio understanding capability
   */
  async transcribeAudio(audioBase64: string, mimeType: string): Promise<string> {
    const raw = (String(mimeType || "audio/webm").split(";")[0] || "audio/webm").trim().toLowerCase();
    let cleanMime = raw;
    if (raw.includes("m4a") || raw.includes("mp4")) cleanMime = "audio/mp4";
    else if (raw.includes("wav") || raw.includes("wave")) cleanMime = "audio/wav";
    else if (raw.includes("mp3") || raw.includes("mpeg")) cleanMime = "audio/mp3";
    else if (raw.includes("ogg")) cleanMime = "audio/ogg";
    else if (raw.includes("aac")) cleanMime = "audio/aac";
    else if (raw.includes("flac")) cleanMime = "audio/flac";

    const systemInstruction = "You are an expert audio transcriber. Listen to the audio recording carefully and write down the exact spoken words in the original language spoken (e.g. Hindi, Marathi, English, Tamil, etc.). Return ONLY the exact transcription text. Do not add any summary, notes, or explanation.";

    return this.executeWithModelFallback<string>(
      systemInstruction,
      async (model) => {
        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    data: audioBase64,
                    mimeType: cleanMime
                  }
                },
                { text: "Listen to this audio recording and transcribe the complete spoken conversation in its original language." }
              ]
            }
          ]
        });
        return result.response.text().trim();
      }
    );
  }

  /**
   * Fallback parameter extractor if AI API calls fail
   */
  extractFallbackData(transcript: string): AgreementStructuredData {
    const text = transcript || "";

    // Extract Hindi / English amounts
    const amounts = Array.from(text.matchAll(/(?:rs\.?|inr|₹|रु\.|रुपये)\s?([\d,]+)|([\d,]+)\s*(?:रुपये|रु|rs|inr)/gi)).map(m => m[1] || m[2]).filter(Boolean);
    const totalAmount = amounts[0] ? amounts[0].replace(/,/g, "") : undefined;
    const advanceAmount = amounts[1] ? amounts[1].replace(/,/g, "") : undefined;

    // Detect Hindi / English contract purpose
    let product = "Commercial Agreement";
    if (/वेबसाइट|website|ई\s*कॉमर्स|e-commerce/i.test(text)) {
      product = "ई-कॉमर्स वेबसाइट विकास (Website Development)";
    } else if (/कार|गाडी|car|vehicle|MH\s*\d+/i.test(text)) {
      product = "वाहन भाडे करार (Vehicle Rental)";
    } else if (/कॉटन बैग|bags|कपड़े|cloth|goods|supply/i.test(text)) {
      product = "माल पुरवठा करार (Goods Supply)";
    }

    // Detect Party Names (Hindi / English)
    const party1Match = text.match(/(?:अमित|संजय|राहुल|प्रशांत|अनिकेत|[A-Z][A-Za-z0-9\s&.-]{2,30})/i);
    const party2Match = text.match(/(?:जोशी|पाटील|काळे|राजेश|ट्रेडर्स|[A-Z][A-Za-z0-9\s&.-]{2,30})/i);

    const party1 = party1Match ? party1Match[0].trim() : "First Party";
    const party2 = party2Match ? party2Match[0].trim() : "Second Party";
    const paymentTerms = advanceAmount ? `₹${advanceAmount} Advance, Balance on Completion` : "As agreed";

    return {
      party_1: party1,
      party_2: party2,
      agreement_purpose: product,
      quantity: "1",
      unit_price: totalAmount ? `₹${totalAmount}` : "Not Specified",
      total_amount: totalAmount ? `₹${totalAmount}` : "Not Specified",
      payment_amount: totalAmount ? `INR ${totalAmount}` : "Not Specified",
      payment_terms: paymentTerms,
      agreement_duration: "Not Specified",
      responsibilities: {
        party_1: ["Make payment as agreed"],
        party_2: [`Fulfill obligations for ${product}`],
      },
      important_dates: ["Not Specified"],
      witnesses: ["Not Specified"],
      special_conditions: ["Not Specified"],
      location: "Not Specified",
      delivery_location: "Not Specified",
      summary: text,
    };
  }

  generateFallbackMarkdown(data: AgreementStructuredData): string {
    return [
      "# Commercial Agreement",
      "",
      `This Agreement is entered into between **${data.party_1}** and **${data.party_2}**.`,
      "",
      "### Key Terms",
      `- **Product / Purpose:** ${data.agreement_purpose}`,
      `- **Quantity:** ${data.quantity}`,
      `- **Unit Price:** ${data.unit_price}`,
      `- **Total Amount:** ${data.total_amount || data.payment_amount}`,
      `- **Delivery Date:** ${data.agreement_duration}`,
    ].join("\n");
  }
}
