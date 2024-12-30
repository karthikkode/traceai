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

// Get a specific trace by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id)
  try {
    const trace = await prisma.trace.findUnique({
      where: { id },
    });

    if (!trace) {
      return res.status(404).json({ error: "Trace not found" });
    }

    res.status(200).json(trace);
  } catch (error) {
    console.error("Error fetching trace:", error);
    res.status(500).json({ error: "Failed to fetch trace" });
  }
});

// Update an existing trace
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, data } = req.body;
  console.log(id)
  try {
    const trace = await prisma.trace.update({
      where: { id },
      data: { name, data, description },
    });
    res.status(200).json(trace);
    console.log(id)

  } catch (error) {
    console.error("Error updating trace:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "Trace not found" });
    } else {
      res.status(500).json({ error: "Failed to update trace" });
    }
  }
});

//Delete a trace
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Attempt to delete the trace
    const deletedTrace = await prisma.trace.delete({
      where: { id: parseInt(id, 10) }, // Ensure `id` is a number
    });

    res.status(200).json({
      message: "Trace deleted successfully",
      deletedTrace,
    });
  } catch (error) {
    console.error("Error deleting trace:", error);

    // Handle cases where the trace does not exist
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Trace not found" });
    }

    // Handle any other errors
    res.status(500).json({ error: "Failed to delete trace" });
  }
});


module.exports = router;
