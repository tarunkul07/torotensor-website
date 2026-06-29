const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const demoForm = document.getElementById('demoForm');
demoForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const company = document.getElementById('company').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const usecase = document.getElementById('usecase').value.trim();
  const message = document.getElementById('message').value.trim();

  const subject = encodeURIComponent('Request Demo - ToroTensor');
  const body = encodeURIComponent(`Hello ToroTensor Team,

I would like to request a demo.

Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${phone}
Use case: ${usecase}

Message:
${message}

Regards,
${name}`);

  window.location.href = `mailto:info@torotensor.com?subject=${subject}&body=${body}`;
});
