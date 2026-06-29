const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

menuButton?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

document.getElementById('year').textContent = new Date().getFullYear();

const demoForm = document.getElementById('demoForm');

demoForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const company = document.getElementById('company').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const message = document.getElementById('message').value.trim();

  const subject = encodeURIComponent('Request Demo - ToroTensor');
  const body = encodeURIComponent(
`Hello ToroTensor Team,

I would like to request a demo.

Name: ${name}
Company: ${company}
Email: ${email}
Phone: ${phone}

Use case / workflow:
${message}

Regards,
${name}`
  );

  window.location.href = `mailto:info@torotensor.com?subject=${subject}&body=${body}`;
});
