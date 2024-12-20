const axios = require("axios");

async function getLocation(ipAddress) {
  try {
    const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
    if (response.data.status === "success") {
      return {
        country: response.data.country,
        region: response.data.regionName,
        city: response.data.city,
        latitude: response.data.lat,
        longitude: response.data.lon,
        timezone: response.data.timezone
      };
    } else {
      throw new Error("Invalid IP address or API limit exceeded");
    }
  } catch (error) {
    console.error("Error fetching location:", error.message);
    return null;
  }
}

module.exports = getLocation;