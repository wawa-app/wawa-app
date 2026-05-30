require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

// ── Routes ────────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const scanRoutes = require("./routes/scanRoutes");
const userRoutes = require("./routes/userRoutes");

// ── Middleware ────────────────────────────────────────────
const authenticateToken = require("./middleware/authenticateToken");

const app = express();

// ── Global Middleware ─────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Database ──────────────────────────────────────────────
connectDB();

// ── Public Routes (no auth required) ─────────────────────
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("WaWa Backend Running!");
});

// ── Protected Routes (JWT required) ──────────────────────
app.use("/api/scan",  authenticateToken, scanRoutes);
app.use("/api/users", authenticateToken, userRoutes);

// ── Server ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});