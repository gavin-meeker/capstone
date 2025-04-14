import express from "express";
import router from "./router.js";
import cors from "cors";

const app = express();

// Configure CORS to allow requests from the client
// In development, the client runs on a different port
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' // Change this to your production domain
    : ['http://localhost:5173', 'http://localhost:3000'], // Vite default port and alternative
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware to parse different request types
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API routes
app.use("/v1", router);

// Root path for API health check
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "SOC Investigation Tool API is running",
    version: "1.0.0" 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: true,
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: `Not found: ${req.method} ${req.originalUrl}`
  });
});

export default app;