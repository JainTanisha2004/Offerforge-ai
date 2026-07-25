import { FiCheckCircle, FiAlertCircle, FiArrowRight } from "react-icons/fi";

const FeedbackPanel = ({ feedback, onNext }) => {
  return (
    <div className="feedback-panel">

      <div className="feedback-score">

        <h2>AI Evaluation</h2>

        <div className="score-circle">
          <span>{feedback.score}</span>
          <small>/10</small>
        </div>

      </div>

      <div className="feedback-card">

        <h3>
          <FiCheckCircle />
          Strengths
        </h3>

        <ul>
          {feedback.strengths.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

      </div>

      <div className="feedback-card warning">

        <h3>
          <FiAlertCircle />
          Areas to Improve
        </h3>

        <ul>
          {feedback.weaknesses.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

      </div>

      <div className="feedback-card">

        <h3>Ideal Answer</h3>

        <p>{feedback.idealAnswer}</p>

      </div>

      <div>
  <button
        className="next-btn"
        onClick={onNext}
      >
        Next Question
        <FiArrowRight />
      </button>
</div>

    </div>

    
  );
};

export default FeedbackPanel;