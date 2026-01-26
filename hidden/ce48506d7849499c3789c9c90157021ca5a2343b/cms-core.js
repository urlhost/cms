// ==========================================
// 1. DOM ELEMENTS & STATE
// ==========================================

const cmsMainMenu = document.querySelector(".cms-main-menu");
const cmsMenu = document.querySelector("cms-menu");
const selectedElementLabel = document.getElementById("selected-element-label");
const styles = document.getElementById("style-editor-sidebar");
const loadedPage = document.getElementById("loaded-page");

// Buttons
const styleButton = document.getElementById("style-element");
const deleteButton = document.getElementById("delete-element");
const moveUp = document.getElementById("move-element-up");
const moveDown = document.getElementById("move-element-down");
const publishPage = document.getElementById("publish-page");
const previewPage = document.getElementById("preview-page");

// State
let currentlySelected = null;
let clipboard = {
    html: null,
    sourceElement: null
};
let cmsPreviewCounter = 0;


// ==========================================
// 2. SELECTION LOGIC
// ==========================================

function deselectAll() {
    if (currentlySelected) {
        currentlySelected.classList.remove('selected');
        currentlySelected = null;
        cmsMenu.classList.add("content-hide");
        styles.classList.add("content-hide");
        loadedPage.classList.remove("sidebar-active");
        cmsMainMenu.classList.remove("sidebar-active");
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
    currentlySelected = getParentLink(currentlySelected) || currentlySelected;
    currentlySelected.classList.add('selected');
}

function updateSelectedLabel() {
    if (currentlySelected) {
        if (currentlySelected.dataset.name === undefined) {
            selectedElementLabel.innerText = 'No Selection';
            return;
        }
        selectedElementLabel.innerText = currentlySelected.dataset.name;
    } else {
        selectedElementLabel.innerText = 'No Selection';
    }
}

function updateMovementArrows() {
    if (currentlySelected) {
        if (currentlySelected.classList.contains('building-column')) {
            moveUp.firstElementChild.className = 'fas fa-chevron-left';
            moveDown.firstElementChild.className = 'fas fa-chevron-right';
            moveUp.title = "Move Left";
            moveDown.title = "Move Right";
        } else {
            moveUp.firstElementChild.className = 'fas fa-chevron-up';
            moveDown.firstElementChild.className = 'fas fa-chevron-down';
            moveUp.title = "Move Up";
            moveDown.title = "Move Down";
        }
    } else {
        moveUp.firstElementChild.className = 'fas fa-chevron-up';
        moveDown.firstElementChild.className = 'fas fa-chevron-down';
        moveUp.title = "Move Up";
        moveDown.title = "Move Down";
    }
}


// ==========================================
// 3. ELEMENT MANIPULATION (Copy, Paste, Delete)
// ==========================================

function deleteElement() {
    if (currentlySelected) {
        if (currentlySelected?.matches('.building-column, .placeholder-block, .accordion-label')) {
            alert("Cannot delete the current selection. Please select another element to delete.");
            deselectAll();
            return;
        }

        if (confirm('Are you sure you want to delete this element?')) {
            currentlySelected.remove();
            deselectAll();
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
        let parentColumn = null;

        if (copiedElement) {
            if (currentlySelected.classList.contains('placeholder-block')) {
                alert('Paste canceled. Please select a building container, column, or block, not the placeholder.');
                return;
            }
        }

        if (copiedElement.classList.contains('building-column')) {
            if (!currentlySelected.classList.contains('building-column')) {
                alert('A building column can only be pasted to overwrite another building column. Please select a building column.');
                return;
            }
            if (currentlySelected === clipboard.sourceElement) {
                alert('Cannot overwrite the same building column. Please select a different building column to replace.');
                return;
            }

            currentlySelected.insertAdjacentHTML('afterend', clipboard.html);
            const newElement = currentlySelected.nextElementSibling;
            currentlySelected.remove();
            selectBuildingBlock(newElement, newElement);
            return;
        }

        if (copiedElement.classList.contains('building-container')) {
            if (currentlySelected.classList.contains('building-container')) {
                currentlySelected.insertAdjacentHTML('afterend', clipboard.html);
                return;
            }
            if (currentlySelected.classList.contains('building-column')) {
                parentColumn = currentlySelected;
                const placeholder = parentColumn.querySelector('.placeholder-block');
                if (placeholder) {
                    placeholder.insertAdjacentHTML('beforebegin', clipboard.html);
                    return;
                } else {
                    currentlySelected.insertAdjacentHTML('beforeend', clipboard.html);
                    return;
                }
            } else {
                currentlySelected.insertAdjacentHTML('afterend', clipboard.html);
                return;
            }
        }

        if (!copiedElement?.matches('.building-container', '.building-column')) {
            if (currentlySelected.classList.contains('building-container')) {
                alert('Content blocks can only be pasted inside a "building column".');
                return;
            }

            if (currentlySelected.classList.contains('building-column')) {
                parentColumn = currentlySelected.closest('.building-column');
                const placeholder = parentColumn.querySelector(':scope > .placeholder-block');
                if (placeholder) {
                    placeholder.insertAdjacentHTML('beforebegin', clipboard.html);
                    return;
                } else {
                    currentlySelected.insertAdjacentHTML('beforeend', clipboard.html);
                    return;
                }
            }

            if (!currentlySelected?.matches('.building-container, .building-column')) {
                currentlySelected.insertAdjacentHTML('afterend', clipboard.html);
                return;
            }
        }
    } finally {
        deselectAll();
    }
}


// ==========================================
// 4. CMS SYSTEM & PREVIEW MODE
// ==========================================

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

    const url = new URL(window.location.href);
    url.searchParams.set('mode', 'preview');
    window.history.pushState({}, '', url.toString());

    initHelpers();
}

function enableCMS() {
    // 1. Reload the CSS file
    if (!document.querySelector('link[href="cms.css"][data-name="cms stylesheet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'cms.css';
        link.setAttribute('data-name', 'cms stylesheet');
        document.head.appendChild(link);
        console.log('CMS Stylesheet restored.');
    }

    // 2. Show the data-name 'cms environment' element
    const cmsEnvElement = document.querySelector('[data-name="cms environment"]');
    if (cmsEnvElement) {
        cmsEnvElement.style.display = '';
        console.log('CMS Environment element visible.');
    }

    const url = new URL(window.location.href);
    url.searchParams.set('mode', 'editing');
    window.history.pushState({}, '', url.toString());

    initHelpers();
}


// ==========================================
// 5. SAVING & PUBLISHING
// ==========================================

const DATABASE_NAME = 'CMS_Backup_DATABASE';
const DATABASE_VERSION = 1;
const STORE_NAME = 'page_drafts';
let cmsBackupDatabase;

const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

request.onupgradeneeded = (event) => {
    cmsBackupDatabase = event.target.result;
    if (!cmsBackupDatabase.objectStoreNames.contains(STORE_NAME)) {
        cmsBackupDatabase.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
};

request.onsuccess = (event) => {
    cmsBackupDatabase = event.target.result;
    loadSavedPage(); 
};

request.onerror = (event) => {
    console.error("Database error: ", event.target.errorCode);
};

function getPageID() {
    const urlParams = new URLSearchParams(window.location.search);
    const pageName = urlParams.get('page');
    
    if (pageName) {
        return pageName;
    }
    
    return window.location.pathname; 
}

const saveBtn = document.getElementById('save-page');
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        saveCurrentPage();
    });
}

