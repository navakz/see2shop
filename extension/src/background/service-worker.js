chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "SEE2SHOP_CAPTURE_SCENE") {
    return;
  }

  captureScene(sender.tab)
    .then(() => sendResponse({ ok: true }))
    .catch((error) => {
      console.error("See2Shop capture error:", error);
      sendResponse({
        ok: false,
        error: error.message
      });
    });

  return true;
});

async function captureScene(tab) {
  if (!tab?.windowId) {
    throw new Error("Unable to determine the active browser window.");
  }

  const image = await chrome.tabs.captureVisibleTab(
    tab.windowId,
    { format: "jpeg", quality: 80 }
  );

  await chrome.storage.local.set({
    capturedScene: {
      image,
      sourceUrl: tab.url || "",
      capturedAt: new Date().toISOString()
    }
  });

  const resultsUrl = chrome.runtime.getURL(
    "src/results/results.html"
  );

  await chrome.tabs.create({
    url: resultsUrl
  });
}
