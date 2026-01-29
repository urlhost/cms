// -- Fades --
const animationFadeIn = document.getElementById('animation-fade-in-checkbox');
const animationFadeInUp = document.getElementById('animation-fade-in-up-checkbox');
const animationFadeInDown = document.getElementById('animation-fade-in-down-checkbox');
const animationFadeInLeft = document.getElementById('animation-fade-in-left-checkbox');
const animationFadeInRight = document.getElementById('animation-fade-in-right-checkbox');

// -- Flys --
const animationFlyInUp = document.getElementById('animation-fly-in-up-checkbox');
const animationFlyInDown = document.getElementById('animation-fly-in-down-checkbox');
const animationFlyInLeft = document.getElementById('animation-fly-in-left-checkbox');
const animationFlyInRight = document.getElementById('animation-fly-in-right-checkbox');

// -- Grows --
const animationGrowUp = document.getElementById('animation-grow-up-checkbox');
const animationGrowDown = document.getElementById('animation-grow-down-checkbox');
const animationGrowRight = document.getElementById('animation-grow-right-checkbox');
const animationGrowLeft = document.getElementById('animation-grow-left-checkbox');

// -- Pop --
const animationPopIn = document.getElementById('animation-pop-in-checkbox');

// -- Scroll --
const animationFadeOutShrink = document.getElementById('animation-fade-out-shrink-checkbox');
const animationFadeOutGrow = document.getElementById('animation-fade-out-grow-checkbox');
const animationSlideOutLeft = document.getElementById('animation-slide-out-left-checkbox');
const animationSlideOutRight = document.getElementById('animation-slide-out-right-checkbox');

function invokeAnimationMenu() {
  if (currentlySelected) {
    currentlySelected = getLinkChild(currentlySelected) || currentlySelected;
    animations.classList.remove('content-hide');
    loadedPage.classList.add("sidebar-active");
    cmsMainMenu.classList.add("sidebar-active");
    loadAnimationsFromSelected();
  }
}

function loadAnimationsFromSelected() {
  if (!currentlySelected) return;

  uncheckAllAnimations();

  const animationType = currentlySelected.getAttribute('data-anim');

  if (!animationType) return;
  
  const checkbox = document.getElementById(`animation-${animationType}-checkbox`);

  if (checkbox) {
    checkbox.checked = true;
  }
}

function setAnimation(animationType) {
  if (!currentlySelected) return;
  
  uncheckAllAnimations();
  
  currentlySelected.setAttribute('data-anim', animationType);
  
  const checkbox = document.getElementById(`animation-${animationType}-checkbox`);

  if (checkbox) {
    checkbox.checked = true;
  }

}

function removeAnimation() {
  if (!currentlySelected) return;
  
  currentlySelected.removeAttribute('data-anim');
  
  uncheckAllAnimations();
}

const animationCheckboxes = [
  { checkbox: animationFadeIn, type: 'fade-in' },
  { checkbox: animationFadeInUp, type: 'fade-in-up' },
  { checkbox: animationFadeInDown, type: 'fade-in-down' },
  { checkbox: animationFadeInLeft, type: 'fade-in-left' },
  { checkbox: animationFadeInRight, type: 'fade-in-right' },
  { checkbox: animationFlyInUp, type: 'fly-in-up' },
  { checkbox: animationFlyInDown, type: 'fly-in-down' },
  { checkbox: animationFlyInLeft, type: 'fly-in-left' },
  { checkbox: animationFlyInRight, type: 'fly-in-right' },
  { checkbox: animationGrowUp, type: 'grow-up' },
  { checkbox: animationGrowDown, type: 'grow-down' },
  { checkbox: animationGrowRight, type: 'grow-right' },
  { checkbox: animationGrowLeft, type: 'grow-left' },
  { checkbox: animationPopIn, type: 'pop-in' },
  { checkbox: animationFadeOutShrink, type: 'fade-out-shrink' },
  { checkbox: animationFadeOutGrow, type: 'fade-out-grow' },
  { checkbox: animationSlideOutLeft, type: 'slide-out-left' },
  { checkbox: animationSlideOutRight, type: 'slide-out-right' }
];

function uncheckAllAnimations() {
  animationCheckboxes.forEach(({ checkbox }) => {
    checkbox.checked = false;
  });
}

animationCheckboxes.forEach(({ checkbox, type }) => {
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      setAnimation(type);
    } else {
      removeAnimation();
    }
  });
});

animateButton.addEventListener("click", () => {
  if (currentlySelected) {
    invokeAnimationMenu();
  }
});

document.addEventListener("keydown", (e) => {
  const isStyleEditorVisible = window.getComputedStyle(styles).display !== "none";
  const isTextEditorVisible = window.getComputedStyle(editorPop).display !== "none";
  const isAnimationEditorVisible = window.getComputedStyle(animations).display !== "none";
  if (isTextEditorVisible || isStyleEditorVisible || isAnimationEditorVisible) return;
  
  if (e.key === 'a') {
    e.preventDefault();
    if (currentlySelected) {
      invokeAnimationMenu();
    }
  }
});