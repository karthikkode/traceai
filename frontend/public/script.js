(function () {

    const backendUrl = "http://localhost:3000/events/"; // Update with your backend URL
  
      // Helper function to fetch the client's IP address
      const fetchIpAddress = async () => {
        try {
          const response = await fetch("https://api64.ipify.org?format=json"); // Example service to fetch IP
          if (response.ok) {
            const data = await response.json();
            return data.ip;
          } else {
            console.error("Failed to fetch IP address.");
            return null;
          }
        } catch (error) {
          console.error("Error fetching IP address:", error);
          return null;
        }
      };
  
      // Helper function to send event data to the API
      const sendEventData = async (data) => {
        try {
          const response = await fetch(backendUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
  
          if (response.ok) {
            const responseData = await response.json();
            console.log("Event logged successfully:", responseData);
          } else {
            console.error("Failed to log event:", await response.text());
          }
        } catch (error) {
          console.error("Error sending event data:", error);
        }
      };
  
      const logPageVisit = async () => {
        const url = window.location.href;
        const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";
        const browser = navigator.userAgent;
        const ipAddress = await fetchIpAddress();
    
        const eventData = {
          ipAddress,
          location: null,
          elementId: null,
          elementContent: null,
          traceEventName: url,
          traceEvent: "page-visit",
          url,
          deviceType,
          browser,
          additionalData: {
            eventType: "page_visit",
          },
        };
    
        sendEventData(eventData);
      };
    
      // Track URL changes
      const observeURLChange = () => {
        let lastURL = window.location.href;
    
        new MutationObserver(() => {
          const currentURL = window.location.href;
          if (currentURL !== lastURL) {
            lastURL = currentURL;
            console.log("URL changed to:", currentURL);
            logPageVisit();
          }
        }).observe(document.body, { childList: true, subtree: true });
      };
    
      // Log initial page visit
      logPageVisit();
    
      // Observe URL changes
      observeURLChange();
  
    
    })();
    
  