import {
  FiCheckCircle,
  FiAlertCircle,
  FiStar,
} from "react-icons/fi";

const ReviewQuestionCard = ({ question, index }) => {
  return (
    <div className="review-card">

      <div className="review-header">

        <div>
          <span className="question-number">
            Question {index + 1}
          </span>

          <h3>{question.question}</h3>
        </div>

        <div className="review-score">
          <FiStar />
          <span>{question.feedback.score}/10</span>
        </div>

      </div>

      <div className="review-section">

        <h4>Your Answer</h4>

        <p>{question.candidateAnswer}</p>

      </div>

      <div className="review-section">

        <h4>
          <FiCheckCircle />
          Strengths
        </h4>

        <ul>
          {question.feedback.strengths.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

      </div>

      <div className="review-section warning">

        <h4>
          <FiAlertCircle />
          Areas to Improve
        </h4>

        <ul>
          {question.feedback.weaknesses.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

      </div>

      <div className="review-section">

        <h4>Ideal Answer</h4>

        <p>{question.feedback.idealAnswer}</p>

      </div>

    </div>
  );
};

export default ReviewQuestionCard;