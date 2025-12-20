//Open The Styles Menu
function invokeStyleMenu() {
    if (currentlySelected) {
        styles.classList.remove('content-hide');
        loadedPage.classList.add("sidebar-active");
        checkRestrictedControls();
        loadStylesFromSelected();
    }
}

// === STYLE EDITOR LOGIC ===
//Behavior Options
const hideOnDesktop = document.getElementById("style-editor-hide-on-desktop-checkbox");
const hideOnMobile = document.getElementById("style-editor-hide-on-mobile-checkbox");
const responsiveCollapse = document.getElementById("style-editor-responsive-collapse-checkbox");

// Background color input
const backgroundColorInput = document.getElementById("style-editor-bg-color-input");
const backgroundColorValueSpan = document.getElementById("style-editor-bg-color-input-value");
const backgroundColorRemove = document.getElementById("style-editor-bg-color-remove");

// Border inputs
const borderColorInput = document.getElementById("style-editor-border-color-input");
const borderColorValueSpan = document.getElementById("style-editor-border-color-input-value");
const borderWidthInput = document.getElementById("style-editor-border-width-input");
const borderRadiusInput = document.getElementById("style-editor-border-radius-input");

// Width input
const widthInput = document.getElementById("style-editor-width-input");

// Alignment buttons
const alignLeft = document.getElementById("style-editor-align-left-button");
const alignCenter = document.getElementById("style-editor-align-center-button");
const alignRight = document.getElementById("style-editor-align-right-button");
const alignTop = document.getElementById("style-editor-align-top-button");
const alignMiddle = document.getElementById("style-editor-align-middle-button");
const alignBottom = document.getElementById("style-editor-align-bottom-button");

// Padding inputs
const paddingTopInput = document.getElementById("style-editor-padding-top-input");
const paddingLeftInput = document.getElementById("style-editor-padding-left-input");
const paddingRightInput = document.getElementById("style-editor-padding-right-input");
const paddingBottomInput = document.getElementById("style-editor-padding-bottom-input");

// Image Options
const imageDefault = document.getElementById("style-editor-image-default-button");
const imageCrop = document.getElementById("style-editor-image-crop-button");
const imageRatio = document.getElementById("style-editor-image-ratio-button");
const imageRatioWidthInput = document.getElementById("style-editor-ratio-width-input");
const imageCropWidthInput = document.getElementById("style-editor-crop-width-input");
const imageCropHeightInput = document.getElementById("style-editor-crop-height-input");
const imageCropPositionInput = document.getElementById("style-editor-crop-position-input");

// ===============================
// HELPERS
// ===============================
function parsePercent(value, fallback = 100) {
  const match = value.match(/([\d.]+)%/);
  return match ? parseFloat(match[1]) : fallback;
}

function parsePx(value, fallback = 0) {
  const match = value.match(/([\d.]+)px/);
  return match ? parseFloat(match[1]) : fallback;
}

// ===============================
// BACKGROUND COLOR
// ===============================
backgroundColorInput.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.style.backgroundColor = backgroundColorInput.value;
  }
  if (backgroundColorValueSpan) {
    backgroundColorValueSpan.textContent = backgroundColorInput.value.toUpperCase();
  }
});

// ===============================
// BORDER INPUTS
// ===============================
borderColorInput?.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.style.borderColor = borderColorInput.value;
  }
  if (borderColorValueSpan) {
    borderColorValueSpan.textContent = borderColorInput.value.toUpperCase();
  }
});

borderWidthInput?.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    let value = parseInt(borderWidthInput.value) || 0;
    currentlySelected.style.borderWidth = value + "px";
    currentlySelected.style.borderStyle = value > 0 ? "solid" : "none"; // ensure visible border
  }
});

borderRadiusInput?.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    let value = parseInt(borderRadiusInput.value) || 0;
    currentlySelected.style.borderRadius = value + "px";
  }
});

