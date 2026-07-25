import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../style/interviewReview.scss";

import ReviewQuestionCard from "../components/ReviewQuestionCard";
import { getMockInterviewSession } from "../services/mockInterview.api";

const InterviewReview = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await getMockInterviewSession(sessionId);
        setSession(data.session);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="review-loading">
        <h2>Loading Interview Review...</h2>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="review-loading">
        <h2>Interview not found.</h2>
      </div>
    );
  }

  const evaluatedQuestions = session.questions.filter(
  (q) => q.feedback && typeof q.feedback.score === "number"
);

const bestQuestion =
  evaluatedQuestions.length > 0
    ? evaluatedQuestions.reduce((best, current) =>
        current.feedback.score > best.feedback.score ? current : best
      )
    : null;

const weakestQuestion =
  evaluatedQuestions.length > 0
    ? evaluatedQuestions.reduce((worst, current) =>
        current.feedback.score < worst.feedback.score ? current : worst
      )
    : null;

  return (
    <div className="review-page">

      <div className="review-top">

        <div>
          <h1>AI Mock Interview Review</h1>

<p>
  Review your answers, AI feedback, strengths, and areas for improvement from your completed interview.
</p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/interview-history")}
        >
          Back to History
        </button>

      </div>

      <div className="review-summary">

  <div className="summary-card review-summary-card">
    <h4>Overall Score</h4>
    <span>{session.overallScore}/10</span>
  </div>

  <div className="summary-card review-summary-card">
    <h4>Status</h4>
    <span>{session.status}</span>
  </div>

  <div className="summary-card review-summary-card">
    <h4>Total Questions</h4>
    <span>{session.totalQuestions}</span>
  </div>

  <div className="summary-card review-summary-card">
    <h4>Completed On</h4>
    <span>
      {new Date(session.completedAt).toLocaleDateString()}
    </span>
  </div>

</div>

<div className="review-insights">

  {bestQuestion && (
    <div className="insight-card success">
      <h4>🏆 Best Answer</h4>

      <p>{bestQuestion.question}</p>

      <span>{bestQuestion.feedback.score}/10</span>
    </div>
  )}

  {weakestQuestion && (
    <div className="insight-card warning">
      <h4>📈 Needs Improvement</h4>

      <p>{weakestQuestion.question}</p>

      <span>{weakestQuestion.feedback.score}/10</span>
    </div>
  )}

</div>

      <div className="review-list">
        {session.questions.map((question, index) => (
          <ReviewQuestionCard
            key={index}
            question={question}
            index={index}
          />
        ))}
      </div>

    </div>
  );
};

export default InterviewReview;
