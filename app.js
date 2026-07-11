(() => {
  // RLR-017: menú y selector de idioma consistentes en cada página.
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('#menu-button');
  const nav = document.querySelector('#main-nav');
  let languageButton = document.querySelector('#language-button');
  let languageMenu = document.querySelector('#language-menu');
  const toast = document.querySelector('#toast');
  let toastTimer;

  // Las páginas editoriales antiguas no incluyen el selector en HTML; lo
  // normalizamos aquí para que el encabezado se comporte igual en todo el sitio.
  if (!languageMenu) {
    const actions = document.querySelector('.nav-actions');
    if (actions) {
      const wrap = document.createElement('div');
      wrap.className = 'language-wrap';
      wrap.innerHTML = '<button class="language-button" id="language-button" type="button" aria-expanded="false" aria-controls="language-menu">ES <span>⌄</span></button><div class="language-menu" id="language-menu" hidden><button class="active" type="button">Español <small>Disponible</small></button><button type="button" data-coming-soon="English">English <small>Próximamente</small></button><button type="button" data-coming-soon="Deutsch">Deutsch <small>Próximamente</small></button><button type="button" data-coming-soon="Japonés">Japonés <small>Próximamente</small></button><button type="button" data-coming-soon="Mandarín">Mandarín <small>Próximamente</small></button></div>';
      actions.prepend(wrap);
      languageButton = wrap.querySelector('#language-button');
      languageMenu = wrap.querySelector('#language-menu');
    }
  }
  if (languageMenu) {
    [['Deutsch', 'Deutsch'], ['Japonés', 'Japonés'], ['Mandarín', 'Mandarín']].forEach(([label, value]) => {
      if (languageMenu.querySelector(`[data-coming-soon="${value}"]`)) return;
      const option = document.createElement('button');
      option.type = 'button'; option.dataset.comingSoon = value;
      option.innerHTML = `${label} <small>Próximamente</small>`;
      languageMenu.append(option);
    });
  }

  // RLR-018: aviso editorial de novedades, visible sin habilitar aún el registro.
  const footer = document.querySelector('.site-footer');
  if (footer && !document.querySelector('.newsletter')) {
    const newsletter = document.createElement('section');
    newsletter.className = 'newsletter';
    newsletter.setAttribute('aria-labelledby', 'newsletter-title');
    newsletter.innerHTML = '<div class="shell newsletter-card"><div class="newsletter-copy"><p class="section-label">Próximamente</p><h2 id="newsletter-title">Las noticias económicas que sí importan.</h2><p>Estamos preparando un correo quincenal con inversiones, oportunidades, infraestructura y novedades de Coahuila.</p></div><form class="newsletter-form" aria-label="Suscripción informativa"><input type="text" placeholder="Nombre completo" disabled aria-label="Nombre completo"><input type="email" placeholder="correo@empresa.com" disabled aria-label="Correo electrónico"><button type="button" disabled>Suscribirme próximamente</button><small>Registro no disponible todavía.</small></form></div>';
    footer.before(newsletter);
  }
  document.querySelectorAll('.footer-bottom').forEach((bottom) => {
    if (!bottom.querySelector('.footer-signature')) {
      const signature = document.createElement('span');
      signature.className = 'footer-signature';
      signature.textContent = 'Página hecha en Coahuila, para el mundo.';
      bottom.append(signature);
    }
  });

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3200);
  };

  let headerOffset = header ? header.offsetTop : 0;
  const updateHeader = () => {
    if (!header) return;
    headerOffset = header.offsetTop;
    header.classList.toggle('is-fixed', window.scrollY > headerOffset + 45);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const setMenu = (open) => {
    if (!nav || !menuButton) return;
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  menuButton?.addEventListener('click', () => setMenu(!nav?.classList.contains('is-open')));
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', (event) => {
    if (!nav?.classList.contains('is-open')) return;
    if (!(event.target instanceof Element) || (!event.target.closest('#main-nav') && !event.target.closest('#menu-button'))) setMenu(false);
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 960) setMenu(false); }, { passive: true });

  languageButton?.addEventListener('click', () => {
    const open = Boolean(languageMenu?.hidden);
    if (languageMenu) languageMenu.hidden = !open;
    languageButton.setAttribute('aria-expanded', String(open));
  });
  languageMenu?.querySelectorAll('[data-coming-soon]').forEach((button) => button.addEventListener('click', () => {
    languageMenu.hidden = true;
    languageButton?.setAttribute('aria-expanded', 'false');
    showToast(`${button.dataset.comingSoon} estará disponible próximamente.`);
  }));
  document.addEventListener('click', (event) => {
    if (languageMenu && (!(event.target instanceof Element) || !event.target.closest('.language-wrap'))) {
      languageMenu.hidden = true;
      languageButton?.setAttribute('aria-expanded', 'false');
    }
  });

  const chatLauncher = document.querySelector('#chat-launcher');
  const chatPanel = document.querySelector('#chat-panel');
  const chatClose = document.querySelector('#chat-close');
  const setChat = (open) => {
    if (!chatPanel || !chatLauncher) return;
    chatPanel.hidden = !open;
    chatLauncher.setAttribute('aria-expanded', String(open));
  };
  chatLauncher?.addEventListener('click', () => setChat(Boolean(chatPanel?.hidden)));
  chatClose?.addEventListener('click', () => setChat(false));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { setChat(false); setMenu(false); } });

  const checklist = [...document.querySelectorAll('#investment-checklist input[type="checkbox"]')];
  const updateChecklist = () => {
    if (!checklist.length) return;
    const completed = checklist.filter((input) => input.checked).length;
    const percent = (completed / checklist.length) * 100;
    const bar = document.querySelector('#check-progress-bar');
    const label = document.querySelector('#check-progress-label');
    if (bar) bar.style.width = `${percent}%`;
    if (label) label.textContent = `${completed} de ${checklist.length} definidos`;
  };
  checklist.forEach((input) => input.addEventListener('change', updateChecklist));
  updateChecklist();

  const faqSearch = document.querySelector('#faq-search');
  const categoryButtons = [...document.querySelectorAll('.faq-categories button')];
  const faqGroups = [...document.querySelectorAll('.faq-group')];
  const faqItems = [...document.querySelectorAll('.faq-item')];
  let activeCategory = 'all';
  const normalize = (value) => {
    const text = String(value || '');
    return (typeof text.normalize === 'function' ? text.normalize('NFD') : text).replace(/[\u0300-\u036f]/g, '').toLowerCase();
  };
  const filterFaq = () => {
    if (!faqItems.length) return;
    const query = normalize(faqSearch?.value.trim() || '');
    let visibleCount = 0;
    faqGroups.forEach((group) => {
      let groupCount = 0;
      group.querySelectorAll('.faq-item').forEach((item) => {
        const categoryMatch = activeCategory === 'all' || group.dataset.category === activeCategory;
        const textMatch = !query || normalize(item.textContent).includes(query);
        const visible = categoryMatch && textMatch;
        item.hidden = !visible;
        if (visible) { groupCount += 1; visibleCount += 1; }
      });
      group.hidden = groupCount === 0;
    });
    const count = document.querySelector('#faq-count');
    const empty = document.querySelector('#faq-empty');
    if (count) count.textContent = `${visibleCount} ${visibleCount === 1 ? 'respuesta' : 'respuestas'}`;
    if (empty) empty.hidden = visibleCount !== 0;
  };
  faqSearch?.addEventListener('input', filterFaq);
  categoryButtons.forEach((button) => button.addEventListener('click', () => {
    activeCategory = button.dataset.category;
    categoryButtons.forEach((candidate) => candidate.classList.toggle('active', candidate === button));
    filterFaq();
  }));
  filterFaq();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach((element) => element.classList.add('in-view'));
  }

  document.querySelectorAll('#year').forEach((year) => { year.textContent = new Date().getFullYear(); });

  // Integration hook: replace or populate this mount point when the AI widget snippet is available.
  window.SUMA_CHAT = {
    mount: document.querySelector('#suma-ai-widget-mount'),
    open: () => setChat(true),
    close: () => setChat(false)
  };
})();
