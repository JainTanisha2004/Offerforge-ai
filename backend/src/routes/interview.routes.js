const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const interviewRouter = express.Router();
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middleware");

function handleUpload(req, res, next) {
  upload.single("resume")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        message: err.message || "File upload failed",
      });
    }
    next();
  });
}

interviewRouter.post(
  "/",
  authMiddleware.authUser,
  handleUpload,
  interviewController.generateInterviewReportController
);

interviewRouter.get(
  "/report/:interviewId",
  authMiddleware.authUser,
  interviewController.getInterviewReportByIdController
);

interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportsController
);

interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser,interviewController.generateResumePdfController);

module.exports = interviewRouter;
