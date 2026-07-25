// import axios from "axios";

// export const startMockInterview = async (reportId) => {
//   const response = await axios.post(
//     `/api/mock-interview/start/${reportId}`
//   );

//   return response.data;
// };

// export const evaluateAnswer = async (
//   sessionId,
//   questionIndex,
//   candidateAnswer
// ) => {
//   const response = await axios.post(
//     `/api/mock-interview/evaluate/${sessionId}`,
//     {
//       questionIndex,
//       candidateAnswer,
//     }
//   );

//   return response.data;
// };

// export const completeInterview = async (sessionId) => {
//   const response = await axios.post(
//     `/api/mock-interview/complete/${sessionId}`
//   );

//   return response.data;
// };

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const startMockInterview = async (reportId) => {
  const response = await api.post(
    `/mock-interview/start/${reportId}`
  );

  return response.data;
};

export const getMockInterviewSession = async (sessionId) => {
  const response = await api.get(
    `/mock-interview/session/${sessionId}`
  );

  return response.data;
};

export const evaluateAnswer = async (
  sessionId,
  questionIndex,
  candidateAnswer
) => {
  const response = await api.post(
    `/mock-interview/evaluate/${sessionId}`,
    {
      questionIndex,
      candidateAnswer,
    }
  );

  return response.data;
};

export const completeInterview = async (sessionId) => {
  const response = await api.post(
    `/mock-interview/complete/${sessionId}`
  );

  return response.data;
};

export const getInterviewHistory = async () => {
  const response = await api.get("/mock-interview/history");
  return response.data;
};