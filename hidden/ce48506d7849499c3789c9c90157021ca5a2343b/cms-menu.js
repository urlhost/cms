// ==========================================
// 1. DOM ELEMENTS
// ==========================================

// Text Elements
const textElementHeadingOneButton = document.getElementById("text-element-heading-one-button");
const textElementHeadingTwoButton = document.getElementById("text-element-heading-two-button");
const textElementHeadingThreeButton = document.getElementById("text-element-heading-three-button");
const textElementHeadingFourButton = document.getElementById("text-element-heading-four-button");
const textElementHeadingFiveButton = document.getElementById("text-element-heading-five-button");
const textElementParagraphButton = document.getElementById("text-element-paragraph-button");
const textElementUnorderedButton = document.getElementById("text-element-unordered-button");
const textElementOrderedButton = document.getElementById("text-element-ordered-button");
const textElementButtonButton = document.getElementById("text-element-button-button");

// Layout Elements
const layoutElementOneColumnButton = document.getElementById("layout-element-one-column-button");
const layoutElementTwoColumnButton = document.getElementById("layout-element-two-column-button");
const layoutElementThreeColumnButton = document.getElementById("layout-element-three-column-button");
const layoutElementFourColumnButton = document.getElementById("layout-element-four-column-button");
const layoutElementFiveColumnButton = document.getElementById("layout-element-five-column-button");
const layoutElementSixColumnButton = document.getElementById("layout-element-six-column-button");
const layoutElementAsymmLeftColumnButton = document.getElementById("layout-element-asymm-left-column-button");
const layoutElementAsymmRightColumnButton = document.getElementById("layout-element-asymm-right-column-button");
const layoutElementInstanceCheckbox = document.getElementById("layout-element-instance-checkbox");

// Cleanup & Structure Elements
const layoutElementSpacerButton = document.getElementById("layout-element-spacer-button");
const layoutElementDividerButton = document.getElementById("layout-element-divider-button");
const layoutElementAccordionButton = document.getElementById("layout-element-accordion-button");

// Image Elements
const imageElementLinkButton = document.getElementById("image-element-link-button");
const imageElementUploadButton = document.getElementById("image-element-upload-button");


// ==========================================
// 2. HELPER FUNCTIONS (INPUTS & UPLOADS)
// ==========================================

function grabImageLink() {
  const link = prompt("Enter a photo link:");
  
  if (link === null) return null; // Handle cancel

  if (link.toLowerCase().includes('google')) {
      return link;
  }

  const imageRegex = /\.(jpe?g|png|gif|webp|svg)(\?.*)?(#.*)?$/i;

  if (link && imageRegex.test(link)) {
    return link;
  } else if (link) {
    alert("Please enter a valid image URL (jpg, png, gif, webp, svg).");
    return grabImageLink(); 
  }

  return null;
}

function grabImageUpload() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/gif,image/webp,image/svg+xml";

    input.onchange = () => {
      const file = input.files[0];
      if (!file) {
        resolve(null);
        return;
      }

      if (file.type === "image/svg+xml") {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          let { width, height } = img;
          const maxDimension = 1200;
          
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height *= maxDimension / width;
              width = maxDimension;
            } else {
              width *= maxDimension / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          let outputMime = 'image/webp'; 
          let quality = 0.85;
          let base64 = canvas.toDataURL(outputMime, quality);

          const maxSizeBytes = 1 * 1024 * 1024; 
          
          while (base64.length > maxSizeBytes && quality > 0.1) {
            quality -= 0.1;
            base64 = canvas.toDataURL(outputMime, quality);
          }

          resolve(base64);
        };
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    };

    input.click();
  });
}


// ==========================================
// 3. INSERTION LOGIC
// ==========================================

function insertElement(htmlContent) {
    if (currentlySelected) {
        currentlySelected.insertAdjacentHTML('beforebegin', htmlContent);
        deselectAll();
    }
}

