# ebookAI

**ebookAI** is an AI-powered eBook creation platform that enables users to write, design, and export professional eBooks with the help of artificial intelligence. Built with a modern React frontend and a robust Node.js/Express backend connected to MongoDB.

## Features

- **User Authentication** — Secure signup and login with JWT-based authentication
- **Dashboard** — Manage all your created eBooks in one place
- **Smart Editor** — Full-featured chapter editor with:
  - Markdown editor with live preview
  - Drag-and-drop chapter reordering
  - Auto-save every 30 seconds
  - Word and character count
- **AI-Powered Writing** — Generate chapter content using Google Gemini AI
- **AI Cover Generator** — Automatically generate book cover images using AI
- **Manual Cover Upload** — Upload custom cover images (JPG, PNG, GIF — max 2MB)
- **Export** — Download your eBook as PDF or DOCX
- **Book Metadata** — Manage title, subtitle, author, status (draft/published)
- **View eBook** — Read your completed book in a clean reader view
- **Profile Management** — Update your user profile

## Tech Stack

### Frontend
- **React 19** — UI library
- **Vite** — Build tool
- **Tailwind CSS v4** — Styling
- **React Router v7** — Navigation
- **Axios** — HTTP client
- **Lucide React** — Icons
- **React Hot Toast** — Notifications
- **@uiw/react-md-editor** — Markdown editor

### Backend
- **Node.js + Express 5** — Server framework
- **MongoDB + Mongoose** — Database
- **JWT** — Authentication
- **Multer** — File upload handling
- **PDFKit** — PDF generation
- **DOCX** — Word document generation
- **Markdown-it** — Markdown processing
- **Google Generative AI (@google/genai)** — AI content generation

## Project Structure

```
mainproject/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   └── eBookCreator/
│       ├── src/
│       │   ├── pages/
│       │   ├── components/
│       │   ├── context/
│       │   ├── utils/
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mainproject
```

2. Install root dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend && npm install
```

4. Install frontend dependencies:
```bash
cd ../frontend/eBookCreator && npm install
```

5. Configure environment variables:

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ebookai
JWT_SECRET=your_jwt_secret_key
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
```

### Running the Application

Start both frontend and backend concurrently:
```bash
npm run dev
```

Or run them separately:

**Backend** (port 5000):
```bash
cd backend && npm run dev
```

**Frontend** (port 5173):
```bash
cd frontend/eBookCreator && npm run dev
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Run frontend and backend concurrently |
| `npm run dev` | Run frontend and backend concurrently |
| `npm run server` | Start backend server |
| `npm run client` | Start frontend dev server |
| `npm run install:all` | Install all dependencies |

## API Routes

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user
- `GET /api/auth/me` — Get current user

### Books
- `GET /api/books` — Get all user books
- `POST /api/books` — Create new book
- `GET /api/books/:id` — Get book by ID
- `PUT /api/books/:id` — Update book
- `PUT /api/books/:id/cover` — Upload book cover
- `DELETE /api/books/:id` — Delete book

### AI
- `POST /api/ai/generate-outline` — Generate book outline
- `POST /api/ai/generate-chapter` — Generate chapter content
- `POST /api/ai/generate-cover` — Generate AI cover image

### Export
- `GET /api/export/pdf/:bookId` — Export book as PDF
- `GET /api/export/docx/:bookId` — Export book as DOCX

## License

ISC
