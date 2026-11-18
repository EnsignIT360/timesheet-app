# Fieldwork Timesheet

A small full-stack employee timesheet app built with React, Express, and Docker. Team members can submit hours and see the latest entries and running total.

## Run the whole app with Docker

Requirements: Docker Desktop with Docker Compose.

From the project root:

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000). The API runs at [http://localhost:5000](http://localhost:5000), and its health endpoint is [http://localhost:5000/api/health](http://localhost:5000/api/health).

To stop the containers, press `Ctrl+C`, then run `docker compose down`.

## Run locally without Docker

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
npm run dev
```

The frontend is at `http://localhost:3000` and the backend is at `http://localhost:5000`.

## API

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check that the backend is running |
| `GET` | `/api/timesheet` | List submitted timesheet entries |
| `POST` | `/api/timesheet` | Add an entry with `employeeName` and `hours` |

Example request body:

```json
{"employeeName":"Jordan Lee","hours":8}
```

Entries are kept in backend memory, matching the lab guide. Restarting the backend clears the data.

## Build containers individually

```bash
docker build -t timesheet-backend ./backend
docker build -t timesheet-frontend ./frontend
docker run --rm -p 5000:5000 -e FRONTEND_ORIGIN=http://localhost:3000 timesheet-backend
```

In a second terminal:

```bash
docker run --rm -p 3000:3000 -e VITE_API_URL=http://localhost:5000/api timesheet-frontend
```

For a convenient two-container run, use `docker compose up --build` instead.

## Team contributions

Add the team members and their contributions before submitting:

| Team member | Contribution |
| --- | --- |
| _Add name_ | _Add contribution_ |

## Submission evidence

Save labeled screenshots in `screenshots/` for the backend container, frontend container, and the frontend with submitted entries. Include the GitHub repository URL in the submission.
