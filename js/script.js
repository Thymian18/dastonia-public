// ===== Footer year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Hero glitch reveal (fires once on load) =====
(function(){
  var wordmark = document.getElementById('heroWordmark');
  if (wordmark) wordmark.classList.add('run');
})();

// ===== Mobile nav toggle =====
(function(){
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  function close(){
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function(){
    var isOpen = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  menu.addEventListener('click', function(e){
    if (e.target.tagName === 'A') close();
  });

  window.addEventListener('resize', function(){
    if (window.innerWidth > 720) close();
  });
})();

// ===== Photo gallery lightbox =====
(function(){
  var triggers = document.querySelectorAll('.photos-grid .photo-trigger');
  if (!triggers.length) return;

  var lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.hidden = true;

  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'lightbox-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '×';

  var img = document.createElement('img');

  lightbox.appendChild(closeBtn);
  lightbox.appendChild(img);
  document.body.appendChild(lightbox);

  var lastTrigger = null;

  // The thumbnail's srcset holds every generated width — pick the
  // largest one instead of whatever size was chosen for the small tile.
  function largestSrc(thumbnailImg){
    var srcset = thumbnailImg.getAttribute('srcset');
    if (!srcset) return thumbnailImg.currentSrc || thumbnailImg.src;

    var candidates = srcset.split(',').map(function(entry){
      var parts = entry.trim().split(/\s+/);
      return { url: parts[0], width: parseInt(parts[1], 10) || 0 };
    });
    candidates.sort(function(a, b){ return b.width - a.width; });
    return candidates[0].url;
  }

  function open(trigger){
    var thumbnailImg = trigger.querySelector('img');
    if (!thumbnailImg) return;

    lastTrigger = trigger;
    img.src = largestSrc(thumbnailImg);
    img.alt = thumbnailImg.alt || '';
    lightbox.hidden = false;
    closeBtn.focus();
    document.addEventListener('keydown', onKeydown);
  }

  function close(){
    lightbox.hidden = true;
    img.src = '';
    document.removeEventListener('keydown', onKeydown);
    if (lastTrigger) lastTrigger.focus();
  }

  function onKeydown(e){
    if (e.key === 'Escape') close();
  }

  triggers.forEach(function(trigger){
    trigger.addEventListener('click', function(){ open(trigger); });
  });

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', function(e){
    if (e.target === lightbox) close();
  });
})();

// ===== Scroll-spy: highlight the nav link of the section currently in view =====
(function(){
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = document.querySelectorAll('#navMenu a');
  if (!sections.length || !navLinks.length) return;

  var header = document.querySelector('header');
  var ticking = false;

  function update(){
    ticking = false;
    var line = (header ? header.offsetHeight : 0) + 80; // px below the top edge
    var current = null;
    sections.forEach(function(section){
      if (section.getBoundingClientRect().top <= line) current = section.id;
    });
    // At the very bottom of the page, the last section counts even if short.
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
      current = sections[sections.length - 1].id;
    }
    navLinks.forEach(function(link){
      link.classList.toggle('active', current !== null && link.getAttribute('href') === '/#' + current);
    });
  }

  window.addEventListener('scroll', function(){
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
