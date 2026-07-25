import { FiClock } from "react-icons/fi";

const InterviewHeader = ({
  currentQuestion,
  totalQuestions,
  time = "00:00",
}) => {
  return (
    <div className="interview-header">

      <div className="header-left">
        <h1>AI Mock Interview</h1>

        <p>
          Question {currentQuestion + 1} of {totalQuestions}
        </p>
      </div>

      <div className="header-right">

        <div className="timer">
          <FiClock />

          <span>{time}</span>
        </div>

      </div>

    </div>
  );
};

export default InterviewHeader;