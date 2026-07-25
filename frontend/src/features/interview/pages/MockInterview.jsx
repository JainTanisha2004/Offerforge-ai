// // import InterviewSidebar from "../components/InterviewSidebar";
// // import InterviewHeader from "../components/InterviewHeader";
// // import QuestionPanel from "../components/QuestionPanel";
// // import AnswerEditor from "../components/AnswerEditor";
// // import { useState } from "react";
// // import "../style/mockInterview.scss";
// // import FeedbackPanel from "../components/Feedbackpanel";
// // const MockInterview = () => {

// //   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
// //   const [answer, setAnswer] = useState("");
// //   const [submitted, setSubmitted] = useState(false);
// //   const [feedback, setFeedback] = useState(null);

// //   const dummyFeedback = {
// //   score: 8.5,

  

// //   strengths: [
// //     "Explained JWT clearly.",
// //     "Mentioned Payload and Signature.",
// //     "Used good terminology."
// //   ],

// //   weaknesses: [
// //     "Didn't explain Refresh Tokens.",
// //     "Missed Token Expiry.",
// //     "No real-world example."
// //   ],

// //   idealAnswer:
// //     "JWT consists of Header, Payload and Signature. During authentication, the server verifies the signature before allowing access. Refresh Tokens are used to generate new Access Tokens without requiring the user to log in again."
// // };

// // const questions = [
// //   {
// //     question: "Explain JWT Authentication and how it works in a MERN application.",
// //     category: "Technical",
// //     difficulty: "Medium",
// //   },
// //   {
// //     question: "What is the Virtual DOM in React?",
// //     category: "Technical",
// //     difficulty: "Easy",
// //   },
// //   {
// //     question: "Explain the difference between SQL and MongoDB.",
// //     category: "Technical",
// //     difficulty: "Medium",
// //   },
// //   {
// //     question: "How would you optimize a Node.js API?",
// //     category: "Technical",
// //     difficulty: "Hard",
// //   },
// // ];

// //   return (
// //     <div className="mock-layout">

// //       <InterviewSidebar
// //         totalQuestions={10}
// //         currentQuestion={2}
// //       />

// //       <main className="mock-main">

// //         <div className="interview-content">
// //         <InterviewHeader
// //           currentQuestion={2}
// //           totalQuestions={10}
// //           time="04:27"
// //         />

// //        const currentQuestion = questions[currentQuestionIndex];

// // <QuestionPanel
// //   question={currentQuestion.question}
// //   category={currentQuestion.category}
// //   difficulty={currentQuestion.difficulty}
// // />

// //        {!submitted ? (
// //     <AnswerEditor
// //         answer={answer}
// //         setAnswer={setAnswer}
// //         onSubmit={() => setSubmitted(true)}
// //     />
// // ) : (
// //     <FeedbackPanel
// //         feedback={dummyFeedback}
// //         onNext={() => setSubmitted(false)}
// //     />
// // )}

// //         </div>
// //       </main>

// //     </div>
// //   );
// // };

// // export default MockInterview;


// import { useState } from "react";
// import "../style/mockInterview.scss";

// import InterviewSidebar from "../components/InterviewSidebar";
// import InterviewHeader from "../components/InterviewHeader";
// import QuestionPanel from "../components/QuestionPanel";
// import AnswerEditor from "../components/AnswerEditor";
// import FeedbackPanel from "../components/FeedbackPanel";

// const MockInterview = () => {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answer, setAnswer] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const [feedback, setFeedback] = useState(null);
//   const { reportId } = useParams();
//   const questions = [
//     {
//       question:
//         "Explain JWT Authentication and how it works in a MERN application.",
//       category: "Technical",
//       difficulty: "Medium",
//     },
//     {
//       question: "What is the Virtual DOM in React?",
//       category: "Technical",
//       difficulty: "Easy",
//     },
//     {
//       question: "Explain the difference between SQL and MongoDB.",
//       category: "Technical",
//       difficulty: "Medium",
//     },
//     {
//       question: "How would you optimize a Node.js API?",
//       category: "Technical",
//       difficulty: "Hard",
//     },
//   ];

//   const dummyFeedback = {
//     score: 8.5,
//     strengths: [
//       "Explained JWT clearly.",
//       "Mentioned Payload and Signature.",
//       "Used good terminology.",
//     ],
//     weaknesses: [
//       "Didn't explain Refresh Tokens.",
//       "Missed Token Expiry.",
//       "No real-world example.",
//     ],
//     idealAnswer:
//       "JWT consists of Header, Payload and Signature. During authentication, the server verifies the signature before allowing access. Refresh Tokens are used to generate new Access Tokens without requiring the user to log in again.",
//   };