// ===============================
// WIDTH CONTROL (direct input)
// ===============================
widthInput.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    let uiPercent = parseFloat(widthInput.value) || 100;
    uiPercent = Math.max(5, Math.min(100, uiPercent));
    widthInput.value = uiPercent;
    if (uiPercent >= 100) {
        currentlySelected.style.width = "";
    } else {
        currentlySelected.style.width = `calc(${uiPercent}% - 2rem)`;
    }
  }
});

// ===============================
// IMAGE WIDTH CONTROL (direct input)
// ===============================
imageRatioWidthInput.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    let width = parseFloat(imageRatioWidthInput.value) || 100;
    width = Math.max(10, Math.min(9999, width));
    currentlySelected.style.width = width + "px";
  }
});

imageCropWidthInput.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    let width = parseFloat(imageCropWidthInput.value) || 100;
    width = Math.max(10, Math.min(9999, width));
    currentlySelected.style.width = width + "px";
  }
});

// ===============================
// IMAGE HEIGHT CONTROL (direct input)
// ===============================
imageCropHeightInput.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    let height = parseFloat(imageCropHeightInput.value) || 100;
    height = Math.max(10, Math.min(9999, height));
    currentlySelected.style.height = height + "px";
  }
});

// ===============================
// IMAGE POSITION CONTROL (direct input)
// ===============================
imageCropPositionInput.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    let position = parseFloat(imageCropPositionInput.value) || 100;
    position = Math.max(5, Math.min(100, position));
    currentlySelected.style.objectPosition = position + "%";
  }
});

//
// ALIGNMENT
// Utility: mark the right button active
function highlightActiveControls() {
  if (!currentlySelected) return;

  // Clear old actives
  [alignLeft, alignCenter, alignRight, alignTop, alignMiddle, alignBottom, imageDefault, imageRatio, imageCrop]
    .forEach(btn => btn.classList.remove("active"));

  // Horizontal
  if (currentlySelected.classList.contains("building-block-align-left")) {
    alignLeft.classList.add("active");
  } else if (currentlySelected.classList.contains("building-block-align-center")) {
    alignCenter.classList.add("active");
  } else if (currentlySelected.classList.contains("building-block-align-right")) {
    alignRight.classList.add("active");
  }

  // Vertical
  if (currentlySelected.classList.contains("building-column-content-top")) {
    alignTop.classList.add("active");
  } else if (currentlySelected.classList.contains("building-column-content-center")) {
    alignMiddle.classList.add("active");
  } else if (currentlySelected.classList.contains("building-column-content-bottom")) {
    alignBottom.classList.add("active");
  }

  // Image
  if (currentlySelected.classList.contains("ratio-image")) {
    imageRatio.classList.add("active");
  } else if (currentlySelected.classList.contains("crop-image")) {
    imageCrop.classList.add("active");
  } else if (currentlySelected.classList.contains("default-image")) {
    imageDefault.classList.add("active");
  }
}



// Wrap existing button handlers so they also highlight
function wrapWithHighlight(fn) {
  return () => {
    fn();
    highlightActiveControls();
  };
}

// Replace your listeners with wrapped ones
alignLeft.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-block-align-center", "building-block-align-right");
    currentlySelected.classList.add("building-block-align-left");
  }
}));

alignCenter.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-block-align-left", "building-block-align-right");
    currentlySelected.classList.add("building-block-align-center");
  }
}));

alignRight.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-block-align-left", "building-block-align-center");
    currentlySelected.classList.add("building-block-align-right");
  }
}));

alignTop.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-column-content-center", "building-column-content-bottom");
    currentlySelected.classList.add("building-column-content-top");
  }
}));

alignMiddle.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-column-content-top", "building-column-content-bottom");
    currentlySelected.classList.add("building-column-content-center");
  }
}));

alignBottom.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("building-column-content-top", "building-column-content-center");
    currentlySelected.classList.add("building-column-content-bottom");
  }
}));

