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

function trackOutbound(label) {
  if (typeof gtag === 'function') {
    gtag('event', 'outbound_click', { event_category: 'engagement', event_label: label });
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

// Real customer reviews from Yelp (yelp.com/biz/brians-plumbing-and-heating-libby-2),
// shown as short attributed excerpts with a link to the full review on Yelp.
var YELP_REVIEWS = [
  { name: 'T F.', location: 'Missoula, MT', quote: 'This plumber knows his trade, very honest and reasonable.' },
  { name: 'Alice C.', location: 'Troy, MT', quote: 'Brian was great, had a hot water tank leak on a Friday night.' },
  { name: 'Demeree J.', location: 'Seattle, WA', quote: 'Called back promptly, showed up on time, and explained exactly what was needed.' },
  { name: 'Elizabeth G.', location: 'Snohomish, WA', quote: 'Polite, professional and very honest.' },
  { name: 'Brian H.', location: 'San Francisco, CA', quote: 'A skilled tradesman — he does not waste any moves.' },
  { name: 'Kurtis D.', location: 'Everett, WA', quote: 'Brian was great! I ended up with a next day appointment.' },
  { name: 'Tim A.', location: 'Everett, WA', quote: 'He deserves all the 5 star ratings.' },
  { name: 'Mike F.', location: 'Carmichael, CA', quote: 'Great guy, quick response, and reasonable prices!' },
  { name: 'Jonathan A.', location: 'Snohomish, WA', quote: 'Trustworthy, knowledgeable, professional and reasonable rates.' },
  { name: 'Sloane R.', location: 'Everett, WA', quote: 'The faucet works like new — so glad I found him.' },
  { name: 'Tamara W.', location: 'Pasco, WA', quote: 'Very professional and wonderful job!' },
  { name: 'Joanne B.', location: 'Bremerton, WA', quote: 'Quick, knew his business, and was very fair!' },
  { name: 'Brent W.', location: 'Kirkland, WA', quote: 'Great guy and very knowledgeable — fixed my leaking water heater.' },
  { name: 'Tricia R.', location: 'San Diego, CA', quote: 'Professional, polite, courteous and fair throughout our whole remodel.' },
  { name: 'GoodMorningSD T.', location: 'WA', quote: 'Fixed the issue with courtesy, honesty, respect and high quality.' }
];
var YELP_URL = 'https://www.yelp.com/biz/brians-plumbing-and-heating-libby-2';

function initReviewCarousel() {
  var track = document.getElementById('reviewTrack');
  var prev = document.getElementById('reviewPrev');
  var next = document.getElementById('reviewNext');
  if (!track || !prev || !next) return;

  var startIndex = 0;
  var visibleCount = 3;

  function render() {
    track.innerHTML = '';
    for (var i = 0; i < visibleCount; i++) {
      var r = YELP_REVIEWS[(startIndex + i) % YELP_REVIEWS.length];
      var card = document.createElement('div');
      card.className = 'review-quote';
      card.innerHTML =
        '<div class="quote-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>' +
        '<p>&ldquo;' + r.quote + '&rdquo;</p>' +
        '<div class="reviewer">&mdash; ' + r.name + ', ' + r.location + '</div>' +
        '<a class="review-link" href="' + YELP_URL + '" target="_blank" rel="noopener" onclick="trackOutbound(\'review_card_yelp_link\')">Read full review on Yelp &rarr;</a>';
      track.appendChild(card);
    }
  }

  prev.addEventListener('click', function () {
    startIndex = (startIndex - 1 + YELP_REVIEWS.length) % YELP_REVIEWS.length;
    render();
  });
  next.addEventListener('click', function () {
    startIndex = (startIndex + 1) % YELP_REVIEWS.length;
    render();
  });

  render();
}

function initAll() {
  initReviewCarousel();
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
