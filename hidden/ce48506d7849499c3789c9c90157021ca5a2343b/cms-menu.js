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

//Embed Element
const embedElementButton = document.getElementById("embed-element-button");

// ==========================================
// 2. INSERTION LOGIC
// ==========================================

function insertElement(htmlContent) {
    if (currentlySelected) {
        currentlySelected.insertAdjacentHTML('beforebegin', htmlContent);
        deselectAll();
    }
}

function insertLayoutElement(htmlContent) {
    if (currentlySelected && layoutElementInstanceCheckbox.checked) {
        const targetEnvironment = currentlySelected.closest('.content-environment, .header-environment, .footer-environment');

        if (!targetEnvironment) {
            console.warn("No valid environment parent found.");
            return;
        }

        const topLevelContainers = targetEnvironment.querySelectorAll(":scope > .building-container");

        if (topLevelContainers.length > 0) {
            const lastContainer = topLevelContainers[topLevelContainers.length - 1];
            lastContainer.insertAdjacentHTML('afterend', htmlContent);
        } else {
            targetEnvironment.insertAdjacentHTML('beforeend', htmlContent);
        }

        deselectAll();
    } else if (currentlySelected) {
        currentlySelected.insertAdjacentHTML("beforebegin", htmlContent);
        layoutElementInstanceCheckbox.checked = true;
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

function insertEmbedContent(htmlContent) {
  if (currentlySelected) {
    const code = grabEmbedCode();

    if (code === null) {
      return;
    }
    
    currentlySelected.insertAdjacentHTML('beforebegin', htmlContent);
    const insertedEmbed = currentlySelected.previousElementSibling;

    if (code && insertedEmbed) {
      insertedEmbed.innerHTML = code;
    }

    deselectAll();
  }
}

// ==========================================
// 3. EVENT LISTENERS
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

//Embed
embedElementButton.addEventListener('click', () => insertEmbedContent(embed));


// ==========================================
// 4. GLOBAL TRIGGERS
// ==========================================

function invokeCMSMenu() {
    if (currentlySelected && currentlySelected.classList.contains('placeholder-block')) {
        cms.classList.remove('content-hide');
        loadedPage.classList.add("sidebar-active");
        cmsMainMenu.classList.add("sidebar-active");
    }
}

const placeHolders = document.querySelectorAll(".placeholder-block");

placeHolders.forEach(placeHolder => {
  placeHolder.addEventListener('click', invokeCMSMenu);
});