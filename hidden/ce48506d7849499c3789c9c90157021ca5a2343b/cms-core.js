// ==========================================
// 1. DOM ELEMENTS & STATE
// ==========================================

const cms = document.querySelector(".cms-menu");
const cmsMenuBar = document.querySelector(".cms-menu-bar");
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
    if currentlySelected.classList.contains('image-elemet') {
        let linkWrapper = getParentLink(currentlySelected);

        if (linkWrapper) {
            currentlySelected = blockToSelect.parentElement;
        }
    }
    currentlySelected.classList.add('selected');
}

function updateSelectedLabel() {
    if (currentlySelected) {
        if (currentlySelected.dataset.name === undefined) {
            selectedElementLabel.innerText = 'Building Block:';
            return;
        }
        selectedElementLabel.innerText = currentlySelected.dataset.name;
    } else {
        selectedElementLabel.innerText = 'Building Block:';
    }
}

function updateMovementArrows() {
    if (currentlySelected) {
        if (currentlySelected.classList.contains('building-column')) {
            moveUp.innerHTML = 'Move Left';
            moveDown.innerHTML = 'Move Right';
        } else {
            moveUp.innerHTML = 'Move Up';
            moveDown.innerHTML = 'Move Down';
        }
    } else {
        moveUp.innerHTML = 'Move Up';
        moveDown.innerHTML = 'Move Down';
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
// 5. PUBLISHING & EXPORT
// ==========================================

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
                result += ` ${attr.name}="${attr.value.replace(/"/g, '&quot;')}"`;
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