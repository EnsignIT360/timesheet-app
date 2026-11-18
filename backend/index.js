const express = require('express');
const cors = require('cors');

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// The lab stores entries in memory, so data resets when the backend restarts.
const timesheets = [];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/timesheet', (_req, res) => {
  res.json(timesheets);
});

app.post('/api/timesheet', (req, res) => {
  const employeeName = typeof req.body.employeeName === 'string'
    ? req.body.employeeName.trim()
    : '';
  const hours = Number(req.body.hours);

  if (!employeeName || !Number.isFinite(hours) || hours <= 0 || hours > 24) {
    return res.status(400).json({
      message: 'Enter an employee name and hours between 0 and 24.',
    });
  }

  const entry = {
    id: timesheets.length + 1,
    employeeName,
    hours,
    submittedAt: new Date().toISOString(),
  };
  timesheets.unshift(entry);
  return res.status(201).json(entry);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend running on port ${port}`);
});