imageRatio.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("default-image");
    currentlySelected.classList.remove("crop-image");
    currentlySelected.classList.add("ratio-image");
  }
}));

imageCrop.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("default-image");
    currentlySelected.classList.remove("ratio-image");
    currentlySelected.classList.add("crop-image");
  }
}));

imageDefault.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    currentlySelected.classList.remove("ratio-image");
    currentlySelected.classList.remove("crop-image");
    currentlySelected.classList.add("default-image");
  }
}));

// ===============================
// PADDING INPUTS
// ===============================
function updatePaddingInput(side, inputEl) {
  inputEl.addEventListener("input", () => {
    if (currentlySelected) {
      currentlySelected.classList.add("custom-styles");
      let value = parseInt(inputEl.value) || 0;
      currentlySelected.style[`padding${side}`] = Math.max(0, value) + "px";
    }
  });
}

updatePaddingInput("Top", paddingTopInput);
updatePaddingInput("Left", paddingLeftInput);
updatePaddingInput("Right", paddingRightInput);
updatePaddingInput("Bottom", paddingBottomInput);

// Helper: Convert "rgb(r,g,b)" or "rgba(r,g,b,a)" to "#rrggbb"
function rgbToHex(rgb) {
    if (!rgb || rgb === "none" || rgb === "transparent") return "#FFFFFF";
    const result = rgb.match(/\d+/g);
    if (!result) return "#000000";
    let [r, g, b] = result.slice(0, 3);
    r = parseInt(r).toString(16).padStart(2, "0");
    g = parseInt(g).toString(16).padStart(2, "0");
    b = parseInt(b).toString(16).padStart(2, "0");

    return `#${r}${g}${b}`;
}

