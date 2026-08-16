chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {

    if (message.type === "SEE2SHOP_CAPTURE_SCENE") {
      captureFullScene(sender.tab)
        .then(() => sendResponse({ ok: true }))
        .catch((error) => {
          console.error("See2Shop:", error);
          sendResponse({
            ok: false,
            error: error.message
          });
        });

      return true;
    }

    if (message.type === "SEE2SHOP_CAPTURE_SELECTION") {
      captureSelection(sender.tab, message.rect)
        .then(() => sendResponse({ ok: true }))
        .catch((error) => {
          console.error("See2Shop:", error);
          sendResponse({
            ok: false,
            error: error.message
          });
        });

      return true;
    }
  }
);

async function captureFullScene(tab) {
  const image = await chrome.tabs.captureVisibleTab(
    tab.windowId,
    {
      format: "jpeg",
      quality: 80
    }
  );

  await chrome.storage.local.set({
    capturedScene: {
      image,
      sourceUrl: tab.url || "",
      capturedAt: new Date().toISOString(),
      selection: null
    }
  });

  await openResults();
}

async function captureSelection(tab, rect) {
  const image = await chrome.tabs.captureVisibleTab(
    tab.windowId,
    {
      format: "jpeg",
      quality: 90
    }
  );

  await chrome.storage.local.set({
    capturedScene: {
      image,
      sourceUrl: tab.url || "",
      capturedAt: new Date().toISOString(),
      selection: rect
    }
  });

  await openResults();
}

async function openResults() {
  const resultsUrl = chrome.runtime.getURL(
    "src/results/results.html"
  );

  await chrome.tabs.create({
    url: resultsUrl
  });
}
