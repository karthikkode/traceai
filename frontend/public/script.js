(function () {

    const backendBaseUrl = "http://localhost:3000/"
    const backendUrl = `${backendBaseUrl}events`; // Update with your backend URL
    const typingDelay = 1000; // Delay in ms before logging
    let typingTimer; // Timer for tracking when the user stops typing
    let lastLoggedValue = ""; // To avoid logging duplicate values
  
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
            pageLoadTime
          },
        };
      
        sendEventData(eventData);
        paymentFailureApi();
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

  // Function to track search input
  const trackSearchInput = async (searchInput, traceEventName) => {
    try {
      if (searchInput && searchInput !== lastLoggedValue) {
        lastLoggedValue = searchInput; // Avoid duplicate calls

        const ipAddress = await fetchIpAddress();
        const eventData = {
          ipAddress,
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