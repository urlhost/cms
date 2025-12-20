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

  if (params.get('mode') !== 'editing') {
    var accordions = document.querySelectorAll(".accordion-label");
    for (var i = 0; i < accordions.length; i++) {
      accordions[i].onclick = function() {
        // The content div is the next sibling of the label
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
      };
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHelpers);
} else {
  initHelpers();
}