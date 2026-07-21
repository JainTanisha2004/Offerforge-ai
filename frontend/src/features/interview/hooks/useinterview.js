import { useCallback, useContext } from "react";
import {
  getAllInterviewReports,
  getInterviewReportById,
  generateInterviewReport,
  generateResumePDF
} from "../services/interview.api";
import { InterviewContext } from "../interview.context";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = useCallback(
    async ({ jobDescription, selfDescription, resumeFile }) => {
      setLoading(true);
      try {
        const response = await generateInterviewReport({
          jobDescription,
          selfDescription,
          resumeFile,
        });
        setReport(response.interviewReport);
        return { success: true, report: response.interviewReport };
      } catch (error) {
        console.error(error);
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          (error?.code === "ECONNABORTED"
            ? "Request timed out. The AI took too long — please try again."
            : null) ||
          error?.message ||
          "Failed to generate interview report";
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setReport]
  );

  const getReportById = useCallback(
    async (interviewId) => {
      setLoading(true);
      try {
        const response = await getInterviewReportById(interviewId);
        setReport(response.interviewReport);
        return response.interviewReport;
      } catch (error) {
        console.error(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setReport]
  );

  const getReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();
      setReports(response.interviewReports);
      return response.interviewReports;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setReports]);

  const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        let response = null
        try {
            response = await generateResumePDF({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
        }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

  return {
    loading,
    setLoading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
    getResumePdf
  };
};
