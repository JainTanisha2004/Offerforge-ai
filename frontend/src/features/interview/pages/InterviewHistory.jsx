import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../style/interviewHistory.scss";

import HistoryCard from "../components/HistoryCard";

import { getInterviewHistory } from "../services/mockInterview.api";

const InterviewHistory = () => {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getInterviewHistory();

        setHistory(data.history);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleView = (sessionId) => {
  navigate(`/interview-review/${sessionId}`);
};

  if (loading) {
    return (
      <div className="history-loading">
        <h2>Loading Interview History...</h2>
      </div>
    );
  }

  return (
    <div className="history-page">

      <div className="history-header">

        <h1>AI Mock Interview History</h1>

        <p>
          Review all your completed AI mock interviews.
        </p>

      </div>

      {history.length === 0 ? (
        <div className="empty-history">
          <h2>No interviews completed yet.</h2>

          <button onClick={() => navigate("/")}>
            Go Home
          </button>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((interview) => (
            <HistoryCard
              key={interview.sessionId}
              interview={interview}
              onView={handleView}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default InterviewHistory;