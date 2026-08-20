// ==========================================================================
// Shashank & Harshitha — Wedding Invitation
// ==========================================================================

// ---- Config: update these when real details are confirmed ----
const WEDDING_DATE = new Date('2026-12-12T08:00:00+05:30'); // Muhurtham time, IST
const RSVP_EMAIL = 'reddyguda1999@gmail.com';

// ---- Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---- Countdown timer ----
function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl) return;

  if (diff <= 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minsEl.textContent = '00';
    secsEl.textContent = '00';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minsEl.textContent = String(mins).padStart(2, '0');
  secsEl.textContent = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ---- RSVP form: build a mailto: link with the response ----
const rsvpForm = document.getElementById('rsvpForm');

if (rsvpForm) {
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('guestName').value.trim();
    const email = document.getElementById('guestEmail').value.trim();
    const attending = document.getElementById('attending').value;
    const guestCount = document.getElementById('guestCount').value;
    const events = document.getElementById('events').value.trim();
    const message = document.getElementById('message').value.trim();

    const subject = `RSVP: ${name} — ${attending}`;
    const body =
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Attending: ${attending}\n` +
      `Number of Guests: ${guestCount}\n` +
      `Events Attending: ${events || '-'}\n` +
      `Message: ${message || '-'}`;

    const mailtoUrl = `mailto:${RSVP_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  });
}

// ---- Header shadow on scroll ----
const header = document.getElementById('siteHeader');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 4px 16px rgba(122,18,48,0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}
