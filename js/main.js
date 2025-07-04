$(function () {
  if (window.location.hash) {
    const $target = $(window.location.hash);
    if ($target.length) {
      $("html, body").animate({ scrollTop: $target.offset().top }, 800);
    }
  }

  startMarquee('.diagonal-divider.dark .marquee-wrapper', 0.5, 'right');  // Vordergrund
  startMarquee('.diagonal-divider.light .marquee-wrapper', 0.2, 'left');  // Hintergrund langsamer, andere Richtung
  addBigCookieBite('.service_card');

  $("#white-overlay").delay(500).fadeOut(2000, () => {
    $("#slogan").css("opacity", 1);
  });

  $("#main-nav a").on("click", function (e) {
    e.preventDefault();
    const $target = $($(this).attr("href"));
    if ($target.length) {
      $("html, body").animate({ scrollTop: $target.offset().top }, 800);
    }
  });

  gsap.registerPlugin(ScrollTrigger);

  // Parallax auf .about-inner
  gsap.timeline({
    scrollTrigger: {
      trigger: "#about",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  })
  .fromTo(".about-inner", { y: 0 }, { y: -100 })
  .fromTo("#corner-logo", { opacity: 0 }, { opacity: 1 }, 0);
  
  // Animierte Cards
  gsap.from(".service_card_wrapper", {
    scrollTrigger: {
      trigger: ".service_cards_wrapper",
      start: "top 95%", // oder "top bottom"
      toggleActions: "play none none none",
      markers: true // nur zum Testen – siehst du Linien?
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
  });

  // Start-Logo ausblenden beim Scroll
  $(window).on("scroll", function () {
    const fadePoint = 100;
    if ($(this).scrollTop() > fadePoint) {
      $("#logo-container").addClass("hidden");
    } else {
      $("#logo-container").removeClass("hidden");
    }
  });
});


function startMarquee(selector, speed = 0.5, direction = 'right') {
  const $wrapper = $(selector);
  const $content = $wrapper.find('.marquee-content');

  if (!$wrapper.length || !$content.length) return;

  let originalText = $content.html();
  let duplicateCount = 2;

  // Duplizieren, bis breite genug ist
  while ($content.width() < $(window).width() * 2) {
    $content.append(originalText);
    duplicateCount++;
    if (duplicateCount > 20) break;
  }

  let pos = direction === 'right' ? -$content.width() / 2 : 0;

  function animateMarquee() {
    pos += (direction === 'right' ? speed : -speed);
    if (direction === 'right' && pos >= 0) pos = -$content.width() / 2;
    if (direction === 'left' && pos <= -$content.width() / 2) pos = 0;
    $content.css('transform', `translateX(${pos}px)`);
    requestAnimationFrame(animateMarquee);
  }

  animateMarquee();

}


function addBigCookieBite(selector) {
  $('.service_card').each(function () {
    const $card = $(this);

    // Erst alle alten Bites entfernen (wichtig beim Reload oder Wiederholung)
    $card.find('.bite-circle').remove();

    // Neue große Crunch-Biss-Kreise oben rechts
    const bites = [
      { top: -30, right: -15, size: 60 }, 
      { top: 10, right: -10, size: 60 }, 
    
      { top: 45, right: -20, size: 40 }
    ];

    bites.forEach(bite => {
      const $bite = $('<div class="bite-circle"></div>');
      $bite.css({
        top: `${bite.top}px`,
        right: `${bite.right}px`,
        width: `${bite.size}px`,
        height: `${bite.size}px`
      });
      $card.append($bite);
    });
  });
}