function saveCurrentPage() {
    if (!cmsBackupDatabase) return;
    const contentContainer = document.getElementById('loaded-page');
    if (!contentContainer) return;

    const clone = contentContainer.cloneNode(true);
    const selectedItems = clone.querySelectorAll('.selected');
    selectedItems.forEach(el => el.classList.remove('selected'));
    
    const pageData = {
        id: getPageID(),
        content: clone.innerHTML,
        timestamp: new Date().getTime()
    };

    const transaction = cmsBackupDatabase.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const putRequest = store.put(pageData);

    putRequest.onsuccess = () => flashSaveSuccess();
    putRequest.onerror = () => alert("Error saving page.");
}

function flashSaveSuccess() {
    if(!saveBtn) return;
    const saveIcon = saveBtn.querySelector('i');
    
    const originalClass = saveIcon.className;
    saveIcon.className = 'fas fa-check';
    saveIcon.style.color = '#2ecc71';

    setTimeout(() => {
        saveIcon.className = originalClass;
        saveIcon.style.color = '';
    }, 1500);
}

function loadSavedPage() {
    if(!cmsBackupDatabase) return;
    
    const transaction = cmsBackupDatabase.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(getPageID());

    getRequest.onsuccess = (event) => {
        const result = event.target.result;
        if (result && result.content) {
            const container = document.getElementById('loaded-page');
            deselectAll();
            container.innerHTML = result.content;
            if (typeof initHelpers === 'function') {
                initHelpers();
            }
        }
    };
}

