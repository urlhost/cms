// ==========================================
// 1. VARIABLES & SELECTION
// ==========================================

// Behavior Options
const hideOnDesktop = document.getElementById("style-editor-hide-on-desktop-checkbox");
const hideOnMobile = document.getElementById("style-editor-hide-on-mobile-checkbox");
const responsiveCollapse = document.getElementById("style-editor-responsive-collapse-checkbox");
const stretchToScreen = document.getElementById("style-editor-stretch-to-screen-checkbox");
const matchAdjacentHeight = document.getElementById("style-editor-match-adjacent-height-checkbox");

// Background & Borders
const backgroundImageLink = document.getElementById("style-editor-bg-image-link");
const backgroundImageUpload = document.getElementById("style-editor-bg-image-upload");
const backgroundImageRemove = document.getElementById("style-editor-bg-image-remove");
const backgroundColorInput = document.getElementById("style-editor-bg-color-input");
const backgroundColorValueSpan = document.getElementById("style-editor-bg-color-input-value");
const backgroundColorRemove = document.getElementById("style-editor-bg-color-remove");
const backgroundColorOpacityInput = document.getElementById("style-editor-bg-color-opacity-input");
const backgroundHoverColorInput = document.getElementById("style-editor-bg-hover-color-input");
const backgroundHoverColorValueSpan = document.getElementById("style-editor-bg-hover-color-input-value");

const borderColorInput = document.getElementById("style-editor-border-color-input");
const borderColorValueSpan = document.getElementById("style-editor-border-color-input-value");
const borderWidthInput = document.getElementById("style-editor-border-width-input");
const borderRadiusInput = document.getElementById("style-editor-border-radius-input");
const borderHoverColorInput = document.getElementById("style-editor-border-hover-color-input");
const borderHoverColorValueSpan = document.getElementById("style-editor-border-hover-color-input-value");

// Text
const textHoverColorInput = document.getElementById("style-editor-text-hover-color-input");
const textHoverColorValueSpan = document.getElementById("style-editor-text-hover-color-input-value");

// Effects
const dropShadow = document.getElementById("style-editor-drop-shadow-checkbox");

// Sizing & Alignment
const widthInput = document.getElementById("style-editor-width-input");
const alignLeft = document.getElementById("style-editor-align-left-button");
const alignCenter = document.getElementById("style-editor-align-center-button");
const alignRight = document.getElementById("style-editor-align-right-button");
const alignTop = document.getElementById("style-editor-align-top-button");
const alignMiddle = document.getElementById("style-editor-align-middle-button");
const alignBottom = document.getElementById("style-editor-align-bottom-button");

// Padding
const paddingTopInput = document.getElementById("style-editor-padding-top-input");
const paddingLeftInput = document.getElementById("style-editor-padding-left-input");
const paddingRightInput = document.getElementById("style-editor-padding-right-input");
const paddingBottomInput = document.getElementById("style-editor-padding-bottom-input");

// Images
const imageDefault = document.getElementById("style-editor-image-default-button");
const imageCrop = document.getElementById("style-editor-image-crop-button");
const imageRatio = document.getElementById("style-editor-image-ratio-button");
const imageRatioWidthInput = document.getElementById("style-editor-ratio-width-input");
const imageCropWidthInput = document.getElementById("style-editor-crop-width-input");
const imageCropHeightInput = document.getElementById("style-editor-crop-height-input");
const imageCropPositionInput = document.getElementById("style-editor-crop-position-input");

// Links
const linkAdd = document.getElementById("style-editor-link-add");
const linkRemove = document.getElementById("style-editor-link-remove");
const linkOpenInNewTab = document.getElementById("style-editor-link-open-in-new-tab-checkbox");


// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

function invokeStyleMenu() {
  if (currentlySelected) {
    styles.classList.remove('content-hide');
    loadedPage.classList.add("sidebar-active");
    checkRestrictedControls();
    loadStylesFromSelected();
    currentlySelected.classList.add("custom-styles");
  }
}

function parsePercent(value, fallback = 100) {
  const match = value.match(/([\d.]+)%/);
  return match ? parseFloat(match[1]) : fallback;
}

