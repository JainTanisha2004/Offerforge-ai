import { FiSend, FiTrash2 } from "react-icons/fi";

const AnswerEditor = ({
  answer,
  setAnswer,
  onSubmit,
}) => {
  const wordCount = answer.trim()
    ? answer.trim().split(/\s+/).length
    : 0;

  return (
    <div className="answer-editor">

      <textarea
        placeholder="Start typing your answer...

Explain your thought process, implementation, examples and best practices."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <div className="editor-footer">

        <div className="editor-info">
          <span>{wordCount} words</span>

          <span>{answer.length} characters</span>
        </div>

        <div className="editor-actions">

          <button
            className="clear-btn"
            onClick={() => setAnswer("")}
          >
            <FiTrash2 />
            Clear
          </button>

          <button
            className="submit-btn"
            onClick={onSubmit}
          >
            <FiSend />
            Submit Answer
          </button>

        </div>

      </div>

    </div>
  );
};

export default AnswerEditor;