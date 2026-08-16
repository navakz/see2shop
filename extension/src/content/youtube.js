(() => {
  if (window.__see2shopLoaded) return;
  window.__see2shopLoaded = true;

  const createButton = () => {
    if (document.getElementById("see2shop-button")) return;

    const button = document.createElement("button");
    button.id = "see2shop-button";
    button.textContent = "✨ Shop this";
    button.title = "Select something in this scene";

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

    button.addEventListener("click", startSelection);

    document.body.appendChild(button);
  };

  function startSelection() {
    if (document.getElementById("see2shop-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "see2shop-overlay";

    Object.assign(overlay.style, {
      position: "fixed",
      inset: "0",
      zIndex: "2147483646",
      cursor: "crosshair",
      background: "rgba(0,0,0,.08)"
    });

    const instructions = document.createElement("div");

    instructions.textContent =
      "Drag around the item or scene you want • Esc to cancel";

    Object.assign(instructions.style, {
      position: "absolute",
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      padding: "10px 16px",
      borderRadius: "20px",
      background: "#111",
      color: "#fff",
      font: "600 14px Arial, sans-serif",
      boxShadow: "0 4px 16px rgba(0,0,0,.3)",
      pointerEvents: "none"
    });

    overlay.appendChild(instructions);

    const selection = document.createElement("div");

    Object.assign(selection.style, {
      position: "absolute",
      display: "none",
      border: "2px solid #fff",
      background: "rgba(255,255,255,.12)",
      boxShadow: "0 0 0 99999px rgba(0,0,0,.18)",
      pointerEvents: "none"
    });

    overlay.appendChild(selection);
    document.body.appendChild(overlay);

    let startX = 0;
    let startY = 0;
    let dragging = false;

    const getRect = (x1, y1, x2, y2) => ({
      left: Math.min(x1, x2),
      top: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1)
    });

    const updateSelection = (x, y) => {
      const rect = getRect(startX, startY, x, y);

      Object.assign(selection.style, {
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`
      });
    };

    const cleanup = () => {
      overlay.remove();
      document.removeEventListener("keydown", onKeyDown);
    };

    const onPointerDown = (event) => {
      if (event.button !== 0) return;

      dragging = true;

      startX = event.clientX;
      startY = event.clientY;

      selection.style.display = "block";

      updateSelection(event.clientX, event.clientY);

      event.preventDefault();
    };

    const onPointerMove = (event) => {
      if (!dragging) return;

      updateSelection(event.clientX, event.clientY);
    };

    const onPointerUp = async (event) => {
      if (!dragging) return;

      dragging = false;

      const rect = getRect(
        startX,
        startY,
        event.clientX,
        event.clientY
      );

      cleanup();

      if (rect.width < 20 || rect.height < 20) {
        return;
      }

      const button =
        document.getElementById("see2shop-button");

      if (button) {
        button.disabled = true;
        button.textContent = "🔎 Capturing...";
      }

      try {
        await chrome.runtime.sendMessage({
          type: "SEE2SHOP_CAPTURE_SELECTION",
          rect: {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
            devicePixelRatio:
              window.devicePixelRatio || 1
          }
        });
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = "✨ Shop this";
        }
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        cleanup();
      }
    };

    overlay.addEventListener(
      "pointerdown",
      onPointerDown
    );

    overlay.addEventListener(
      "pointermove",
      onPointerMove
    );

    overlay.addEventListener(
      "pointerup",
      onPointerUp
    );

    document.addEventListener(
      "keydown",
      onKeyDown
    );
  }

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
