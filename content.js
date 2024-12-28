// Hide video recommendations
const hideRecommendations = () => {
  const selectors = [
    "#primary", // Main video grid
    "#secondary", // Sidebar recommendations
    "#related", // Related videos on the right
    "ytd-rich-grid-renderer", // Home grid
    "ytd-item-section-renderer", // Sections
    "ytd-browse", // Browse page content
  ];

  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      element.style.display = "none";
    });
  });
};

// Observe changes for dynamically loaded content
const observer = new MutationObserver(() => hideRecommendations());
observer.observe(document.body, { childList: true, subtree: true });

// Initial call
hideRecommendations();
