require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const scanRoutes = require("./routes/scanRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// routes
app.use("/scan", scanRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
    res.send("WaWa Backend Running!");
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});