function insertLayoutElement(htmlContent) {
    if (currentlySelected && layoutElementInstanceCheckbox.checked) {
        // The '>' ensures we ignore any containers nested inside columns
        const topLevelContainers = document.querySelectorAll(":is(.content-environment, .header-environment, .footer-environment) > .building-container");

        if (topLevelContainers.length > 0) {
            // Case A: We have existing containers, put this after the last one
            const lastContainer = topLevelContainers[topLevelContainers.length - 1];
            lastContainer.insertAdjacentHTML('afterend', htmlContent);
        } else {
            // Case B: The environment is empty (no containers yet)
            const environment = document.querySelector(".content-environment");
            if (environment) {
                environment.insertAdjacentHTML('beforeend', htmlContent);
            } else {
                console.warn("Parent container '.content-environment' not found.");
                return;
            }
        }

        deselectAll();
    } else {
        // Insert directly before selection
        currentlySelected.insertAdjacentHTML("beforebegin", htmlContent);
        layoutElementInstanceCheckbox.checked = true; // Reset checkbox
        deselectAll();
    }
}

function insertImageLink(htmlContent) {
  if (currentlySelected) {
    const imageLink = grabImageLink();

    if (imageLink === null) {
      return;
    }
    
    currentlySelected.insertAdjacentHTML('beforebegin', htmlContent);
    const insertedImage = currentlySelected.previousElementSibling;

    if (imageLink && insertedImage) {
      insertedImage.src = imageLink;
    }

    deselectAll();
  }
}

async function insertImageUpload(htmlContent) {
  if (currentlySelected) {
    // 1. Insert the HTML structure first
    currentlySelected.insertAdjacentHTML("beforebegin", htmlContent);
    const insertedImage = currentlySelected.previousElementSibling;

    // 2. Process the file
    const imageUpload = await grabImageUpload();

    // 3. Apply the source or remove if failed
    if (imageUpload && insertedImage) {
      insertedImage.src = imageUpload;
    } else if (!imageUpload && insertedImage) {
       // Optional: Remove the empty image tag if the user cancelled upload
       // insertedImage.remove(); 
    }

    deselectAll();
  }
}


// ==========================================
// 4. EVENT LISTENERS
// ==========================================

// Text
textElementHeadingOneButton.addEventListener('click', () => insertElement(headingOne));
textElementHeadingTwoButton.addEventListener('click', () => insertElement(headingTwo));
textElementHeadingThreeButton.addEventListener('click', () => insertElement(headingThree));
textElementHeadingFourButton.addEventListener('click', () => insertElement(headingFour));
textElementHeadingFiveButton.addEventListener('click', () => insertElement(headingFive));
textElementParagraphButton.addEventListener('click', () => insertElement(paragraph));
textElementUnorderedButton.addEventListener('click', () => insertElement(unorderedList));
textElementOrderedButton.addEventListener('click', () => insertElement(orderedList));
textElementButtonButton.addEventListener('click', () => insertElement(button));

// Layout
layoutElementOneColumnButton.addEventListener('click', () => insertLayoutElement(oneColumn));
layoutElementTwoColumnButton.addEventListener('click', () => insertLayoutElement(twoColumns));
layoutElementThreeColumnButton.addEventListener('click', () => insertLayoutElement(threeColumns));
layoutElementFourColumnButton.addEventListener('click', () => insertLayoutElement(fourColumns));
layoutElementFiveColumnButton.addEventListener('click', () => insertLayoutElement(fiveColumns));
layoutElementSixColumnButton.addEventListener('click', () => insertLayoutElement(sixColumns));
layoutElementAsymmLeftColumnButton.addEventListener('click', () => insertLayoutElement(asymmLeftColumn));
layoutElementAsymmRightColumnButton.addEventListener('click', () => insertLayoutElement(asymmRightColumn));

// Cleanup & Structure
layoutElementSpacerButton.addEventListener('click', () => insertElement(spacer));
layoutElementDividerButton.addEventListener('click', () => insertElement(divider));
layoutElementAccordionButton.addEventListener('click', () => insertElement(accordion));

// Images
imageElementLinkButton.addEventListener('click', () => insertImageLink(image));
imageElementUploadButton.addEventListener('click', () => insertImageUpload(image));


// ==========================================
// 5. GLOBAL TRIGGERS
// ==========================================

function invokeCMSMenu() {
    if (currentlySelected && currentlySelected.classList.contains('placeholder-block')) {
        cms.classList.remove('content-hide');
        loadedPage.classList.add("sidebar-active");
    }
}