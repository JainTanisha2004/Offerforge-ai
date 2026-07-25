import { useLocation, useNavigate } from "react-router-dom";
import "../style/interviewSummary.scss";

const InterviewSummary = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="summary-page">
        <h2>No interview summary found.</h2>

        <button onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

  const {
    overallScore,
    totalQuestions,
    completedAt,
    questions,
  } = state;

  const strongest =
    [...questions].sort(
      (a, b) => b.feedback.score - a.feedback.score
    )[0];

  const weakest =
    [...questions].sort(
      (a, b) => a.feedback.score - b.feedback.score
    )[0];

  return (
    <div className="summary-page">
      <div className="summary-card interview-summary-card">

        <h1>🎉 Interview Completed</h1>

        <p>
          Great job completing your AI Mock Interview.
        </p>

        <div className="overall-score">
          <span>{overallScore}</span>
          <small>/10</small>
        </div>

        <div className="summary-info">

          <div>
            <h4>Total Questions</h4>
            <p>{totalQuestions}</p>
          </div>

          <div>
            <h4>Completed At</h4>
            <p>{new Date(completedAt).toLocaleString()}</p>
          </div>

        </div>

        <h2>Question Scores</h2>

        <div className="question-list">
          {questions.map((q, index) => (
            <div
              className="question-score"
              key={index}
            >
              <span>
                Question {index + 1}
              </span>

              <strong>
                {q.feedback.score}/10
              </strong>
            </div>
          ))}
        </div>

        <div className="best-worst">

          <div className="best">
            <h3>🏆 Strongest Answer</h3>

            <p>{strongest.question}</p>

            <strong>{strongest.feedback.score}/10</strong>
          </div>

          <div className="worst">
            <h3>📈 Needs Improvement</h3>

            <p>{weakest.question}</p>

            <strong>{weakest.feedback.score}/10</strong>
          </div>

        </div>

        <div className="summary-actions">

          <button
            onClick={() => navigate("/")}
          >
            Go Home
          </button>

        </div>

      </div>
    </div>
  );
};

export default InterviewSummary;
