# Voice Karar Backend

The backend system for **Voice Karar**—an AI-powered platform that converts informal verbal business agreements into structured, digitally confirmed contracts.

## Tech Stack
- **Runtime Environment:** Node.js
- **Web Framework:** Express.js
- **Database:** MongoDB
- **ODM (Object Document Mapper):** Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Environment Management:** dotenv
- **Middleware:** CORS, Express JSON parser, error handling middlewares

---

## Folder Structure & Architecture

```
backend/
├── docs/                     # Architectural design & system flow documentation
├── src/
│   ├── config/               # Database and environment variable loaders
│   ├── controllers/          # Route handlers (decodes payload, calls service layer)
│   ├── routes/               # API endpoint definitions mapping to controllers
│   ├── services/             # Pure business logic layer (independent of transport mechanism)
│   ├── models/               # MongoDB Mongoose schemas
│   ├── middleware/           # Reusable middleware filters (authentication, validations, error boundaries)
│   ├── validations/          # Data schema validators for request payloads
│   ├── interfaces/           # JSON contracts, schemas and md specifications for UI & AI agents
│   ├── utils/                # Utility classes, errors wrappers, token builders & helpers
│   ├── app.js                # Express app setup and middleware pipeline config
│   └── server.js             # Network listener & DB bootloader entry point
├── tests/                    # Testing suite placeholders
├── .env.example              # Sample environment configuration template
├── .gitignore                # Files/folders ignored in git tracking
└── package.json              # App dependencies & run scripts
```

### Purpose of Key Folders

1. **`src/config`**: Houses configuration files like the database connection client (`db.js`) and sanitizes environment configuration variables (`env.js`).
2. **`src/controllers`**: Standard route entry points. Extracts parameters, delegates to service logic, and responds using consistent response envelopes (`ApiResponse.js`).
3. **`src/services`**: Orchestrates application operations. Connects to database models and third-party systems. Contains logic for agreement parsing integration, history updates, and shared links.
4. **`src/models`**: Defines the data model structure using Mongoose. Includes schemas for `User`, `Agreement`, and `Confirmation`.
5. **`src/middleware`**: Hooks into Express pipeline. Includes `auth.middleware.js` for verifying signatures/JWTs, `error.middleware.js` to catch internal crashes, and validations filters.
6. **`src/validations`**: Declares schemas to enforce structure, types, and constraints on user actions, preventing dirty data from hitting database layers.
7. **`src/interfaces`**: Defines cross-boundary API contracts and documentation, keeping frontend-backend-AI integrations in sync.
8. **`src/utils`**: Code sharing for tools like token generators (`generateToken.js`), random token generators for links (`generateShareId.js`), logging wrappers (`logger.js`), and base exceptions wrapper (`ApiError.js`).

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or Atlas cluster URI)

### Installation
1. Clone the project.
2. Change directory into `backend/`:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Configure environment:
   ```bash
   cp .env.example .env
   # Update variables inside .env according to your database/secrets
   ```

### Running the App
- Run dev server (using Nodemon auto-reload):
  ```bash
  npm run dev
  ```
- Run production:
  ```bash
  npm start
  ```

---

