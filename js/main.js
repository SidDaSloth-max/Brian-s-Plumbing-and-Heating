// Mobile nav toggle
var navToggle = document.getElementById('navToggle');
var mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', function () {
  var isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Close mobile nav after clicking a link
mainNav.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () { mainNav.classList.remove('open'); });
});

var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Fade the header/nav in once the user scrolls down
var siteHeader = document.querySelector('.site-header');
function updateHeaderVisibility() {
  if (window.scrollY > 80) {
    siteHeader.classList.add('visible');
  } else {
    siteHeader.classList.remove('visible');
    mainNav.classList.remove('open');
  }
}
window.addEventListener('scroll', updateHeaderVisibility, { passive: true });
updateHeaderVisibility();

// GA4 event tracking
function trackCall(label) {
  if (typeof gtag === 'function') {
    gtag('event', 'call_click', { event_category: 'engagement', event_label: label });
  }
}

function trackFormSubmit(label) {
  if (typeof gtag === 'function') {
    gtag('event', 'form_submit', { event_category: 'engagement', event_label: label });
  }
}

// Netlify Forms AJAX submission (generic, works for any form id/status pair)
function initNetlifyForm(formId, statusId, successMessage, failureMessage) {
  var form = document.getElementById(formId);
  var status = document.getElementById(statusId);
  if (!form || !status) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    status.textContent = '';
    status.className = 'form-status';

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Submission failed');
        trackFormSubmit(formId);
        form.style.display = 'none';
        status.textContent = successMessage;
        status.className = 'form-status success';
      })
      .catch(function () {
        status.textContent = failureMessage;
        status.className = 'form-status error';
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
  });
}

function initAll() {
  initNetlifyForm(
    'contactFormEl',
    'contactFormStatus',
    "Thank you! Your message has been sent — I'll be in touch soon.",
    'Something went wrong sending your message. Please call (206) 427-2219 instead.'
  );
  initNetlifyForm(
    'feedbackFormEl',
    'feedbackFormStatus',
    "Thanks for letting me know — I'll take a look.",
    'Something went wrong sending your feedback. Please call (206) 427-2219 instead.'
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  setTimeout(initAll, 0);
}
