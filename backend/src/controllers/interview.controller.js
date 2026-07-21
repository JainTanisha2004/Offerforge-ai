const { PDFParse } = require("pdf-parse");
const mongoose = require("mongoose");
const {generateInterviewReport ,generateResumePDF}= require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({
                message: "Database is not connected. Please try again in a moment.",
            });
        }

        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription?.trim()) {
            return res.status(400).json({
                message: "Job description is required",
            });
        }

        if (!req.file && !selfDescription?.trim()) {
            return res.status(400).json({
                message: "Either resume or self description is required",
            });
        }

        let resumeText = "";

        if (req.file) {
            try {
                const parser = new PDFParse({ data: req.file.buffer });
                const resumeContent = await parser.getText();
                resumeText = resumeContent?.text || "";
                await parser.destroy();
            } catch (parseError) {
                console.error(parseError);
                return res.status(400).json({
                    message:
                        "Could not read the PDF. Please upload a valid PDF resume.",
                });
            }

            if (!resumeText.trim()) {
                return res.status(400).json({
                    message:
                        "The uploaded PDF has no readable text. Try another file or use self description.",
                });
            }
        }

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription,
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription,
            ...interviewReportByAi,
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport,
        });
    } catch (error) {
        console.error(error);

        const details = error?.message || "Unknown error";
        const isQuota = /quota|rate limit|resource_exhausted/i.test(details);
        const isDb = /mongo|econnrefused|querysrv|buffering timed out/i.test(
            details
        );

        res.status(isQuota ? 429 : isDb ? 503 : 500).json({
            message: isQuota
                ? "Gemini API quota exceeded. Please wait a minute and try again."
                : isDb
                  ? "Database connection failed. Please try again."
                  : details || "Failed to generate interview report",
            error: details,
        });
    }
}

async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(interviewId)) {
            return res.status(400).json({
                message: "Invalid interview report id",
            });
        }

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id,
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found",
            });
        }

        res.status(200).json({
            message: "Interview report fetched successfully",
            interviewReport,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch interview report",
            error: error.message,
        });
    }
}

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({
                user: req.user.id,
            })
            .sort({ createdAt: -1 })
            .select(
                "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan"
            );

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch interview reports",
            error: error.message,
        });
    }
}

async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePDF({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
};
