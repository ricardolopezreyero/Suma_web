(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('#menu-button');
  const nav = document.querySelector('.main-nav');
  const languageButton = document.querySelector('#language-button');
  const languageMenu = document.querySelector('#language-menu');
  const toast = document.querySelector('#toast');
  let toastTimer;

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3600);
  };

  const updateHeader = () => header.classList.toggle('is-fixed', window.scrollY > 22);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  languageButton?.addEventListener('click', () => {
    const isOpen = !languageMenu.hidden;
    languageMenu.hidden = isOpen;
    languageButton.setAttribute('aria-expanded', String(!isOpen));
  });
  languageMenu?.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => {
    languageMenu.hidden = true;
    languageButton.setAttribute('aria-expanded', 'false');
    if (!button.classList.contains('active')) showToast(`${button.dataset.language} estará disponible próximamente.`);
  }));
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.language-wrap')) {
      languageMenu.hidden = true;
      languageButton?.setAttribute('aria-expanded', 'false');
    }
  });

  const nodeDetails = {
    industria: 'Una base industrial que permite conversaciones más concretas sobre proveedores, capacidades y operación.',
    talento: 'Talento técnico y una red educativa que fortalece la formación y el crecimiento de la operación.',
    logistica: 'Conexiones carreteras, ferroviarias y fronterizas que forman parte de una decisión de ubicación informada.',
    acompanamiento: 'Un punto de entrada para estructurar necesidades, validaciones y conversaciones relevantes.'
  };
  document.querySelectorAll('.map-node').forEach((node) => node.addEventListener('click', () => {
    document.querySelector('#node-detail').textContent = nodeDetails[node.dataset.node];
  }));

  document.querySelectorAll('.region-link').forEach((button) => button.addEventListener('click', () => {
    document.querySelector('#selector').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`Has seleccionado ${button.dataset.region}. Cuéntanos más de tu operación para iniciar una conversación útil.`);
  }));

  const form = document.querySelector('#selector-form');
  const steps = [...document.querySelectorAll('.form-step')];
  const progress = [...document.querySelectorAll('.form-progress > span')];
  const labels = ['Tu operación', 'Escala y horizonte', 'Contacto confidencial'];
  let step = 1;

  const setStep = (nextStep) => {
    step = nextStep;
    steps.forEach((element) => element.classList.toggle('active', Number(element.dataset.step) === step));
    progress.forEach((element, index) => element.classList.toggle('active', index < step));
    document.querySelector('#form-step-label').textContent = labels[step - 1];
  };
  const validateCurrentStep = () => {
    const current = steps.find((element) => Number(element.dataset.step) === step);
    const required = [...current.querySelectorAll('[required]')];
    return required.every((field) => {
      const valid = field.checkValidity();
      if (!valid) field.reportValidity();
      return valid;
    });
  };
  form?.querySelectorAll('.form-next').forEach((button) => button.addEventListener('click', () => {
    if (validateCurrentStep()) setStep(Math.min(step + 1, 3));
  }));
  form?.querySelectorAll('.back-button').forEach((button) => button.addEventListener('click', () => setStep(Math.max(step - 1, 1))));
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateCurrentStep()) return;
    steps.forEach((element) => element.hidden = true);
    form.querySelector('.form-progress').hidden = true;
    form.querySelector('.form-success').hidden = false;
  });
  document.querySelector('#restart-form')?.addEventListener('click', () => {
    form.reset();
    form.querySelector('.form-success').hidden = true;
    form.querySelector('.form-progress').hidden = false;
    steps.forEach((element) => element.hidden = false);
    setStep(1);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
