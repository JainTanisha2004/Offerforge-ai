const mongoose = require("mongoose");

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewReport",
      required: true,
    },

    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    currentQuestion: {
      type: Number,
      default: 0,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },
   questions: [
  {
    question: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "Technical",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },

    intention: {
      type: String,
      default: "",
    },

    // Candidate's submitted answer
    candidateAnswer: {
      type: String,
      default: "",
    },

    // AI evaluation
    feedback: {
      score: {
        type: Number,
        default: 0,
      },

      strengths: {
        type: [String],
        default: [],
      },

      weaknesses: {
        type: [String],
        default: [],
      },

      idealAnswer: {
        type: String,
        default: "",
      },
    },
  },
],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "InterviewSession",
  interviewSessionSchema
);