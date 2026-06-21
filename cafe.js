 /* ============================================
   DAR NANA — interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Nav: background on scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const closeMenu = () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------- Menu tabs ---------- */
  const tabs = document.querySelectorAll('.menu__tab');
  const panels = document.querySelectorAll('.menu__panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      panels.forEach(panel => {
        panel.classList.toggle('is-active', panel.dataset.panel === target);
      });
    });
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: no IntersectionObserver support
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Reservation form ---------- */
  const form = document.getElementById('reserveForm');
  const formMsg = document.getElementById('formMsg');

  // Endpoint Formspree connecté au formulaire de réservation Dar Nana
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mnjkawby';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        formMsg.textContent = 'Merci ! Votre demande a bien été reçue, nous vous recontacterons rapidement.';
        formMsg.style.color = 'var(--mint)';
        form.reset();
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (error) {
      formMsg.textContent = 'Une erreur est survenue. Merci de réessayer ou de nous appeler directement.';
      formMsg.style.color = 'var(--terracotta)';
    }

    formMsg.classList.add('is-shown');
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;

    setTimeout(() => formMsg.classList.remove('is-shown'), 6000);
  });

  /* ---------- Set min date on reservation field to today ---------- */
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

});