function parsePx(value, fallback = 0) {
  const match = value.match(/([\d.]+)px/);
  return match ? parseFloat(match[1]) : fallback;
}

function rgbToHex(rgb) {
  if (!rgb || rgb === "none" || rgb === "transparent") return "#FFFFFF";
  const result = rgb.match(/\d+/g);
  if (!result) return "#000000";
  let [r, g, b, a] = result.slice(0, 4);
  r = parseInt(r).toString(16).padStart(2, "0");
  g = parseInt(g).toString(16).padStart(2, "0");
  b = parseInt(b).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}

function changeRGBAlpha(element, newAlpha) {
  let alpha = Math.max(0, Math.min(1, parseFloat(newAlpha)));
  let color = getComputedStyle(element).backgroundColor;
  let matches = color.match(/\d+(\.\d+)?/g);

  if (matches) {
      let [r, g, b] = matches;
      element.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

function getRGBAlpha(element) {
let color = getComputedStyle(element).backgroundColor;

  if (color === 'rgba(0, 0, 0, 0)' || color === 'transparent') {
    return 1;
  }

  let values = color.match(/[\d\.]+/g);

  if (values && values.length === 4) {
    return parseFloat(values[3]);
  } else {
    return 1;
  }
}

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
  }
}

function loadImageValues() {
  if (currentlySelected.classList.contains("image-element")) {
    const computedStyle = window.getComputedStyle(currentlySelected);
    const inlineStyle = currentlySelected.style;

    if (inlineStyle.width && inlineStyle.width.includes('%')) return;

    let displayWidth, displayHeight;

    if (inlineStyle.width && inlineStyle.width.includes("px")) {
      displayWidth = parseFloat(inlineStyle.width);
    } else {
      displayWidth = Math.round(parseFloat(computedStyle.width));
      inlineStyle.width = displayWidth + "px";
    }

    if (inlineStyle.height && inlineStyle.height.includes("px")) {
      displayHeight = parseFloat(inlineStyle.height);
    } else {
      displayHeight = Math.round(parseFloat(computedStyle.height));
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

function grabLink() {
  let link = prompt("Enter a URL:");
  
  if (link === null) return null;

  link = link.trim();

  if (link.startsWith('.')) {
     alert("URL cannot start with a dot.");
     return grabLink();
  }

  if (!link.match(/^https?:\/\//i)) {
      alert("URL must start with http:// or https://.");
      return grabLink();
  }

  const linkRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,10}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i;

  if (link && linkRegex.test(link)) {
    return link;
  } else {
    alert("Please enter a valid URL.");
    return grabLink();
  }
}

function highlightActiveControls() {
  if (!currentlySelected) return;

  [alignLeft, alignCenter, alignRight, alignTop, alignMiddle, alignBottom, imageDefault, imageRatio, imageCrop]
  .forEach(btn => btn.classList.remove("active"));

  if (currentlySelected.classList.contains("building-block-align-left")) {
    alignLeft.classList.add("active");
  } else if (currentlySelected.classList.contains("building-block-align-center")) {
    alignCenter.classList.add("active");
  } else if (currentlySelected.classList.contains("building-block-align-right")) {
    alignRight.classList.add("active");
  }

  if (currentlySelected.classList.contains("building-column-content-top")) {
    alignTop.classList.add("active");
  } else if (currentlySelected.classList.contains("building-column-content-center")) {
    alignMiddle.classList.add("active");
  } else if (currentlySelected.classList.contains("building-column-content-bottom")) {
    alignBottom.classList.add("active");
  }

  if (currentlySelected.classList.contains("ratio-image")) {
    imageRatio.classList.add("active");
  } else if (currentlySelected.classList.contains("crop-image")) {
    imageCrop.classList.add("active");
  } else if (currentlySelected.classList.contains("default-image")) {
    imageDefault.classList.add("active");
  }
}

function wrapWithHighlight(fn) {
  return () => {
    fn();
    highlightActiveControls();
  };
}


// ==========================================
// 3. MAIN LOGIC (LOAD & CHECK)
// ==========================================

function loadStylesFromSelected() {
  if (!currentlySelected) return;
  const computed = window.getComputedStyle(currentlySelected);

  // Background
  backgroundColorInput.value = rgbToHex(computed.backgroundColor);
  if (backgroundColorValueSpan) backgroundColorValueSpan.textContent = rgbToHex(computed.backgroundColor).toUpperCase();

const backgroundHoverColor = computed.getPropertyValue('--button-hover-background-color').trim();
let finalBackgroundHoverColor = '#000000'; // Default fallback

if (backgroundHoverColor) {
  if (backgroundHoverColor.startsWith('#')) {
    finalBackgroundHoverColor = backgroundHoverColor;
  } else if (backgroundHoverColor.includes('rgb')) {
    finalBackgroundHoverColor = rgbToHex(backgroundHoverColor);
  }
}

if (backgroundHoverColorInput) {
  backgroundHoverColorInput.value = finalBackgroundHoverColor;
}

if (backgroundHoverColorValueSpan) {
  backgroundHoverColorValueSpan.textContent = finalBackgroundHoverColor.toUpperCase();
}
  
  backgroundColorOpacityInput.value = getRGBAlpha(currentlySelected) * 100;

  // Width & Images
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

let finalBorderColor = '#000000';

if (currentlySelected.style.borderColor) {
  finalBorderColor = rgbToHex(currentlySelected.style.borderColor);
} else if (parseFloat(computed.borderWidth) > 0) {
  finalBorderColor = rgbToHex(computed.borderColor);
}
if (borderColorInput) borderColorInput.value = finalBorderColor;
if (borderColorValueSpan) borderColorValueSpan.textContent = finalBorderColor.toUpperCase();

const borderHoverColor = computed.getPropertyValue('--button-hover-border-color').trim();
let finalBorderHoverColor = '#000000';

if (borderHoverColor) {
  if (borderHoverColor.startsWith('#')) {
    finalBorderHoverColor = borderHoverColor;
  } else if (borderHoverColor.includes('rgb')) {
    finalBorderHoverColor = rgbToHex(borderHoverColor);
  }
}

if (borderHoverColorInput) {
  borderHoverColorInput.value = finalBorderHoverColor;
}

if (borderHoverColorValueSpan) {
  borderHoverColorValueSpan.textContent = finalBorderHoverColor.toUpperCase();
}

  //Text

const textHoverColor = computed.getPropertyValue('--button-hover-text-color').trim();

let finalTextHoverColor = '#000000'; // Default fallback if empty

if (textHoverColor) {
  if (textHoverColor.startsWith('#')) {
    finalTextHoverColor = textHoverColor;
  } else if (textHoverColor.includes('rgb')) {
    finalTextHoverColor = rgbToHex(textHoverColor);
  }
}

if (textHoverColorInput) {
  textHoverColorInput.value = finalTextHoverColor;
}

if (textHoverColorValueSpan) {
  textHoverColorValueSpan.textContent = finalTextHoverColor.toUpperCase();
}

  // Checkboxes
  hideOnDesktop.checked = currentlySelected.classList.contains("hide-on-desktop");
  hideOnMobile.checked = currentlySelected.classList.contains("hide-on-mobile");
  
  if (currentlySelected.firstElementChild) {
    responsiveCollapse.checked = !currentlySelected.firstElementChild.classList.contains("unresponsive-collapse");
  }

  stretchToScreen.checked = currentlySelected.classList.contains("stretch-to-screen");
  matchAdjacentHeight.checked = currentlySelected.classList.contains("match-adjacent-height");
  dropShadow.checked = currentlySelected?.matches('.drop-shadow, .drop-shadow-text');

  if (currentlySelected.parentElement) {
    if (currentlySelected.parentElement.classList.contains("building-block-link") && currentlySelected.parentElement.target === "_blank") {
      linkOpenInNewTab.checked = true;
    } else {
      linkOpenInNewTab.checked = false;
    }
  }

  highlightActiveControls();
}

function checkRestrictedControls() {
  const containerResponsiveControls = document.getElementById("style-editor-building-container-responsive-controls");
  const containerScreenControls = document.getElementById("style-editor-building-container-screen-controls");
  const columnMatchControls = document.getElementById("style-editor-building-column-match-controls");
  const imageControls = document.getElementById("style-editor-image-controls");
  const imageRatioControls = document.getElementById("style-editor-image-ratio-controls");
  const imageCropControls = document.getElementById("style-editor-image-crop-controls");
  const linkControls = document.getElementById("style-editor-link-controls");
  const linkOptionControls = document.getElementById("style-editor-link-option-controls");
  const backgroundImageControls = document.getElementById("style-editor-background-image-controls");
  const backgroundColorOpacityControls = document.getElementById("style-editor-background-color-opacity-controls");
  const backgroundColorRemoveControls = document.getElementById("style-editor-bg-color-remove-controls");
  const backgroundColorHoverControls = document.getElementById("style-editor-background-hover-color-controls");
  const borderColorHoverControls = document.getElementById("style-editor-border-hover-color-controls");
  const textColorHoverControls = document.getElementById("style-editor-text-hover-color-controls");
  const verticalAlignControls = document.getElementById("style-editor-vertical-align-controls");


  if (currentlySelected?.classList.contains("building-container") || currentlySelected?.classList.contains("building-column")) {
    backgroundImageControls.classList.remove("content-hide");
  } else {
    backgroundImageControls.classList.add("content-hide");
  }

if (currentlySelected?.matches(".building-container, .building-column") && currentlySelected.style.backgroundImage !== "none" && currentlySelected.style.backgroundImage !== "") {
  backgroundColorOpacityControls.classList.remove("content-hide");
} else {
  backgroundColorOpacityControls.classList.add("content-hide");
}

  if (currentlySelected?.classList.contains("button")) {
    backgroundColorOpacityControls.classList.add("content-hide");
    backgroundColorRemoveControls.classList.add("content-hide");
    backgroundColorHoverControls.classList.remove("content-hide");
    borderColorHoverControls.classList.remove("content-hide");
    textColorHoverControls.classList.remove("content-hide");
  } else {
    backgroundColorOpacityControls.classList.remove("content-hide");
    backgroundColorRemoveControls.classList.remove("content-hide");
    backgroundImageControls.classList.remove("content-hide");
    backgroundColorHoverControls.classList.add("content-hide");
    borderColorHoverControls.classList.add("content-hide");
    textColorHoverControls.classList.add("content-hide");
  }

  if (currentlySelected?.classList.contains("building-container") && !currentlySelected?.firstElementChild?.matches(".building-column-span-one, .building-column-span-two")) {
    containerResponsiveControls.classList.remove("content-hide");
  } else {
    containerResponsiveControls.classList.add("content-hide");
  }

  if (currentlySelected?.classList.contains("building-container") && !currentlySelected?.parentElement.matches(".building-column")) {
    containerScreenControls.classList.remove("content-hide");
  } else {
    containerScreenControls.classList.add("content-hide");
  }

  if (currentlySelected?.classList.contains("building-column") && !currentlySelected?.parentElement.matches(".building-column-span-one")) {
    verticalAlignControls.classList.remove("content-hide");
  } else {
    verticalAlignControls.classList.add("content-hide");
  }

  if (currentlySelected?.classList.contains("building-column") && !currentlySelected?.parentElement?.matches(".building-column-span-one") && currentlySelected?.style.backgroundImage !== '') {
    columnMatchControls.classList.remove("content-hide");
  } else {
    columnMatchControls.classList.add("content-hide");
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

  if (currentlySelected?.classList.contains("image-element") || currentlySelected?.classList.contains("button")) {
    linkControls.classList.remove("content-hide");
  } else {
    linkControls.classList.add("content-hide");
  }

  if (currentlySelected?.parentElement.classList.contains("building-block-link")) {
    linkOptionControls.classList.remove("content-hide");
  } else {
    linkOptionControls.classList.add("content-hide");
  }

  if (currentlySelected?.classList.contains("accordion-label") || currentlySelected?.classList.contains("button")) {
    paddingLeftInput.disabled = true;
    paddingRightInput.disabled = true;
    paddingLeftInput.style.opacity = "0.5";
    paddingRightInput.style.opacity = "0.5";
  } else {
    paddingLeftInput.disabled = false;
    paddingRightInput.disabled = false;
    paddingLeftInput.style.opacity = "1.0";
    paddingRightInput.style.opacity = "1.0";
  }
}


// ==========================================
// 4. EVENT LISTENERS
// ==========================================

// --- Background ---
backgroundColorInput.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.style.backgroundColor = backgroundColorInput.value;
    changeRGBAlpha(currentlySelected, backgroundColorOpacityInput.value / 100);
  }
  if (backgroundColorValueSpan) {
    backgroundColorValueSpan.textContent = backgroundColorInput.value.toUpperCase();
  }
});

backgroundColorOpacityInput.addEventListener("input", (e) => {
  if (currentlySelected) {
    if (e.target.value > 100) {
        e.target.value = 100;
    }
    changeRGBAlpha(currentlySelected, backgroundColorOpacityInput.value / 100);
  }
});

backgroundColorRemove.addEventListener("click", function() {
  if (currentlySelected) {
    if (currentlySelected.style.backgroundColor !== '') {
      currentlySelected.style.backgroundColor = '';
      loadStylesFromSelected();
    }
  }
});

backgroundHoverColorInput.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.style.setProperty('--button-hover-background-color', backgroundHoverColorInput.value);
  }
  if (backgroundHoverColorValueSpan) {
    backgroundHoverColorValueSpan.textContent = backgroundHoverColorInput.value.toUpperCase();
  }
});

