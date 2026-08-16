chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {

    if (message.type !== "SEE2SHOP_CAPTURE_SELECTION") {
      return;
    }

    captureSelectedRegion(sender.tab, message.rect)
      .then(() => sendResponse({ ok: true }))
      .catch((error) => {
        console.error("See2Shop capture error:", error);

        sendResponse({
          ok: false,
          error: error.message
        });
      });

    return true;
  }
);

async function captureSelectedRegion(tab, rect) {
  if (!tab?.windowId) {
    throw new Error("Unable to determine browser window.");
  }

  if (!rect || rect.width < 20 || rect.height < 20) {
    throw new Error("Selected area is too small.");
  }

  const screenshot = await chrome.tabs.captureVisibleTab(
    tab.windowId,
    {
      format: "jpeg",
      quality: 90
    }
  );

  const croppedImage = await cropImage(
    screenshot,
    rect
  );

  await chrome.storage.local.set({
    capturedScene: {
      image: croppedImage,
      sourceUrl: tab.url || "",
      capturedAt: new Date().toISOString(),
      selection: {
        width: rect.width,
        height: rect.height
      }
    }
  });

  await openResults();
}

async function cropImage(dataUrl, rect) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  const bitmap = await createImageBitmap(blob);

  const scaleX = bitmap.width / window.innerWidth;
  const scaleY = bitmap.height / window.innerHeight;

  const sx = Math.max(
    0,
    Math.round(rect.left * scaleX)
  );

  const sy = Math.max(
    0,
    Math.round(rect.top * scaleY)
  );

  const sw = Math.min(
    bitmap.width - sx,
    Math.round(rect.width * scaleX)
  );

  const sh = Math.min(
    bitmap.height - sy,
    Math.round(rect.height * scaleY)
  );

  if (sw <= 0 || sh <= 0) {
    bitmap.close();

    throw new Error(
      "Selected region is outside the captured viewport."
    );
  }

  const canvas = new OffscreenCanvas(sw, sh);

  const context = canvas.getContext("2d");

  if (!context) {
    bitmap.close();

    throw new Error(
      "Unable to create image processing context."
    );
  }

  context.drawImage(
    bitmap,
    sx,
    sy,
    sw,
    sh,
    0,
    0,
    sw,
    sh
  );

  bitmap.close();

  const croppedBlob = await canvas.convertToBlob({
    type: "image/jpeg",
    quality: 0.9
  });

  return blobToDataUrl(croppedBlob);
}

async function blobToDataUrl(blob) {
  const buffer = await blob.arrayBuffer();

  let binary = "";

  const bytes = new Uint8Array(buffer);

  const chunkSize = 0x8000;

  for (
    let i = 0;
    i < bytes.length;
    i += chunkSize
  ) {
    binary += String.fromCharCode(
      ...bytes.subarray(
        i,
        Math.min(i + chunkSize, bytes.length)
      )
    );
  }

  return `data:${blob.type};base64,${btoa(binary)}`;
}

async function openResults() {
  const resultsUrl = chrome.runtime.getURL(
    "src/results/results.html"
  );

  await chrome.tabs.create({
    url: resultsUrl
  });
}
