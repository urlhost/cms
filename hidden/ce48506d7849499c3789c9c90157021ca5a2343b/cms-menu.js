//Text Element Buttons
const textElementHeadingOneButton = document.getElementById("text-element-heading-one-button");
const textElementHeadingTwoButton = document.getElementById("text-element-heading-two-button");
const textElementHeadingThreeButton = document.getElementById("text-element-heading-three-button");
const textElementHeadingFourButton = document.getElementById("text-element-heading-four-button");
const textElementHeadingFiveButton = document.getElementById("text-element-heading-five-button");
const textElementParagraphButton = document.getElementById("text-element-paragraph-button");
const textElementUnorderedButton = document.getElementById("text-element-unordered-button");
const textElementOrderedButton = document.getElementById("text-element-ordered-button");
//Layout Element Buttons
const layoutElementOneColumnButton = document.getElementById("layout-element-one-column-button");
const layoutElementTwoColumnButton = document.getElementById("layout-element-two-column-button");
const layoutElementThreeColumnButton = document.getElementById("layout-element-three-column-button");
const layoutElementFourColumnButton = document.getElementById("layout-element-four-column-button");
const layoutElementFiveColumnButton = document.getElementById("layout-element-five-column-button");
const layoutElementSixColumnButton = document.getElementById("layout-element-six-column-button");
const layoutElementAsymmLeftColumnButton = document.getElementById("layout-element-asymm-left-column-button");
const layoutElementAsymmRightColumnButton = document.getElementById("layout-element-asymm-right-column-button");
const layoutElementSpacerButton = document.getElementById("layout-element-spacer-button");
const layoutElementDividerButton = document.getElementById("layout-element-divider-button");
const layoutElementAccordionButton = document.getElementById("layout-element-accordion-button");
//Image Element Buttons
const imageElementLinkButton = document.getElementById("image-element-link-button");
const imageElementUploadButton = document.getElementById("image-element-upload-button");

//Element Functions
function insertElement(htmlContent) {
    if (currentlySelected) {
        currentlySelected.insertAdjacentHTML('beforebegin', htmlContent);
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
    currentlySelected.insertAdjacentHTML("beforebegin", htmlContent);

    const insertedImage = currentlySelected.previousElementSibling;
    const imageUpload = await grabImageUpload();

    if (imageUpload && insertedImage) {
      insertedImage.src = imageUpload;
    }

    deselectAll();
  }
}

function insertLayoutElement(htmlContent) {
    if (currentlySelected) {
        // The '>' ensures we ignore any containers nested inside columns
        const topLevelContainers = document.querySelectorAll(".building-environment > .building-container");

        if (topLevelContainers.length > 0) {
            // Case A: We have existing containers, put this after the last one
            const lastContainer = topLevelContainers[topLevelContainers.length - 1];
            lastContainer.insertAdjacentHTML('afterend', htmlContent);
        } else {
            // Case B: The environment is empty (no containers yet)
            // We need to append the content directly into the environment wrapper
            const environment = document.querySelector(".building-environment");
            
            if (environment) {
                environment.insertAdjacentHTML('beforeend', htmlContent);
            } else {
                console.warn("Parent container '.building-environment' not found.");
                return;
            }
        }

        deselectAll();
    }
}

// Utilities
function grabImageLink() {
  const link = prompt("Enter a photo link:");
  const imageRegex = /\.(jpe?g|png|gif|webp|svg)(\?.*)?(#.*)?$/i;

  if (link && imageRegex.test(link)) {
    return link;
  } else if (link) {
    alert("Please enter a valid image URL (jpg, png, gif, webp, svg).");
    grabImageLink();
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

      // SVG: return as-is
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

          // Scale down if too large
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

          let mimeType = file.type;
          let quality = 0.85;

          // Create base64
          let base64 = canvas.toDataURL(mimeType, quality);

          // Reduce quality silently until under 2MB
          const maxSizeBytes = 2 * 1024 * 1024;
          while (base64.length * 0.75 > maxSizeBytes && quality > 0.4) {
            quality -= 0.05;
            base64 = canvas.toDataURL(mimeType, quality);
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

//Text Element Event Listeners
textElementHeadingOneButton.addEventListener('click', () => insertElement(headingOne));
textElementHeadingTwoButton.addEventListener('click', () => insertElement(headingTwo));
textElementHeadingThreeButton.addEventListener('click', () => insertElement(headingThree));
textElementHeadingFourButton.addEventListener('click', () => insertElement(headingFour));
textElementHeadingFiveButton.addEventListener('click', () => insertElement(headingFive));
textElementParagraphButton.addEventListener('click', () => insertElement(paragraph));
textElementUnorderedButton.addEventListener('click', () => insertElement(unorderedList));
textElementOrderedButton.addEventListener('click', () => insertElement(orderedList));
//Layout Element Event Listeners
layoutElementAccordionButton.addEventListener('click', () => insertElement(accordion));
layoutElementOneColumnButton.addEventListener('click', () => insertLayoutElement(oneColumn));
layoutElementTwoColumnButton.addEventListener('click', () => insertLayoutElement(twoColumns));
layoutElementThreeColumnButton.addEventListener('click', () => insertLayoutElement(threeColumns));
layoutElementFourColumnButton.addEventListener('click', () => insertLayoutElement(fourColumns));
layoutElementFiveColumnButton.addEventListener('click', () => insertLayoutElement(fiveColumns));
layoutElementSixColumnButton.addEventListener('click', () => insertLayoutElement(sixColumns));
layoutElementAsymmLeftColumnButton.addEventListener('click', () => insertLayoutElement(asymmLeftColumn));
layoutElementAsymmRightColumnButton.addEventListener('click', () => insertLayoutElement(asymmRightColumn));
layoutElementSpacerButton.addEventListener('click', () => insertElement(spacer));
layoutElementDividerButton.addEventListener('click', () => insertElement(divider));
layoutElementAccordionButton.addEventListener('click', () => insertElement(accordion));
//Image Element Event Listeners
imageElementLinkButton.addEventListener('click', () => insertImageLink(image));
imageElementUploadButton.addEventListener('click', () => insertImageUpload(image));

//Open The CMS Menu
function invokeCMSMenu() {
    if (currentlySelected && currentlySelected.classList.contains('placeholder-block')) {
        cms.classList.remove('content-hide');
        loadedPage.classList.add("sidebar-active");
    }
}