borderHoverColorInput.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.style.setProperty('--button-hover-border-color', borderHoverColorInput.value);
  }
  if (borderHoverColorValueSpan) {
    borderHoverColorValueSpan.textContent = borderHoverColorInput.value.toUpperCase();
  }
});

textHoverColorInput.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.style.setProperty('--button-hover-text-color', textHoverColorInput.value);
  }
  if (textHoverColorValueSpan) {
    textHoverColorValueSpan.textContent = textHoverColorInput.value.toUpperCase();
  }
});

backgroundImageLink.addEventListener("click", function() {
  if (currentlySelected) {
    const imageLink = grabImageLink();
    currentlySelected.style.backgroundImage = `url(${imageLink})`;
    currentlySelected.style.backgroundBlendMode = "overlay";
    currentlySelected.style.backgroundColor = '';
    checkRestrictedControls();
    loadStylesFromSelected();
    document.querySelectorAll('.sidebar-control-label').forEach(el => {
      if (el.textContent.trim() === "Background Color") {
        el.innerText = "Background Overlay Color";
      }
    });
  }
});

backgroundImageUpload.addEventListener("click", async function() {
  if (currentlySelected) {
    const imageUpload = await grabImageUpload();
    if (imageUpload) {
      currentlySelected.style.backgroundImage = `url(${imageUpload})`;
      currentlySelected.style.backgroundBlendMode = "overlay";
      currentlySelected.style.backgroundColor = '';
      checkRestrictedControls();
      loadStylesFromSelected();
      document.querySelectorAll('.sidebar-control-label').forEach(el => {
        if (el.textContent.trim() === "Background Color") {
          el.innerText = "Background Overlay Color";
        }
      });
    }
  }
});

