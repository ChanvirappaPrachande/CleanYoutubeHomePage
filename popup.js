addItemBtn.addEventListener("click", () => {
  const type = listType.value;
  const title = titleInput.value;
  const url = urlInput.value;

  if (title && url) {
    chrome.storage.local.get([type], (result) => {
      const items = result[type] || [];
      items.push({ title, url });
      chrome.storage.local.set({ [type]: items }, () => {
        loadList(type);
      });
    });
  }
});

function deleteItem(type, index) {
  chrome.storage.local.get([type], (result) => {
    const items = result[type] || [];
    items.splice(index, 1);
    chrome.storage.local.set({ [type]: items }, () => {
      loadList(type);
    });
  });
}

listType.addEventListener("change", () => loadList(listType.value));
loadList(listType.value);
