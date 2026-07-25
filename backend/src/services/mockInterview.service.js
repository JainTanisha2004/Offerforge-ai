const InterviewReport = require("../models/interviewReport.model");
const InterviewSession = require("../models/interviewSession.model");

const {
  generateMockInterviewQuestions,
  evaluateInterviewAnswer,
} = require("./mockInterviewAI.service");

exports.startInterview = async (userId, reportId) => {
  // Fetch report
  const report = await InterviewReport.findById(reportId);

  if (!report) {
    throw new Error("Interview report not found.");
  }

  // Verify ownership
  if (report.user.toString() !== userId) {
    throw new Error("You are not authorized to access this report.");
  }

  // Generate fresh interview questions
  const questions = await generateMockInterviewQuestions({
    resume: report.resume,
    selfDescription: report.selfDescription,
    jobDescription: report.jobDescription,
    existingQuestions: report.technicalQuestions,
  });

  // Create interview session
  const session = await InterviewSession.create({
    userId,
    reportId,
    status: "in_progress",
    totalQuestions: questions.length,
    currentQuestion: 0,
    questions,
  });

  return {
    success: true,
    message: "Mock interview started successfully.",
    sessionId: session._id,
    totalQuestions: questions.length,
    questions,
  };
};

exports.getInterviewSession = async (userId, sessionId) => {
  const session = await InterviewSession.findOne({ _id: sessionId, userId });

  if (!session) {
    throw new Error("Interview session not found.");
  }

  return session;
};

exports.evaluateAnswer = async (
  userId,
  sessionId,
  questionIndex,
  candidateAnswer
) => {
  const session = await InterviewSession.findOne({
    _id: sessionId,
    userId,
  });

  if (!session) {
    throw new Error("Interview session not found.");
  }

  if (questionIndex >= session.questions.length) {
    throw new Error("Invalid question index.");
  }

  const question = session.questions[questionIndex];

  const feedback = await evaluateInterviewAnswer({
    question: question.question,
    intention: question.intention,
    candidateAnswer,
  });

  // Save candidate answer
  question.candidateAnswer = candidateAnswer;

  // Save AI feedback
  question.feedback = feedback;

  await session.save();

  return {
    success: true,
    feedback,
  };
};

exports.completeInterview = async (userId, sessionId) => {
  const session = await InterviewSession.findOne({
    _id: sessionId,
    userId,
  });

  if (!session) {
    throw new Error("Interview session not found.");
  }

  if (session.status === "completed") {
    return {
      success: true,
      message: "Interview already completed.",
      overallScore: session.overallScore,
      totalQuestions: session.totalQuestions,
      completedAt: session.completedAt,
      questions: session.questions,
    };
  }

  // Calculate average score
  const totalScore = session.questions.reduce((sum, question) => {
    return sum + (question.feedback?.score || 0);
  }, 0);

  const overallScore =
    session.questions.length > 0
      ? Number((totalScore / session.questions.length).toFixed(1))
      : 0;

  // Update session
  session.overallScore = overallScore;
  session.status = "completed";
  session.completedAt = new Date();

  await session.save();

  return {
    success: true,
    message: "Interview completed successfully.",
    overallScore,
    totalQuestions: session.totalQuestions,
    completedAt: session.completedAt,
    questions: session.questions,
  };
};

exports.getInterviewHistory = async (userId) => {
  const sessions = await InterviewSession.find({
    userId,
    status: "completed",
  })
    .populate("reportId", "title")
    .sort({ completedAt: -1 });

  return sessions.map((session) => ({
    sessionId: session._id,

    reportId: session.reportId?._id,

    title: session.reportId?.title || "Mock Interview",

    overallScore: session.overallScore,

    totalQuestions: session.totalQuestions,

    completedAt: session.completedAt,

    status: session.status,
  }));
};