const express=require('express');
const app=express();
const cookieParser=require("cookie-parser");
const cors=require("cors");
const mockInterviewRoutes = require("./routes/mockInterview.routes");

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

app.use(cors({
  origin(origin, callback) {
    // Allow non-browser requests (no Origin) and known Vite ports
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}))
const authRouter=require('./routes/auth.routes');
const interviewRouter=require('./routes/interview.routes');
app.use('/api/auth',authRouter);
app.use("/api/interview",interviewRouter)
app.use("/api/mock-interview", mockInterviewRoutes);
module.exports=app;