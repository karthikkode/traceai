const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

// Get organization details by user ID
router.get("/organization/:userId", async (req, res) => {
  const { userId } = req.params;
  console.log(userId)

  try {
    // Fetch the organization details based on the user ID
    const userWithOrganization = await prisma.customUser.findUnique({
      where: {
        id: userId,
      },
      include: {
        organization: true, // Include organization details
      },
    });

    if (!userWithOrganization) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!userWithOrganization.organization) {
      return res.status(404).json({ error: "Organization not found for this user" });
    }

    res.status(200).json(userWithOrganization.organization);
  } catch (error) {
    console.error("Error fetching organization details:", error);
    res.status(500).json({ error: "Failed to fetch organization details" });
  }
});

router.post("/create-organization", async (req, res) => {
    const { organizationName, userId } = req.body;
  
    if (!organizationName || !userId) {
      return res.status(400).json({ error: "Organization name and userId are required." });
    }
  
    try {
      // Create organization
      const organization = await prisma.organization.create({
        data: {
          name: organizationName,
        },
      });
  
      // Add user to CustomUser table and link to the organization
      const customUser = await prisma.customUser.create({
        data: {
          id: userId,
          organizationId: organization.id,
        },
      });
  
      res.status(201).json({
        message: "Organization and user created successfully.",
        organization,
        customUser,
      });
    } catch (error) {
      console.error("Error creating organization and user:", error);
      res.status(500).json({ error: "Failed to create organization and user." });
    }
  });

  
module.exports = router;