backgroundImageRemove.addEventListener("click", function() {
  if (currentlySelected && currentlySelected.style.backgroundImage !== '') {
    currentlySelected.style.removeProperty('background-image');
    checkRestrictedControls();
    loadStylesFromSelected();
    document.querySelectorAll('.sidebar-control-label').forEach(el => {
      if (el.textContent.trim() === "Background Overlay Color") {
        el.innerText = "Background Color";
      }
    });
  }
});

// --- Borders ---
borderColorInput?.addEventListener("input", () => {
  if (currentlySelected) {
    currentlySelected.style.borderColor = borderColorInput.value;
  }
  if (borderColorValueSpan) {
    borderColorValueSpan.textContent = borderColorInput.value.toUpperCase();
  }
});

borderWidthInput?.addEventListener("input", () => {
  if (currentlySelected) {
    let value = parseInt(borderWidthInput.value) || 0;
    currentlySelected.style.borderWidth = value + "px";
    currentlySelected.style.borderStyle = value > 0 ? "solid" : "none";
  }
});

borderRadiusInput?.addEventListener("input", () => {
  if (currentlySelected) {
    let value = parseInt(borderRadiusInput.value) || 0;
    currentlySelected.style.borderRadius = value + "px";
  }
});

// --- Drop Shadow ---
dropShadow.addEventListener("change", function() {
  if (currentlySelected && dropShadow.checked) {
    if (currentlySelected.classList.contains("text-element")) {
        currentlySelected.classList.add("drop-shadow-text");
    } else {
        currentlySelected.classList.add("drop-shadow");
    }

    if (currentlySelected.classList.contains("button")) {
        currentlySelected.parentElement.classList.add("drop-shadow");
    }
  } else {
    currentlySelected.classList.remove("drop-shadow", "drop-shadow-text");
  }
});

