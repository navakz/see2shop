async function loadScene() {
  const result = await chrome.storage.local.get("capturedScene");

  const image = document.getElementById("scene-image");

  if (!result.capturedScene?.image) {
    document.getElementById("status").textContent =
      "No scene has been captured yet.";

    return;
  }

  image.src = result.capturedScene.image;
}

loadScene();
