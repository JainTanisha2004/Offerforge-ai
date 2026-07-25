const QuestionPanel = ({
  question,
  category = "Technical",
  difficulty = "Medium",
}) => {
  return (
    <div className="question-panel">

      <div className="question-top">

        <span className="category-badge">
          {category}
        </span>

        <span className={`difficulty-badge ${difficulty.toLowerCase()}`}>
          {difficulty}
        </span>

      </div>

      <h2 className="question-title">
        {question}
      </h2>

    </div>
  );
};

export default QuestionPanel;