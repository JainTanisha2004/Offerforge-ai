import {createBrowserRouter} from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import { Protected } from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/interview"
import MockInterview from "./features/interview/pages/MockInterview";
import InterviewSummary from "./features/interview/pages/InterviewSummary";
import InterviewHistory from "./features/interview/pages/InterviewHistory";
import InterviewReview from "./features/interview/pages/InterviewReview";

export const router=createBrowserRouter([
  {
    path: "/login",
    element:<Login/>
  },
  {
    path:"/register",
    element: <Register/>
  },
  {
    path:"/",
    element:<Protected><Home/></Protected>
  },
  {
    path:"/interview/:interviewId",
    element:<Protected><Interview/></Protected>
  },
  {
  path: "/interview/session/:sessionId",
  element: (
    <Protected>
      <MockInterview />
    </Protected>
  )
},
{
  path: "/interview-summary",
  element: (
    <Protected>
      <InterviewSummary />
    </Protected>
  ),
},
{
  path: "/interview-history",
  element: (
    <Protected>
      <InterviewHistory />
    </Protected>
  ),
},
{
  path: "/interview-review/:sessionId",
  element: (
    <Protected>
      <InterviewReview />
    </Protected>
  ),
},
]);