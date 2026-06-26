# 🚖 Taxi ML Predictor

A full-stack machine learning system for predicting **taxi trip duration**, built with a **FastAPI** backend, a **React + TypeScript** frontend, and **Apache Spark** for scalable data processing.


<img width="1920" height="1030" alt="1" src="https://github.com/user-attachments/assets/39975b7b-b0c7-4227-9684-72430b4a417b" />
<img width="1920" height="1030" alt="image" src="https://github.com/user-attachments/assets/91c57d88-def6-460d-b54e-730b4cb45884" />
<img width="1920" height="1030" alt="image" src="https://github.com/user-attachments/assets/e164597d-5db8-4600-aa99-713a4515c9f6" />
<img width="1920" height="1030" alt="image" src="https://github.com/user-attachments/assets/8d0b6b3d-b13e-413b-a55d-9b810dae6962" />
<img width="1920" height="1030" alt="image" src="https://github.com/user-attachments/assets/f6e7919a-eaf6-46d9-bcae-22eaabe0776e" />

---

## 📌 Overview

**Taxi ML Predictor** is an end-to-end ML-powered web application that takes raw taxi trip data and turns it into trip-duration predictions through a simple, interactive UI. It covers the full pipeline — from dataset upload to model training to visualizing predictions — so you can experiment with the model without touching a notebook.

With this app, you can:

- 📂 Upload a taxi trip dataset (CSV)
- 🧹 Preprocess and clean the data
- 🤖 Train a machine learning model on it
- ⏱️ Predict trip duration for new trips
- 📊 Visualize results and model performance

---

## 🧠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, TypeScript, Vite, shadcn/ui |
| **Backend** | FastAPI (Python) |
| **Data Processing / ML** | Apache Spark |
| **Package Management** | Bun (frontend), pip (backend) |
| **Deployment** | Render (backend) · Vercel / Cloudflare (frontend) |

> 💡 The repo includes a `wrangler.jsonc`, so the frontend can also be deployed to **Cloudflare Pages/Workers** as an alternative to Vercel.

---

## ⚙️ Features

- 📂 Upload CSV taxi trip datasets
- 🧹 Automated data preprocessing & cleaning
- 🤖 Model training pipeline powered by Apache Spark
- 📊 Model evaluation metrics (Accuracy, Precision, Recall, F1-score)
- ⏱️ Real-time trip duration predictions
- 🌐 Fully integrated full-stack experience (React ↔ FastAPI)

---

## 🏗️ Project Structure

```
taxi-ml-predictor/
│
├── backend/          # FastAPI backend (API routes, model training & inference, Spark jobs)
├── src/              # React + TypeScript frontend source
├── dist/             # Production build output of the frontend
├── components.json   # shadcn/ui configuration
├── vite.config.ts    # Vite build configuration
├── wrangler.jsonc     # Cloudflare deployment configuration
├── package.json       # Frontend dependencies & scripts
├── bun.lockb           # Bun lockfile
├── .gitignore
├── LICENSE
└── README.md
```

> ⚠️ **Note:** Folders like `models/` (trained model artifacts) and `uploads/` (temporary uploaded files) are expected to exist at runtime but are git-ignored — they will be created automatically when you run the backend.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+) or **[Bun](https://bun.sh/)** for the frontend
- **Python** (3.9+) for the backend
- **Apache Spark** (PySpark) set up locally, or accessible via your Spark environment

### 1️⃣ Clone the repository

```bash
git clone https://github.com/maryhansabry/taxi-ml-predictor.git
cd taxi-ml-predictor
```

### 2️⃣ Backend setup (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.
Interactive API docs (Swagger UI) are available at `http://localhost:8000/docs`.

### 3️⃣ Frontend setup (React)

From the project root:

```bash
npm install
npm run dev
```

> If you're using Bun instead: `bun install && bun run dev`

The frontend will be available at `http://localhost:5173` (default Vite port).

---

## 🔌 API Overview

The FastAPI backend exposes endpoints for the core ML workflow, generally following this pattern:

| Endpoint | Description |
|---|---|
| `POST /upload` | Upload a raw taxi trip CSV dataset |
| `POST /preprocess` | Clean and preprocess the uploaded dataset |
| `POST /train` | Train the ML model on the processed dataset |
| `POST /predict` | Predict trip duration for new trip input |
| `GET /metrics` | Retrieve model evaluation metrics |

> 📝 **Note:** Exact route names/payloads may differ slightly — check `backend/main.py` (and any router files) for the definitive list, or visit `/docs` once the backend is running for the live, auto-generated API reference.

---

## 🌍 Deployment

| Component | Suggested Platform |
|---|---|
| **Backend** | [Render](https://render.com/) |
| **Frontend** | [Vercel](https://vercel.com/) or Cloudflare Pages (via `wrangler.jsonc`) |

---

## 📊 Future Improvements

- [ ] Real-time predictions via streaming input
- [ ] Improve model accuracy with feature engineering / hyperparameter tuning
- [ ] Add user authentication
- [ ] Containerize with Docker for easier deployment
- [ ] Deploy scalable Spark infrastructure (e.g. on a cluster/cloud provider)

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## ⭐ Notes

This project was built for learning, experimentation, and showcasing full-stack ML integration (React + FastAPI + Spark). Contributions, issues, and suggestions are welcome!<img width="1920" height="1030" alt="1" src="https://github.com/user-attachments/assets/16c08bee-c450-4ecd-b23a-c75c743193c6" />
