
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});


// INTERVIEW REPORT SCHEMA

const interviewReportSchema = z.object({

    matchScore: z.number()
        .min(0)
        .max(100)
        .describe("Candidate job match score between 0 and 100"),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ).min(5).describe("At least 5 relevant technical interview questions with detailed answers and interviewer intentions"),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ).min(5).describe("At least 5 behavioral interview questions with detailed answers and interviewer intentions"),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"])
        })
    ).min(5).describe("At least 5 relevant skill gaps with their severity"),

    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string()).min(2)
        })
    ).min(7).describe("A 7-day interview preparation plan with at least 2 tasks per day"),

    title: z.string().describe("The job title for which the interview report is generated")

});


// GENERATE INTERVIEW REPORT

async function generateInterviewReport({
    resume,
    selfDescription,
    targetRole,
    jobDescription
}) {

    const prompt = `
You are an expert technical interviewer and career preparation assistant.

Analyze the candidate's resume, self-description and target job description.

CANDIDATE RESUME:
${resume}

CANDIDATE SELF DESCRIPTION:
${selfDescription}

TARGET ROLE:
${targetRole || "Infer the role from the job description"}

TARGET JOB DESCRIPTION:
${jobDescription}

Generate a complete and detailed interview preparation report.

FOLLOW THESE REQUIREMENTS STRICTLY:

1. MATCH SCORE:
Generate a realistic score between 0 and 100 based on the candidate's skills, experience and job requirements.

2. TECHNICAL QUESTIONS:
Generate at least 5 technical interview questions relevant to the target job.
For every question provide:
- question: The interview question.
- intention: What the interviewer wants to evaluate.
- answer: A clear and detailed sample answer.

3. BEHAVIORAL QUESTIONS:
Generate at least 5 behavioral interview questions.
For every question provide:
- question
- intention
- answer

4. SKILL GAPS:
Identify at least 5 skills the candidate needs to improve.
For every skill provide:
- skill
- severity: low, medium or high.

5. PREPARATION PLAN:
Create a complete 7-day preparation plan.
Every day must contain:
- day: Day number from 1 to 7.
- focus: Main topic for that day.
- tasks: At least 2 practical tasks.

6. JOB TITLE:
Use the supplied target role when present; otherwise identify the target job title from the job description.
If no exact title is mentioned, infer a suitable title.
Never return an empty title.

IMPORTANT:
- Do not return empty arrays.
- Do not generate generic or repetitive questions.
- Make all content relevant to the candidate's actual profile and target job.
- Provide practical answers suitable for a real job interview.
- Do not invent experience or qualifications that are absent from the resume.
- Follow the required JSON schema exactly.
`;

    const response = await ai.models.generateContent({

        model: "gemini-3-flash-preview",

        contents: prompt,

        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema)
        }

    });

    const result = JSON.parse(response.text);

    // Validate AI-generated response
    const validatedReport = interviewReportSchema.parse(result);

    return validatedReport;
}



// GENERATE PDF FROM HTML

async function generatePdfFromHtml(htmlContent) {

    const browser = await puppeteer.launch();

    try {

        const page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: "networkidle0"
        });

        const pdfBuffer = await page.pdf({

            format: "A4",

            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            }

        });

        return pdfBuffer;

    } finally {

        await browser.close();

    }

}



// GENERATE TAILORED RESUME PDF

async function generateResumePdf({
    resume,
    selfDescription,
    jobDescription
}) {

    const resumePdfSchema = z.object({
        html: z.string()
    });

    const prompt = `
Generate a professional, ATS-friendly resume using the following details.

CANDIDATE RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

REQUIREMENTS:

1. Tailor the resume to the target job.
2. Highlight relevant skills, projects and experience.
3. Do not invent qualifications, experience or achievements.
4. Use a clean and professional design.
5. Keep the resume approximately 1-2 pages.
6. Use readable fonts and proper headings.
7. Make the HTML ATS-friendly.
8. Return valid HTML inside a JSON object with one field named "html".
`;

    const response = await ai.models.generateContent({

        model: "gemini-3-flash-preview",

        contents: prompt,

        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema)
        }

    });

    const jsonContent = JSON.parse(response.text);

    const validatedContent = resumePdfSchema.parse(jsonContent);

    const pdfBuffer = await generatePdfFromHtml(
        validatedContent.html
    );

    return pdfBuffer;

}



async function evaluatePracticeAnswer({ question, intention, answer, targetRole }) {
    const evaluationSchema = z.object({
        score: z.number().min(0).max(100),
        strengths: z.array(z.string()).min(1),
        improvements: z.array(z.string()).min(1),
        sampleAnswer: z.string(),
        summary: z.string()
    });

    const prompt = `
You are a supportive but honest interview coach.
Target role: ${targetRole || "the role described in the question"}.
Question: ${question}
Interviewer intention: ${intention || "Assess relevance, clarity, correctness and communication."}
Candidate answer: ${answer}

Return JSON:
- score: integer 0-100 for correctness, relevance, clarity and completeness.
- strengths: 1-4 specific things done well.
- improvements: 1-4 actionable improvements.
- sampleAnswer: concise stronger example; never invent personal experience, use placeholders for personal examples.
- summary: one encouraging but honest sentence.
Do not reward length alone. Score empty or irrelevant answers low.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(evaluationSchema)
        }
    });

    return evaluationSchema.parse(JSON.parse(response.text));
}

module.exports = {
    generateInterviewReport,
    generateResumePdf,
    evaluatePracticeAnswer
};
