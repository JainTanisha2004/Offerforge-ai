const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer=require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const questionSchema = z.object({
  question: z.string(),
  intention: z.string(),
  answer: z.string(),
});

const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100),
  technicalQuestions: z.array(questionSchema).min(1),
  behavioralQuestions: z.array(questionSchema).min(1),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),
  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()).min(1),
    })
  ).min(1),
  title: z.string(),
});

const MODEL_CANDIDATES = [
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-flash-lite-latest",
  "gemini-flash-latest",
];

function buildResponseSchema() {
  const schema = zodToJsonSchema(interviewReportSchema, {
    $refStrategy: "none",
    target: "openApi3",
  });

  delete schema.$schema;
  delete schema.additionalProperties;

  return schema;
}

function extractErrorMessage(error) {
  const nested =
    error?.error?.message ||
    error?.message ||
    (typeof error === "string" ? error : null);

  if (!nested) return "AI generation failed";

  if (/quota|rate limit|resource_exhausted|429/i.test(nested)) {
    return "Gemini API quota exceeded. Please wait a minute and try again.";
  }

  if (/api key|permission|unauthenticated|401|403/i.test(nested)) {
    return "Gemini API key is invalid or missing permissions.";
  }

  return nested;
}

async function callModel(model, prompt, responseSchema) {
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const text = response?.text;
  if (!text) {
    throw new Error("AI returned an empty response");
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  const validated = interviewReportSchema.safeParse(parsed);
  if (!validated.success) {
    throw new Error("AI response did not match the expected report format");
  }

  return validated.data;
}

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    throw new Error("GOOGLE_GENAI_API_KEY is not configured");
  }

  const prompt = `Generate a detailed interview preparation report as JSON for this candidate.

Resume:
${resume || "Not provided"}

Self Description:
${selfDescription || "Not provided"}

Job Description:
${jobDescription}

Include realistic technical questions, behavioral questions, skill gaps, a day-wise preparation plan, a matchScore from 0-100, and a short job title.`;

  const responseSchema = buildResponseSchema();
  const errors = [];

  for (const model of MODEL_CANDIDATES) {
    try {
      return await callModel(model, prompt, responseSchema);
    } catch (error) {
      const message = extractErrorMessage(error);
      errors.push(`${model}: ${message}`);
      console.error(`Model ${model} failed:`, message);

      // Try next model on quota/model errors; stop on auth issues
      if (/api key|permission|unauthenticated|401|403/i.test(message)) {
        break;
      }
    }
  }

  throw new Error(
    errors[errors.length - 1] ||
      "Failed to generate interview report with available AI models"
  );
}

async function generatePdfFromHtml(htmlContent){
  const browser = await puppeteer.launch({
    headless: true,
    // Required by Chromium in restricted container environments such as Render.
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    return pdfBuffer
  } finally {
    await browser.close();
  }
}

async function generateResumePDF({resume,selfDescription, jobDescription}){
  const resumePdfSchema=z.object({
    html: z.string().describe("The HTML content of the resume which can be converted to pdf using any library like puppeteer")
  })

  const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.`

   const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })    
    
    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}

module.exports = {generateInterviewReport, generateResumePDF};
