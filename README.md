# PrepFlow 🚀

### AI-Powered Mock Interview Platform

PrepFlow is a full-stack AI interview preparation platform that simulates real technical interviews with adaptive questioning, intelligent evaluation, and personalized feedback.

The system dynamically generates interview questions based on user-selected domains, evaluates answers using AI, and adjusts follow-up questions according to candidate performance.

---

# ✨ Features

* 🎯 AI-generated interview questions
* 🧠 Adaptive follow-up questioning system
* 📄 Resume-based contextual interviews
* 🔐 JWT Authentication & Protected Routes
* 📊 Answer evaluation and feedback generation
* 🎙️ Voice-enabled interview support
* 🧩 Custom interview domain support
* 📈 Difficulty progression during interviews
* 🐳 Dockerized full-stack architecture
* ⚙️ CI/CD pipeline using GitHub Actions

---

# 🏗️ System Architecture

```text id="readme1"
Frontend (React + Vite)
        ↓
Django REST API
        ↓
AI Engine (Groq LLM + Interview Pipeline)
        ↓
PostgreSQL Database
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* React Router
* Axios

## Backend

* Django
* Django REST Framework
* JWT Authentication
* PostgreSQL

## AI / ML

* Groq API
* Adaptive Interview Pipeline
* Context-aware Question Generation
* AI Answer Evaluation

## DevOps / Infrastructure

* Docker
* Docker Compose
* GitHub Actions (CI/CD)

---

# 🧠 AI Features

PrepFlow uses an adaptive interview engine that:

* Generates contextual technical questions
* Tracks interview history and candidate responses
* Creates follow-up questions dynamically
* Adjusts interview flow based on answer quality
* Evaluates technical and semantic quality of answers

---

# 📂 Project Structure

```text id="readme2"
PrepFlow/
│
├── frontend/                 # React frontend
├── interviews/               # Interview management app
├── ai_engine/                # AI interview pipeline
├── resumes/                  # Resume processing
├── users/                    # Authentication system
├── config/                   # Django settings
│
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── .github/workflows/ci.yml
```

---

# 🐳 Docker Setup

## Run the project

```bash id="readme3"
docker compose up --build
```

Frontend:

```text id="readme4"
http://localhost:5173
```

Backend:

```text id="readme5"
http://localhost:8000
```

---

# 🔐 Environment Variables

Create a `.env` file in the root directory:

```env id="readme6"
SECRET_KEY=your_secret_key
DEBUG=True

DB_NAME=prepflow_db
DB_USER=postgres
DB_PASSWORD=1234
DB_HOST=db
DB_PORT=5432

GROQ_API_KEY=your_groq_api_key
```

---

# ⚙️ CI/CD Pipeline

GitHub Actions automatically:

* Validates Django backend
* Builds React frontend
* Verifies Docker builds
* Runs project integrity checks on every push

Workflow file:

```text id="readme7"
.github/workflows/ci.yml
```

---

# 🚀 Future Improvements

* Multi-agent interview evaluators
* Real-time speech analysis
* Interview analytics dashboard
* Redis caching
* Async task queues with Celery
* Production deployment with Kubernetes

---


# 👨‍💻 Author

**Kashvi Gulati**

Built as an AI-powered intelligent interview preparation platform focused on combining modern AI workflows with production-grade full-stack engineering practices.
