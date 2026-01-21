function initHelpers() {
  const params = new URLSearchParams(window.location.search);

  // Recursive function to get the first non-default color
  function getEffectiveColor(el) {
    if (!el) return null;
    const color = getComputedStyle(el).color;
    // Check if color is not transparent/black
    if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'rgb(0, 0, 0)') {
      return color;
    }
    // Recursively check children
    for (const child of el.children) {
      const childColor = getEffectiveColor(child);
      if (childColor) return childColor;
    }
    return null; // fallback if nothing found
  }

  // Select all first children
  if (params.get('mode') !== 'editing') {
    const firstChildren = document.querySelectorAll('.accordion-label > :first-child');
    firstChildren.forEach(accordionLabelText => {
      const color = getEffectiveColor(accordionLabelText);
      accordionLabelText.style.setProperty('--label-color', color);
    });
  }

  var accordions = document.querySelectorAll(".accordion-label");
  for (var i = 0; i < accordions.length; i++) {
    accordions[i].onclick = function() {
      if (params.get('mode') === 'editing') {
        return;
      } else {
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          // If it's visible, hide it
          content.style.display = "none";
          this.firstElementChild.classList.remove("accordion-active");
        } else {
          // If it's hidden, show it
          content.style.display = "block";
          this.firstElementChild.classList.add("accordion-active");
        }
      }
    }
  }

  const mobileMediaQuery = window.matchMedia('(max-width: 640px)');

  function handleMobileChange(screen) {
    const hideOnDesktop = document.querySelectorAll('.hide-on-desktop');
    const hideOnMobile = document.querySelectorAll('.hide-on-mobile');
    hideOnDesktop.forEach(item => {
      if (params.get('mode') === 'editing') {
        item.style.display = '';
      } else {
        if (screen.matches) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      }
    });
    hideOnMobile.forEach(item => {
      if (params.get('mode') === 'editing') {
        item.style.display = '';
      } else {
        if (screen.matches) {
          item.style.display = 'none';
        } else {
          item.style.display = '';
        }
      }
    });
  }

  mobileMediaQuery.addEventListener('change', handleMobileChange);
  handleMobileChange(mobileMediaQuery);

var navigation = document.querySelector('.navigation');
var navigationOpenButton = document.querySelector('.navigation-open-button');
var navigationCloseButton = document.querySelector('.navigation-close-button');

if (params.get('mode') === 'editing') {
  if (navigation) navigation.style.display = '';
  if (navigationOpenButton) navigationOpenButton.onclick = (e) => e.preventDefault();
  if (navigationCloseButton) navigationCloseButton.onclick = (e) => e.preventDefault();
} else {
  if (navigation) navigation.style.display = 'none';
  if (navigationOpenButton) navigationOpenButton.onclick = () => navigation.style.display = '';
  if (navigationCloseButton) navigationCloseButton.onclick = () => navigation.style.display = 'none';
}

  if (params.get('mode') !== 'editing') {
    // Register the ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Configuration for all animations
    const defaults = {
      duration: 0.8,
      ease: "power2.out",
      toggleActions: "play none none reverse", // Play on enter, reverse on leave
      start: "top 66%", // Trigger when top of element hits 85% of viewport height
    };

    // Select all elements with the data-anim attribute
    const elements = document.querySelectorAll("[data-anim]");

    elements.forEach((el) => {
      const type = el.getAttribute("data-anim");
      const delay = el.getAttribute("data-delay") || 0; // Optional delay

      // Base object for GSAP .from()
      let settings = {
        scrollTrigger: {
          trigger: el,
          toggleActions: defaults.toggleActions,
          start: defaults.start,
        },
        duration: defaults.duration,
        ease: defaults.ease,
        delay: delay,
      };

      // --- ANIMATION LOGIC --- //
      switch (type) {

        // === FADES (Subtle movement + Opacity) ===
        case "fade-in":
          settings.opacity = 0;
          break;

        case "fade-in-up":
          settings.opacity = 0;
          settings.y = 50; // Coming from 50px below
          break;

        case "fade-in-down":
          settings.opacity = 0;
          settings.y = -50; // Coming from 50px above
          break;

        case "fade-in-left":
          settings.opacity = 0;
          settings.x = -50;
          break;

        case "fade-in-right":
          settings.opacity = 0;
          settings.x = 50;
          break;

          // === FLY INS (Large movement, usually "Elastic" or "Back" ease) ===
        case "fly-in-up":
          settings.opacity = 0;
          settings.y = 200;
          settings.ease = "back.out(1.7)"; // Boing effect
          break;

        case "fly-in-down":
          settings.opacity = 0;
          settings.y = -200;
          settings.ease = "back.out(1.7)";
          break;

        case "fly-in-left":
          settings.opacity = 0;
          settings.x = -200;
          settings.ease = "back.out(1.7)";
          break;

        case "fly-in-right":
          settings.opacity = 0;
          settings.x = 200;
          settings.ease = "back.out(1.7)";
          break;

          // === GROWS (Scale effects) ===
          // Note: "Grow Up" usually means growing FROM the bottom UP.

        case "grow-up":
          settings.opacity = 0;
          settings.scaleY = 0;
          settings.transformOrigin = "bottom center";
          break;

        case "grow-down":
          settings.opacity = 0;
          settings.scaleY = 0;
          settings.transformOrigin = "top center";
          break;

        case "grow-right": // Grows from left to right
          settings.opacity = 0;
          settings.scaleX = 0;
          settings.transformOrigin = "left center";
          break;

        case "grow-left": // Grows from right to left
          settings.opacity = 0;
          settings.scaleX = 0;
          settings.transformOrigin = "right center";
          break;

        case "pop-in":
          settings.opacity = 0;
          settings.scale = 0.5;
          settings.ease = "elastic.out(1, 0.5)";
          break;
      }

      // Apply the animation
      gsap.from(el, settings);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHelpers);
} else {
  initHelpers();
}