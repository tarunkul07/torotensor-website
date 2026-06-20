const menuButton = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');

menuButton?.addEventListener('click', () => {
  menu.classList.toggle('open');
});

document.querySelectorAll('.menu a').forEach((link) => {
  link.addEventListener('click', () => menu.classList.remove('open'));
});

document.getElementById('year').textContent = new Date().getFullYear();
