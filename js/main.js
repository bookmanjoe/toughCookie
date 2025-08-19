
$(function () {
  if (window.location.hash) {
    const $target = $(window.location.hash);
    if ($target.length) {
      $("html, body").animate({ scrollTop: $target.offset().top }, 800);
    }
  }

  const $burgerButton = $('#burger-button');
  const $navOverlay = $('#nav-overlay');
  const $navLinks = $('.nav-link');
  const $body = $('body');

  // Burger-Button Toggle
  $burgerButton.on('click', function() {
    $(this).toggleClass('active');
    $navOverlay.toggleClass('active');

    // Body-Scroll verhindern wenn Menü offen ist
    if ($navOverlay.hasClass('active')) {
      $body.css('overflow', 'hidden');
    } else {
      $body.css('overflow', 'auto');
    }
  });

  // Menü schließen beim Klick auf einen Link
  $navLinks.on('click', function() {
    $burgerButton.removeClass('active');
    $navOverlay.removeClass('active');
    $body.css('overflow', 'auto');
  });

  // Menü schließen beim Klick außerhalb (auf das Overlay selbst)
  $navOverlay.on('click', function(e) {
    if (e.target === this) {
      $burgerButton.removeClass('active');
      $navOverlay.removeClass('active');
      $body.css('overflow', 'auto');
    }
  });

  // ESC-Taste zum Schließen
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' && $navOverlay.hasClass('active')) {
      $burgerButton.removeClass('active');
      $navOverlay.removeClass('active');
      $body.css('overflow', 'auto');
    }
  });

  // Optional: Smooth Scrolling zu Anchor-Links mit jQuery
  $navLinks.on('click', function(e) {
    const href = $(this).attr('href');

    // Nur wenn es ein Anchor-Link ist (#section)
    if (href.startsWith('#')) {
      e.preventDefault();

      const target = $(href);
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - 80 // 80px Abstand nach oben
        }, 800); // 800ms Animation
      }
    }
  });

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
      toggleActions: "play none none none"
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.2,
    ease: "power2.out"
  });


  gsap.to(".footer-wrapper", {
    y: 0,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: "#projects",
      start: "bottom bottom",
      toggleActions: "play none none none"
    }
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

  // Project Carousel initialisieren
  initProjectCarousel();

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

// Project Carousel Funktionalität mit unendlichem Loop
function initProjectCarousel() {
  // Variable für aktuelles Video
  let currentVideo = null;
  let originalSlideCount = 0;

  // Swiper initialisieren mit Loop-Funktionalität
  const projectSwiper = new Swiper('.project-carousel', {
    // Grundeinstellungen
    effect: 'slide',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    mousewheel: false,

    // Loop für unendliches Scrollen aktivieren
    loop: false,

    // Start bei mittlerer Card (Index 2 bei 5 Cards = Card 3)
    initialSlide: Math.floor(document.querySelectorAll('.swiper-slide').length / 2),

    // Abstand zwischen Cards
    spaceBetween: -500,

    // Pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
      // Pagination zeigt nur Original-Slides an
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + '</span>';
      }
    },

    // Geschwindigkeit
    speed: 800,

    // Breakpoints für Responsive Design
    breakpoints: {
      320: {
        slidesPerView: 3,
        spaceBetween: -50,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: -50,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: -900,
      }
    },

    // Event Callbacks
    on: {
      // Bei Slide-Wechsel
      slideChange: function() {
        handleVideoPlayback(this);
        // Z-Index für alle Cards aktualisieren
        updateCardZIndex(this.activeIndex, this.slides.length);
      },

      // Bei Initialisierung
      init: function() {
        // Anzahl der Original-Slides speichern
        originalSlideCount = this.slides.length;
        handleVideoPlayback(this);
        // Initiale Z-Index-Werte setzen
        updateCardZIndex(this.activeIndex, this.slides.length);
        // Details-Overlay initialisieren
        initProjectDetailsOverlay();
      },

      // Spezielle Loop-Events
      slideChangeTransitionStart: function() {
        // Z-Index auch während der Transition aktualisieren
        updateCardZIndex(this.activeIndex, this.slides.length);

        // Sanfte Übergänge bei Loop-Wechsel
        this.slides.forEach(slide => {
          // Existing transition code here if any
        });
      },

      // Bei realIndex-Änderung (wichtig für Loop-Modus)
      realIndexChange: function() {
        updateCardZIndex(this.realIndex, originalSlideCount);
      }
    }
  });

  // More Button Event Listeners
  function initMoreButtons() {
    const moreButtons = document.querySelectorAll('.more-button');
    moreButtons.forEach((button, index) => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        showProjectDetails(projectSwiper.realIndex);
      });
    });
  }


  // Project Details Funktionen
  function initProjectDetailsOverlay() {
    const container = document.getElementById('projectDetailsContainer');
    const closeBtn = document.getElementById('closeDetailsBtn');

    if (closeBtn) {
      closeBtn.addEventListener('click', hideProjectDetails);
    }

    // ESC-Taste zum Schließen
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideProjectDetails();
      }
    });

    // More Buttons initialisieren
    initMoreButtons();
  }


  function showProjectDetails(projectIndex) {
    const carousel = document.querySelector('.card-carousel-container');
    const detailsContainer = document.getElementById('projectDetailsContainer');

    if (carousel && detailsContainer) {
      // Carousel ausblenden
      carousel.style.opacity = '0';
      carousel.style.transform = 'translateY(-20px)';

      setTimeout(() => {
        carousel.style.display = 'none';

        // Details einblenden
        detailsContainer.style.display = 'block';
        updateProjectDetails(projectIndex);

        setTimeout(() => {
          detailsContainer.style.opacity = '1';
          detailsContainer.style.transform = 'translateY(0)';
        }, 50);
      }, 300);
    }
  }


  function hideProjectDetails() {
    const carousel = document.querySelector('.card-carousel-container');
    const detailsContainer = document.getElementById('projectDetailsContainer');

    if (carousel && detailsContainer) {
      // Details ausblenden
      detailsContainer.style.opacity = '0';
      detailsContainer.style.transform = 'translateY(20px)';

      setTimeout(() => {
        detailsContainer.style.display = 'none';

        // Carousel wieder einblenden
        carousel.style.display = 'block';

        setTimeout(() => {
          carousel.style.opacity = '1';
          carousel.style.transform = 'translateY(0)';
        }, 50);
      }, 300);
    }
  }


  function updateProjectDetails(activeIndex) {
    const detailItems = document.querySelectorAll('#projectDetailsContainer .detail-item');

    detailItems.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }



  // Z-Index Update für More Button Sichtbarkeit
  function updateCardZIndex(activeIndex, totalSlides) {
    const slides = document.querySelectorAll('.swiper-slide');
    const maxZIndex = 1000;

    slides.forEach((slide, index) => {
      let distance = Math.abs(index - activeIndex);

      if (totalSlides > 0) {
        const wrapDistance = Math.min(
          Math.abs(index - activeIndex),
          Math.abs((index + totalSlides) - activeIndex),
          Math.abs(index - (activeIndex + totalSlides))
        );
        distance = Math.min(distance, wrapDistance);
      }

      const zIndex = maxZIndex - distance;
      slide.style.zIndex = zIndex;

      const card = slide.querySelector('.project-video-card');
      const overlay = slide.querySelector('.project-card-overlay');

      if (card && overlay) {
        if (index === activeIndex) {
          card.classList.add('active-card');
          overlay.classList.add('active');
        } else {
          card.classList.remove('active-card');
          overlay.classList.remove('active');
        }
      }
    });
  }


  // Video Playback Management für Loop-Carousel
  function handleVideoPlayback(swiper) {
    // Alle Videos pausieren
    const allVideos = document.querySelectorAll('.project-video');
    allVideos.forEach(video => {
      video.pause();
      video.currentTime = 0;
    });

    // Aktuelles Video über activeIndex finden (einfacher für Loop)
    const activeSlide = swiper.slides[swiper.activeIndex];

    if (activeSlide) {
      const activeVideo = activeSlide.querySelector('.project-video');
      if (activeVideo) {
        currentVideo = activeVideo;

        // Video abspielen mit verbessertem Error-Handling
        activeVideo.muted = true; // Sicherstellen dass muted ist
        const playPromise = activeVideo.play();

        if (playPromise !== undefined) {
          playPromise
              .then(() => {
                console.log('Video playing successfully');
              })
              .catch(error => {
                console.log('Video autoplay failed:', error);
                // Fallback: Video bei User-Interaktion bereit machen
                activeVideo.addEventListener('click', () => {
                  activeVideo.play();
                }, { once: true });
              });
        }
      }
    }
  }

  // Enhanced Drag & Drop für Loop-Carousel
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let dragThreshold = 50; // Mindest-Drag-Distanz für Slide-Wechsel

  // Touch/Mouse Events für besseres Loop-Drag-Gefühl
  projectSwiper.el.addEventListener('mousedown', handleDragStart, { passive: true });
  projectSwiper.el.addEventListener('touchstart', handleDragStart, { passive: true });

  document.addEventListener('mousemove', handleDragMove, { passive: true });
  document.addEventListener('touchmove', handleDragMove, { passive: true });

  document.addEventListener('mouseup', handleDragEnd);
  document.addEventListener('touchend', handleDragEnd);

  function handleDragStart(e) {
    isDragging = true;
    startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    projectSwiper.el.style.cursor = 'grabbing';

    // Autoplay pausieren beim Drag
    if (projectSwiper.autoplay) {
      projectSwiper.autoplay.stop();
    }
  }

  function handleDragMove(e) {
    if (!isDragging) return;

    e.preventDefault();
    currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const deltaX = currentX - startX;

    // Visual feedback während des Drags
    if (Math.abs(deltaX) > 10) {
      const intensity = Math.min(Math.abs(deltaX) / 100, 0.3);
      projectSwiper.el.style.transform = `translateX(${deltaX * intensity}px) scale(${1 - intensity * 0.05})`;
    }
  }

  function handleDragEnd(e) {
    if (!isDragging) return;

    isDragging = false;
    projectSwiper.el.style.cursor = 'grab';
    projectSwiper.el.style.transform = '';

    const deltaX = currentX - startX;

    // Slide wechseln basierend auf Drag-Distanz
    if (Math.abs(deltaX) > dragThreshold) {
      if (deltaX > 0) {
        projectSwiper.slidePrev();
      } else {
        projectSwiper.slideNext();
      }
    }
  }

  // Enhanced Keyboard Navigation für Loop
  document.addEventListener('keydown', function(e) {
    if (isCarouselInView()) {
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          projectSwiper.slidePrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          projectSwiper.slideNext();
          break;
        case 'Home':
          e.preventDefault();
          projectSwiper.slideTo(0); // Zum ersten Original-Slide
          break;
        case 'End':
          e.preventDefault();
          projectSwiper.slideTo(originalSlideCount - 1); // Zum letzten Original-Slide
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          // Video pausieren/abspielen
          if (currentVideo) {
            if (currentVideo.paused) {
              currentVideo.play();
            } else {
              currentVideo.pause();
            }
          }
          break;
      }
    }
  });

  // Hilfsfunktion: Prüfen ob Carousel im Viewport ist
  function isCarouselInView() {
    const carousel = document.querySelector('.card-carousel-container');
    if (!carousel) return false;

    const rect = carousel.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  // Video-Qualität basierend auf Performance anpassen
  function optimizeVideoQuality() {
    const videos = document.querySelectorAll('.project-video');
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    videos.forEach(video => {
      // Auf langsameren Verbindungen niedrigere Qualität laden
      if (connection && connection.effectiveType === '2g') {
        video.setAttribute('preload', 'none');
      } else if (connection && connection.effectiveType === '3g') {
        video.setAttribute('preload', 'metadata');
      } else {
        video.setAttribute('preload', 'metadata');
      }
    });
  }

  // Intersection Observer für Performance-Optimierung
  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  const carouselObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Carousel ist sichtbar - Videos laden
        optimizeVideoQuality();

      } else {
        // Carousel nicht sichtbar - alle Videos pausieren
        const allVideos = document.querySelectorAll('.project-video');
        allVideos.forEach(video => video.pause());
      }
    });
  }, observerOptions);

  // Observer für Carousel Container aktivieren
  const carouselContainer = document.querySelector('.card-carousel-container');
  if (carouselContainer) {
    carouselObserver.observe(carouselContainer);
  }

  // Cleanup beim Window Unload
  window.addEventListener('beforeunload', () => {
    const allVideos = document.querySelectorAll('.project-video');
    allVideos.forEach(video => {
      video.pause();
      video.src = '';
    });

    // Swiper cleanup
    if (projectSwiper) {
      projectSwiper.destroy(true, true);
    }
  });

  // Neue Funktionen für Detail-Bereich:
  function initProjectDetails() {
    const toggleBtn = document.getElementById('detailsToggle');
    const detailsContent = document.getElementById('detailsContent');

    if (!toggleBtn || !detailsContent) return;

    toggleBtn.addEventListener('click', function() {
      const isActive = detailsContent.classList.contains('active');

      if (isActive) {
        // Schließen
        detailsContent.classList.remove('active');
        toggleBtn.classList.remove('active');
        toggleBtn.querySelector('.toggle-text').textContent = 'Details anzeigen';
      } else {
        // Öffnen
        detailsContent.classList.add('active');
        toggleBtn.classList.add('active');
        toggleBtn.querySelector('.toggle-text').textContent = 'Details';
      }
    });
  }

  function updateProjectDetails(activeIndex) {
    const detailItems = document.querySelectorAll('.detail-item');

    detailItems.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }


  // Return Swiper instance für externe Kontrolle
  return projectSwiper;
}
