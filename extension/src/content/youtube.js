(() => {
  if (window.__see2shopLoaded) return;
  window.__see2shopLoaded = true;

  const createButton = () => {
    if (document.getElementById("see2shop-button")) return;

    const button = document.createElement("button");

    button.id = "see2shop-button";
    button.textContent = "✨ Shop this";
    button.title = "Find products in this scene";

    Object.assign(button.style, {
      position: "fixed",
      right: "24px",
      bottom: "90px",
      zIndex: "2147483647",
      border: "0",
      borderRadius: "24px",
      padding: "12px 18px",
      background: "#111",
      color: "#fff",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 4px 18px rgba(0,0,0,.3)"
    });

    button.addEventListener("click", () => {
      button.disabled = true;
      button.textContent = "🔎 Looking...";

      chrome.runtime.sendMessage(
        { type: "SEE2SHOP_CAPTURE_SCENE" },
        () => {
          button.disabled = false;
          button.textContent = "✨ Shop this";

          if (chrome.runtime.lastError) {
            console.error(
              "See2Shop:",
              chrome.runtime.lastError.message
            );
          }
        }
      );
    });

    document.body.appendChild(button);
  };

  createButton();

  const observer = new MutationObserver(() => {
    if (!document.getElementById("see2shop-button")) {
      createButton();
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
