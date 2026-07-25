//import "./../style/mockInterview.scss";

const InterviewSidebar = ({
  totalQuestions = 10,
  currentQuestion = 0,
}) => {
  return (
    <aside className="interview-sidebar">
      <h3>Interview Progress</h3>

      <div className="progress-list">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          let status = "pending";

          if (index < currentQuestion) {
            status = "completed";
          } else if (index === currentQuestion) {
            status = "current";
          }

          return (
            <div
              key={index}
              className={`progress-item ${status}`}
            >
              <span className="dot"></span>

              <span className="label">
                Question {index + 1}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default InterviewSidebar;