const clearBtn = document.getElementById('clear-save');
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        if (!cmsBackupDatabase) return;
        const transaction = cmsBackupDatabase.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const countRequest = store.count(getPageID());

        countRequest.onsuccess = () => {
            if (countRequest.result > 0) {
                if(confirm("Delete saved draft for this page?")) {
                    clearSavedPage();
                }
            } else {
                alert("No saved data for this page.");
            }
        };
    });
}

function clearSavedPage() {
    if (!cmsBackupDatabase) return;
    const transaction = cmsBackupDatabase.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const deleteRequest = store.delete(getPageID());
    
    deleteRequest.onsuccess = () => {
         const icon = clearBtn.querySelector('i');
         icon.classList.add('fa-spin');
         setTimeout(() => icon.classList.remove('fa-spin'), 500);
    }
}

//Legacy Format

function formatHtml(node, level = 0, indentChar = '  ') {
    const inlineTags = new Set(['abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr']);
    const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
    const preserveWhitespaceTags = new Set(['pre', 'code', 'textarea', 'script', 'style']);

    let result = '';

    switch (node.nodeType) {
        case Node.ELEMENT_NODE:
            const tagName = node.nodeName.toLowerCase();
            const isInline = inlineTags.has(tagName);
            const preserveWhitespace = preserveWhitespaceTags.has(tagName);
            const indent = indentChar.repeat(level);
            
            // Only add newline/indent for block-level elements that aren't nested directly in inline content
            const parentElement = node.parentElement;
            const parentIsInline = parentElement && inlineTags.has(parentElement.tagName.toLowerCase());

            if (!isInline && level > 0 && !parentIsInline) {
                result += '\n' + indent;
            }

            result += `<${tagName}`;
            
            // Improved attribute handling with proper escaping
            for (const attr of node.attributes) {
                const value = attr.value
                    .replace(/&/g, '&amp;')
                    .replace(/"/g, '&quot;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                result += ` ${attr.name}="${value}"`;
            }
            result += '>';

            if (!voidTags.has(tagName)) {
                let isEffectivelyEmpty = true;
                // Check if the element contains any non-whitespace children
                if (node.hasChildNodes()) {
                    for (const child of node.childNodes) {
                        if (preserveWhitespace) {
                            isEffectivelyEmpty = false;
                            break;
                        }
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
                    if (!isInline && !preserveWhitespace) {
                        result += '\n' + indent;
                    }
                }
                result += `</${tagName}>`;
            }
            break;

        case Node.TEXT_NODE:
            const parent = node.parentElement;
            const shouldPreserveWhitespace = parent && preserveWhitespaceTags.has(parent.tagName.toLowerCase());
            
            if (shouldPreserveWhitespace) {
                // Preserve all whitespace for pre, code, textarea, script, style
                result += node.nodeValue;
            } else {
                const trimmedValue = node.nodeValue.trim();
                if (trimmedValue) {
                    // Escape special HTML characters in text nodes
                    const escapedValue = trimmedValue
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
                    result += escapedValue;
                }
            }
            break;

        case Node.COMMENT_NODE:
            const commentIndent = indentChar.repeat(level);
            result += `\n${commentIndent}<!--${node.nodeValue}-->`;
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


// ==========================================
// 6. EVENT LISTENERS
// ==========================================

// Global Click (Selection & UI Logic)
document.addEventListener("click", (e) => {
    const target = e.target;

    // Define the primary UI containers that should not trigger selection changes.
    const isInsideQuillUI = target.closest('.text-editor-pop');
    const isInsideCmsUI = target.closest('.cms-menu');
    const isInsideCmsMenuBar = target.closest('.cms-menu-bar');
    const isInsideStyleEditor = target.closest('#style-editor-sidebar');

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

    // Building Block Selection
    const targetBuildingBlock = target.closest('.building-block');
    if (targetBuildingBlock) {
        selectBuildingBlock(targetBuildingBlock, target);
    } else {
        deselectAll();
    }

    // Prevent link navigation
    const link = e.target.closest('a');
    if (link) {
        e.preventDefault();
    }

    updateSelectedLabel();
    updateMovementArrows();
});

// Global Keydown (Shortcuts & Nudging)
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
        return;
    }

    const isCtrl = e.ctrlKey || e.metaKey;

    // Copy: Ctrl+C
    if (isCtrl && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        copyElement();
        return;
    }

    // Paste: Ctrl+V
    if (isCtrl && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        pasteElement();
        return;
    }

    // Arrows (Nudge) & Delete
    if (currentlySelected) {
        if (e.key === 'ArrowUp' && !currentlySelected.classList.contains('building-column')) {
            e.preventDefault();
            const prev = currentlySelected.previousElementSibling;
            if (prev) {
                currentlySelected.parentElement.insertBefore(currentlySelected, prev);
            }
        } else if (e.key === 'ArrowDown' && !currentlySelected.classList.contains('building-column')) {
            e.preventDefault();
            const next = currentlySelected.nextElementSibling;
            if (next && !next.classList.contains("placeholder-block") && !next.classList.contains("accordion-content")) {
                currentlySelected.parentElement.insertBefore(currentlySelected, next.nextElementSibling);
            }
        } else if (e.key === 'ArrowLeft' && currentlySelected.classList.contains("building-column")) {
            e.preventDefault();
            const prev = currentlySelected.previousElementSibling;
            if (prev && !prev.classList.contains("placeholder-block") && !prev.classList.contains("accordion-content")) {
                currentlySelected.parentElement.insertBefore(currentlySelected, prev);
            }
        } else if (e.key === 'ArrowRight' && currentlySelected.classList.contains("building-column")) {
            e.preventDefault();
            const next = currentlySelected.nextElementSibling;
            if (next && !next.classList.contains("placeholder-block") && !next.classList.contains("accordion-content")) {
                currentlySelected.parentElement.insertBefore(currentlySelected, next.nextElementSibling);
            }
        } else if (e.key.toLowerCase() === 'd') {
            e.preventDefault();
            deleteElement();
        }
    }
});

// Toolbar Listeners
deleteButton.addEventListener("click", deleteElement);
publishPage.addEventListener("click", publishPageCode);
previewPage.addEventListener('click', checkCMSVisibilityState);

// ==========================================
// 7. GLOBAL FUNCTIONS
// ==========================================

// --- Links ---
function getParentLink(element) {
  if (element.parentElement && element.parentElement.tagName === 'A' && element.parentElement.classList.contains('link-element')) {
    return element.parentElement;
  }
  return null;
}

function getLinkChild(element) {
    if (element.classList.contains('link-element')) {
        return element.firstElementChild;
    }
    return null;
}

// --- Image Uploading ---
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

// --- Embeds ---
function grabEmbedCode() {
  const paste = prompt("Paste embed code:");
  
  if (paste === null) return null;

  if (paste) {
    const cleaned = paste.trim();
    
    if (!validateEmbedCode(cleaned)) {
      alert("Invalid embed code. Please paste valid HTML.");
      return null;
    }
    
    return cleaned;
  }

  return null;
}

function validateEmbedCode(code) {
  if (!code || code.length === 0) {
    return false;
  }
  
  const hasHtmlTag = /<\w+[^>]*>/i.test(code);
  if (!hasHtmlTag) {
    return false;
  }
  
  const hasClosingTag = /<\/\w+>/i.test(code);
  const isSelfClosing = /<\w+[^>]*\/>/i.test(code);
  
  if (!hasClosingTag && !isSelfClosing) {
    return false;
  }
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(code, 'text/html');
    
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      return false;
    }
    
    return doc.body.children.length > 0;
  } catch (e) {
    return false;
  }
}