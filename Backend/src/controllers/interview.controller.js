const pdfParse = require("pdf-parse")
const interviewReportModel = require("../models/interviewReport.model")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.services")

/**
 * Generate an interview report from the candidate's resume and target role.
 * A resume is optional when the candidate provides a self-description.
 */
async function generateInterViewReportController(req, res) {
    const { targetRole = "", selfDescription = "", jobDescription = "" } = req.body

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
            resumeText = resumeContent.text || ""
        } catch (error) {
            return res.status(400).json({
                message: "We couldn't read that PDF. Please upload a valid, text-based PDF."
            })
        }
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

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}
