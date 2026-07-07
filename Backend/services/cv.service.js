import { InferenceClient } from "@huggingface/inference";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFParse } from "pdf-parse";

const HF_KEYS = [
  process.env.HF_API_KEY_1,
  process.env.HF_API_KEY_2,
  process.env.HF_API_KEY_3,
].filter(Boolean);

const GEMINI_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
].filter(Boolean);

const HF_MODEL = "black-forest-labs/FLUX.1-Kontext-dev";
const GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image";
const GEMINI_TEXT_MODEL = "gemini-2.5-flash";

const PHOTO_PROMPT = `
Change this person's clothing to professional business attire
and replace the background with a clean neutral studio backdrop
with soft studio lighting. Keep the person's face, facial features,
expression, hairstyle, and skin tone exactly the same — do not change
their identity or appearance in any way. Photorealistic result.`;

const SCORE_SYSTEM_PROMPT = `You are a strict but constructive CV/resume reviewer for internship applicants (students, early-career).
Score the CV from 0-100 based on: completeness, clarity, use of specific/quantified achievements, relevance for internship applications, and professionalism.
Then give 3-5 concrete, actionable suggestions, each tied to a specific section of the CV.

The "section" field MUST be exactly one of these four strings (nothing else): "Personal Info", "About & Skills", "Experience", "Photo".

Respond with ONLY valid JSON, no markdown fences, no preamble, matching exactly this shape:
{
  "score": <integer 0-100>,
  "summary": "<one sentence overall verdict>",
  "suggestions": [
    { "section": "Personal Info" | "About & Skills" | "Experience" | "Photo", "note": "<specific, actionable suggestion, 1-2 sentences>" }
  ]
}`;

const PARSE_SYSTEM_PROMPT = `You extract structured resume/CV data from raw text pulled from a PDF.
The text may have messy spacing or line breaks from PDF extraction — do your best to interpret it correctly.

Respond with ONLY valid JSON, no markdown fences, no preamble, matching exactly this shape:
{
  "personal": {
    "fullName": "",
    "location": "",
    "phoneNumber": "",
    "email": ""
  },
  "about": {
    "aboutMe": "",
    "skills": [],
    "hobbies": [],
    "languages": [
      { "language": "", "proficiency": "" }
    ],
    "links": [
      { "label": "", "url": "" }
    ]
  },
  "experience": {
    "workExperience": [
      {
        "jobTitle": "", "company": "", "location": "",
        "startMonth": "", "startYear": "", "endMonth": "", "endYear": "",
        "currentlyWorking": false, "description": ""
      }
    ],
    "education": [
      { "institution": "", "degree": "", "startYear": "", "endYear": "", "currentlyStudying": false }
    ],
    "references": [
      { "fullName": "", "jobTitle": "", "company": "", "email": "", "phone": "" }
    ]
  }
}

Rules:
- If a field isn't present in the text, leave it as an empty string, false, or empty array — never invent data.
- "startMonth"/"endMonth" must be a full month name (e.g. "January") or "" if no month is given in the source text.
- "startYear"/"endYear" must be a 4-digit year as a string, or "" if not present.
- If the source text says a role or degree is current/ongoing (e.g. "Present", "Current"), set "currentlyWorking"/"currentlyStudying" to true and leave the corresponding end fields as "".
- "proficiency" should be one of "Basic", "Conversational", "Fluent", "Native" if inferable, otherwise "".
- "aboutMe" should be a short professional summary if one exists in the text, otherwise leave empty.
- "links" should capture any personal URLs found (e.g. portfolio, GitHub, LinkedIn), with "label" being a short name for the link (e.g. "LinkedIn", "Portfolio") and "url" the full URL. Leave the array empty if none are found.
- "references" should capture any listed referees with their available contact details. Leave the array empty if none are found — never invent a reference.
- Do not include fields not shown in the shape above.`;

