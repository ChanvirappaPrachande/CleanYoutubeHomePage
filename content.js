// Fetch and render sections dynamically on the homepage
function fetchAndRender() {
  chrome.storage.local.get(
    ["bookmarks", "favorites", "playlists", "channels"],
    (result) => {
      const container = document.createElement("div");
      container.classList.add("custom-sections");

      // Render each section
      renderSection(container, "Bookmarks", result.bookmarks || [], 3);
      renderSection(container, "Favorites", result.favorites || [], 3);
      renderSection(container, "Playlists", result.playlists || [], 3);
      renderSection(container, "Shortcuts", result.channels || [], 1);

      const mainContainer = document.querySelector("ytd-browse");
      const existingContainer = document.querySelector(".custom-sections");
      if (existingContainer) existingContainer.remove(); // Avoid duplicates

      if (mainContainer) {
        mainContainer.prepend(container); // Insert custom sections
      }
    }
  );
}

// Render individual sections like Bookmarks
function renderSection(container, title, items, columns) {
  const section = document.createElement("div");
  section.classList.add("custom-section");
  section.innerHTML = `<h3>${title}</h3>`;
  const grid = document.createElement("div");
  grid.classList.add("video-grid");
  grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  items.forEach((item) => {
    grid.innerHTML += `<a href="${item.url}" target="_blank">${item.title}</a>`;
  });
  section.appendChild(grid);
  container.appendChild(section);
}

// Add bookmark options to the three-dot menu
function addBookmarkOptions() {
  const videos = document.querySelectorAll(
    "ytd-video-renderer, ytd-rich-item-renderer"
  );

  videos.forEach((video) => {
    const menuButton = video.querySelector("button#button"); // Updated selector for menu button
    if (!menuButton || video.hasAttribute("bookmark-added")) return;

    video.setAttribute("bookmark-added", "true");

    menuButton.addEventListener("click", () => {
      setTimeout(() => {
        const menu = document.querySelector("ytd-menu-popup-renderer");
        if (menu && !menu.querySelector(".bookmark-option")) {
          const options = [
            { id: "bookmarks", label: "Add to Bookmarks" },
            { id: "favorites", label: "Add to Favorites" },
            { id: "playlists", label: "Add to Playlists" },
            { id: "channels", label: "Add to Shortcuts" },
          ];

          options.forEach((option) => {
            const menuItem = document.createElement("tp-yt-paper-item");
            menuItem.classList.add("bookmark-option");
            menuItem.textContent = option.label;

            // Save to storage on click
            menuItem.addEventListener("click", () => {
              const title = video.querySelector("#video-title").innerText;
              const url = video.querySelector("#video-title").href;

              chrome.storage.local.get([option.id], (result) => {
                const list = result[option.id] || [];
                list.push({ title, url });
                chrome.storage.local.set({ [option.id]: list }, () => {
                  alert(`${title} added to ${option.label}`);
                  fetchAndRender(); // Refresh homepage sections
                });
              });
            });

            // Append options to the menu
            menu.appendChild(menuItem);
          });
        }
      }, 200); // Delay to ensure the menu has rendered
    });
  });
}

// Observe DOM changes and dynamically update options
const observer = new MutationObserver(() => {
  addBookmarkOptions(); // Update menus
  fetchAndRender(); // Refresh homepage sections
});

// Observe YouTube’s dynamic DOM changes
observer.observe(document.body, { childList: true, subtree: true });

// **New Listener**: Update homepage when storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (
    changes.bookmarks ||
    changes.favorites ||
    changes.playlists ||
    changes.channels
  ) {
    fetchAndRender(); // Refresh the homepage dynamically
  }
});

// Initial setup
addBookmarkOptions();
fetchAndRender();
