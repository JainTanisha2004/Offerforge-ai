const express = require("express");
const { authUser } = require("../middlewares/auth.middleware");
const mockInterviewController = require("../controllers/mockInterview.controller");

const router = express.Router();

// Start Mock Interview
router.post(
  "/start/:reportId",
  authUser,
  mockInterviewController.startInterview
);

// Evaluate Answer
router.post(
  "/evaluate/:sessionId",
  authUser,
  mockInterviewController.evaluateAnswer
);

// Complete Interview
router.post(
  "/complete/:sessionId",
  authUser,
  mockInterviewController.completeInterview
);

// Interview History
router.get(
  "/history",
  authUser,
  mockInterviewController.getInterviewHistory
);

// Get Interview Session
router.get(
  "/session/:sessionId",
  authUser,
  mockInterviewController.getInterviewSession
);

module.exports = router;