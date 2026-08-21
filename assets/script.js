const menuButton = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  document.body.classList.toggle('nav-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Close' : 'Menu';
});

mainNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    document.body.classList.remove('nav-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    if (menuButton) menuButton.textContent = 'Menu';
  });
});

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = new Date().getFullYear();
});

document.querySelectorAll('[data-tabs]').forEach((tabset) => {
  const buttons = [...tabset.querySelectorAll('[role="tab"]')];
  const panels = [...tabset.querySelectorAll('[role="tabpanel"]')];

  const activate = (button) => {
    buttons.forEach((item) => item.setAttribute('aria-selected', String(item === button)));
    panels.forEach((panel) => panel.classList.toggle('active', panel.id === button.getAttribute('aria-controls')));
  };

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => activate(button));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      buttons[next].focus();
      activate(buttons[next]);
    });
  });
});

const terminalScripts = {
  homepage: [
    '[workflow] International expense records',
    '01  Receive PDFs, scans and handwritten notes',
    '02  Classify document type and country',
    '03  Extract vendor, currency, tax and amount',
    '04  Validate totals and flag low-confidence fields',
    '05  Send exceptions to a human reviewer',
    '06  Export approved records to Excel / database',
    '',
    '[status] Review-controlled workflow ready'
  ],
  automation: [
    '[discovery] Department: Procurement',
    'Input: purchase orders, invoices, delivery notes',
    'Business rules: PO match, amount tolerance, due date',
    'Human control: approve exceptions before posting',
    'Output: structured record + review queue + audit trail',
    '',
    '[next] Connect selected workflow to existing systems'
  ],
  demoFinance: [
    '[receive] Scanned travel expense pack',
    '[extract] Vendor: Aurora Suites',
    '[extract] Currency: EUR',
    '[extract] Total: 1,248.40',
    '[validate] Tax line requires review',
    '[route] Human approval queue',
    '[export] Approved fields → finance register'
  ],
  demoHr: [
    '[receive] Resume + candidate information form',
    '[extract] Role, skills, experience, notice period',
    '[validate] Missing consent field detected',
    '[route] Recruiter review queue',
    '[export] Approved candidate record → HR system'
  ],
  demoProcurement: [
    '[receive] Purchase order + supplier invoice',
    '[extract] PO, supplier, line items, tax and total',
    '[validate] Quantity variance detected',
    '[route] Procurement owner review',
    '[export] Approved record → payable workflow'
  ]
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const terminalState = new WeakMap();

function stopTerminal(node) {
  const state = terminalState.get(node);
  if (!state) return;
  window.clearTimeout(state.timer);
  terminalState.delete(node);
}

function runTerminal(node) {
  stopTerminal(node);
  const key = node.dataset.terminal || 'homepage';
  const script = terminalScripts[key] || terminalScripts.homepage;
  const fullText = script.join('\n');
  node.classList.add('typing');

  if (reduceMotion.matches) {
    node.textContent = fullText;
    node.classList.remove('typing');
    return;
  }

  let index = 0;
  const state = { timer: 0 };
  terminalState.set(node, state);

  const type = () => {
    if (!document.body.contains(node)) return;
    if (index <= fullText.length) {
      node.textContent = fullText.slice(0, index);
      index += 1;
      state.timer = window.setTimeout(type, fullText[index - 1] === '\n' ? 145 : 22);
      return;
    }
    node.classList.remove('typing');
    state.timer = window.setTimeout(() => {
      node.textContent = '';
      node.classList.add('typing');
      index = 0;
      type();
    }, 2400);
  };
  type();
}

const terminals = [...document.querySelectorAll('[data-terminal]')];
const terminalObserver = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) runTerminal(entry.target);
        else stopTerminal(entry.target);
      });
    }, { threshold: 0.2 })
  : null;

terminals.forEach((terminal) => {
  if (terminalObserver) terminalObserver.observe(terminal);
  else runTerminal(terminal);
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) terminals.forEach(stopTerminal);
  else terminals.forEach((terminal) => {
    if (terminal.getBoundingClientRect().top < window.innerHeight && terminal.getBoundingClientRect().bottom > 0) runTerminal(terminal);
  });
});

reduceMotion.addEventListener?.('change', () => terminals.forEach(runTerminal));

const params = new URLSearchParams(window.location.search);
['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((name) => {
  const field = document.querySelector(`[name="${name}"]`);
  if (field) field.value = params.get(name) || '';
});

