import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
//import { FiUploadCloud } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import { useInterview } from "../hooks/useinterview";
import { FiUploadCloud, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../auth/hooks/useAuth";
import "../style/home.scss";

const Home = () => {
  const { generateReport, setLoading, reports, getReports } = useInterview();
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const resumeInputRef = useRef(null);

   const logoutUser = async () => {
    try {
      await handleLogout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  // Clear any stuck global loading from other pages/requests
  useEffect(() => {
    setLoading(false);
    getReports();
  }, [setLoading, getReports]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setResumeFile(null);
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF resumes are supported");
      setResumeFile(null);
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume must be 5MB or smaller");
      setResumeFile(null);
      e.target.value = "";
      return;
    }

    setError("");
    setResumeFile(file);
  };

 

  const handleGenerateReport = async () => {
    if (isSubmitting) return;

    setError("");

    if (!jobDescription.trim()) {
      setError("Job description is required");
      return;
    }

    if (!resumeFile && !selfDescription.trim()) {
      setError("Upload a PDF resume or enter a self description");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      if (result?.success && result.report?._id) {
        navigate(`/interview/${result.report._id}`);
        return;
      }

      setError(result?.message || "Interview report was not generated.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="home">
      <div className="container">

  <button
  className="home-logout-btn"
  onClick={logoutUser}
>
  <FiLogOut size={18} />
  <span>Logout</span>
</button>

        <div className="hero">
          <h1>
            Create Your Custom <span>Interview Plan</span>
          </h1>

          <p>
            Let AI analyze your profile and target job description to build a
            personalized interview preparation strategy.
          </p>
        </div>


        <div className="workspace">
          <div className="left-panel">
            <div className="panel-title">🎯 Target Job Description</div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the complete Job Description here..."
            />

            <div className="counter">{jobDescription.length} / 5000</div>
          </div>

          <div className="right-panel">
            <div className="panel-title">👤 Your Profile</div>

            <div className="field">
              <label htmlFor="resume-upload">Upload Resume</label>

              <input
                id="resume-upload"
                type="file"
                accept="application/pdf,.pdf"
                ref={resumeInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />

              <div
                className={`upload-box ${resumeFile ? "has-file" : ""}`}
                onClick={() => resumeInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    resumeInputRef.current?.click();
                  }
                }}
              >
                <FiUploadCloud size={45} />

                <h4>{resumeFile ? "Resume selected" : "Click to upload"}</h4>

                <p>{resumeFile ? resumeFile.name : "PDF only (Max 5MB)"}</p>
              </div>
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="field">
              <label htmlFor="self-description">Quick Self Description</label>

              <textarea
                id="self-description"
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                placeholder="Describe yourself in 100-150 words..."
              />
            </div>

            <div className="note">
              Either Resume or Self Description is required.
            </div>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="button-wrapper">
          <button
            type="button"
            onClick={handleGenerateReport}
            disabled={isSubmitting}
          >
            <HiOutlineSparkles />
            {isSubmitting ? "Generating..." : "Generate Interview Strategy"}
          </button>
        </div>

        {reports.length > 0 && (
          <section className="recent-reports">
            <h2>My Recent Interview Plans</h2>
            <ul className="reports-list">
              {reports.map((report) => (
                <li
                  key={report._id}
                  className="report-item"
                  onClick={() => navigate(`/interview/${report._id}`)}
                >
                  <h3>{report.title || "Untitled Position"}</h3>
                  <p className="report-meta">
                    Generated on{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  <p
                    className={`match-score ${report.matchScore >= 80 ? "score--high" : report.matchScore >= 60 ? "score--mid" : "score--low"}`}
                  >
                    Match Score: {report.matchScore}%
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
};

export default Home;
