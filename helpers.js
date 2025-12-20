    document.addEventListener("DOMContentLoaded", () => {
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
      const firstChildren = document.querySelectorAll('.accordion-label > :first-child');

      firstChildren.forEach(accordionLabelText => {
        const color = getEffectiveColor(accordionLabelText);
        accordionLabelText.style.setProperty('--label-color', color);
      });

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

      const mobileMediaQuery = window.matchMedia('(max-width: 640px)');

      function handleMobileChange(screen) {
        const hideOnDesktop = document.querySelectorAll('.hide-on-desktop-toggle');
        const hideOnMobile = document.querySelectorAll('.hide-on-mobile-toggle');

        hideOnDesktop.forEach(item => {
          if (screen.matches) {
            item.classList.remove('hide-on-desktop');
          } else {
            item.classList.add('hide-on-desktop');
          }
        });

        hideOnMobile.forEach(item => {
          if (screen.matches) {
            item.classList.add('hide-on-mobile');
          } else {
            item.classList.remove('hide-on-mobile');
          }
        });
      }

      mobileMediaQuery.addListener(handleMobileChange);
      handleMobileChange(mobileMediaQuery);
    });