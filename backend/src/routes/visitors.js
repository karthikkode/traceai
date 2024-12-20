const getLocation = require("../utilities/getLocation");
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req, res) => {
  const { ipAddress } = req.body;
  let location;
  await getLocation(ipAddress).then((res) => location = res.country);

  try {
    console.log("location", location)
    const visitor = await prisma.visitor.create({
      data: { ipAddress },
    });
    res.status(201).json(visitor);
  } catch (error) {
    console.error("Error creating visitor:", error);
    res.status(500).json({ error: "Failed to create visitor" });
  }
});

router.get("/", async (req, res) => {
  try {
    const visitors = await prisma.visitor.findMany();
    res.status(200).json(visitors);
  } catch (error) {
    console.error("Error retrieving visitors:", error);
    res.status(500).json({ error: "Failed to retrieve visitors" });
  }
});

module.exports = router;
