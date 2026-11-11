const pdfParse = require("pdf-parse")
const interviewReportModel = require("../models/interviewReport.model")
const { generateInterviewReport, generateResumePdf, evaluatePracticeAnswer } = require("../services/ai.services")

/**
 * Generate an interview report from the candidate's resume and target role.
 * A resume is optional when the candidate provides a self-description.
 */
async function generateInterViewReportController(req, res) {
    const { targetRole = "", selfDescription = "", jobDescription = "" } = req.body || ""

    if (typeof targetRole !== "string" || typeof selfDescription !== "string" || typeof jobDescription !== "string") {
        return res.status(400).json({ message: "Target role, self-description and job description must be text." })
    }

    if (!jobDescription.trim()) {
        return res.status(400).json({ message: "Job description is required." })
    }

    if (!req.file && !selfDescription.trim()) {
        return res.status(400).json({
            message: "Upload a PDF resume or provide a self-description."
        })
    }

    let resumeText = ""
    if (req.file) {
        try {
            const resumeContent = await new pdfParse.PDFParse(
                Uint8Array.from(req.file.buffer)
            ).getText()
            resumeText = (resumeContent.text || "").trim()
            if (!resumeText) {
                return res.status(400).json({ message: "This PDF contains no readable text. Please upload a text-based PDF or provide a self-description." })
            }
        } catch (error) {
            return res.status(400).json({
                message: "We couldn't read that PDF. Please upload a valid, text-based PDF."
            })
        }
    }

    if (resumeText.length > 30000 || selfDescription.length > 10000 || jobDescription.length > 20000) {
        return res.status(400).json({ message: "Your resume or description is too long. Please shorten the text and try again." })
    }

    const generatedReport = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        targetRole,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeText,
        selfDescription,
        jobDescription,
        ...generatedReport,
        // The schema requires a title; keep a safe fallback if AI omits it.
        title: generatedReport.title?.trim() || targetRole.trim() || "Interview preparation"
    })

    return res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })
}

/**
 * Get one report belonging to the authenticated user.
 */
async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params
    const interviewReport = await interviewReportModel.findOne({
        _id: interviewId,
        user: req.user.id
    })

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." })
    }

    return res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}

/**
 * Get all reports belonging to the authenticated user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel
        .find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    return res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

/**
 * Generate a tailored resume PDF only from the authenticated user's report.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params
    const interviewReport = await interviewReportModel.findOne({
        _id: interviewReportId,
        user: req.user.id
    })

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." })
    }

    const { resume, jobDescription, selfDescription } = interviewReport
    const pdfBuffer = await generateResumePdf({
        resume,
        jobDescription,
        selfDescription
    })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="orbitprep_resume_${interviewReportId}.pdf"`
    })

    return res.send(pdfBuffer)
}



/**
 * Evaluate a candidate's written answer with Gemini.
 */
async function evaluatePracticeAnswerController(req, res) {
    const { question, intention = "", answer = "", targetRole = "" } = req.body || {}

    if (typeof question !== "string" || !question.trim()) {
        return res.status(400).json({ message: "Interview question is required." })
    }
    if (typeof answer !== "string" || !answer.trim()) {
        return res.status(400).json({ message: "Write your answer before requesting feedback." })
    }
    if (answer.length > 8000) {
        return res.status(400).json({ message: "Please keep your answer under 8,000 characters." })
    }

    const evaluation = await evaluatePracticeAnswer({
        question: question.trim(),
        intention: typeof intention === "string" ? intention.trim() : "",
        answer: answer.trim(),
        targetRole: typeof targetRole === "string" ? targetRole.trim() : ""
    })

    return res.status(200).json({
        message: "Your answer has been evaluated.",
        evaluation
    })
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,
    evaluatePracticeAnswerController
}
