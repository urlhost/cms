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

    linkWrapper.setAttribute('data-name', 'Building Block: Linked Image');
