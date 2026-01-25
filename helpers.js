function initHelpers() {
  const params = new URLSearchParams(window.location.search);
  const isEditMode = params.get('mode') === 'editing';

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
    return null;
  }

  // Only run interactive features if not in edit mode
  if (!isEditMode) {
    initAccordionColors();
    initAccordionToggles();
    initResponsiveVisibility();
    initScrollAnimations();
  } else {
    // In edit mode, just ensure responsive classes are visible
    initResponsiveVisibility();
  }

  function initAccordionColors() {
    const firstChildren = document.querySelectorAll('.accordion-label > :first-child');
    firstChildren.forEach(accordionLabelText => {
      const color = getEffectiveColor(accordionLabelText);
      accordionLabelText.style.setProperty('--label-color', color);
    });
  }

  function initAccordionToggles() {
    const accordions = document.querySelectorAll(".accordion-label");
    accordions.forEach(accordion => {
      accordion.onclick = function() {
        const content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
          this.firstElementChild.classList.remove("accordion-active");
        } else {
          content.style.display = "block";
          this.firstElementChild.classList.add("accordion-active");
        }
      };
    });
  }

  function initResponsiveVisibility() {
    const mobileMediaQuery = window.matchMedia('(max-width: 640px)');

    function handleMobileChange(screen) {
      const hideOnDesktop = document.querySelectorAll('.hide-on-desktop');
      const hideOnMobile = document.querySelectorAll('.hide-on-mobile');
      
      hideOnDesktop.forEach(item => {
        item.style.display = (isEditMode || screen.matches) ? '' : 'none';
      });
      
      hideOnMobile.forEach(item => {
        item.style.display = (isEditMode || !screen.matches) ? '' : 'none';
      });
    }

    mobileMediaQuery.addEventListener('change', handleMobileChange);
    handleMobileChange(mobileMediaQuery);
  }

  function initScrollAnimations() {
    // Register the ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Configuration for all animations
    const defaults = {
      duration: 0.8,
      ease: "power2.out",
      toggleActions: "play none none reverse",
      start: "top 66%",
    };

    // Select all elements with the data-anim attribute
    const elements = document.querySelectorAll("[data-anim]");

    elements.forEach((el) => {
      const type = el.getAttribute("data-anim");
      const delay = el.getAttribute("data-delay") || 0;

      // Base settings for GSAP
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

      // Animation configurations
      switch (type) {
        // === FADES ===
        case "fade-in":
          settings.opacity = 0;
          break;

        case "fade-in-up":
          settings.opacity = 0;
          settings.y = 50;
          break;

        case "fade-in-down":
          settings.opacity = 0;
          settings.y = -50;
          break;

        case "fade-in-left":
          settings.opacity = 0;
          settings.x = -50;
          break;

        case "fade-in-right":
          settings.opacity = 0;
          settings.x = 50;
          break;

        // === FLY INS ===
        case "fly-in-up":
          settings.opacity = 0;
          settings.y = 200;
          settings.ease = "back.out(1.7)";
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

        // === GROWS ===
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

        case "grow-right":
          settings.opacity = 0;
          settings.scaleX = 0;
          settings.transformOrigin = "left center";
          break;

        case "grow-left":
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