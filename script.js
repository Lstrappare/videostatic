document.addEventListener("DOMContentLoaded", () => {
  // Referencias a los elementos del DOM
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");
  const controls = document.getElementById("controls");
  const previewContainer = document.getElementById("preview-container");
  const backgroundImage = document.getElementById("background-image");
  const foregroundImage = document.getElementById("foreground-image");
  const directionSelect = document.getElementById("direction");
  const durationInput = document.getElementById("duration");
  const shapeSelect = document.getElementById("shape");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const customTextInput = document.getElementById("custom-text");
  const customTextDisplay = document.getElementById("custom-text-display");
  const spinControlGroup = document.getElementById("spin-control-group");
  const spinCheckbox = document.getElementById("spin-checkbox");
  const borderCheckbox = document.getElementById("border-checkbox");
  const textColorSelect = document.getElementById("text-color-select");
  // Formas de las imágenes
  const shapeClasses = [
    "shape-default",
    "shape-square",
    "shape-circle",
    "shape-triangle",
  ];
  // Esta variable controlará si las animaciones ya han comenzado.
  let animationsHaveStarted = false;

  // --- CARGA DE ARCHIVOS ---
  dropZone.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(
      eventName,
      (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      false
    );
  });
  dropZone.addEventListener("dragover", () =>
    dropZone.classList.add("drag-over")
  );
  dropZone.addEventListener("dragleave", () =>
    dropZone.classList.remove("drag-over")
  );
  dropZone.addEventListener("drop", (e) => {
    dropZone.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  function handleFile(file) {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, suelta un archivo de imagen.");
      return;
    }
    const imageURL = URL.createObjectURL(file);
    backgroundImage.style.backgroundImage = `url(${imageURL})`;
    foregroundImage.style.backgroundImage = `url(${imageURL})`;

    dropZone.classList.add("hidden");
    controls.classList.remove("hidden");
    previewContainer.classList.remove("hidden");

    // Aplicamos los estilos visuales, pero ya NO iniciamos las animaciones.
    updateShape();
    updateBorder();
    updateTextColor();
    customTextDisplay.textContent = customTextInput.value;
  }

  // --- FUNCIONES DE ACTUALIZACIÓN ---
  function updateShape() {
    const selectedShape = shapeSelect.value;
    foregroundImage.classList.remove(...shapeClasses);
    foregroundImage.classList.add(`shape-${selectedShape}`);
    if (selectedShape === "circle") {
      spinControlGroup.classList.remove("hidden");
    } else {
      spinControlGroup.classList.add("hidden");
      spinCheckbox.checked = false;
    }
    updateSpin();
  }

  function updateSpin() {
    // Solo aplica la animación si ya ha comenzado y las condiciones se cumplen
    if (
      shapeSelect.value === "circle" &&
      spinCheckbox.checked &&
      animationsHaveStarted
    ) {
      foregroundImage.classList.add("spin-animation");
    } else {
      foregroundImage.classList.remove("spin-animation");
    }
  }

  function updateBorder() {
    if (borderCheckbox.checked) {
      foregroundImage.classList.add("has-border");
    } else {
      foregroundImage.classList.remove("has-border");
    }
  }

  function updateTextColor() {
    customTextDisplay.style.color = textColorSelect.value;
  }

  function updateBackgroundAnimation() {
    const direction = directionSelect.value;
    const duration = durationInput.value;
    const animationName = `move-${direction}`;
    backgroundImage.style.animation = "none";
    void backgroundImage.offsetWidth;
    backgroundImage.style.animation = `${animationName} ${duration}s linear infinite alternate`;
  }

  // --- EVENT LISTENERS ---

  shapeSelect.addEventListener("change", updateShape);
  borderCheckbox.addEventListener("change", updateBorder);
  textColorSelect.addEventListener("change", updateTextColor);
  customTextInput.addEventListener("input", () => {
    customTextDisplay.textContent = customTextInput.value;
  });

  // Los controles de animación ahora solo actualizarán la animación SI YA COMENZÓ.
  directionSelect.addEventListener("change", () => {
    if (animationsHaveStarted) updateBackgroundAnimation();
  });
  durationInput.addEventListener("input", () => {
    if (animationsHaveStarted) updateBackgroundAnimation();
  });
  spinCheckbox.addEventListener("change", () => {
    if (animationsHaveStarted) updateSpin();
  });

  // Pantalla Completa
  fullscreenBtn.addEventListener("click", () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      previewContainer.requestFullscreen().catch((err) => {
        alert(`Error al intentar entrar en pantalla completa: ${err.message}`);
      });
    }
  });

  // --- CLIC EN LA IMAGEN (MODIFICADA) ---
  foregroundImage.addEventListener("click", () => {
    // Si las animaciones NO han comenzado...
    if (!animationsHaveStarted) {
      // 1. Marca las animaciones como iniciadas.
      animationsHaveStarted = true;

      // 2. Llama a las funciones para aplicar las animaciones con los valores actuales.
      updateBackgroundAnimation();
      updateSpin();
    } else {
      // Si ya comenzaron, el clic simplemente pausa o reanuda.
      const bgPaused = backgroundImage.style.animationPlayState === "paused";
      const fgPaused = foregroundImage.style.animationPlayState === "paused";
      const newState = bgPaused || fgPaused ? "running" : "paused";

      backgroundImage.style.animationPlayState = newState;
      foregroundImage.style.animationPlayState = newState;
    }
  });

  // Cambio de tema
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute(
      "data-theme",
      currentTheme === "dark" ? "light" : "dark"
    );
  });
});
