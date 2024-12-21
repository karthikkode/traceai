const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Create trace
router.post("/", async (req, res) => {
    const { name, data } = req.body;
  
    try {
      const trace = await prisma.trace.create({
        data: {
          name,
          data
        },
      });
      res.status(201).json(trace);
    } catch (error) {
      console.error("Error creating trace:", error);
      res.status(500).json({ error: "Failed to create trace" });
    }
  });

// Get all traces
router.get("/", async (req, res) => {
  try {
    const traces = await prisma.trace.findMany();
    res.status(200).json(traces);
  } catch (error) {
    console.error("Error fetching traces:", error);
    res.status(500).json({ error: "Failed to fetch traces" });
  }
});

// Update an existing trace
router.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, data } = req.body;

  try {
    const trace = await prisma.trace.update({
      where: { id: parseInt(id, 10) },
      data: { name, data },
    });
    res.status(200).json(trace);
  } catch (error) {
    console.error("Error updating trace:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Trace not found" });
    } else {
      res.status(500).json({ error: "Failed to update trace" });
    }
  }
});


module.exports = router;
