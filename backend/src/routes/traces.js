const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res) => {
    const { name, stepCount } = req.body;
  
    try {
      const trace = await prisma.trace.create({
        data: {
          name,
          stepCount,
        },
      });
      res.status(201).json(trace);
    } catch (error) {
      console.error("Error creating trace:", error);
      res.status(500).json({ error: "Failed to create trace" });
    }
  });

module.exports = router;
