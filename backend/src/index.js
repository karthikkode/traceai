const express = require("express");
const dotenv = require("dotenv");
const visitorRoutes = require("./routes/visitors");
const eventRoutes = require("./routes/events");

dotenv.config();

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors({ origin: "https://your-frontend-url.onrender.com" }));


// Routes
app.use("/visitors", visitorRoutes);
app.use("/events", eventRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("TraceAI Core Service is Running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});