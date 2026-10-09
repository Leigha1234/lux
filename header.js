(function () {
  const mount = document.getElementById('site-header');
  if (!mount) return;

  fetch('header.html', { cache: 'no-cache' })
    .then(function (response) {
      if (!response.ok) throw new Error('Could not load shared header');
      return response.text();
    })
    .then(function (html) {
      mount.innerHTML = html;

      const menuToggle = document.getElementById('siteMenuToggle');
      const nav = document.getElementById('siteNavLinks');
      const dropdowns = Array.from(document.querySelectorAll('.site-dropdown'));

      function closeDropdowns(except) {
        dropdowns.forEach(function (dropdown) {
          if (dropdown !== except) {
            dropdown.classList.remove('is-open');
            const button = dropdown.querySelector('.site-dropdown-toggle');
            if (button) button.setAttribute('aria-expanded', 'false');
          }
        });
      }

      dropdowns.forEach(function (dropdown) {
        const button = dropdown.querySelector('.site-dropdown-toggle');
        if (!button) return;
        button.addEventListener('click', function (event) {
          event.stopPropagation();
          const opening = !dropdown.classList.contains('is-open');
          closeDropdowns(dropdown);
          dropdown.classList.toggle('is-open', opening);
          button.setAttribute('aria-expanded', String(opening));
        });
      });

      function closeMobileMenu() {
        if (!menuToggle || !nav) return;
        nav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation menu');
        closeDropdowns();
      }

      if (menuToggle && nav) {
        menuToggle.addEventListener('click', function (event) {
          event.stopPropagation();
          const open = !nav.classList.contains('is-open');
          nav.classList.toggle('is-open', open);
          menuToggle.setAttribute('aria-expanded', String(open));
          menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        });

        nav.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', closeMobileMenu);
        });
      }

      document.addEventListener('click', function (event) {
        if (nav && !nav.contains(event.target) && menuToggle && !menuToggle.contains(event.target)) closeMobileMenu();
        else closeDropdowns();
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeMobileMenu();
      });

      window.addEventListener('resize', function () {
        if (window.innerWidth > 930) closeMobileMenu();
      });

      const page = location.pathname.split('/').pop() || 'index.html';
      document.querySelectorAll('[data-page]').forEach(function (link) {
        if (link.getAttribute('data-page') === page) {
          link.classList.add('is-current');
          link.setAttribute('aria-current', 'page');
          const parent = link.closest('.site-dropdown');
          if (parent) parent.classList.add('is-current');
        }
      });
    })
    .catch(function (error) {
      console.error(error);
      mount.innerHTML = '<div style="padding:16px 20px;background:#0b1423;color:white"><a href="index.html" style="color:white;text-decoration:none">LUX Electrical Engineering</a></div>';
    });
})();