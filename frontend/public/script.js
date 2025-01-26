(function () {

  const backendBaseUrl = "http://localhost:3000/"
  const backendUrl = `${backendBaseUrl}events`; // Update with your backend URL
  const backendUrlMouse = `${backendBaseUrl}events/mouseMovement`; // Update with your backend URL
  const typingDelay = 1000; // Delay in ms before logging
  let typingTimer; // Timer for tracking when the user stops typing
  let lastLoggedValue = ""; // To avoid logging duplicate values
  let pageEnterTime = null; // Time when the current page is entered
  let prevUrl = null; // Previous URL
  let prevUrlEnterTime = null; // Time when the previous page was entered
  let prevUrlExitTime = null; // Time when the previous page was exited
  let mouseCoordinates = []; // Store mouse coordinates temporarily
  let batchInterval = 2000; // Send data to backend every 2 seconds

  let sessionId = sessionStorage.getItem("sessionId");
  if (window.location.href === "http://localhost:3001/" && sessionStorage.getItem("lastLoggedPage")!=="http://localhost:3001/") {
    // Reset sessionId when visiting exactly backendBaseUrl
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem("sessionId", sessionId);
  } else if (!sessionId) {
    // Create a new sessionId if not already set
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem("sessionId", sessionId);
  }
  


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

    const sendMouseData = async () => {
      if (mouseCoordinates.length === 0) return;
  
      try {
        const response = await fetch(backendUrlMouse, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            pageUrl: window.location.href,
            mouseData: mouseCoordinates,
          }),
        });
  
        if (response.ok) {
          console.log("Mouse data sent successfully");
          mouseCoordinates = []; // Clear the batch after sending
        } else {
          console.error("Failed to send mouse data:", await response.text());
        }
      } catch (error) {
        console.error("Error sending mouse data:", error);
      }
    };

    // Function to track mouse movement
    const trackMouseMovement = (event) => {
      const { clientX, clientY } = event;

      // Add coordinates to the batch
      mouseCoordinates.push({
        x: clientX,
        y: clientY,
        timestamp: Date.now(),
      });
    };

    // Set up periodic batch sending
    setInterval(() => {
      sendMouseData();
    }, batchInterval);

    document.addEventListener("mousemove", trackMouseMovement);

    const getPageLoadTime = () => {
      if (window.performance && window.performance.getEntriesByType) {
        const navigationEntries = window.performance.getEntriesByType("navigation");
    
        if (navigationEntries.length > 0) {
          const navigationTiming = navigationEntries[0];
          return navigationTiming.loadEventEnd - navigationTiming.startTime; // Total page load time in ms
        }
      }
      console.warn("PerformanceNavigationTiming API not supported.");
      return null; // Return null if metrics are not available
    };

    //Helper function to call the payment failure api
    const paymentFailureApi = async () => {
      try {
        const response = await fetch(`${backendBaseUrl}payment/pageVisitCount`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
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
      pageEnterTime = Date.now();
      
      // Check if the page visit was already logged
      const lastLoggedPage = sessionStorage.getItem("lastLoggedPage");
      const pageLoadTime = getPageLoadTime();
      if (lastLoggedPage === url) {
        console.log("Page visit already logged for this URL:", url);
        return; // Avoid logging duplicate page visits
      }
    
      // Store the current URL as the last logged page
      sessionStorage.setItem("lastLoggedPage", url);
    
      const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";
      const browser = navigator.userAgent;
      const ipAddress = await fetchIpAddress();
    
      const eventData = {
        ipAddress,
        sessionId,
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
          pageLoadTime,
          prevUrl,
          prevUrlEnterTime,
          prevUrlExitTime
        },
      };
    
      sendEventData(eventData);
      paymentFailureApi();
      prevUrl = url;
      prevUrlEnterTime = pageEnterTime;
      prevUrlExitTime = null; // Reset exit time for the new page
    };

    // Log page change
    const logPageChange = () => {
      if (pageEnterTime) {
        prevUrlExitTime = Date.now(); // Set the exit time for the previous page
        console.log(`Exiting page: ${prevUrl}, Time Spent: ${prevUrlExitTime - prevUrlEnterTime}ms`);
      }
    };

    // Function to log page exit
    const logPageOutEvent = async () => {
        const ipAddress = await fetchIpAddress();
        const eventData = {
          ipAddress,
          sessionId,
          location: null,
          elementId: null,
          elementContent: null,
          traceEventName: window.location.href,
          traceEvent: "page-out",
          url: window.location.href,
          deviceType: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
          browser: navigator.userAgent,
          additionalData: {
            eventType: "page_out",
            timestamp: Date.now(),
          },
        };

        sendEventData(eventData);
    };    
    const logPageInEvent = async () => {
        const ipAddress = await fetchIpAddress();
        const eventData = {
          ipAddress,
          sessionId,
          location: null,
          elementId: null,
          elementContent: null,
          traceEventName: window.location.href,
          traceEvent: "page-in",
          url: window.location.href,
          deviceType: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
          browser: navigator.userAgent,
          additionalData: {
            eventType: "page_in",
            timestamp: Date.now(),
          },
        };

        sendEventData(eventData);
    };    
    const handleVisibilityChange = () => {
      if (document.hidden) { // Log "page-out" only if the page is hidden and not already logged
        logPageOutEvent();
      } else if (!document.hidden) { // Log "page-in" only if the page is visible and "page-out" was logged
        logPageInEvent();
      }
    };

    // Attach the event listener
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Track URL changes
    const observeURLChange = () => {
      let lastURL = window.location.href;
  
      new MutationObserver(() => {
        const currentURL = window.location.href;
        if (currentURL !== lastURL) {
          logPageChange(); // Log exit for the previous page
          lastURL = currentURL;
          logPageVisit(); // Log visit for the new page
        }
      }).observe(document.body, { childList: true, subtree: true });
    };

// Function to track search input
const trackSearchInput = async (searchInput, traceEventName) => {
  try {
    if (searchInput && searchInput !== lastLoggedValue) {
      lastLoggedValue = searchInput; // Avoid duplicate calls

      const ipAddress = await fetchIpAddress();
      const eventData = {
        ipAddress,
        sessionId,
        location: null,
        elementId: traceEventName,
        elementContent: searchInput,
        traceEventName,
        traceEvent: "trace-search",
        url: window.location.href,
        deviceType: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
        browser: navigator.userAgent,
        additionalData: {
          eventType: "search_input",
        },
      };

      sendEventData(eventData);
    }
  } catch (error) {
    console.error("Error tracking search input:", error);
  }
};

  // Log click events
  document.addEventListener("click", async (event) => {
    let target = event.target;

    while (target && !target.hasAttribute("trace-click")) {
      target = target.parentElement;
    }

    if (!target) {
      console.log("No trace-click element found for this event.");
      return;
    }

    if (target && target.hasAttribute("trace-click")) {
      const traceType = target.getAttribute("trace-click");
      const content = target.innerText.trim();
      const id = target.id || "No ID";
      const url = window.location.href;
      const deviceType = /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";
      const browser = navigator.userAgent;
      const ipAddress = await fetchIpAddress(); // Fetch client IP

      console.log("Click Event Tracked for:", traceType);
      console.log("Content:", content);
      console.log("Element ID:", id);

      const eventData = {
        ipAddress,
        sessionId,
        location: null,
        elementId: id,
        elementContent: content,
        traceEventName: traceType,
        traceEvent: "trace-click",
        url,
        deviceType,
        browser,
        additionalData: {
          eventType: "click",
        },
      };

      sendEventData(eventData);
    }
  });

  // Detect page visits
  window.onload = logPageVisit; // Log when the page loads
  window.addEventListener("popstate", logPageVisit); // Log when navigating back/forward

// Initialize search bar tracking
const initializeSearchBarTracking = () => {
  const searchBars = document.querySelectorAll("[trace-search]");

  if (searchBars.length > 0) {
    searchBars.forEach((searchBar) => {
      const traceEventName = searchBar.getAttribute("trace-search");
      searchBar.addEventListener("input", (e) => {
        clearTimeout(typingTimer); // Clear previous timer
        const searchInput = e.target.value.trim(); // Get trimmed input value
        typingTimer = setTimeout(() => trackSearchInput(searchInput, traceEventName), typingDelay);
      });
    });
  } else {
    console.warn("No elements with [trace-search] attribute found.");
  }
};

const observeDOMChanges = () => {
  const observer = new MutationObserver(() => {
    initializeSearchBarTracking(); // Reinitialize search bar tracking
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

// Initialize tracking
const initializeTracking = () => {
  // Log initial page visit
  logPageVisit();

  // Observe URL changes
  observeURLChange();

  // Track search bar input
  initializeSearchBarTracking();
  observeDOMChanges();
};

// Ensure DOM is fully loaded before initializing
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeTracking);
} else {
  initializeTracking();
}
})();