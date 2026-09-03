# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

BookNest — an online book store. A MERN-style app split into two independent npm packages: `server/` (Express 5 + Mongoose REST API) and `client/` (React 19 + Vite + Tailwind v4 SPA). There is no root `package.json`; install and run each side separately.

This is a work-in-progress learning project. Several pages and components are still stubs or use hardcoded dummy data — see "Current state" below before assuming a feature exists.

## Commands

```bash
# Server (from server/)
npm install
npx nodemon app.js       # dev server on PORT (.env) or 8080
node app.js              # without watch

# Client (from client/)
npm install
npm run dev              # Vite dev server
npm run build
npm run preview
npm run lint             # ESLint (flat config, js/react-hooks/react-refresh)
```

There are no tests in either package. `server`'s `npm start` script points at a nonexistent `server.js` — the real entry point is `app.js`. `npm test` is the create-* placeholder that exits 1.

`server/.env` (gitignored) must define `MONGODB_URI`, `PORT`, and `JWT_SECRET`. The server will not boot without a reachable Mongo — `app.listen` runs inside the `mongoose.connect().then()` callback.

## Architecture

### Server (`server/`)

Classic layered Express structure: `app.js` → `routes/` → `controllers/` → `models/`.

- **`app.js`** wires JSON/urlencoded parsers, serves `server/images` statically at `/images`, sets permissive CORS headers by hand (no `cors` package — `Access-Control-Allow-Origin: *`), mounts the two routers, then registers the error-handling middleware.
- **Route mounts**: `/feed` → `routes/feed.js` (`GET /feed/books`, `POST /feed/book`), `/auth` → `routes/auth.js` (`POST /auth/signup`, `POST /auth/login`).
- **Validation** lives in the route definitions via `express-validator` `body(...)` chains; controllers call `validationResult(req)` and return 422 with `{ message, errors }`. The signup email validator does a custom `User.findOne` uniqueness check.
- **Error convention**: controllers create an `Error`, attach `error.statusCode`, and either `throw` inside a promise chain or `next(err)` from `.catch`. The terminal middleware in `app.js` responds `{ message }` with `error.statusCode || 500`. Some controllers (`signUp`, `getBooks`, `createBook`) still `console.log(err)` instead of calling `next` — prefer `next(err)` in new code.
- **Auth**: `POST /auth/login` verifies with `bcryptjs` and signs a JWT (`{ email, userId }`, 1h expiry). `middleware/isAuth.js` reads `Authorization: Bearer <token>`, verifies it, and sets `req.userId` for downstream handlers.
- **Uploads**: `util/multer.js` configures disk storage into `images/` with an ISO-timestamp-prefixed filename and a png/jpg/jpeg filter (rejects silently via `cb(null, false)`, so handlers must check `req.file`). `createBook` stores `req.file.path` as `imageUrl`, which the client resolves against the server origin.

Note: `server/images/` is **not** gitignored, so uploaded covers get committed. Multer's destination is the relative path `"images"`, so the server must be started from the `server/` directory.

Callback/promise-chain style (`.then().catch()`) is used throughout the server, not `async/await`.

### Client (`client/`)

- **Composition**: `main.jsx` nests `BrowserRouter` → `AuthProvider` → `App`. `App.jsx` renders the persistent `NavBar` plus all `Routes`.
- **Auth state**: `context/AuthContext.jsx` holds `{ user, token, login, logout }`, mirrored into `localStorage` (`token`, `user`). Consume it through the `useAuth()` hook in `hooks/`, never by importing the context directly into pages.
- **Barrel exports**: every folder under `components/` and `pages/` has an `index.js` re-export, and `components/index.js` re-exports all three subfolders. Import as `import { NavBar, BookCard } from "./components"` / `from "../components"`. Add new components to the relevant barrel.
- **API calls** are currently inline `fetch` calls against a hardcoded `http://localhost:8080` inside page components. `services/api.js`, `services/authService.js`, and `services/bookService.js` exist but are **empty** — they are the intended home for this logic.
- **Styling**: Tailwind v4 via the `@tailwindcss/vite` plugin, configured in CSS not JS. `src/index.css` declares the design tokens in an `@theme` block — `primary` (#10b981), `primary-dark`, `background` (#0f172a), `surface` (#1e2536) — used as `bg-surface`, `text-primary`, `border-primary`, etc. Reuse these tokens rather than raw hex or arbitrary slate shades. The dark UI is hardcoded (`text-white`, `text-gray-400`); there is no theme toggle.

### Client ⇄ server contract gaps to watch for

These are known inconsistencies in the current code, not intended behavior:

- Mongo documents expose `_id`, but client components read `book.id` (e.g. `BookCard` links to `/book/${book.id}`) — these links currently resolve to `undefined`.
- `Login` calls `login(data.userId, data.token)`, so context `user` is a bare id string, while `BookCard`/`BookDetail` compare against `user.id`. Ownership checks never match.
- `POST /feed/book` is not behind `isAuth` and hardcodes `createdBy: "507f1f77bcf86cd799439011"`; `AddBook` sends no `Authorization` header.
- `isAuth` is applied to `POST /auth/signup`, which makes registration require an existing token.

### Current state

Implemented end-to-end: book listing (`GET /feed/books` → `Home`), book creation with image upload (`AddBook` → `POST /feed/book`), signup, login.

Stubs / dummy data: `BookDetail` and `MyBooks` render hardcoded objects; `routes/ProtectedRoutes.jsx`, `components/common/Button.jsx`, `components/common/Loader.jsx`, and `components/books/BookList.jsx` are placeholders. No update or delete endpoints exist yet, though the UI has Edit/Delete affordances and an `/edit-book/:id` route (reusing `AddBook`).

## Conventions

- Server: CommonJS (`require`/`module.exports`). Client: ES modules.
- 4-space indent, double-quoted strings, semicolons, trailing commas.
- Components are arrow-function consts with a `default export`; named exports come from the barrel files.
- Commit messages are short imperative-ish sentences describing what was added (e.g. "Added bcrypt for password hashing and setup signup user api").
