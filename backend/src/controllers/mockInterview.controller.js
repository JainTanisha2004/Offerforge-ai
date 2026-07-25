const mockInterviewService = require("../services/mockInterview.service");

exports.startInterview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reportId } = req.params;

    const result = await mockInterviewService.startInterview(
      userId,
      reportId
    );

    res.status(200).json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Placeholder APIs

exports.evaluateAnswer = async (req, res) => {
  try {
    const userId = req.user.id;

    const { sessionId } = req.params;

    const { questionIndex, candidateAnswer } = req.body;

    const result = await mockInterviewService.evaluateAnswer(
      userId,
      sessionId,
      questionIndex,
      candidateAnswer
    );

    res.status(200).json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.completeInterview = async (req, res) => {
  try {
    const result = await mockInterviewService.completeInterview(
      req.user.id,
      req.params.sessionId
    );

    res.status(200).json(result);
  } catch (err) {
    console.error(err);

    const status =
      err.message === "Interview session not found." ? 404 : 500;

    res.status(status).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getInterviewSession = async (req, res) => {
  try {
    const session = await mockInterviewService.getInterviewSession(
      req.user.id,
      req.params.sessionId
    );

    res.status(200).json({
      success: true,
      session,
      questions: session.questions,
    });
  } catch (err) {
    const status = err.message === "Interview session not found." ? 404 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

// exports.getInterviewSession = async (req, res) => {
//   try {
//     const result = await mockInterviewService.getInterviewSession(
//       req.user.id,
//       req.params.sessionId
//     );

//     res.status(200).json({
//       success: true,
//       session: result.session,
//       answers: result.answers,
//     });
//   } catch (err) {
//     const status =
//       err.message === "Interview session not found." ? 404 : 500;

//     res.status(status).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

exports.getInterviewHistory = async (req, res) => {
  try {
    const history = await mockInterviewService.getInterviewHistory(
      req.user.id
    );

    res.status(200).json({
      success: true,
      history,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};