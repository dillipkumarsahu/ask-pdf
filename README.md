# 📄 Ask PDF

A full-stack AI-powered application that allows users to upload PDF documents and ask questions about their content using Retrieval-Augmented Generation (RAG).

The application extracts text from uploaded PDFs, generates embeddings, stores them in a vector database (FAISS), retrieves relevant context for each query, and uses an LLM to generate accurate answers.

---

## ✨ Features

- 📤 Upload PDF documents
- 💬 Ask questions about uploaded PDFs
- 🧠 Retrieval-Augmented Generation (RAG)
- 🔍 Semantic search using FAISS
- 📄 Automatic PDF text extraction
- ⚡ FastAPI backend
- ⚛️ React + TypeScript frontend
- 🎨 Clean and responsive UI

---

## 🏗️ Project Structure

```text
ASK-PDF/
│
├── ask-pdf-api/          # FastAPI Backend
│   ├── core/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   ├── app.py
│   ├── state.py
│   ├── requirements.txt
│   └── .env
│
├── ask-pdf-ui/           # React Frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

# 🛠️ Tech Stack

### Backend

- FastAPI
- LangChain
- Mistral AI
- FAISS
- PyPDF
- Python

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

---

# ⚙️ How It Works

1. User uploads a PDF.
2. The backend extracts text from the document.
3. The text is split into smaller chunks.
4. Embeddings are generated using Mistral Embeddings.
5. Embeddings are stored in FAISS.
6. When a user asks a question:
   - Relevant chunks are retrieved.
   - Retrieved context is sent to the LLM.
   - The LLM generates an answer based on the document.

---

# 🚀 Getting Started

## Clone the repository

```bash
git clone https://github.com/yourusername/ask-pdf.git

cd ask-pdf
```

---

# Backend Setup

Navigate to the backend.

```bash
cd ask-pdf-api
```

### Install dependencies

```bash
uv sync
```

> If you're using only a `requirements.txt` (and not `pyproject.toml`), run:

```bash
uv pip install -r requirements.txt
```

### Create a `.env` file

```env
MISTRAL_API_KEY=your_mistral_api_key
```

### Run the backend

```bash
uv run uvicorn app:app --reload
```

The backend will start on:

```
http://localhost:8000
```

# API Endpoints

## Upload PDF

```
POST /upload
```

Uploads a PDF document and creates a searchable vector store.

---

## Ask Question

```
GET /ask?question=Your question here
```

Returns an answer generated using the uploaded PDF.

Example:

```
GET /ask?question=What is this document about?
```

---

# Example Workflow

1. Open the application.
2. Upload a PDF.
3. Wait for processing.
4. Ask questions about the document.
5. Receive AI-generated answers.

---

# Screenshots

You can add screenshots here.

```
/screenshots/1.png

/screenshots/2.png

/screenshots/3.png
```

---

# Author

**Dillip Kumar Sahu**

Full Stack Developer | AI Enthusiast

- GitHub: https://github.com/dillipkumarsahu
- LinkedIn: https://www.linkedin.com/in/dillipkumarsahu

---