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
const widthUnit = document.getElementById("style-editor-width-unit");
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
    currentlySelected = getLinkChild(currentlySelected) || currentlySelected;
    styles.classList.remove('content-hide');
    loadedPage.classList.add("sidebar-active");
    cmsMainMenu.classList.add("sidebar-active");
    checkRestrictedControls();
    loadStylesFromSelected();
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
  
  if (!styleWidth || styleWidth.includes("px")) return 100;

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
const styleWidth = currentlySelected.style.width;

if (styleWidth && styleWidth.includes("px")) {
    widthUnit.value = "px";
    widthInput.max = 2000;
    widthInput.value = parseFloat(styleWidth);
    
    if (currentlySelected.classList.contains("image-element")) {
        loadImageValues();
    }
} else {
    widthUnit.value = "%";
    widthInput.max = 100;
    
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

  linkOpenInNewTab.checked = currentlySelected.classList.contains("button-element") && currentlySelected.target === "_blank" || getParentLink(currentlySelected)?.target === "_blank";

  highlightActiveControls();
}

function checkRestrictedControls() {
  // Cache all control elements
  const controls = {
    containerResponsive: document.getElementById("style-editor-building-container-responsive-controls"),
    containerScreen: document.getElementById("style-editor-building-container-screen-controls"),
    columnMatch: document.getElementById("style-editor-building-column-match-controls"),
    image: document.getElementById("style-editor-image-controls"),
    imageRatio: document.getElementById("style-editor-image-ratio-controls"),
    imageCrop: document.getElementById("style-editor-image-crop-controls"),
    link: document.getElementById("style-editor-link-controls"),
    linkOption: document.getElementById("style-editor-link-option-controls"),
    backgroundImage: document.getElementById("style-editor-background-image-controls"),
    bgColorOpacity: document.getElementById("style-editor-background-color-opacity-controls"),
    bgColorRemove: document.getElementById("style-editor-bg-color-remove-controls"),
    bgColorHover: document.getElementById("style-editor-background-hover-color-controls"),
    borderColorHover: document.getElementById("style-editor-border-hover-color-controls"),
    textColorHover: document.getElementById("style-editor-text-hover-color-controls"),
    width: document.getElementById("style-editor-width-controls"),
    verticalAlign: document.getElementById("style-editor-vertical-align-controls")
  };

  // Determine element types
  const elementType = {
    isContainer: currentlySelected?.classList.contains("building-container"),
    isColumn: currentlySelected?.classList.contains("building-column"),
    isButton: currentlySelected?.classList.contains("button"),
    isAccordion: currentlySelected?.classList.contains("accordion-label"),
    isImage: currentlySelected?.classList.contains("image-element"),
    isRatioImage: currentlySelected?.classList.contains("ratio-image"),
    isCropImage: currentlySelected?.classList.contains("crop-image")
  };

  const hasBgImage = (elementType.isContainer || elementType.isColumn) && 
                     currentlySelected.style.backgroundImage !== '';

  // Helper function to toggle visibility
  const toggle = (control, shouldShow) => {
    if (!control) return;
    control.classList.toggle("content-hide", !shouldShow);
  };

  // Background image controls
  toggle(controls.backgroundImage, elementType.isContainer || elementType.isColumn);

  // Background color opacity (hide for buttons, accordions, or when bg image exists)
  const shouldShowOpacity = !elementType.isButton && !elementType.isAccordion && !hasBgImage;
  toggle(controls.bgColorOpacity, shouldShowOpacity);

  // Update "Background Color" label when background image is present
  document.querySelectorAll('.sidebar-control-label').forEach(el => {
    const text = el.textContent.trim();
    if (text === "Background Color" || text === "Background Overlay Color") {
      el.innerText = hasBgImage ? "Background Overlay Color" : "Background Color";
    }
  });

  // Button-specific controls
  toggle(controls.bgColorRemove, !elementType.isButton && !elementType.isAccordion);
  toggle(controls.bgColorHover, elementType.isButton);
  toggle(controls.borderColorHover, elementType.isButton);
  toggle(controls.textColorHover, elementType.isButton);

  // Container controls
  const hasSpanColumns = currentlySelected?.firstElementChild?.matches(
    ".building-column-span-one, .building-column-span-two"
  );
  toggle(controls.containerResponsive, elementType.isContainer && !hasSpanColumns);

  const isNestedInColumn = currentlySelected?.parentElement.matches(".building-column");
  toggle(controls.containerScreen, elementType.isContainer && !isNestedInColumn);

  // Column controls
  const isInSpanOne = currentlySelected?.parentElement.matches(".building-column-span-one");
  toggle(controls.verticalAlign, elementType.isColumn && !isInSpanOne);
  toggle(controls.columnMatch, elementType.isColumn && !isInSpanOne && hasBgImage);

  // Image controls
  toggle(controls.image, elementType.isImage);
  toggle(controls.imageRatio, elementType.isRatioImage);
  toggle(controls.imageCrop, elementType.isCropImage);
  toggle(controls.width, !elementType.isRatioImage && !elementType.isCropImage);

  // Link controls
  toggle(controls.link, elementType.isButton || elementType.isImage);
  const isButtonLink = currentlySelected?.classList.contains("button-element") && currentlySelected?.href !== '';
  const isImageLink = currentlySelected?.classList.contains("image-element") && getParentLink(currentlySelected);
  toggle(controls.linkOption, isButtonLink || isImageLink);

  // Width unit control
  setControlState(widthUnit, !elementType.isImage);

  // Padding controls for accordions and buttons
  const allowPadding = !elementType.isAccordion && !elementType.isButton;
  setControlState(paddingLeftInput, allowPadding);
  setControlState(paddingRightInput, allowPadding);

  // Width input configuration
  updateWidthInput();
}

