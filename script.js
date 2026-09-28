(() => {
  const root = document.documentElement;
  const scene = document.querySelector('.object-scene');
  const menuButton = document.querySelector('.menu-button');
  const mobileNav = document.querySelector('.mobile-nav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0, frame = 0;

  window.addEventListener('DOMContentLoaded', () => requestAnimationFrame(() => root.classList.add('loaded')), { once: true });

  const renderParallax = () => {
    currentX += (targetX - currentX) * .075;
    currentY += (targetY - currentY) * .075;
    scene.style.setProperty('--mx', `${currentX.toFixed(2)}px`);
    scene.style.setProperty('--my', `${currentY.toFixed(2)}px`);
    frame = Math.abs(targetX - currentX) > .05 || Math.abs(targetY - currentY) > .05 ? requestAnimationFrame(renderParallax) : 0;
  };
  const scheduleRender = () => { if (!frame) frame = requestAnimationFrame(renderParallax); };
  const resetParallax = () => { targetX = 0; targetY = 0; scheduleRender(); };

  if (!reduceMotion.matches && finePointer.matches) {
    scene.addEventListener('pointermove', (event) => {
      const bounds = scene.getBoundingClientRect();
      targetX = ((event.clientX - bounds.left) / bounds.width - .5) * 34;
      targetY = ((event.clientY - bounds.top) / bounds.height - .5) * 25;
      scheduleRender();
    }, { passive: true });
    scene.addEventListener('pointerleave', resetParallax, { passive: true });
  }

  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
    mobileNav.classList.toggle('open', !isOpen);
  });
  mobileNav.addEventListener('click', (event) => {
    if (event.target.matches('a')) { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open menu'); mobileNav.classList.remove('open'); }
  });
})();