//   // ✅ Define outside return()
//   const currentQuestion = questions[currentQuestionIndex];

//   const handleSubmit = () => {
//     setFeedback(dummyFeedback);
//     setSubmitted(true);
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex((prev) => prev + 1);
//       setAnswer("");
//       setSubmitted(false);
//       setFeedback(null);
//     } else {
//       alert("Interview Completed");
//     }
//   };

//   return (
//     <div className="mock-layout">
//       <InterviewSidebar
//         totalQuestions={questions.length}
//         currentQuestion={currentQuestionIndex}
//       />

//       <main className="mock-main">
//         <div className="interview-content">
//           <InterviewHeader
//             currentQuestion={currentQuestionIndex}
//             totalQuestions={questions.length}
//             time="04:27"
//           />

//           <QuestionPanel
//             question={currentQuestion.question}
//             category={currentQuestion.category}
//             difficulty={currentQuestion.difficulty}
//           />

//           {!submitted ? (
//             <AnswerEditor
//               answer={answer}
//               setAnswer={setAnswer}
//               onSubmit={handleSubmit}
//             />
//           ) : (
//             <FeedbackPanel
//               feedback={feedback}
//               onNext={handleNextQuestion}
//             />
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default MockInterview;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../style/mockInterview.scss";

import InterviewSidebar from "../components/InterviewSidebar";
import InterviewHeader from "../components/InterviewHeader";
import QuestionPanel from "../components/QuestionPanel";
import AnswerEditor from "../components/AnswerEditor";
import FeedbackPanel from "../components/FeedbackPanel";

import {
  getMockInterviewSession,
  evaluateAnswer,
  completeInterview,
} from "../services/mockInterview.api";

const MockInterview = () => {
  const { sessionId } = useParams();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300);

  const navigate = useNavigate();

  useEffect(() => {
    const loadInterview = async () => {
      try {
        const data = await getMockInterviewSession(sessionId);

        setQuestions(data.questions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [sessionId]);

  useEffect(() => {
    if (submitted) return undefined;

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        const nextTime = Math.max(previousTime - 1, 0);
        if (nextTime === 0) {
          clearInterval(timer);
          setSubmitted(true);
          setFeedback({
            score: 0,
            strengths: [],
            weaknesses: ["Time expired before submitting the answer."],
            idealAnswer: "Try to manage your time by explaining the main concept first.",
          });
        }
        return nextTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  if (loading) {
    return (
      <div className="mock-loading">
        <h2>Preparing your AI Interview...</h2>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="mock-loading">
        <h2>No interview questions found.</h2>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = async () => {
  try {
    const result = await evaluateAnswer(
      sessionId,
      currentQuestionIndex,
      answer
    );

    setFeedback(result.feedback);

    setSubmitted(true);
  } catch (err) {
    console.error(err);
    alert("Failed to evaluate answer.");
  }
};

  const handleNextQuestion = async () => {
  if (currentQuestionIndex < questions.length - 1) {
    setCurrentQuestionIndex((prev) => prev + 1);

    setAnswer("");

    setSubmitted(false);

    setFeedback(null);
  } else {
    try {
      const result = await completeInterview(sessionId);

navigate("/interview-summary", {
  state: result,
});

      // Next we'll navigate to the Interview Summary page
    } catch (err) {
      console.error(err);

      alert("Failed to complete interview.");
    }
  }
};

  const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2,"0")}:${String(
    remainingSeconds
  ).padStart(2,"0")}`;
};

  return (
    <div className="mock-layout">
      <InterviewSidebar
        totalQuestions={questions.length}
        currentQuestion={currentQuestionIndex}
      />

      <main className="mock-main">
        <div className="interview-content">
          <InterviewHeader
  currentQuestion={currentQuestionIndex}
  totalQuestions={questions.length}
  time={formatTime(timeLeft)}
/>

          <QuestionPanel
            question={currentQuestion.question}
            category={currentQuestion.category}
            difficulty={currentQuestion.difficulty}
          />

          {!submitted ? (
            <AnswerEditor
              answer={answer}
              setAnswer={setAnswer}
              onSubmit={handleSubmit}
            />
          ) : (
            <FeedbackPanel
              feedback={feedback}
              onNext={handleNextQuestion}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default MockInterview;
