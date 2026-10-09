(function(){
  const mount = document.getElementById('site-header');
  if (!mount) return;

  fetch('header.html', {cache:'no-store'})
    .then(function(r){ if(!r.ok) throw new Error('Header load failed'); return r.text(); })
    .then(function(html){
      mount.innerHTML = html;

      const desktopDropdown = document.getElementById('luxServicesDropdown');
      const desktopButton = desktopDropdown ? desktopDropdown.querySelector('.lux-drop-button') : null;
      const mobileButton = document.getElementById('luxMenuButton');
      const mobilePanel = document.getElementById('luxMobilePanel');
      const mobileServices = document.getElementById('luxMobileServices');
      const mobileServicesButton = mobileServices ? mobileServices.querySelector('button') : null;

      function closeDesktop(){
        if(!desktopDropdown || !desktopButton) return;
        desktopDropdown.classList.remove('lux-open');
        desktopButton.setAttribute('aria-expanded','false');
      }
      function closeMobile(){
        if(mobilePanel && mobileButton){
          mobilePanel.classList.remove('lux-open');
          mobileButton.setAttribute('aria-expanded','false');
          mobileButton.setAttribute('aria-label','Open navigation menu');
        }
        if(mobileServices && mobileServicesButton){
          mobileServices.classList.remove('lux-open');
          mobileServicesButton.setAttribute('aria-expanded','false');
        }
      }

      if(desktopButton){
        desktopButton.addEventListener('click', function(e){
          e.stopPropagation();
          const open = !desktopDropdown.classList.contains('lux-open');
          desktopDropdown.classList.toggle('lux-open', open);
          desktopButton.setAttribute('aria-expanded', String(open));
        });
      }

      if(mobileButton){
        mobileButton.addEventListener('click', function(e){
          e.stopPropagation();
          const open = !mobilePanel.classList.contains('lux-open');
          mobilePanel.classList.toggle('lux-open', open);
          mobileButton.setAttribute('aria-expanded', String(open));
          mobileButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        });
      }

      if(mobileServicesButton){
        mobileServicesButton.addEventListener('click', function(e){
          e.stopPropagation();
          const open = !mobileServices.classList.contains('lux-open');
          mobileServices.classList.toggle('lux-open', open);
          mobileServicesButton.setAttribute('aria-expanded', String(open));
        });
      }

      document.addEventListener('click', function(e){
        const header = document.getElementById('lux-site-header');
        if(header && !header.contains(e.target)){ closeDesktop(); closeMobile(); }
      });
      document.addEventListener('keydown', function(e){
        if(e.key === 'Escape'){ closeDesktop(); closeMobile(); }
      });
      window.addEventListener('resize', function(){
        if(window.innerWidth > 930) closeMobile();
      });

      const page = location.pathname.split('/').pop() || 'index.html';
      mount.querySelectorAll('[data-page]').forEach(function(link){
        if(link.getAttribute('data-page') === page){
          link.classList.add('lux-current');
          link.setAttribute('aria-current','page');
          const dd = link.closest('.lux-dropdown');
          if(dd) dd.classList.add('lux-current');
        }
      });

      mount.querySelectorAll('a').forEach(function(a){
        a.addEventListener('click', closeMobile);
      });
    })
    .catch(function(err){
      console.error(err);
      mount.innerHTML = '<header style="background:#09121f;padding:18px 24px"><a href="index.html" style="color:white;text-decoration:none;font-family:Arial,sans-serif;font-weight:700">LUX Electrical Engineering Ltd</a></header>';
    });
})();