// --- Width ---
widthInput.addEventListener("input", () => {
  if (currentlySelected) {
    let uiPercent = parseFloat(widthInput.value);
    if (isNaN(uiPercent)) uiPercent = 5;
    uiPercent = Math.max(5, Math.min(100, uiPercent));

    if (uiPercent >= 100) {
      currentlySelected.style.width = "";
    } else {
      currentlySelected.style.width = `calc(${uiPercent}% - 2rem)`;
    }
  }
});

widthInput.addEventListener("change", () => {
  let finalValue = parseFloat(widthInput.value) || 5;
  finalValue = Math.max(5, Math.min(100, finalValue));
  widthInput.value = finalValue;

  if (currentlySelected) {
    if (finalValue >= 100) {
      currentlySelected.style.width = "";
    } else {
      currentlySelected.style.width = `calc(${finalValue}% - 2rem)`;
    }
  }
});

// --- Images ---
imageRatioWidthInput.addEventListener("input", () => {
  if (currentlySelected) {
    let width = parseFloat(imageRatioWidthInput.value) || 100;
    width = Math.max(10, Math.min(9999, width));
    currentlySelected.style.width = width + "px";
  }
});

imageCropWidthInput.addEventListener("input", () => {
  if (currentlySelected) {
    let width = parseFloat(imageCropWidthInput.value) || 100;
    width = Math.max(10, Math.min(9999, width));
    currentlySelected.style.width = width + "px";
  }
});

