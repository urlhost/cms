const cms = document.querySelector(".cms-menu");
const cmsMenuBar = document.querySelector(".cms-menu-bar");
const selectedElementLabel = document.getElementById("selected-element-label");
const styles = document.getElementById("style-editor-sidebar");
const styleButton = document.getElementById("style-element");
const deleteButton = document.getElementById("delete-element");
const moveUp = document.getElementById("move-element-up");
const moveDown = document.getElementById("move-element-down");
const publishPage = document.getElementById("publish-page");
const previewPage = document.getElementById("preview-page");
const loadedPage = document.getElementById("loaded-page");

let currentlySelected = null;
let clipboard = {
   html: null,
   sourceElement: null
};

function deselectAll() {
   if (currentlySelected) {
      currentlySelected.classList.remove('selected');
      currentlySelected = null;
      updateSelectedLabel();
      cms.classList.add("content-hide");
      styles.classList.add("content-hide");
      loadedPage.classList.remove("sidebar-active");
   }
}

function selectBuildingBlock(blockToSelect, originalTarget) {
   if (originalTarget.closest('.placeholder-block')) {
      deselectAll();
      currentlySelected = originalTarget;
      invokeCMSMenu();
      return;
   }
   deselectAll();
   currentlySelected = blockToSelect;
   currentlySelected.classList.add('selected');
   updateSelectedLabel();
}

function updateSelectedLabel() {
   if (currentlySelected) {
      if (currentlySelected.dataset.name === undefined) {
         selectedElementLabel.innerText = '';
         return;
      }

      selectedElementLabel.innerText = currentlySelected.dataset.name;
   }
}

function deleteElement() {
   if (currentlySelected) {
      if (confirm('Are you sure you want to delete this element?')) {
         currentlySelected.remove();
         currentlySelected = null;
      }
   }
}

function copyElement() {
   if (currentlySelected) {
      currentlySelected.classList.remove('selected');
      clipboard.html = currentlySelected.outerHTML;
      currentlySelected.classList.add('selected');
      clipboard.sourceElement = currentlySelected;
   }
}

function pasteElement() {
   if (!currentlySelected || !clipboard.html) {
      deselectAll();
      return;
   }

   try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = clipboard.html;
      const copiedElement = tempDiv.firstElementChild;

      if (copiedElement.classList.contains('building-column')) {
         if (!currentlySelected.classList.contains('building-column')) {
            alert('A column can only be pasted to overwrite another column. Please select a column.');
            return;
         }
         if (currentlySelected === clipboard.sourceElement) {
            alert('Cannot overwrite the same column. Please select a different column to replace.');
            return;
         }

         currentlySelected.insertAdjacentHTML('afterend', clipboard.html);
         const newElement = currentlySelected.nextElementSibling;
         currentlySelected.remove();
         selectBuildingBlock(newElement, newElement);
         return;
      }

      // if (copiedElement.classList.contains('building-container')) {
      //    if (currentlySelected.classList.contains('building-container')) {
      //       currentlySelected.insertAdjacentHTML('afterend', clipboard.html);
      //       return;
      //    } else {
      //       alert('A building container can only be pasted after another container.');
      //       return;
      //    }
      // }

      if (currentlySelected.classList.contains('building-column')) {
         const placeholder = currentlySelected.querySelector('.placeholder-block');
         if (placeholder) {
            placeholder.insertAdjacentHTML('beforebegin', clipboard.html);
            return;
         } else {
            currentlySelected.insertAdjacentHTML('beforeend', clipboard.html);
            return;
         }
      } else {
         const parentColumn = currentlySelected.closest('.building-column');
         if (parentColumn) {
            if (currentlySelected.classList.contains('placeholder-block')) {
               alert('Cannot paste an element here. Please select the column to paste into, not the placeholder.');
               return;
            }
            currentlySelected.insertAdjacentHTML('afterend', clipboard.html);
            return;
         } else {
            alert('Content blocks can only be pasted inside a "building-column".');
            return;
         }
      }
   } finally {
      deselectAll();
   }
}

let cmsPreviewCounter = 0;

function checkCMSVisibilityState() {
   if (cmsPreviewCounter == 0) {
      disableCMS();
      setTimeout(() => {
         cmsPreviewCounter = 1;
      }, 0);
   } else {
      enableCMS();
      setTimeout(() => {
         cmsPreviewCounter = 0;
      }, 0);
   }
}

