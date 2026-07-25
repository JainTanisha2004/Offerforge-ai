import { useEffect, useState } from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useinterview";
import { useParams } from "react-router-dom";
//import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";
import { startMockInterview } from "../services/mockInterview.api";

import {
  FiCode,
  FiMessageCircle,
  FiMap,
  FiDownload,
  FiLogOut,
  FiHome,
  FiPlay
} from "react-icons/fi";



const NAV_ITEMS = [
  {
    id: "technical",
    label: "Technical",
    icon: <FiCode />,
  },
  {
    id: "behavioral",
    label: "Behavioral",
    icon: <FiMessageCircle />,
  },
  {
    id: "roadmap",
    label: "Roadmap",
    icon: <FiMap />,
  },
];

const QuestionCard = ({ item, index }) => {
  return (
    <div className="question-card">
      <div className="question-card__header">
        <div className="question-card__left">
          <div className="question-number">{index + 1}</div>

          <div className="question-content">
            <p>{item.question}</p>

            <div className="question-meta">
              <span>Interview Question</span>
            </div>
          </div>
        </div>
      </div>

      <div className="question-card__body">
        <div className="answer-box">
          <h5>Interviewer Intention</h5>
          <p>{item.intention}</p>
        </div>

        <div className="answer-box">
          <h5>Ideal Answer</h5>
          <p>{item.answer}</p>
        </div>
      </div>
    </div>
  );
};

const RoadmapDay = ({ day }) => (
  <div className="roadmap-card">
    <div className="timeline-dot"></div>

    <div className="roadmap-content">
      <div className="roadmap-header">
        <span>Day {day.day}</span>

        <h3>{day.focus}</h3>
      </div>

      <ul>
        {day.tasks.map((task, i) => (
          <li key={i}>{task}</li>
        ))}
      </ul>
    </div>
  </div>
);

const Interview = () => {
  const navigate = useNavigate();
const { handleLogout } = useAuth();
  const [activeNav, setActiveNav] = useState("technical");

  const { report, loading, getReportById, getResumePdf } = useInterview();

  const { interviewId } = useParams();

  const goHome = () => {
  navigate("/");
};

  const startInterview = async () => {
    try {
      const { sessionId } = await startMockInterview(interviewId);
      navigate(`/interview/session/${sessionId}`);
    } catch (error) {
      console.error("Unable to start mock interview", error);
      alert(error.response?.data?.message || "Unable to start mock interview.");
    }
  };

  const logoutUser = async () => {
  try {
    await handleLogout();
    navigate("/login", { replace: true });
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId, getReportById]);

  if (loading) {
    return <main className="loading-screen">Loading Interview Plan...</main>;
  }

  if (!report) {
    return <main className="loading-screen">No Interview Report Found</main>;
  }

  return (
    <div className="interview-page">
      <div className="layout">
        {/* LEFT */}

        <aside className="sidebar">
          <div className="sidebar-top">

             <button
    className="home-btn"
    onClick={goHome}
  >
    <FiHome />
    Home
  </button>
            <button className="logout-btn" onClick={logoutUser}>
              <FiLogOut />
              Logout
            </button>
          </div>

          <div>
            <h5>Navigation</h5>

            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={activeNav === item.id ? "nav-btn active" : "nav-btn"}
                onClick={() => setActiveNav(item.id)}
              >
                {item.icon}

                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              getResumePdf(interviewId);
            }}
            className="download-btn"
          >
            <FiDownload />
            Download Resume
          </button>

          <button
  className="mock-btn"
  onClick={startInterview}
>
  <FiPlay />
  Start AI Mock Interview
</button>

<button
  className="history-btn"
  onClick={() => navigate("/interview-history")}
>
  Mock Interview History
</button>
        </aside>

        {/* CENTER */}

        <main className="content">
          {activeNav === "technical" && (
            <>
              <div className="section-header">
                <div className="section-header-left">
                  <h2>Technical Questions</h2>

                  <p>
                    Important interview questions generated from your resume and
                    job description.
                  </p>
                </div>

                <span>{report.technicalQuestions.length} Questions</span>
              </div>

              <div className="questions">
                {report.technicalQuestions.map((item, index) => (
                  <QuestionCard key={index} item={item} index={index} />
                ))}
              </div>
            </>
          )}

          {activeNav === "behavioral" && (
            <>
              <div className="section-header">
                <h2>Behavioral Questions</h2>

                <span>{report.behavioralQuestions.length} Questions</span>
              </div>

              <div className="questions">
                {report.behavioralQuestions.map((item, index) => (
                  <QuestionCard key={index} item={item} index={index} />
                ))}
              </div>
            </>
          )}

          {activeNav === "roadmap" && (
            <>
              <div className="section-header">
                <h2>Preparation Roadmap</h2>

                <span>{report.preparationPlan.length} Days</span>
              </div>

              {report.preparationPlan.map((day) => (
                <RoadmapDay key={day.day} day={day} />
              ))}
            </>
          )}
        </main>

        {/* RIGHT */}

        <aside className="right-panel">
          <div className="score-card">
            <p>Match Score</p>

            <div className="score-circle">
              {report.matchScore}

              <small>%</small>
            </div>
          </div>

          <div className="skills-card">
            <h4>Skill Gaps</h4>

            <div className="skills">
              {report.skillGaps.map((gap, index) => (
                <span key={index} className={gap.severity}>
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Interview;
