const express = require("express");
const { PrismaClient } = require("@prisma/client");
const {  buildQuery } = require("../utilities/buildQuery");
const JSONbig = require('json-bigint');
const { buildMetabaseQuery } = require("../utilities/buildMetabaseQuery");

const prisma = new PrismaClient();
const router = express.Router();

// Create trace
router.post("/", async (req, res) => {
    const { name, data } = req.body;
    traceMetabaseCard = await buildMetabaseQuery(data.steps, name)
    try {
      const trace = await prisma.trace.create({
        data: {
          name,
          data,
          traceMetabaseCard
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
  const { name, description, data, cardID } = req.body;
  
  try {
    const traceMetabaseCard = await buildMetabaseQuery(data.steps, name, cardID)
    const trace = await prisma.trace.update({
      where: { id },
      data: { name, data, description, traceMetabaseCard},
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

// Delete a trace
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Attempt to delete the trace
    const deletedTrace = await prisma.trace.delete({
      where: { id }
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

// Get query of a trace
router.post("/getTraceData/funnel", async (req, res) => {
  try {
    const { steps } = req.body;
    const sql = await buildQuery(steps)
    const result = await prisma.$queryRawUnsafe(sql);
    // Serialize result to handle BigInt values
    const serializedResult = JSONbig.stringify({ data: result });

    res.status(200).send(serializedResult);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }finally {
    await prisma.$disconnect();
  }

});

module.exports = router;
