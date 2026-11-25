const toggle = document.querySelector('.menu-toggle');
const closeBtn = document.querySelector('.menu-close');
const navLinks = document.querySelectorAll('.nav-links a');

const openMenu = () => toggle?.setAttribute('aria-expanded', 'true');
const closeMenu = () => toggle?.setAttribute('aria-expanded', 'false');

toggle?.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', `${!isExpanded}`);
});

closeBtn?.addEventListener('click', closeMenu);

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu when clicking outside (on the body area)
document.addEventListener('click', (event) => {
    const isClickInsideMenu = event.target.closest('.navigation');
    const isClickOnToggle = event.target.closest('.menu-toggle');

    if (!isClickInsideMenu && !isClickOnToggle && toggle?.getAttribute('aria-expanded') === 'true') {
        closeMenu();
    }
});