// Helper to enable/disable controls with opacity
function setControlState(control, enabled) {
  if (!control) return;
  control.disabled = !enabled;
  control.style.opacity = enabled ? "1.0" : "0.5";
}

// Handle width input based on current value
function updateWidthInput() {
  const styleWidth = currentlySelected?.style.width || "";
  
  if (styleWidth.includes("px")) {
    widthUnit.value = "px";
    widthInput.max = 1500;
    widthInput.value = parseFloat(styleWidth);
  } else {
    widthUnit.value = "%";
    widthInput.max = 100;
    widthInput.value = getRealWidthPercent();
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
    }
  }
});

backgroundImageRemove.addEventListener("click", function() {
  if (currentlySelected && currentlySelected.style.backgroundImage !== '') {
    currentlySelected.style.removeProperty('background-image');
    checkRestrictedControls();
    loadStylesFromSelected();
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
    if (currentlySelected.classList.contains("text-element") && !currentlySelected.classList.contains("button")) {
        currentlySelected.classList.add("drop-shadow-text");
    } else {
        currentlySelected.classList.add("drop-shadow");
    }
  } else {
    currentlySelected.classList.remove("drop-shadow", "drop-shadow-text");
  }
});

// --- Width ---
widthUnit.addEventListener("change", () => {
    if (!currentlySelected) return;

    if (widthUnit.value === "%") {
        widthInput.max = 100;
        widthInput.value = 100;
        currentlySelected.style.width = ""; 
    } else {
        alert("Caution: Fixed pixel widths can cause horizontal scrolling on smaller screens. For best results, use percentages to keep your layout responsive. Use only if a fixed width is required.");
        widthInput.max = 1500;
        const rect = currentlySelected.getBoundingClientRect();
        let convertedPx = Math.round(rect.width);
        widthInput.value = Math.min(1500, convertedPx);
    }
    updateWidth(); 
});

function updateWidth() {
    if (!currentlySelected) return;

    let val = parseFloat(widthInput.value);
    if (isNaN(val)) return;

    const unit = widthUnit.value;

    if (unit === "%") {
        if (val > 100) {
            val = 100;
            widthInput.value = 100;
        }
        
        if (val >= 100) {
            currentlySelected.style.width = "";
        } else {
            currentlySelected.style.width = `calc(${val}% - 2rem)`;
        }
    } else {
        if (val > 1500) {
            val = 1500;
            widthInput.value = 1500;
        }
        currentlySelected.style.width = val + "px";
    }
}

widthInput.addEventListener("input", updateWidth);

widthInput.addEventListener("change", () => {
    let val = parseFloat(widthInput.value) || 5;
    const unit = widthUnit.value;
    const maxVal = (unit === "%") ? 100 : 1500;

    val = Math.max(5, Math.min(maxVal, val));
    widthInput.value = val;
    updateWidth();
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
  const url = grabLink();
  if (url === null) return;

  if (currentlySelected && currentlySelected.classList.contains('button-element')) {
    currentlySelected.href = url;
    checkRestrictedControls();
    loadStylesFromSelected();
  }

  if (currentlySelected && currentlySelected.classList.contains('image-element')) {
    let linkWrapper = getParentLink(currentlySelected);

    if (!linkWrapper) {
      linkWrapper = document.createElement('a');
      linkWrapper.className = 'link-element building-block building-block-align-center';
      linkWrapper.setAttribute('data-name', 'Building Block: Linked Image');
      
      linkWrapper.style.display = 'contents'; 

      currentlySelected.parentNode.insertBefore(linkWrapper, currentlySelected);
      linkWrapper.appendChild(currentlySelected);
    }

    linkWrapper.href = url;
    
    checkRestrictedControls();
    loadStylesFromSelected();
  }
});

linkRemove.addEventListener("click", function() {
  if (currentlySelected && currentlySelected.classList.contains('button-element')) {
    currentlySelected.removeAttribute('href');
    checkRestrictedControls();
    loadStylesFromSelected();
  }

  if (currentlySelected && currentlySelected.classList.contains('image-element')) {
    const linkWrapper = getParentLink(currentlySelected);

    if (linkWrapper) {
      linkWrapper.parentNode.insertBefore(currentlySelected, linkWrapper);
      linkWrapper.remove();
    }

    checkRestrictedControls();
    loadStylesFromSelected();
  }
});

linkOpenInNewTab.addEventListener("change", function() {
  if (currentlySelected && currentlySelected.classList.contains('button-element')) {
    if (linkOpenInNewTab.checked) {
      currentlySelected.target = "_blank";
    } else {
      currentlySelected.removeAttribute("target");
    }
  }

  if (currentlySelected && currentlySelected.classList.contains('image-element')) {
    const linkWrapper = getParentLink(currentlySelected);
    
    if (linkWrapper) {
      if (linkOpenInNewTab.checked) {
        linkWrapper.target = "_blank";
      } else {
        linkWrapper.removeAttribute("target");
      }
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
  const isAnimationEditorVisible = window.getComputedStyle(animations).display !== "none";
  if (isTextEditorVisible || isStyleEditorVisible || isAnimationEditorVisible) return;
  
  if (e.key === 's') {
    e.preventDefault();
    if (currentlySelected) {
  
      invokeStyleMenu();
    }
  }
});