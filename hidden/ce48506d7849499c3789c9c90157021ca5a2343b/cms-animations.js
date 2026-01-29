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

    const hasAnimation = currentlySelected.hasAttribute('data-anim');

    if (!hasAnimation) return;
    
    // -- Fades --
    animationFadeIn.checked = hasAnimation === 'fade-in';
    animationFadeInUp.checked = hasAnimation === 'fade-in-up';
    animationFadeInDown.checked = hasAnimation === 'fade-in-down';
    animationFadeInLeft.checked = hasAnimation === 'fade-in-left';
    animationFadeInRight.checked = hasAnimation === 'fade-in-right';

    // -- Flys --
    animationFlyInUp.checked = hasAnimation === 'fly-in-up';
    animationFlyInDown.checked = hasAnimation === 'fly-in-down';
    animationFlyInLeft.checked = hasAnimation === 'fly-in-left';
    animationFlyInRight.checked = hasAnimation === 'fly-in-right';

    // -- Grows --
    animationGrowUp.checked = hasAnimation === 'grow-up';
    animationGrowDown.checked = hasAnimation === 'grow-down';
    animationGrowRight.checked = hasAnimation === 'grow-right';
    animationGrowLeft.checked = hasAnimation === 'grow-left';

    // -- Pop --
    animationPopIn.checked = hasAnimation === 'pop-in';

    // -- Scroll --
    animationFadeOutShrink.checked = hasAnimation === 'fade-out-shrink';
    animationFadeOutGrow.checked = hasAnimation === 'fade-out-grow';
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

function uncheckAllAnimations() {
  // -- Fades --
  animationFadeIn.checked = false;
  animationFadeInUp.checked = false;
  animationFadeInDown.checked = false;
  animationFadeInLeft.checked = false;
  animationFadeInRight.checked = false;

  // -- Flys --
  animationFlyInUp.checked = false;
  animationFlyInDown.checked = false;
  animationFlyInLeft.checked = false;
  animationFlyInRight.checked = false;

  // -- Grows --
  animationGrowUp.checked = false;
  animationGrowDown.checked = false;
  animationGrowRight.checked = false;
  animationGrowLeft.checked = false;

  // -- Pop --
  animationPopIn.checked = false;

  // -- Scroll --
  animationFadeOutShrink.checked = false;
  animationFadeOutGrow.checked = false;
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
  { checkbox: animationFadeOutGrow, type: 'fade-out-grow' }
];

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