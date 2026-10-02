                                                                  # OfferForge AI

OfferForge AI is a full-stack web application that helps candidates prepare for interviews based on the role they are applying for.

Most interview preparation platforms provide the same set of questions to everyone. In reality, the questions for a Frontend Developer, Backend Developer, or Data Analyst are very different. The idea behind this project was to make interview preparation more relevant by using the candidate's background together with the job description.

The application takes a job description and either a resume or a short self-description as input. It then uses Google's Gemini API to generate a personalized interview report containing role-specific interview questions, skill gap analysis, a preparation roadmap, and a resume-job match score. Users can also take an AI-powered mock interview where every answer is evaluated individually and detailed feedback is generated.

---



## Features

* User registration and login
* JWT authentication using HTTP-only cookies
* Resume upload (PDF)
* Resume text extraction
* AI-generated interview reports
* Technical interview questions
* Behavioral interview questions
* Resume-job match score
* Skill gap analysis
* Personalized preparation roadmap
* AI mock interview
* Per-question feedback
* Overall interview evaluation
* Resume PDF generation
* Interview history

---

## Tech Stack

**Frontend**

* React
* Vite
* React Router
* Axios
* SCSS

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB
* Mongoose

**Authentication**

* JWT
* bcryptjs
* HTTP-only Cookies

**AI & Utilities**

* Google Gemini API
* Zod
* Multer
* pdf-parse
* Puppeteer

---

## How it Works

```text
                Resume (PDF)
                      │
                      ▼
             Extract Resume Text
                      │
                      │
Job Description ──────┤
                      ▼
          Build AI Prompt
                      │
                      ▼
             Google Gemini API
                      │
                      ▼
      Structured Interview Report
                      │
      ┌───────────────┴──────────────┐
      ▼                              ▼
Interview Preparation         Mock Interview
      │                              │
      └───────────────┬──────────────┘
                      ▼
              AI Feedback & Score
                      │
                      ▼
                  MongoDB
```

---

## Project Structure

```text
OfferForge-AI
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── features
│   │   │   ├── auth
│   │   │   ├── interview
│   │   │   └── mockInterview
│   │   ├── context
│   │   ├── hooks
│   │   └── utils
│   │
│   └── package.json
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   │
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## A Few Things I'm Proud Of

One of the goals while building this project was to keep the backend easy to extend. Instead of putting everything inside controllers, the application follows a layered structure where routes handle API endpoints, controllers process requests, services contain the business logic, and models interact with the database.

Another challenge was working with LLM responses. Since AI responses are not always predictable, I used **Zod** to validate the generated output before processing it further. This made the application much more reliable.

The mock interview module was also designed to behave like an actual interview instead of generating all feedback at once. Every answer is evaluated separately, the interview state is maintained across requests, and a final performance summary is generated when the interview is completed.

---

## API Modules

### Authentication

* Register
* Login
* Logout
* Get Current User

### Interview

* Generate Interview Report
* Get Report
* Get All Reports
* Generate Resume PDF

### Mock Interview

* Start Interview
* Evaluate Answer
* Complete Interview
* Resume Session
* Interview History

---

## Running the Project

Clone the repository.

```bash
git clone https://github.com/JainTanisha2004/Offerforge-ai.git
```

Install dependencies.

```bash
cd backend
npm install

cd ../frontend
npm install
```

Create the required environment variables.

**Backend**

```env
PORT=
MONGO_URI=
JWT_SECRET=
GOOGLE_API_KEY=
CLIENT_URL=
```

**Frontend**

```env
VITE_API_URL=
```

Start both servers.

```bash
# Backend
npm run dev

# Frontend
npm run dev
```

---

## Future Improvements

There are a few ideas I would like to add in future versions of the project.

* Resume Analyzer
* Resume Builder
* Cover Letter Generator
* Company-specific interview preparation
* ATS compatibility analysis
* Interview analytics dashboard

---

## What I Learned

Building OfferForge AI gave me hands-on experience with designing REST APIs, implementing JWT authentication, integrating large language models into a full-stack application, parsing PDF documents, validating AI responses, generating PDFs dynamically, and managing application state across a multi-step workflow.

Although the project uses AI extensively, one of the biggest takeaways was learning how much of the work happens around the model—designing prompts, validating responses, handling failures, and building a workflow that feels reliable for the end user.
