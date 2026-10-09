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

      const toggle = document.getElementById('siteMenuToggle');
      const links = document.getElementById('siteNavLinks');

      function closeMenu() {
        if (!toggle || !links) return;
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open navigation menu');
      }

      if (toggle && links) {
        toggle.addEventListener('click', function () {
          const open = !links.classList.contains('is-open');
          links.classList.toggle('is-open', open);
          toggle.setAttribute('aria-expanded', String(open));
          toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        });

        links.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', function (event) {
          if (!links.contains(event.target) && !toggle.contains(event.target)) closeMenu();
        });

        document.addEventListener('keydown', function (event) {
          if (event.key === 'Escape') closeMenu();
        });

        window.addEventListener('resize', function () {
          if (window.innerWidth > 930) closeMenu();
        });
      }

      const page = location.pathname.split('/').pop() || 'index.html';
      document.querySelectorAll('#siteNavLinks a').forEach(function (link) {
        const href = link.getAttribute('href') || '';
        if ((page === 'index.html' && href === 'index.html') || href === page) {
          link.classList.add('is-current');
          link.setAttribute('aria-current', 'page');
        }
      });
    })
    .catch(function (error) {
      console.error(error);
      mount.innerHTML = '<div style="padding:14px 20px;background:#0b1423;color:white"><a href="index.html" style="color:white">LUX Electrical Engineering</a></div>';
    });
})();