🚖 Taxi ML Predictor

A full-stack machine learning system for predicting taxi trip duration using FastAPI, React, and Apache Spark.

📌 Overview

This project is a complete ML-powered web application that allows users to:

Upload taxi trip datasets
Preprocess and clean data
Train machine learning models
Predict trip duration
Visualize results
🧠 Tech Stack
Frontend: React
Backend: FastAPI
ML / Data Processing: Apache Spark
Deployment: Render / Vercel
⚙️ Features
📂 Upload CSV datasets
🧹 Data preprocessing & cleaning
🤖 Machine learning model training
📊 Model evaluation (Accuracy, Recall, Precision, F1-score)
⏱️ Trip duration prediction
🌐 Full-stack integration

🏗️ Project Structure
wise-ride-predict/
│
├── backend/        # FastAPI backend
├── src/            # React frontend
├── models/         # ML models (optional / ignored in git)
├── uploads/        # temp files (ignored)
├── .gitignore
├── package.json
└── README.md

🚀 Getting Started
1️⃣ Clone the repo
git clone https://github.com/maryhansabry/taxi-ml-predictor.git
cd taxi-ml-predictor
2️⃣ Backend setup (FastAPI)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
3️⃣ Frontend setup (React)
npm install
npm run dev
🌍 Deployment
Backend → Render
Frontend → Vercel
📊 Future Improvements
Add real-time predictions
Improve model performance
Add user authentication
Deploy scalable infrastructure
📜 License

This project is licensed under the MIT License.


⭐ Notes

This project is built for learning, experimentation, and showcasing ML + full-stack integration.
