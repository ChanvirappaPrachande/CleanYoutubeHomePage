const hideRecommendations = () => {
  // Check if the page is the YouTube homepage
  if (window.location.pathname === "/") {
    const selectors = [
      "#primary", // Main video grid
      "ytd-rich-grid-renderer", // Home grid
      "ytd-browse", // Browse page content
    ];

    // Hide matched elements
    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        element.style.display = "none";
      });
    });
  }
};

// Observe dynamic changes to handle infinite scrolling
const observer = new MutationObserver(hideRecommendations);
observer.observe(document.body, { childList: true, subtree: true });

// Initial call
hideRecommendations();
