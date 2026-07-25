const mongoose = require("mongoose");

const interviewAnswerSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true,
    },

    questionIndex: {
      type: Number,
      required: true,
    },

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

    candidateAnswer: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      default: 0,
    },

    strengths: [
      {
        type: String,
      },
    ],

    weaknesses: [
      {
        type: String,
      },
    ],

    idealAnswer: {
      type: String,
      default: "",
    },

    feedback: {
      type: String,
      default: "",
    },

    timeTaken: {
      type: Number, // in seconds
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "InterviewAnswer",
  interviewAnswerSchema
);