// Detects a rate-limit / quota-exhausted response from either provider's
// error shape (HF uses e.status / e.response.status, Gemini's SDK error
// message usually contains "429" or "RESOURCE_EXHAUSTED").
function isRateLimitError(e) {
  const status = e?.status || e?.response?.status || e?.httpStatus;
  if (status === 429) return true;

  const message = String(e?.message || e);
  return /429|RESOURCE_EXHAUSTED|rate.?limit|quota/i.test(message);
}

// ── Provider 1: Hugging Face (tries all configured keys before giving up) ──
async function generateWithHuggingFace(imageBuffer) {
  let lastError = null;
  let allRateLimited = HF_KEYS.length > 0;

  for (let i = 0; i < HF_KEYS.length; i++) {
    try {
      const client = new InferenceClient(HF_KEYS[i]);
      const imageBlob = new Blob([imageBuffer], { type: "image/jpeg" });

      const resultBlob = await client.imageToImage({
        provider: "fal-ai",
        model: HF_MODEL,
        inputs: imageBlob,
        parameters: {
          prompt: PHOTO_PROMPT,
          guidance_scale: 2.5,
          resolution_mode: "match_input",
          num_inference_steps: 40,
        },
      });

      console.log(`[HuggingFace] Success using key ${i + 1}`);
      const arrayBuffer = await resultBlob.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (e) {
      const rateLimited = isRateLimitError(e);
      if (!rateLimited) allRateLimited = false;

      console.warn(
        `[HuggingFace] Key ${i + 1} failed${rateLimited ? " (rate limit / quota exhausted)" : ""}:`,
        e.message || e
      );
      lastError = e;
    }
  }

  if (lastError) lastError.allRateLimited = allRateLimited;
  throw lastError || new Error("All Hugging Face keys failed");
}

// ── Provider 2: Gemini (fallback — tries all configured keys before giving up) ──
async function generateWithGemini(imageBuffer) {
  let lastError = null;
  let allRateLimited = GEMINI_KEYS.length > 0;

  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_KEYS[i]);
      const model = genAI.getGenerativeModel({
        model: GEMINI_IMAGE_MODEL,
        generationConfig: {
          responseModalities: ["Text", "Image"],
        },
      });

      const result = await model.generateContent([
        { text: PHOTO_PROMPT },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBuffer.toString("base64"),
          },
        },
      ]);

      const parts = result.response.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((part) => part.inlineData);

      if (!imagePart) {
        throw new Error("Gemini response did not contain an image");
      }

      console.log(`[Gemini] Success using key ${i + 1}`);
      return Buffer.from(imagePart.inlineData.data, "base64");
    } catch (e) {
      const rateLimited = isRateLimitError(e);
      if (!rateLimited) allRateLimited = false;

      console.warn(
        `[Gemini] Key ${i + 1} failed${rateLimited ? " (rate limit / quota exhausted)" : ""}:`,
        e.message || e
      );
      lastError = e;
    }
  }

  // Gemini quota is per Google Cloud project, not per key — if all
  // 3 keys share one project, this will trip on the very first request
  // once that project's daily/per-minute quota is used up.
  if (lastError) lastError.allRateLimited = allRateLimited;
  throw lastError || new Error("All Gemini keys failed");
}

// Tries Hugging Face first, then falls back to Gemini only if every
// Hugging Face key fails (quota exhausted, outage, etc.).
export async function generatePhotoService(base64Image) {
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");

  let hfError = null;
  let geminiError = null;

  if (HF_KEYS.length > 0) {
    try {
      const buf = await generateWithHuggingFace(imageBuffer);
      return `data:image/png;base64,${buf.toString("base64")}`;
    } catch (e) {
      hfError = e;
      console.warn("[cv.service] All Hugging Face keys failed, falling back to Gemini:", e.message || e);
    }
  }

  if (GEMINI_KEYS.length > 0) {
    try {
      const buf = await generateWithGemini(imageBuffer);
      return `data:image/png;base64,${buf.toString("base64")}`;
    } catch (e) {
      geminiError = e;
    }
  }

  const combinedError = new Error("All configured image generation providers failed");
  combinedError.hfError = hfError;
  combinedError.geminiError = geminiError;
  combinedError.bothRateLimited =
    (!hfError || hfError.allRateLimited) && (!geminiError || geminiError.allRateLimited);
  throw combinedError;
}

