const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');
const prisma = require('@prisma/client'); // Assuming you're using Prisma for data fetching

const generateHeatmapImage = async (pageUrl, heatmapData) => {
  try {
    // Create a canvas with a black background
    const canvasWidth = 1920; // Adjust based on client dimensions
    const canvasHeight = 1080;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Fill the canvas with black
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Calculate intensity for each point
    const intensityMap = new Map();
    heatmapData.forEach((point) => {
      const key = `${point.x},${point.y}`;
      if (intensityMap.has(key)) {
        intensityMap.set(key, intensityMap.get(key) + 1);
      } else {
        intensityMap.set(key, 1);
      }
    });

    // Get max intensity
    const maxIntensity = Math.max(...intensityMap.values());

    // Draw the heatmap overlay with gradient
    intensityMap.forEach((count, key) => {
      const [x, y] = key.split(',').map(Number);
      const intensity = count / maxIntensity; // Normalize intensity (0 to 1)

      // Choose color based on intensity
      const color = intensity > 0.7
        ? `rgba(255, 0, 0, ${intensity})` // Red for hot areas
        : intensity > 0.3
        ? `rgba(255, 165, 0, ${intensity})` // Orange for warm areas
        : `rgba(0, 255, 0, ${intensity})`; // Green for cooler areas

      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2, true); // Circle radius can be adjusted
      ctx.fillStyle = color;
      ctx.fill();
    });

    // Save the canvas to an image file
    const outputPath = path.join(__dirname, 'output', `${Date.now()}-heatmap.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);

    return outputPath;
  } catch (error) {
    console.error('Error generating heatmap:', error);
    throw error;
  }
};

module.exports = generateHeatmapImage;
