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

  secsEl.classList.remove('tick');
  void secsEl.offsetWidth; // restart the animation each second
  secsEl.classList.add('tick');
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
      events: document.getElementById('eventsAttending').value.trim(),
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

// ---- Add to Calendar (.ics download) ----
const addToCalendarBtn = document.getElementById('addToCalendar');

function toICSDate(date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

if (addToCalendarBtn) {
  addToCalendarBtn.addEventListener('click', () => {
    const start = WEDDING_DATE;
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000); // 3-hour block

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Shashank & Harshitha Wedding//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@shashank-harshitha-wedding`,
      `DTSTAMP:${toICSDate(new Date())}`,
      `DTSTART:${toICSDate(start)}`,
      `DTEND:${toICSDate(end)}`,
      'SUMMARY:Shashank & Harshitha\'s Wedding',
      'DESCRIPTION:Wedding ceremony of Shashank and Harshitha',
      'LOCATION:Guntur, Andhra Pradesh, India',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shashank-harshitha-wedding.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

// ---- Scroll-reveal animations ----
const revealEls = document.querySelectorAll('.reveal');

if (revealEls.length && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ---- Header shadow on scroll ----
const header = document.getElementById('siteHeader');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 4px 16px rgba(138,90,68,0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}
