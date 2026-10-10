(function () {
  const mount = document.getElementById('site-header');
  if (!mount) return;

  fetch('header.html', { cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Header load failed');
      }
      return response.text();
    })
    .then(function (html) {
      mount.innerHTML = html;

      /* =========================================================
         ELEMENTS
      ========================================================= */

      const header = document.getElementById('lux-site-header');

      const desktopDropdown =
        document.getElementById('luxServicesDropdown');

      const desktopButton = desktopDropdown
        ? desktopDropdown.querySelector('.lux-drop-button')
        : null;

      const desktopMenu = desktopDropdown
        ? desktopDropdown.querySelector('.lux-dropdown-menu')
        : null;

      const mobileButton =
        document.getElementById('luxMenuButton');

      const mobilePanel =
        document.getElementById('luxMobilePanel');

      const mobileServices =
        document.getElementById('luxMobileServices');

      const mobileServicesButton = mobileServices
        ? mobileServices.querySelector('button')
        : null;


      /* =========================================================
         DESKTOP SERVICES DROPDOWN
      ========================================================= */

      function openDesktopDropdown() {
        if (!desktopDropdown || !desktopButton) return;

        desktopDropdown.classList.add('lux-open');
        desktopButton.setAttribute('aria-expanded', 'true');
      }

      function closeDesktopDropdown() {
        if (!desktopDropdown || !desktopButton) return;

        desktopDropdown.classList.remove('lux-open');
        desktopButton.setAttribute('aria-expanded', 'false');
      }

      function toggleDesktopDropdown() {
        if (!desktopDropdown) return;

        const isOpen =
          desktopDropdown.classList.contains('lux-open');

        if (isOpen) {
          closeDesktopDropdown();
        } else {
          openDesktopDropdown();
        }
      }


      /*
       * IMPORTANT:
       * Desktop dropdown is CLICK controlled.
       *
       * We deliberately do not close it on mouseleave.
       * This removes the flaky behaviour when moving
       * the mouse from Services into the dropdown.
       */
      if (desktopButton) {
        desktopButton.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();

          toggleDesktopDropdown();
        });
      }


      /*
       * Prevent clicks inside the actual dropdown menu
       * from bubbling to the document before the link
       * has had a chance to work.
       */
      if (desktopMenu) {
        desktopMenu.addEventListener('click', function (event) {
          event.stopPropagation();
        });
      }


      /*
       * Once a service link is clicked, allow the link
       * to navigate normally and close the menu.
       */
      if (desktopDropdown) {
        desktopDropdown
          .querySelectorAll('.lux-dropdown-menu a')
          .forEach(function (link) {
            link.addEventListener('click', function () {
              closeDesktopDropdown();
            });
          });
      }


      /* =========================================================
         MOBILE MAIN MENU
      ========================================================= */

      function openMobileMenu() {
        if (!mobilePanel || !mobileButton) return;

        mobilePanel.classList.add('lux-open');

        mobileButton.setAttribute(
          'aria-expanded',
          'true'
        );

        mobileButton.setAttribute(
          'aria-label',
          'Close navigation menu'
        );
      }

      function closeMobileMenu() {
        if (mobilePanel && mobileButton) {
          mobilePanel.classList.remove('lux-open');

          mobileButton.setAttribute(
            'aria-expanded',
            'false'
          );

          mobileButton.setAttribute(
            'aria-label',
            'Open navigation menu'
          );
        }

        closeMobileServices();
      }

      function toggleMobileMenu() {
        if (!mobilePanel) return;

        const isOpen =
          mobilePanel.classList.contains('lux-open');

        if (isOpen) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      }


      if (mobileButton) {
        mobileButton.addEventListener(
          'click',
          function (event) {
            event.preventDefault();
            event.stopPropagation();

            /*
             * Desktop dropdown should never remain
             * open when the mobile menu is used.
             */
            closeDesktopDropdown();

            toggleMobileMenu();
          }
        );
      }


      /* =========================================================
         MOBILE SERVICES SUBMENU
      ========================================================= */

      function openMobileServices() {
        if (!mobileServices || !mobileServicesButton) return;

        mobileServices.classList.add('lux-open');

        mobileServicesButton.setAttribute(
          'aria-expanded',
          'true'
        );
      }

      function closeMobileServices() {
        if (!mobileServices || !mobileServicesButton) return;

        mobileServices.classList.remove('lux-open');

        mobileServicesButton.setAttribute(
          'aria-expanded',
          'false'
        );
      }

      function toggleMobileServices() {
        if (!mobileServices) return;

        const isOpen =
          mobileServices.classList.contains('lux-open');

        if (isOpen) {
          closeMobileServices();
        } else {
          openMobileServices();
        }
      }


      if (mobileServicesButton) {
        mobileServicesButton.addEventListener(
          'click',
          function (event) {
            event.preventDefault();
            event.stopPropagation();

            toggleMobileServices();
          }
        );
      }


      /* =========================================================
         CLICK OUTSIDE
      ========================================================= */

      document.addEventListener('click', function (event) {

        /*
         * DESKTOP:
         * Close Services if the click wasn't inside
         * the Services dropdown.
         */
        if (
          desktopDropdown &&
          !desktopDropdown.contains(event.target)
        ) {
          closeDesktopDropdown();
        }


        /*
         * MOBILE:
         * Close mobile navigation if clicking
         * completely outside the header.
         */
        if (
          header &&
          !header.contains(event.target)
        ) {
          closeMobileMenu();
        }
      });


      /* =========================================================
         ESCAPE KEY
      ========================================================= */

      document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') return;

        closeDesktopDropdown();
        closeMobileMenu();

        if (desktopButton) {
          desktopButton.focus();
        }
      });


      /* =========================================================
         SCREEN RESIZE
      ========================================================= */

      window.addEventListener('resize', function () {

        if (window.innerWidth > 930) {
          closeMobileMenu();
        }

        if (window.innerWidth <= 930) {
          closeDesktopDropdown();
        }

      });


      /* =========================================================
         CURRENT PAGE
      ========================================================= */

      const page =
        location.pathname.split('/').pop() ||
        'index.html';

      mount
        .querySelectorAll('[data-page]')
        .forEach(function (link) {

          const linkPage =
            link.getAttribute('data-page');

          if (linkPage === page) {

            link.classList.add('lux-current');

            link.setAttribute(
              'aria-current',
              'page'
            );

            const dropdown =
              link.closest('.lux-dropdown');

            if (dropdown) {
              dropdown.classList.add('lux-current');
            }
          }
        });


      /* =========================================================
         MOBILE LINK CLICKS
      ========================================================= */

      if (mobilePanel) {
        mobilePanel
          .querySelectorAll('a')
          .forEach(function (link) {

            link.addEventListener(
              'click',
              function () {
                closeMobileMenu();
              }
            );

          });
      }


      /* =========================================================
         DESKTOP KEYBOARD SUPPORT
      ========================================================= */

      if (desktopButton) {

        desktopButton.addEventListener(
          'keydown',
          function (event) {

            /*
             * Arrow Down opens Services and moves
             * focus to the first service.
             */
            if (event.key === 'ArrowDown') {
              event.preventDefault();

              openDesktopDropdown();

              const firstLink =
                desktopMenu
                  ? desktopMenu.querySelector('a')
                  : null;

              if (firstLink) {
                firstLink.focus();
              }
            }

          }
        );

      }


      /*
       * Allow keyboard navigation through the
       * desktop dropdown without accidentally
       * closing it.
       */
      if (desktopMenu) {

        const menuLinks =
          Array.from(
            desktopMenu.querySelectorAll('a')
          );

        menuLinks.forEach(function (link, index) {

          link.addEventListener(
            'keydown',
            function (event) {

              if (event.key === 'ArrowDown') {
                event.preventDefault();

                const next =
                  menuLinks[index + 1] ||
                  menuLinks[0];

                next.focus();
              }

              if (event.key === 'ArrowUp') {
                event.preventDefault();

                const previous =
                  menuLinks[index - 1] ||
                  menuLinks[menuLinks.length - 1];

                previous.focus();
              }

              if (event.key === 'Escape') {
                event.preventDefault();

                closeDesktopDropdown();

                if (desktopButton) {
                  desktopButton.focus();
                }
              }

            }
          );

        });

      }

    })
    .catch(function (error) {

      console.error(
        'LUX navigation error:',
        error
      );

      mount.innerHTML =
        '<header style="' +
        'background:#09121f;' +
        'padding:18px 24px;' +
        '">' +
        '<a href="index.html" style="' +
        'color:white;' +
        'text-decoration:none;' +
        'font-family:Arial,sans-serif;' +
        'font-weight:700;' +
        '">' +
        'LUX Electrical Engineering Ltd' +
        '</a>' +
        '</header>';

    });

})();