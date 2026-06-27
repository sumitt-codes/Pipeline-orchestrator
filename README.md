# Pipeline Orchestrator

A powerful and visually rich visual pipeline builder and validator. Build complex workflows with an interactive drag-and-drop node canvas, configure nodes, and validate the pipeline structure (node counts, edge counts, and Directed Acyclic Graph (DAG) validation with detailed cycle path tracing) via a FastAPI-powered backend.

---

## 🚀 Key Features

*   **Interactive Node Canvas:** Built on React Flow, allowing dragging, dropping, and connecting various functional nodes.
*   **9 Custom Specialized Nodes:**
    *   **Input Node:** Define entry parameters (Text, File fields).
    *   **Output Node:** Target execution outcomes (Text, File fields).
    *   **LLM Node:** AI logic node with prompt input and outputs.
    *   **Text Node:** Supports auto-expanding input and dynamic variable extraction (using `{{variable_name}}` syntax which automatically generates corresponding target input handles!).
    *   **AI Image Node:** Define prompt details and size fields.
    *   **Automation Node:** Triggers and scheduled workflows.
    *   **Database Node:** Database source queries or ingestion configs.
    *   **Discord Node:** Post messages or listen to webhooks.
    *   **Conditional Node:** Route execution using custom conditional logic rules.
*   **Base Node Abstraction:** High-level React node reuse wrapper (`BaseNode.js`) enforcing clean typography, custom handle placements, and title templates.
*   **DAG Validation Backend:** Validates whether the built pipeline is a Directed Acyclic Graph (DAG) using **Kahn's Algorithm** and detects detailed cycle paths using depth-first search (DFS) if invalid.
*   **Interactive Feedback Modal:** Displays real-time validation results from the server with detailed nodes/edges summary metrics and cycle tracing.

---

## 🛠️ Project Structure

```text
Pipeline orchestration/
├── backend/
│   ├── main.py             # FastAPI App exposing /pipelines/parse (Kahn's & DFS cycle finder)
│   └── __pycache__/        # Compiled Python files (ignored in Git)
├── frontend/
│   ├── public/             # Static public assets
│   ├── src/
│   │   ├── nodes/          # Customized individual React Flow node implementations
│   │   │   ├── inputNode.js, outputNode.js, llmNode.js, textNode.js, aiImageNode.js, etc.
│   │   │   └── ...
│   │   ├── App.js          # React Root Component
│   │   ├── BaseNode.js     # Shared abstract Node styling/structure wrapper
│   │   ├── store.js        # Zustand state manager for node/edge connections
│   │   ├── submit.js       # Submit execution handler + API connection + Validation Modal
│   │   ├── toolbar.js      # Toolbar for dragging new nodes
│   │   ├── ui.js           # Canvas workspace UI wrapper
│   │   └── ...
│   ├── package.json        # Frontend Node dependencies
│   └── README.md           # Default React CRA documentation
├── .gitignore              # Multi-stack git ignores (React build, node_modules, python cache)
└── README.md               # Main Project Documentation (This File)
```

---

## 💻 Tech Stack

*   **Frontend:** React, React Flow (for canvas orchestration), Zustand (state management), Vanilla CSS (premium styling).
*   **Backend:** Python 3.8+, FastAPI, Uvicorn, Pydantic (data parsing/validation), CORS Middleware.
*   **Algorithms:** Kahn's Algorithm (in-degree BFS topological sorting) for DAG checks, DFS path-tracing for cycle retrieval.

---

## ⚙️ Getting Started

Follow these steps to run both the frontend and backend of the application locally:

### 1. Backend Setup (FastAPI)

Navigate to the `backend` folder:
```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

Install the dependencies:
```bash
pip install fastapi uvicorn pydantic
```

Run the backend server using Uvicorn:
```bash
uvicorn main:app --reload
```
The backend server will start at `http://127.0.0.1:8000`.

### 2. Frontend Setup (React)

Open a new terminal session and navigate to the `frontend` folder:
```bash
cd frontend
```

Install npm dependencies:
```bash
npm install
```

Start the local React development server:
```bash
npm start
```
The frontend application will boot and open at `http://localhost:3000`.

---

## 🔌 API Documentation

### POST `/pipelines/parse`

Validates a pipeline layout submitted from the React Flow canvas.

#### Request Headers
`Content-Type: application/json`

#### Request Body Schema
```json
{
  "nodes": [
    { "id": "input-1", "type": "customInput" },
    { "id": "llm-1", "type": "customLLM" }
  ],
  "edges": [
    {
      "id": "e-input-1-llm-1",
      "source": "input-1",
      "sourceHandle": "input-1-value",
      "target": "llm-1",
      "targetHandle": "llm-1-system"
    }
  ]
}
```

#### Response Body Schema (DAG / Valid)
```json
{
  "num_nodes": 2,
  "num_edges": 1,
  "is_dag": true,
  "cycle_path": ""
}
```

#### Response Body Schema (Cycle Detected / Invalid)
```json
{
  "num_nodes": 3,
  "num_edges": 3,
  "is_dag": false,
  "cycle_path": "LLM (response) → AI Image (prompt) → LLM (prompt)"
}
```

---

## 🎨 Interactive Node Customizations

### Text Node Auto-resizing & Handles
The Text node has been customized to search for double curly brace expressions (e.g., `{{variable}}`) inside its input text area. Every unique variable matched dynamically adds a new input handle (labeled with the variable name) on the left side of the node, enabling dynamic, data-driven pipeline building. The textbox also automatically resizes its height to fit the content!