imageCropHeightInput.addEventListener("input", () => {
  if (currentlySelected) {
    let height = parseFloat(imageCropHeightInput.value) || 100;
    height = Math.max(10, Math.min(9999, height));
    currentlySelected.style.height = height + "px";
  }
});

imageCropPositionInput.addEventListener("input", () => {
  if (currentlySelected) {
    let position = parseFloat(imageCropPositionInput.value) || 100;
    position = Math.max(5, Math.min(100, position));
    currentlySelected.style.objectPosition = position + "%";
  }
});

imageDefault.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.remove("ratio-image", "crop-image");
    currentlySelected.classList.add("default-image");
    currentlySelected.style.removeProperty('width');
    currentlySelected.style.removeProperty('height');
    currentlySelected.style.removeProperty('object-position');
    setTimeout(checkRestrictedControls, 0);
  }
}));

imageRatio.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.remove("default-image", "crop-image");
    currentlySelected.classList.add("ratio-image");
    currentlySelected.style.removeProperty('width');
    currentlySelected.style.removeProperty('height');
    currentlySelected.style.removeProperty('object-position');
    loadImageValues();
    setTimeout(checkRestrictedControls, 0);
  }
}));

imageCrop.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.remove("default-image", "ratio-image");
    currentlySelected.classList.add("crop-image");
    currentlySelected.style.removeProperty('width');
    currentlySelected.style.removeProperty('height');
    currentlySelected.style.removeProperty('object-position');
    loadImageValues();
    setTimeout(checkRestrictedControls, 0);
  }
}));

