const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import CORS middleware
const visitorRoutes = require("./routes/visitors");
const eventRoutes = require("./routes/events");
const traceRoutes = require("./routes/traces");
const userRoutes = require("./routes/user");
const paymentRoutes = require("./routes/payment");
const formRoutes = require("./routes/forms");

dotenv.config();

const app = express();
app.use(express.json());

// Enable CORS with specific options
const corsOptions = {
  origin: ["http://localhost:8080", "http://localhost:3001"], // Add your frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};
app.options("*", cors(corsOptions));
app.use(cors(corsOptions)); // Apply CORS middleware with options

// Routes
app.use("/visitors", visitorRoutes);
app.use("/events", eventRoutes);
app.use("/traces", traceRoutes);
app.use("/user", userRoutes);
app.use("/payment", paymentRoutes);
app.use("/form", formRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("TraceAI Core Service is Running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
