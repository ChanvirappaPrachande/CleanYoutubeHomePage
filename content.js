const hideRecommendations = () => {
  const selectors = [
    "#primary",
    "#secondary",
    "#related",
    "ytd-rich-grid-renderer",
    "ytd-item-section-renderer",
    "ytd-browse",
  ];

  selectors.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => (element.style.display = "none"));
  });
};

const observer = new MutationObserver(() => hideRecommendations());
observer.observe(document.body, { childList: true, subtree: true });

hideRecommendations();
