require("dotenv").config()

const express = require("express")
const cors = require("cors")

const connectDB = require("./config/db")

// ── Routes ────────────────────────────────────────────────
const authRoutes       = require("./routes/authRoutes")
const userRoutes       = require("./routes/userRoutes")
const alarmRoutes      = require("./routes/alarmRoutes")
const objectRoutes     = require("./routes/objectRoutes")
const onboardingRoutes = require("./routes/onboardingRoutes")
const scanRoutes       = require("./routes/scanRoutes") // mission execution

// ── Middleware ────────────────────────────────────────────
const authenticateToken = require("./middleware/authenticateToken")

const app = express()

// ── Global Middleware ─────────────────────────────────────
app.use(cors())
app.use(express.json())

// ── Database ──────────────────────────────────────────────
connectDB()

// ── Public Routes (no auth required) ─────────────────────
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
    res.send("WaWa Backend Running!")
})

// ── Protected Routes (JWT required) ──────────────────────
app.use("/api/onboarding", authenticateToken, onboardingRoutes) // photo-challenge
app.use("/api/alarms",     authenticateToken, alarmRoutes)
app.use("/api/objects",    authenticateToken, objectRoutes)
app.use("/api/mission",    authenticateToken, scanRoutes) // mission execution
app.use("/api/users",      authenticateToken, userRoutes) // stats, history, profile, account

// ── Server ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})