//Helper: Parse both %s and calc(%s - 2rem)
function getRealWidthPercent() {
    if (!currentlySelected) return 100;
    const styleWidth = currentlySelected.style.width;
    if (!styleWidth) return 100;

    const calcMatch = styleWidth.match(/calc\((\d*\.?\d+)%/);
    if (calcMatch && calcMatch[1]) {
        return parseFloat(calcMatch[1]);
    }
    if (styleWidth.includes("%")) {
        return parseFloat(styleWidth);
    }
    return 100;
}

//Helper: Find all elements with an inline width value
function findWidth() {
  const blocksWithWidth = []; 
    const allBlocks = document.querySelectorAll('.building-block');

  allBlocks.forEach(block => {
    if (block.style.width) {
        blocksWithWidth.push({
            element: block,
            width: block.style.width
        });
    }
  });

  return blocksWithWidth;
}

//Helper: Clean all width values
function cleanWidth() {
  const foundBlocks = findWidth();

  if (foundBlocks && foundBlocks.length > 0) {
    foundBlocks.forEach(item => {
      const element = item.element;
      const dirtyWidth = item.width;
      let realPercent = null;

      if (dirtyWidth.includes("calc")) {
        const calcMatch = dirtyWidth.match(/calc\((\d*\.?\d+)%/);
        
        if (calcMatch && calcMatch[1]) {
          realPercent = parseFloat(calcMatch[1]);
        }
      }

      if (realPercent !== null) {
        const cleanStyle = `${realPercent}%`;
        element.style.width = cleanStyle;
      }
    });
  } else {
    return;
  }
}

//Helper: Load the cropped image styles
function loadImageValues() {
    if (currentlySelected.classList.contains("image-element")) {
        const computedStyle = window.getComputedStyle(currentlySelected);
        const inlineStyle = currentlySelected.style;

        if (inlineStyle.width && inlineStyle.width.includes('%')) {
            return; 
        }

        let displayWidth, displayHeight;

        if (inlineStyle.width && inlineStyle.width.includes("px")) {
            displayWidth = parseFloat(inlineStyle.width);
        } else {
            displayWidth = Math.round(parseFloat(computedStyle.width));
            // THE FIX: Add the "px" unit to the number
            inlineStyle.width = displayWidth + "px";
        }

        if (inlineStyle.height && inlineStyle.height.includes("px")) {
            displayHeight = parseFloat(inlineStyle.height);
        } else {
            displayHeight = Math.round(parseFloat(computedStyle.height));
            // THE FIX: Add the "px" unit to the number
            inlineStyle.height = displayHeight + "px";
        }

        if (currentlySelected.classList.contains("ratio-image")) {
            inlineStyle.height = "auto";
        }

        imageRatioWidthInput.value = displayWidth;
        imageCropWidthInput.value = displayWidth;
        imageCropHeightInput.value = displayHeight;
        
        const objectPositionValue = computedStyle.objectPosition;
        const positionX = objectPositionValue.split(' ')[0];
        imageCropPositionInput.value = parseFloat(positionX) || 50;
    }
}

// ===============================
// LOAD STYLES FROM SELECTED ELEMENT
// ===============================
function loadStylesFromSelected() {
    if (!currentlySelected) return;
    const computed = window.getComputedStyle(currentlySelected);

    // Background
    backgroundColorInput.value = rgbToHex(computed.backgroundColor);
    if (backgroundColorValueSpan) backgroundColorValueSpan.textContent = rgbToHex(computed.backgroundColor).toUpperCase();

if (currentlySelected.style.width && currentlySelected.style.width.includes("px")) {
    loadImageValues();
} else {
    const realPercent = getRealWidthPercent();
    widthInput.value = realPercent;

    if (realPercent >= 100) {
        currentlySelected.style.width = "";
    } else {
        currentlySelected.style.width = `calc(${realPercent}% - 2rem)`;
    }
}

    // Padding
    paddingTopInput.value = parseInt(computed.paddingTop) || 0;
    paddingLeftInput.value = parseInt(computed.paddingLeft) || 0;
    paddingRightInput.value = parseInt(computed.paddingRight) || 0;
    paddingBottomInput.value = parseInt(computed.paddingBottom) || 0;

    // Border
const borderWidth = parseInt(computed.borderWidth) || 0;

if (borderWidthInput) borderWidthInput.value = borderWidth;
if (borderRadiusInput) borderRadiusInput.value = parseInt(computed.borderRadius) || 0;

let finalBorderColor = '#000000'; // Start with a sensible default

if (currentlySelected.style.borderColor) {
    finalBorderColor = rgbToHex(currentlySelected.style.borderColor);

} else if (borderWidth > 0) {
    finalBorderColor = rgbToHex(computed.borderColor);
}

if (borderColorInput) borderColorInput.value = finalBorderColor;
if (borderColorValueSpan) borderColorValueSpan.textContent = finalBorderColor.toUpperCase();

//Behavior

if (currentlySelected.classList.contains("hide-on-desktop")) {
  hideOnDesktop.checked = true;
} else {
  hideOnDesktop.checked = false;
}

if (currentlySelected.classList.contains("hide-on-mobile")) {
  hideOnMobile.checked = true;
} else {
  hideOnMobile.checked = false;
}

if (currentlySelected.firstElementChild.classList.contains("unresponsive-collapse")) {
  responsiveCollapse.checked = false;
} else {
  responsiveCollapse.checked = true;
}

highlightActiveControls();
}

function checkRestrictedControls() {
  const containerResponsiveControls = document.getElementById("style-editor-building-container-responsive-controls");
  const verticalAlignControls = document.getElementById("style-editor-vertical-align-controls");
  const imageControls = document.getElementById("style-editor-image-controls");
  const imageRatioControls = document.getElementById("style-editor-image-ratio-controls");
  const imageCropControls = document.getElementById("style-editor-image-crop-controls");

  if (currentlySelected?.classList.contains("building-container") && !currentlySelected?.firstElementChild.matches(".building-column-span-one, .building-column-span-two")) {
    containerResponsiveControls.classList.remove("content-hide");
  } else {
    containerResponsiveControls.classList.add("content-hide");
  }

  if (currentlySelected?.classList.contains("building-column")) {
    verticalAlignControls.classList.remove("content-hide");
  } else {
    verticalAlignControls.classList.add("content-hide");
  }

  if (currentlySelected?.classList.contains("image-element")) {
    imageControls.classList.remove("content-hide");
  } else {
    imageControls.classList.add("content-hide");
  }

  if (currentlySelected?.classList.contains("ratio-image")) {
    imageRatioControls.classList.remove("content-hide");
  } else {
    imageRatioControls.classList.add("content-hide");
  }

  if (currentlySelected?.classList.contains("crop-image")) {
    imageCropControls.classList.remove("content-hide");
  } else {
    imageCropControls.classList.add("content-hide");
  }

  if (currentlySelected?.classList.contains("ratio-image") || currentlySelected?.classList.contains("crop-image")) {
    widthInput.disabled = true;
    widthInput.style.opacity = "0.5";
  } else {
    widthInput.disabled = false;
    widthInput.style.opacity = "1.0";
  }
}

// Misc Event Listeners
imageDefault.addEventListener("click", () => {
    currentlySelected.style.removeProperty('width');
    currentlySelected.style.removeProperty('height');
    currentlySelected.style.removeProperty('object-position');
    setTimeout(checkRestrictedControls, 0);
});

imageRatio.addEventListener("click", () => {
    currentlySelected.style.removeProperty('width');
    currentlySelected.style.removeProperty('height');
    currentlySelected.style.removeProperty('object-position');
    loadImageValues();
    setTimeout(checkRestrictedControls, 0);
});

imageCrop.addEventListener("click", () => {
    currentlySelected.style.removeProperty('width');
    currentlySelected.style.removeProperty('height');
    currentlySelected.style.removeProperty('object-position');
    loadImageValues();
    setTimeout(checkRestrictedControls, 0);
});

hideOnDesktop.addEventListener("change", function() {
  if (currentlySelected && hideOnDesktop.checked) {
      currentlySelected.classList.add("hide-on-desktop");
    } else {
      currentlySelected.classList.remove("hide-on-desktop");
    }
  });

  hideOnMobile.addEventListener("change", function() {
  if (currentlySelected && hideOnMobile.checked) {
      currentlySelected.classList.add("hide-on-mobile");
    } else {
      currentlySelected.classList.remove("hide-on-mobile");
    }
  });

  responsiveCollapse.addEventListener("change", function() {
  if (currentlySelected && responsiveCollapse.checked) {
      currentlySelected.firstElementChild.classList.remove("unresponsive-collapse");
    } else {
      currentlySelected.firstElementChild.classList.add("unresponsive-collapse");
    }
  });

backgroundColorRemove.addEventListener("click", function() {
  if (currentlySelected) {
    if (currentlySelected.style.backgroundColor !== '') {
      currentlySelected.style.backgroundColor = '';
      loadStylesFromSelected();
    } else {
      return;
    }
  }
});

// Open Styles Menu
styleButton.addEventListener("click", () => {
  if (currentlySelected) {
    currentlySelected.classList.add("custom-styles");
    invokeStyleMenu();
  }
});

// ===============================
// s and button triggers
// ===============================

document.addEventListener("keydown", (e) => {
  const isStyleEditorVisible = window.getComputedStyle(styles).display !== "none";
  const isTextEditorVisible = window.getComputedStyle(editorPop).display !== "none";
  if (isTextEditorVisible || isStyleEditorVisible) return;
  e.preventDefault();
  if (e.key === 's') {
        if (currentlySelected) {
            currentlySelected.classList.add("custom-styles");
            invokeStyleMenu();
        }
    }
});