const interestField = document.querySelector('[name="interest"]');
if (interestField && params.get('interest')) {
  const interestMap = {
    briefing: 'AI Readiness & Opportunity Briefing',
    enablement: 'Corporate AI Enablement',
    'discovery-sprint': 'Workflow Discovery Sprint',
    automation: 'AI Automation / Document Intelligence',
    'document-intelligence': 'AI Automation / Document Intelligence'
  };
  const requestedInterest = interestMap[params.get('interest')] || params.get('interest');
  if ([...interestField.options].some((option) => option.value === requestedInterest)) {
    interestField.value = requestedInterest;
  }
}

document.querySelectorAll('[data-lead-form]').forEach((form) => {
  const status = form.querySelector('.form-status');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (form.elements.website?.value) return;

    const data = new FormData(form);
    const lines = [
      'Hello ToroTensor Team,',
      '',
      'I would like to discuss a company-specific AI engagement.',
      '',
      `Name: ${data.get('name') || ''}`,
      `Work email: ${data.get('email') || ''}`,
      `Company: ${data.get('company') || ''}`,
      `Role / department: ${data.get('role') || ''}`,
      `Primary interest: ${data.get('interest') || ''}`,
      `Approximate team size: ${data.get('team_size') || ''}`,
      '',
      'Current challenge:',
      `${data.get('challenge') || ''}`,
      '',
      `Source: ${data.get('utm_source') || 'Direct website'}`
    ];
    const subject = encodeURIComponent(`AI engagement enquiry — ${data.get('company') || data.get('name') || 'Website lead'}`);
    const body = encodeURIComponent(lines.join('\n'));
    if (status) {
      status.textContent = 'Your email application will open with the enquiry prepared. Please review it and press Send. If it does not open, email info@torotensor.com directly.';
      status.classList.add('visible');
    }
    window.location.href = `mailto:info@torotensor.com?subject=${subject}&body=${body}`;
  });
});

const demoData = {
  finance: {
    title: 'International travel-finance records',
    document: `TRAVEL EXPENSE PACK — SAMPLE\n\nSupplier: Aurora Suites GmbH\nCountry: Germany\nInvoice date: 14 May 2026\nCurrency: EUR\nAccommodation: 1,120.00\nCity tax: 128.40\nTotal: 1,248.40\n\nNote: Tax supporting page is partially scanned.`,
    fields: [['Supplier', 'Aurora Suites GmbH'], ['Currency', 'EUR'], ['Total', '1,248.40'], ['Review', 'Tax support page']],
    review: 'Human review required: confirm the tax supporting page before the record is approved.',
    terminal: 'demoFinance'
  },
  hr: {
    title: 'HR candidate and onboarding records',
    document: `CANDIDATE PACK — SAMPLE\n\nCandidate: Riya Sharma\nTarget role: Data Analyst\nExperience: 4 years\nSkills: Python, SQL, Power BI\nNotice period: 30 days\nConsent field: Not completed\n\nAttachment: Resume + candidate form`,
    fields: [['Candidate', 'Riya Sharma'], ['Role', 'Data Analyst'], ['Experience', '4 years'], ['Review', 'Consent missing']],
    review: 'Human review required: request consent before creating the approved HR record.',
    terminal: 'demoHr'
  },
  procurement: {
    title: 'Procurement document matching',
    document: `SUPPLIER PACK — SAMPLE\n\nPO: TT-PO-1042\nSupplier: Northstar Components\nInvoice: NS-8821\nOrdered quantity: 80\nInvoice quantity: 84\nCurrency: INR\nInvoice total: 2,18,400\n\nDelivery note attached`,
    fields: [['Purchase order', 'TT-PO-1042'], ['Supplier', 'Northstar Components'], ['Variance', '+4 units'], ['Review', 'Quantity mismatch']],
    review: 'Human review required: approve or resolve the quantity variance before payable processing.',
    terminal: 'demoProcurement'
  }
};

const demoButtons = [...document.querySelectorAll('[data-scenario]')];
if (demoButtons.length) {
  const title = document.querySelector('[data-demo-title]');
  const documentView = document.querySelector('[data-document-preview]');
  const fieldGrid = document.querySelector('[data-demo-fields]');
  const review = document.querySelector('[data-review-box]');
  const terminal = document.querySelector('[data-demo-terminal]');

  const renderScenario = (key) => {
    const scenario = demoData[key];
    if (!scenario) return;
    demoButtons.forEach((button) => {
      const active = button.dataset.scenario === key;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    title.textContent = scenario.title;
    documentView.textContent = scenario.document;
    fieldGrid.innerHTML = scenario.fields.map(([label, value]) => `<div class="demo-field"><span>${label}</span><b>${value}</b></div>`).join('');
    review.textContent = scenario.review;
    terminal.dataset.terminal = scenario.terminal;
    runTerminal(terminal);
  };

  demoButtons.forEach((button) => button.addEventListener('click', () => renderScenario(button.dataset.scenario)));
  renderScenario('finance');
}
