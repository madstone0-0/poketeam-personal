# PokeTeam

## Overview
PokeTeam is a web application that allows users to create, manage, and analyze their Pokemon teams. The application is divided into two main parts: the frontend and the backend.

## Technologies Used
### Frontend

The frontend of the application is built using modern web technologies to provide a responsive and interactive user interface.

- React: A JavaScript library for building user interfaces.
- Vite: A build tool that provides a fast development experience.
- Tailwind CSS: A utility-first CSS framework for rapid UI development.
- React Router: A library for routing in React applications.
- Axios: A promise-based HTTP client for making API requests.
- React Query: A library for managing server-state in React applications.
- Zustand: A small, fast, and scalable state-management solution for React.
- ApexCharts: A modern charting library to visualize data.
- Notistack: A notification library for React.

### Backend

The backend of the application is designed to handle API requests, manage data, and provide authentication.

- Hono: A small, fast, and simple web framework for creating HTTP servers.
- Postgres: A powerful, open-source object-relational database system.
- Zod: A TypeScript-first schema declaration and validation library.
- Bcrypt: A library to help with hashing passwords.

## Getting Started
### Prerequisites

- Node.js (v20+)
- npm (pnpm is preferred)
- PostgreSQL (v16+)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/madstone0-0/poketeam-personal.git
cd poketeam
```

2. Install dependencies for both frontend and backend:
```bash
cd frontend
pnpm install
cd ../backend
pnpm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to http://localhost:3000 to see the application in action.
