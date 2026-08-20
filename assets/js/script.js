// ==========================================================================
// Shashank & Harshitha — Wedding Invitation
// ==========================================================================

// ---- Config: update these when real details are confirmed ----
const WEDDING_DATE = new Date('2026-12-12T08:00:00+05:30'); // Muhurtham time, IST
const RSVP_EMAIL = 'reddyguda1999@gmail.com';
// Formspree endpoint — replace YOUR_FORM_ID with the ID from https://formspree.io
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mdenbejj';

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

// ---- RSVP form: submit to Formspree, with a mailto: fallback ----
const rsvpForm = document.getElementById('rsvpForm');
const rsvpStatus = document.getElementById('rsvpStatus');
const rsvpSubmit = document.getElementById('rsvpSubmit');

function buildMailtoUrl(data) {
  const subject = `RSVP: ${data.guestName} — ${data.attending}`;
  const body =
    `Name: ${data.guestName}\n` +
    `Email: ${data.guestEmail}\n` +
    `Attending: ${data.attending}\n` +
    `Number of Guests: ${data.guestCount}\n` +
    `Events Attending: ${data.events || '-'}\n` +
    `Message: ${data.message || '-'}`;
  return `mailto:${RSVP_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

if (rsvpForm) {
  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      guestName: document.getElementById('guestName').value.trim(),
      guestEmail: document.getElementById('guestEmail').value.trim(),
      attending: document.getElementById('attending').value,
      guestCount: document.getElementById('guestCount').value,
      events: document.getElementById('events').value.trim(),
      message: document.getElementById('message').value.trim(),
    };

    if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
      rsvpStatus.textContent = 'RSVP form is not fully set up yet — opening your email app instead.';
      rsvpStatus.className = 'rsvp-status rsvp-status-error';
      window.location.href = buildMailtoUrl(data);
      return;
    }

    rsvpSubmit.disabled = true;
    rsvpSubmit.textContent = 'Sending...';
    rsvpStatus.textContent = '';

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(rsvpForm),
      });

      if (response.ok) {
        rsvpStatus.textContent = 'Thank you! Your RSVP has been sent. 💛';
        rsvpStatus.className = 'rsvp-status rsvp-status-success';
        rsvpForm.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      rsvpStatus.innerHTML =
        'Something went wrong sending your RSVP. Please ' +
        `<a href="${buildMailtoUrl(data)}">click here to email us directly</a>.`;
      rsvpStatus.className = 'rsvp-status rsvp-status-error';
    } finally {
      rsvpSubmit.disabled = false;
      rsvpSubmit.textContent = 'Send RSVP';
    }
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
