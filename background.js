chrome.runtime.onInstalled.addListener(() => {
  const menuItems = [
    { id: "addBookmark", title: "Add to Bookmarks" },
    { id: "addFavorite", title: "Add to Favorites" },
    { id: "addPlaylist", title: "Add to Playlists" },
    { id: "addChannel", title: "Add to Channels" },
  ];

  menuItems.forEach((item) => {
    chrome.contextMenus.create({
      id: item.id,
      title: item.title,
      contexts: ["link"],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const url = info.linkUrl;
  const title = info.selectionText || "Untitled";
  const type = info.menuItemId.replace("add", "").toLowerCase();

  chrome.storage.local.get([type], (result) => {
    const list = result[type] || [];
    list.push({ title, url });
    chrome.storage.local.set({ [type]: list }, () => {
      console.log(`Added ${title} to ${type}`);
    });
  });
});