// --- Alignment ---
alignLeft.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.remove("building-block-align-center", "building-block-align-right");
    currentlySelected.classList.add("building-block-align-left");
  }
}));

alignCenter.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.remove("building-block-align-left", "building-block-align-right");
    currentlySelected.classList.add("building-block-align-center");
  }
}));

alignRight.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.remove("building-block-align-left", "building-block-align-center");
    currentlySelected.classList.add("building-block-align-right");
  }
}));

alignTop.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.remove("building-column-content-center", "building-column-content-bottom");
    currentlySelected.classList.add("building-column-content-top");
  }
}));

alignMiddle.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.remove("building-column-content-top", "building-column-content-bottom");
    currentlySelected.classList.add("building-column-content-center");
  }
}));

alignBottom.addEventListener("click", wrapWithHighlight(() => {
  if (currentlySelected) {
    currentlySelected.classList.remove("building-column-content-top", "building-column-content-center");
    currentlySelected.classList.add("building-column-content-bottom");
  }
}));

// --- Padding ---
function updatePaddingInput(side, inputEl) {
  inputEl.addEventListener("input", () => {
    if (currentlySelected) {
  
      let value = parseInt(inputEl.value) || 0;
      currentlySelected.style[`padding${side}`] = Math.max(0, value) + "px";
    }
  });
}
updatePaddingInput("Top", paddingTopInput);
updatePaddingInput("Left", paddingLeftInput);
updatePaddingInput("Right", paddingRightInput);
updatePaddingInput("Bottom", paddingBottomInput);

// --- Behavior ---
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

stretchToScreen.addEventListener("change", function() {
  if (currentlySelected && stretchToScreen.checked) {
    currentlySelected.classList.add("stretch-to-screen");
  } else {
    currentlySelected.classList.remove("stretch-to-screen");
  }
});

matchAdjacentHeight.addEventListener("change", function() {
  if (currentlySelected && matchAdjacentHeight.checked) {
    currentlySelected.classList.add("match-adjacent-height");
  } else {
    currentlySelected.classList.remove("match-adjacent-height");
  }
});

// --- Links ---
linkAdd.addEventListener("click", function() {
  if (currentlySelected) {
    const url = grabLink();
    if (url === null) return;

    if (currentlySelected && currentlySelected.parentNode) {
      const linkWrapper = document.createElement('a');
      linkWrapper.classList.add('building-block-link');
      linkWrapper.href = url;
      currentlySelected.parentNode.insertBefore(linkWrapper, currentlySelected);
      linkWrapper.appendChild(currentlySelected);
      checkRestrictedControls();
      loadStylesFromSelected();
    }
  }
});

linkRemove.addEventListener("click", function() {
  if (currentlySelected && currentlySelected.parentNode) {
    const parentLink = currentlySelected.parentNode;
    if (parentLink.tagName === 'A' && parentLink.classList.contains('building-block-link')) {
      parentLink.parentNode.insertBefore(currentlySelected, parentLink);
      parentLink.remove();
      checkRestrictedControls();
      loadStylesFromSelected();
    }
  }
});

linkOpenInNewTab.addEventListener("change", function() {
  if (currentlySelected && currentlySelected.parentElement.tagName === 'A') {
    if (linkOpenInNewTab.checked) {
      currentlySelected.parentElement.target = "_blank";
    } else {
      currentlySelected.parentElement.removeAttribute("target");
    }
  }
});


// ==========================================
// 5. GLOBAL TRIGGERS
// ==========================================

styleButton.addEventListener("click", () => {
  if (currentlySelected) {

    invokeStyleMenu();
  }
});

document.addEventListener("keydown", (e) => {
  const isStyleEditorVisible = window.getComputedStyle(styles).display !== "none";
  const isTextEditorVisible = window.getComputedStyle(editorPop).display !== "none";
  if (isTextEditorVisible || isStyleEditorVisible) return;
  
  if (e.key === 's') {
    e.preventDefault();
    if (currentlySelected) {
  
      invokeStyleMenu();
    }
  }
});