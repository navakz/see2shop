async function loadScene() {
  const result =
    await chrome.storage.local.get("capturedScene");

  const image =
    document.getElementById("scene-image");

  const status =
    document.getElementById("status");

  if (!result.capturedScene?.image) {
    status.textContent =
      "No scene has been captured yet.";

    return;
  }

  image.src =
    result.capturedScene.image;

  const selection =
    result.capturedScene.selection;

  if (selection) {
    status.textContent =
      `Selected area captured: ${Math.round(selection.width)} × ${Math.round(selection.height)} pixels.`;
  }
}

loadScene();