// Turns the nested cvData object into plain text — cheaper on tokens
// and more reliable than making the model parse raw JSON.
function summarizeCvForPrompt(cvData) {
  const p = cvData.personal || {};
  const a = cvData.about || {};
  const e = cvData.experience || {};

  const lines = [];
  lines.push(`Name: ${p.fullName || "(not provided)"}`);
  lines.push(`Location: ${p.location || "(not provided)"}`);
  lines.push("");
  lines.push("About Me:");
  lines.push(a.aboutMe || "(empty)");
  lines.push("");
  lines.push(`Skills: ${(a.skills || []).join(", ") || "(none listed)"}`);
  lines.push(
    `Languages: ${(a.languages || [])
      .map((l) => (typeof l === "string" ? l : `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`))
      .join(", ") || "(none listed)"}`
  );
  lines.push(`Hobbies: ${(a.hobbies || []).join(", ") || "(none listed)"}`);
  lines.push("");
  lines.push("Work Experience:");
  if ((e.workExperience || []).length === 0) {
    lines.push("(none listed)");
  } else {
    e.workExperience.forEach((w, i) => {
      const start = [w.startMonth, w.startYear].filter(Boolean).join(" ") || "?";
      const end = w.currentlyWorking ? "present" : [w.endMonth, w.endYear].filter(Boolean).join(" ") || "?";
      lines.push(`${i + 1}. ${w.jobTitle || "?"} at ${w.company || "?"} (${start} - ${end})`);
      if (w.description) lines.push(`   ${w.description}`);
    });
  }
  lines.push("");
  lines.push("Education:");
  if ((e.education || []).length === 0) {
    lines.push("(none listed)");
  } else {
    e.education.forEach((ed, i) => {
      const end = ed.currentlyStudying ? "present" : ed.endYear || "?";
      lines.push(`${i + 1}. ${ed.degree || "?"} - ${ed.institution || "?"} (${ed.startYear || "?"} - ${end})`);
    });
  }

  return lines.join("\n");
}

async function generateJsonWithFallback(systemPrompt, userText, temperature) {
  let lastError = null;
  for (let i = 0; i < GEMINI_KEYS.length; i++) {
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_KEYS[i]);
      const model = genAI.getGenerativeModel({
        model: GEMINI_TEXT_MODEL,
        generationConfig: {
          responseMimeType: "application/json",
          temperature,
        },
      });

      const result = await model.generateContent([{ text: systemPrompt }, { text: userText }]);

      console.log(`Success using key ${i + 1}`);
      return result.response.text();
    } catch (e) {
      console.warn(`Key ${i + 1} failed: `, e);
      lastError = e;
    }
  }
  throw lastError || new Error("All keys failed");
}

export async function scoreCvService(cvData) {
  const cvText = summarizeCvForPrompt(cvData);
  const raw = await generateJsonWithFallback(SCORE_SYSTEM_PROMPT, `Here is the CV to review:\n\n${cvText}`, 0.4);

  const parsed = JSON.parse(raw);
  if (typeof parsed.score !== "number" || !Array.isArray(parsed.suggestions)) {
    const err = new Error("Scoring service returned incomplete data");
    err.badFormat = true;
    throw err;
  }
  return parsed;
}

export async function parseUploadedCvService(base64File) {
  const base64Data = base64File.replace(/^data:application\/pdf;base64,/, "");
  const pdfBuffer = Buffer.from(base64Data, "base64");

  const parser = new PDFParse({ data: pdfBuffer });
  const textResult = await parser.getText();
  await parser.destroy();
  const rawText = textResult.text?.trim();

  if (!rawText || rawText.length < 20) {
    const err = new Error("Could not read text from this PDF. It may be a scanned image rather than a text-based PDF.");
    err.unreadable = true;
    throw err;
  }

  const raw = await generateJsonWithFallback(PARSE_SYSTEM_PROMPT, `Here is the extracted PDF text:\n\n${rawText}`, 0.2);
  return JSON.parse(raw);
}
