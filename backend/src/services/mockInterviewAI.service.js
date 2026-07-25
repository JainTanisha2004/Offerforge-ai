const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

// =========================================
// ZOD SCHEMA
// =========================================

const interviewQuestionSchema = z.object({
  question: z.string(),
  category: z.literal("Technical"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  intention: z.string(),
});

const mockInterviewSchema = z.array(interviewQuestionSchema).length(5);

const evaluationSchema = z.object({
  score: z.number().min(0).max(10),

  strengths: z.array(z.string()).min(1),

  weaknesses: z.array(z.string()).min(1),

  idealAnswer: z.string(),
});

// =========================================
// MODELS
// =========================================

const MODEL_CANDIDATES = [
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-flash-lite-latest",
  "gemini-flash-latest",
];

// =========================================
// RESPONSE SCHEMA
// =========================================

function buildResponseSchema() {
  const schema = zodToJsonSchema(mockInterviewSchema, {
    $refStrategy: "none",
    target: "openApi3",
  });

  delete schema.$schema;
  delete schema.additionalProperties;

  return schema;
}

// =========================================
// ERROR HANDLER
// =========================================

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

// =========================================
// GEMINI CALL
// =========================================

// async function callModel(model, prompt, responseSchema) {
//   const response = await ai.models.generateContent({
//     model,
//     contents: prompt,
//     config: {
//       responseMimeType: "application/json",
//       responseSchema,
//     },
//   });

//   const text = response?.text;

//   if (!text) {
//     throw new Error("AI returned an empty response.");
//   }

//   let parsed;

//   try {
//     parsed = JSON.parse(text);
//   } catch {
//     throw new Error("AI returned invalid JSON.");
//   }

//   const validated = mockInterviewSchema.safeParse(parsed);

//   if (!validated.success) {
//     throw new Error("AI response did not match expected format.");
//   }

//   return validated.data;
// }

async function callModel(
  model,
  prompt,
  responseSchema,
  validationSchema
) {
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
    throw new Error("AI returned an empty response.");
  }

  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("AI returned invalid JSON.");
  }

  const validated = validationSchema.safeParse(parsed);

  if (!validated.success) {
    throw new Error("AI response did not match expected format.");
  }

  return validated.data;
}

// =========================================
// MAIN FUNCTION
// =========================================

async function generateMockInterviewQuestions({
  resume,
  selfDescription,
  jobDescription,
  existingQuestions = [],
}) {
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    throw new Error("GOOGLE_GENAI_API_KEY is not configured");
  }

  const existingQuestionText =
    existingQuestions.length > 0
      ? existingQuestions
          .map((q, i) => `${i + 1}. ${q.question}`)
          .join("\n")
      : "None";

  const prompt = `
You are a Senior Software Engineering Interviewer.

Generate a realistic AI Mock Interview.

Candidate Resume:

${resume || "Not Provided"}

----------------------------------------

Self Description:

${selfDescription || "Not Provided"}

----------------------------------------

Job Description:

${jobDescription}

----------------------------------------

Already Generated ATS Questions:

${existingQuestionText}

----------------------------------------

Instructions:

1. Generate EXACTLY 5 interview questions.

2. ALL questions must be Technical.

3. DO NOT repeat any question listed above.

4. Questions should test practical understanding.

5. Questions should be tailored to the resume and job description.

6. Difficulty progression:

Question 1 → Easy

Question 2 → Easy

Question 3 → Medium

Question 4 → Medium

Question 5 → Hard

7. Include a short intention for every question.

8. Do NOT generate answers.

9. Do NOT generate markdown.

10. Return ONLY valid JSON.
`;

  const responseSchema = buildResponseSchema();

  const errors = [];

  for (const model of MODEL_CANDIDATES) {
    try {
      // return await callModel(model, prompt, responseSchema);
      return await callModel(
  model,
  prompt,
  responseSchema,
  mockInterviewSchema
);
    } catch (error) {
      const message = extractErrorMessage(error);

      errors.push(`${model}: ${message}`);

      console.error(`${model} failed -> ${message}`);

      if (/api key|permission|unauthenticated|401|403/i.test(message)) {
        break;
      }
    }
  }

  throw new Error(
    errors[errors.length - 1] ||
      "Failed to generate interview questions."
  );
}

async function evaluateInterviewAnswer({
  question,
  intention,
  candidateAnswer,
}) {
  const responseSchema = zodToJsonSchema(evaluationSchema, {
    $refStrategy: "none",
    target: "openApi3",
  });

  const prompt = `
You are a Senior Software Engineer conducting a technical interview.

Question:
${question}

Interviewer Intention:
${intention}

Candidate Answer:
${candidateAnswer}

Evaluate the answer objectively.

Instructions:

1. Give a score from 0 to 10.
2. Mention 2-4 strengths.
3. Mention 2-4 weaknesses.
4. Provide an ideal interview answer.
5. Return ONLY valid JSON.
`;

  const errors = [];

  for (const model of MODEL_CANDIDATES) {
    try {
      return await callModel(
        model,
        prompt,
        responseSchema,
        evaluationSchema
      );
    } catch (error) {
      const message = extractErrorMessage(error);

      errors.push(`${model}: ${message}`);

      console.error(`${model} failed -> ${message}`);

      if (/api key|permission|unauthenticated|401|403/i.test(message)) {
        break;
      }
    }
  }

  throw new Error(
    errors[errors.length - 1] ||
      "Failed to evaluate interview answer."
  );
}

module.exports = {
  generateMockInterviewQuestions,
  evaluateInterviewAnswer
};