function disableCMS() {
  // 1. Unload the CSS file
  // We target the link tag with the specific href and data-name
  const stylesheet = document.querySelector('link[href="cms.css"][data-name="cms stylesheet"]');
  
  if (stylesheet) {
    stylesheet.remove();
    console.log('CMS Stylesheet unloaded.');
  }

  // 2. Hide the element with data-name "cms environment"
  const cmsEnvElement = document.querySelector('[data-name="cms environment"]');
  
  if (cmsEnvElement) {
    cmsEnvElement.style.display = 'none';
    console.log('CMS Environment element hidden.');
  }
}

function enableCMS() {
  // 1. Reload the CSS file
  // First, check if it already exists to prevent adding duplicates
  if (!document.querySelector('link[href="cms.css"][data-name="cms stylesheet"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'cms.css';
    link.setAttribute('data-name', 'cms stylesheet'); // Restore the data attribute
    
    // Append it back to the <head>
    document.head.appendChild(link);
    console.log('CMS Stylesheet restored.');
  }

  // 2. Show the data-name 'cms environment' element
  const cmsEnvElement = document.querySelector('[data-name="cms environment"]');
  
  if (cmsEnvElement) {
    // Setting display to an empty string removes the inline 'display: none',
    // allowing the element's default CSS (block, flex, grid, etc.) to take over.
    cmsEnvElement.style.display = ''; 
    console.log('CMS Environment element visible.');
  }
}

previewPage.addEventListener('click', checkCMSVisibilityState);

// NEW, CORRECTED HELPER FUNCTION
function formatHtml(node, level = 0, indentChar = '  ') {
   const inlineTags = new Set(['a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr']);
   const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

   let result = '';

   switch (node.nodeType) {
      case Node.ELEMENT_NODE:
         const tagName = node.nodeName.toLowerCase();
         const isInline = inlineTags.has(tagName);
         const indent = indentChar.repeat(level);

         // Add newline and indentation before block-level tags
         if (!isInline && level > 0) {
            result += '\n' + indent;
         }

         result += `<${tagName}`;
         for (const attr of node.attributes) {
            result += ` ${attr.name}="${attr.value}"`;
         }
         result += '>';

         if (!voidTags.has(tagName)) {
            let isEffectivelyEmpty = true;
            // Check if the element contains any non-whitespace children
            if (node.hasChildNodes()) {
               for (const child of node.childNodes) {
                  if ((child.nodeType === Node.TEXT_NODE && child.nodeValue.trim() !== '') || child.nodeType === Node.ELEMENT_NODE) {
                     isEffectivelyEmpty = false;
                     break;
                  }
               }
            }

            if (!isEffectivelyEmpty) {
               for (const child of node.childNodes) {
                  result += formatHtml(child, level + 1, indentChar);
               }
               if (!isInline) {
                  result += '\n' + indent;
               }
            }
            result += `</${tagName}>`;
         }
         break;

      case Node.TEXT_NODE:
         const trimmedValue = node.nodeValue.trim();
         if (trimmedValue) {
            result += trimmedValue;
         }
         break;

      case Node.COMMENT_NODE:
         result += ``;
         break;
   }

   return result;
}

async function publishPageCode() {
    deselectAll();
    cleanWidth();

    const liveWrapper = document.querySelector('#loaded-page');
    if (!liveWrapper) {
        alert('Could not find #loaded-page.');
        return;
    }

    const wrapperParent = liveWrapper.parentNode;
    const wrapperNextSibling = liveWrapper.nextSibling;

    // ----- Step 1: Unwrap the live wrapper -----
    const liveChildren = Array.from(liveWrapper.childNodes);
    liveChildren.forEach(child => wrapperParent.insertBefore(child, liveWrapper));
    wrapperParent.removeChild(liveWrapper);

    try {
        // ----- Step 2: Clone the live DOM -----
        const tempDoc = document.cloneNode(true);

        // ----- Step 3: Remove unwanted CMS/extension elements -----
        const unwantedSelectors = [
            '[data-name="cms menu bar"]',
            '[data-name="cms environment"]',
            '[data-name="cms stylesheet"]',
            '[data-name="cms javascript"]',
            '[id^="fa-"]',
            'link[href^="chrome-extension://"]'
        ].join(', ');

        tempDoc.querySelectorAll(unwantedSelectors).forEach(el => el.remove());

        // ----- Step 4: Unwrap #loaded-page in the tempDoc -----
        const tempWrapper = tempDoc.querySelector('#loaded-page');
        if (tempWrapper) {
            tempWrapper.replaceWith(...tempWrapper.childNodes);
        }

        // ----- Step 5: Format and copy HTML -----
        const formattedHtml = formatHtml(tempDoc.documentElement);
        const cleanedHtml = '<!DOCTYPE html>\n' + formattedHtml;
        await navigator.clipboard.writeText(cleanedHtml);

        console.log('Formatted page HTML copied to clipboard!');
        alert('Page HTML copied!');

    } catch (err) {
        console.error('Failed to copy HTML to clipboard:', err);
        alert('Could not copy HTML.');
    } finally {
        // ----- Step 6: Safely rewrap the live DOM -----
        const newWrapper = document.createElement('div');
        newWrapper.id = 'loaded-page';
        newWrapper.className = liveWrapper.className;

        // Move all children back into the wrapper
        Array.from(wrapperParent.childNodes).forEach(child => newWrapper.appendChild(child));

        // Insert wrapper in original spot if possible
        if (wrapperNextSibling && wrapperParent.contains(wrapperNextSibling)) {
            wrapperParent.insertBefore(newWrapper, wrapperNextSibling);
        } else {
            wrapperParent.appendChild(newWrapper);
        }
    }
}

document.addEventListener("click", (e) => {
   const target = e.target;

   // Define the primary UI containers that should not trigger selection changes.
   // Clicks inside these elements are considered UI interactions and should be ignored here.
   const isInsideQuillUI = target.closest('.text-editor-pop');
   const isInsideCmsUI = target.closest('.cms-menu');
   const isInsideCmsMenuBar = target.closest('.cms-menu-bar');
   const isInsideStyleEditor = target.closest('#style-editor-sidebar');

   // If the click is inside any of our main UI containers, stop further execution.
   if (isInsideQuillUI || isInsideCmsUI || isInsideStyleEditor) {
      return;
   }

   if (isInsideCmsMenuBar) {
      if (target !== moveUp && target !== moveDown) {
         return;
      } else {
         if (currentlySelected) {
            if (target === moveUp) {
               const prev = currentlySelected.previousElementSibling;
               if (prev) {
                  currentlySelected.parentElement.insertBefore(currentlySelected, prev);
               }
            } else if (target === moveDown) {
               const next = currentlySelected.nextElementSibling;
               if (next.classList.contains("placeholder-block") || next.classList.contains("accordion-content")) {
                  return;
               } else {
                  currentlySelected.parentElement.insertBefore(currentlySelected, next.nextElementSibling);
               }
            }
         }

         return;
      }
   }

   // If the click was not in a UI area, check if it was on a building block.
   const targetBuildingBlock = target.closest('.building-block');

   if (targetBuildingBlock) {
      // If a building block was clicked, select it.
      // The `selectBuildingBlock` function handles the specific logic.
      selectBuildingBlock(targetBuildingBlock, target);
   } else {
      deselectAll();
   }
});

document.addEventListener("keydown", e => {

   const target = e.target;

   // Ignore keystrokes inside editors OR form fields
   if (
      target.closest('.text-editor-pop') ||
      target.closest('.style-editor-sidebar') ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
   ) {
      return; // allow normal typing
   }

   const isCtrl = e.ctrlKey || e.metaKey; // metaKey for macOS (Command key)

   // Copy: Ctrl+C or Cmd+C
   if (isCtrl && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      copyElement();
      return;
   }

   // Paste: Ctrl+V or Cmd+V
   if (isCtrl && e.key.toLowerCase() === 'v') {
      e.preventDefault();
      pasteElement();
      return;
   }

   if (currentlySelected) {
      if (e.key === 'ArrowUp') {
         e.preventDefault();
         const prev = currentlySelected.previousElementSibling;
         if (prev) {
            currentlySelected.parentElement.insertBefore(currentlySelected, prev);
         }
      } else if (e.key === 'ArrowDown') {
         e.preventDefault();
         const next = currentlySelected.nextElementSibling;
         if (next.classList.contains("placeholder-block") || next.classList.contains("accordion-content")) {
            return;
         } else {
            currentlySelected.parentElement.insertBefore(currentlySelected, next.nextElementSibling);
         }
      }
   }
});

deleteButton.addEventListener("click", deleteElement);
publishPage.addEventListener("click", publishPageCode);


// const cms = document.querySelector(".cms-menu");

// const styles = document.querySelector(".style-editor-sidebar");

// const deleteButton = document.querySelector(".delete-element");

// const loadedPage = document.querySelector("#loaded-page");



// let currentlySelected = null;

// let clipboard = {

// html: null,

// sourceElement: null

// };



// function deselectAll() {

// if (currentlySelected) {

// currentlySelected.classList.remove('selected');

// currentlySelected = null;

// cms.classList.add("content-hide");

// styles.classList.add("content-hide");

// }

// }



// function selectBuildingBlock(blockToSelect, originalTarget) {

// if (originalTarget.closest('.placeholder-block')) {

// deselectAll();

// currentlySelected = originalTarget;

// invokeCMSMenu();

// return;

// }

// deselectAll();

// currentlySelected = blockToSelect;

// currentlySelected.classList.add('selected');

// }



// function deleteElement() {

// if (currentlySelected) {

// if (confirm('Are you sure you want to delete this element?')) {

// currentlySelected.remove();

// currentlySelected = null;

// }

// }

// }



// function copyElement() {

// if (currentlySelected) {

// currentlySelected.classList.remove('selected');

// clipboard.html = currentlySelected.outerHTML;

// currentlySelected.classList.add('selected');

// clipboard.sourceElement = currentlySelected;

// }

// }



// function pasteElement() {

// if (!currentlySelected || !clipboard.html) {

// deselectAll();

// return;

// }



// try {

// const tempDiv = document.createElement('div');

// tempDiv.innerHTML = clipboard.html;

// const copiedElement = tempDiv.firstElementChild;



// if (copiedElement.classList.contains('building-column')) {

// if (!currentlySelected.classList.contains('building-column')) {

// alert('A column can only be pasted to overwrite another column. Please select a column.');

// return;

// }

// if (currentlySelected === clipboard.sourceElement) {

// alert('Cannot overwrite the same column. Please select a different column to replace.');

// return;

// }



// currentlySelected.insertAdjacentHTML('afterend', clipboard.html);

// const newElement = currentlySelected.nextElementSibling;

// currentlySelected.remove();

// selectBuildingBlock(newElement, newElement);

// return;

// }



// if (copiedElement.classList.contains('building-container')) {

// if (currentlySelected.classList.contains('building-container')) {

// currentlySelected.insertAdjacentHTML('afterend', clipboard.html);

// return;

// } else {

// alert('A building container can only be pasted after another container.');

// return;

// }

// }



// if (currentlySelected.classList.contains('building-column')) {

// const placeholder = currentlySelected.querySelector('.placeholder-block');

// if (placeholder) {

// placeholder.insertAdjacentHTML('beforebegin', clipboard.html);

// return;

// } else {

// currentlySelected.insertAdjacentHTML('beforeend', clipboard.html);

// return;

// }

// } else {

// const parentColumn = currentlySelected.closest('.building-column');

// if (parentColumn) {

// if (currentlySelected.classList.contains('placeholder-block')) {

// alert('Cannot paste an element here. Please select the column to paste into, not the placeholder.');

// return;

// }

// currentlySelected.insertAdjacentHTML('afterend', clipboard.html);

// return;

// } else {

// alert('Content blocks can only be pasted inside a "building-column".');

// return;

// }

// }

// } finally {

// deselectAll();

// }

// }



// document.addEventListener("click", (e) => {

// const target = e.target;

// const uiElements = '.ql-container, .ql-toolbar, .ql-picker, .ql-tooltip, .ql-action, .text-editor-pop, .text-editor, .cms-menu-bar, .cms-menu, .cms-menu-container, .style-editor-sidebar';

// if (target.closest(uiElements)) return;



// const targetBlock = target.closest('.building-block');

// if (targetBlock) {

// selectBuildingBlock(targetBlock, target);

// } else {

// deselectAll();

// }

// });



// document.addEventListener("keydown", e => {

// // Ignore keystrokes inside editors

// if (e.target.closest('.text-editor-pop') || e.target.closest('.style-editor-sidebar')) {

// return;

// }



// const isCtrl = e.ctrlKey || e.metaKey; // metaKey for macOS (Command key)



// // Copy: Ctrl+C or Cmd+C

// if (isCtrl && e.key.toLowerCase() === 'c') {

// e.preventDefault();

// copyElement();

// return; // Stop further execution

// }



// // Paste: Ctrl+V or Cmd+V

// if (isCtrl && e.key.toLowerCase() === 'v') {

// e.preventDefault();

// pasteElement();

// return; // Stop further execution

// }



// if (currentlySelected) {

// e.preventDefault();

// if (e.key === 'ArrowUp') {

// const prev = currentlySelected.previousElementSibling;

// if (prev) currentlySelected.parentElement.insertBefore(currentlySelected, prev);

// } else if (e.key === 'ArrowDown') {

// const next = currentlySelected.nextElementSibling;

// if (next) currentlySelected.parentElement.insertBefore(currentlySelected, next.nextElementSibling);

// }

// }

// });



// deleteButton.addEventListener("click", deleteElement);


