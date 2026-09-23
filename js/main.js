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
  if (!track) return;

  var mq = window.matchMedia('(max-width: 700px)');
  var startIndex = 0;
  var animating = false;
  var vis = mq.matches ? 1 : 3;
  var total = YELP_REVIEWS.length;
  var FIRST = -2; // cards rendered from offset -2 .. vis+1; offsets <0 and >=vis are faded "peek" cards

  function wrap(i) { return ((i % total) + total) % total; }

  function buildCard(offset) {
    var r = YELP_REVIEWS[wrap(startIndex + offset)];
    var card = document.createElement('div');
    card.className = 'review-quote';
    card.setAttribute('data-offset', offset);
    card.innerHTML =
      '<div class="quote-stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div>' +
      '<p>&ldquo;' + r.quote + '&rdquo;</p>' +
      '<div class="reviewer">&mdash; ' + r.name + ', ' + r.location + '</div>' +
      '<a class="review-link" href="' + YELP_URL + '" target="_blank" rel="noopener" onclick="trackOutbound(\'review_card_yelp_link\')">Read full review on Yelp &rarr;</a>';
    return card;
  }

  function setPeek(card, offset) {
    var peek = offset < 0 || offset >= vis;
    card.classList.toggle('review-peek', peek);
    var link = card.querySelector('.review-link');
    if (link) link.tabIndex = peek ? -1 : 0;
    if (peek) {
      card.setAttribute('role', 'button');
      card.tabIndex = (offset === -1 || offset === vis) ? 0 : -1;
      card.setAttribute('aria-label', offset < 0 ? 'Show earlier reviews' : 'Show more reviews');
    } else {
      card.removeAttribute('role');
      card.removeAttribute('tabindex');
      card.removeAttribute('aria-label');
    }
  }

  function step() {
    var cards = track.children;
    return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 0;
  }

  function setTransform(px, animate) {
    track.style.transition = animate ? 'transform 0.55s ease' : 'none';
    track.style.transform = 'translateX(' + px + 'px)';
  }

  function render() {
    track.innerHTML = '';
    for (var o = FIRST; o <= vis + 1; o++) {
      var card = buildCard(o);
      setPeek(card, o);
      track.appendChild(card);
    }
    setTransform(-step(), false);
  }

  function slide(direction) {
    if (animating) return;
    animating = true;
    var s = step();
    var cards = track.children;
    var i;
    // Fade cards to their post-slide state while the track moves
    for (i = 0; i < cards.length; i++) {
      var off = FIRST + i;
      var newOff = direction === 'next' ? off - 1 : off + 1;
      var peek = newOff < 0 || newOff >= vis;
      cards[i].classList.toggle('review-peek', peek);
    }
    setTransform(direction === 'next' ? -2 * s : 0, true);
    setTimeout(function () {
      startIndex = wrap(startIndex + (direction === 'next' ? 1 : -1));
      render();
      animating = false;
    }, 580);
  }

  track.addEventListener('click', function (e) {
    var card = e.target.closest ? e.target.closest('.review-peek') : null;
    if (!card) return;
    var off = parseInt(card.getAttribute('data-offset'), 10);
    slide(off < 0 ? 'prev' : 'next');
  });
  track.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var card = e.target.closest ? e.target.closest('.review-peek') : null;
    if (!card) return;
    e.preventDefault();
    slide(parseInt(card.getAttribute('data-offset'), 10) < 0 ? 'prev' : 'next');
  });

  var lastWidth = 0;
  function onResize() {
    var viewport = track.parentNode;
    var width = viewport.clientWidth;
    var newVis = mq.matches ? 1 : 3;
    if (animating) return;
    if (width === lastWidth && newVis === vis) return;
    lastWidth = width;
    vis = newVis;
    render();
  }
  if (window.ResizeObserver) {
    new ResizeObserver(onResize).observe(track.parentNode);
  } else {
    window.addEventListener('resize', onResize);
  }

  render();
  lastWidth = track.parentNode.clientWidth;
}

// Gallery carousel prev/next
function initGalleryCarousel() {
  var track = document.getElementById('carouselTrack');
  var prev = document.getElementById('carouselPrev');
  var next = document.getElementById('carouselNext');
  if (!track || !prev || !next) return;

  function step() {
    return track.clientWidth;
  }
  prev.addEventListener('click', function () {
    track.scrollBy({ left: -step(), behavior: 'smooth' });
  });
  next.addEventListener('click', function () {
    track.scrollBy({ left: step(), behavior: 'smooth' });
  });
}

function initAll() {
  initReviewCarousel();
  initGalleryCarousel();
  initNetlifyForm(
    'contactFormEl',
    'contactFormStatus',
    "Thank you! Your message has been sent — I'll be in touch soon.",
    'Something went wrong sending your message. Please call (206) 427-2219 instead.'
  );
  initNetlifyForm(
    'quoteFormEl',
    'quoteFormStatus',
    "Thank you! Your request has been sent — I'll be in touch soon.",
    'Something went wrong sending your request. Please call (206) 427-2219 instead.'
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
