function initHelpers() {
  const params = new URLSearchParams(window.location.search);
  const isEditMode = params.get('mode') === 'editing';

  function getEffectiveColor(el) {
    if (!el) return null;
    const color = getComputedStyle(el).color;
    if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'rgb(0, 0, 0)') {
      return color;
    }
    for (const child of el.children) {
      const childColor = getEffectiveColor(child);
      if (childColor) return childColor;
    }
    return null;
  }
  if (!isEditMode) {
    initAccordionColors();
    initAccordionToggles();
    initResponsiveVisibility();
    initNavigation();
    initScrollAnimations();
  } else {
    initResponsiveVisibility();
    initNavigation();
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

  function initNavigation() {
    const navigation = document.querySelector(".navigation");
    const navigationOpenButton = document.querySelector(".navigation-open-button");
    const navigationCloseButton = document.querySelector(".navigation-close-button");

    if (!navigation) return;

    if (!navigationOpenButton || !navigationCloseButton) {
      navigation.style.display = (isEditMode) ? '' : 'none';
    };

    navigation.style.display = (isEditMode) ? '' : 'none';
    
    if (isEditMode) {
        navigationOpenButton.addEventListener('click', () => {
            navigation.style.display = '';
        });

        navigationCloseButton.addEventListener('click', () => {
            navigation.style.display = 'none';
        });
    }
  }

  function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    const defaults = {
      duration: 0.8,
      ease: "power2.out",
      toggleActions: "play none none reverse",
      start: "top 66%",
    };

    const elements = document.querySelectorAll("[data-anim]");

    elements.forEach((el) => {
      const type = el.getAttribute("data-anim");
      const delay = el.getAttribute("data-delay") || 0;

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

      switch (type) {
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

        case "fade-out-shrink":
          settings.scrollTrigger.start = "top 50%";
          gsap.to(el, {
            ...settings,
            opacity: 0,
            scale: 0,
          });
          return;

        case "fade-out-grow":
          settings.scrollTrigger.start = "top 50%";
          gsap.to(el, {
            ...settings,
            opacity: 0,
            scale: 1.5,
          });
          return;
      }

      gsap.from(el, settings);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHelpers);
} else {
  initHelpers();
}