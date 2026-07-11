(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('#menu-button');
  const nav = document.querySelector('#main-nav');
  const languageButton = document.querySelector('#language-button');
  const languageMenu = document.querySelector('#language-menu');
  const toast = document.querySelector('#toast');
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3200);
  };

  let headerOffset = header?.offsetTop || 0;
  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-fixed', window.scrollY > headerOffset + 45);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const open = nav?.classList.toggle('is-open');
    document.body.classList.toggle('menu-open', Boolean(open));
    menuButton.setAttribute('aria-expanded', String(Boolean(open)));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

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
    if (!event.target.closest('.language-wrap') && languageMenu) {
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
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setChat(false); });

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
  const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
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
