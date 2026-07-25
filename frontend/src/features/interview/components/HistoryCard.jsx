import { FiCalendar, FiBarChart2, FiFileText, FiArrowRight } from "react-icons/fi";

const HistoryCard = ({ interview, onView }) => {
  return (
    <div className="history-card">
      <div className="history-card__header">
        <h3>{interview.title}</h3>

        <span className="status completed">
          {interview.status}
        </span>
      </div>

      <div className="history-card__body">
        <div className="history-item">
          <FiBarChart2 />
          <span>
            <strong>Overall Score:</strong> {interview.overallScore}/10
          </span>
        </div>

        <div className="history-item">
          <FiFileText />
          <span>
            <strong>Questions:</strong> {interview.totalQuestions}
          </span>
        </div>

        <div className="history-item">
          <FiCalendar />
          <span>
            <strong>Completed:</strong>{" "}
            {new Date(interview.completedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="history-card__footer">
        <button
          className="view-btn"
          onClick={() => onView(interview.sessionId)}
        >
          View Details
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
};

export default HistoryCard;