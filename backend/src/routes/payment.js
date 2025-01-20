const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like Outlook, Yahoo, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// POST API to add a new payment URL
router.post("/addPaymentUrl", async (req, res) => {
    const { url } = req.body;
  
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }
  
    try {
      const newUrl = await prisma.paymentUrl.create({
        data: {
          url,
        },
      });
  
      return res.status(201).json({ message: "URL added successfully", data: newUrl });
    } catch (error) {
      console.error("Error adding URL:", error);
      return res.status(500).json({ error: "Failed to add URL" });
    }
  });

  // GET API to fetch all payment URLs
router.get("/getPaymentUrls", async (req, res) => {
    try {
      const urls = await prisma.paymentUrl.findMany();
      return res.status(200).json({ message: "URLs fetched successfully", data: urls });
    } catch (error) {
      console.error("Error fetching URLs:", error);
      return res.status(500).json({ error: "Failed to fetch URLs" });
    }
  });


  router.put("/updatePaymentUrl", async (req, res) => {
    const { currentUrl, newUrl } = req.body;
  
    if (!currentUrl || !newUrl) {
      return res.status(400).json({ error: "Both currentUrl and newUrl are required" });
    }
  
    try {
      // Check if the URL exists
      const existingUrl = await prisma.paymentUrl.findFirst({
        where: { url: currentUrl },
      });
  
      if (!existingUrl) {
        return res.status(404).json({ error: "Current URL not found" });
      }
  
      // Update the URL
      const updatedUrl = await prisma.paymentUrl.update({
        where: { id: existingUrl.id },
        data: { url: newUrl },
      });
  
      return res.status(200).json({ message: "URL updated successfully", data: updatedUrl });
    } catch (error) {
      console.error("Error updating URL:", error);
      return res.status(500).json({ error: "Failed to update URL" });
    }
  });

  // API to count page visits for the stored payment URL
  router.get("/pageVisitCount", async (req, res) => {
    try {
      // Fetch the payment URL and monitoring settings from the database
      const paymentUrl = await prisma.paymentUrl.findFirst();
  
      if (!paymentUrl || !paymentUrl.url) {
        return res.status(404).json({ error: "No payment URL found." });
      }
  
      const durationInMinutes = paymentUrl.duration; // Duration in minutes
      const currentTime = new Date();
      const windowStartTime = new Date(currentTime.getTime() - durationInMinutes * 60 * 1000);
  
      // Count events matching the payment URL within the duration
      const count = await prisma.event.count({
        where: {
          traceEvent: "page-visit",
          traceEventName: {
            contains: paymentUrl.url, // Matching the URL in the traceEventName
          },
          createdAt: {
            gte: windowStartTime, // Within the specified duration
          },
        },
      });
  
      const limit = 5; // Example failure threshold
  
      // Check if an email was sent within the current duration window
      if (paymentUrl.lastEmailSentAt && new Date(paymentUrl.lastEmailSentAt) >= windowStartTime) {
        console.log("Email already sent within the current window. Skipping...");
        return res.status(200).json({ count, message: "Email already sent in the current window." });
      }
  
      // If the count exceeds the limit, send an email
      if (count >= limit) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: "tsaikarthik@yahoo.in", // Replace with the recipient's email
          subject: "High Traffic Alert",
          text: `The page "${paymentUrl.url}" has exceeded the traffic limit of ${limit} within ${durationInMinutes} minutes. Current count: ${count}`,
        };
  
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully.");
  
        // Update the lastEmailSentAt timestamp in the database
        await prisma.paymentUrl.update({
          where: { id: paymentUrl.id },
          data: {
            lastEmailSentAt: currentTime, // Update the last email sent time
          },
        });
      }
  
      return res.status(200).json({ count });
    } catch (error) {
      console.error("Error counting page visits:", error);
      return res.status(500).json({ error: "Failed to count page visits." });
    } finally {
      await prisma.$disconnect();
    }
  });  
module.exports = router;