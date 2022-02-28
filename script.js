'use strict';

const modalWindow = document.querySelector('.modal-window');
const overlay = document.querySelector('.overlay');
const btnCloseModalWindow = document.querySelector('.btn--close-modal-window');
const btnsOpenModalWindow = document.querySelectorAll(
  '.btn--show-modal-window'
);

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabContent = document.querySelectorAll('.operations__content');
const tabsParent = document.querySelector('.operations__tab-container');
const tabs = tabsParent.querySelectorAll('.btn');

const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModalWindow = function () {
  modalWindow.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModalWindow = function (e) {
  e.preventDefault();
  modalWindow.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModalWindow.forEach(btn => {
  btn.addEventListener('click', openModalWindow);
});

btnCloseModalWindow.addEventListener('click', closeModalWindow);
overlay.addEventListener('click', closeModalWindow);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modalWindow.classList.contains('hidden')) {
    closeModalWindow();
  }
});


///////////////////////////////////////
// Scroll 

btnScrollTo.addEventListener('click', (e) => {
  //const section1Coords = section1.getBoundingClientRect();
  // 1
  //window.scrollTo(section1Coords.left + window.pageXOffset, section1Coords.top + window.pageYOffset);

  // 2
  // window.scrollTo({
  //   left: section1Coords.left + window.pageXOffset, 
  //   top: section1Coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // 3
  section1.scrollIntoView({behavior: 'smooth'});
});


///////////////////////////////////////
// Плавная навигация

// document.querySelectorAll('.nav__link').forEach(link => {
//   link.addEventListener('click', (e) => {
//     e.preventDefault();
//     const select = link.getAttribute('href');
//     document.querySelector(select).scrollIntoView({behavior: 'smooth'});
//   });
// });

//Делегирование
document.querySelector('.nav__links').addEventListener('click', (e) => {
  if (e.target && e.target.matches('.nav__link')) {
    e.preventDefault();
    const select = e.target.getAttribute('href');
    document.querySelector(select).scrollIntoView({behavior: 'smooth'});
  }
});


///////////////////////////////////////
// Табы

// 1 вариант
tabsParent.addEventListener('click', (e) => {
  const clickBtn = e.target.closest('.btn');
  if (!clickBtn) return;

  tabs.forEach(btn => btn.classList.remove('operations__tab--active'));
  clickBtn.classList.add('operations__tab--active');

  tabContent.forEach(item => item.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clickBtn.dataset.tab}`).classList.add('operations__content--active');

});

/*
// 2 вариант
tabsParent.addEventListener('click', (e) => {
  if (e.target && e.target.matches('.btn')) {
    tabContent.forEach(item => {
      item.classList.remove('operations__content--active');
    });

    tabs.forEach((tab, i) => {
      tab.classList.remove('operations__tab--active');

      if (e.target === tab) {
        tab.classList.add('operations__tab--active');
        tabContent[i].classList.add('operations__content--active');
      }
    });
  }
});
*/


/*
// 3 вариант
const tabContent = document.querySelectorAll('.operations__content');
const tabsParent = document.querySelector('.operations__tab-container');
const tabs = tabsParent.querySelectorAll('.btn');

const hideTabContent = () => {
  tabContent.forEach(item => {
    item.classList.remove('operations__content--active');
  });
};

const showTabContent = (i) => {
  tabContent[i].classList.add('operations__content--active');
};

tabsParent.addEventListener('click', (e) => {
  if (e.target && e.target.matches('.btn')) {
    tabs.forEach((item, i) => {
      item.classList.remove('operations__tab--active');
      if (e.target == item) {
        item.classList.add('operations__tab--active');
        hideTabContent();
        showTabContent(i);
      }
    });
  }
});
*/

///////////////////////////////////////
// Анимация потускнения на панели навигации

const navLinksHoverAnimation = function (e, nn) {
  const link = e.target;
  if (link && link.matches('.nav__link')) {
    const allLinks = link.closest('.nav__links').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    const logoText = link.closest('.nav').querySelector('.nav__text');

    allLinks.forEach(item => {
      if (item !== link) {
        //item.style.opacity = nn;
        item.style.opacity = this;
      }
    });
    //logo.style.opacity = nn;
    logo.style.opacity = this;
    //logoText.style.opacity = nn;
    logoText.style.opacity = this;
  }
};

nav.addEventListener('mouseover', navLinksHoverAnimation.bind(0.5));
nav.addEventListener('mouseout', navLinksHoverAnimation.bind(1));

// nav.addEventListener('mouseover', (e) => navLinksHoverAnimation(e, 0.5));
// nav.addEventListener('mouseout', (e) => navLinksHoverAnimation(e, 1));


///////////////////////////////////////
// Sticky navigation

// const section1Coords = section1.getBoundingClientRect();

// window.addEventListener('scroll', () => {
//   console.log('a');
//   if (window.pageYOffset >= section1Coords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });


///////////////////////////////////////
// Sticky navigation - Intersection Observer AP
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const getStickyNav = function(entries) {
  const entry = entries[0];
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }

};

const observerHeader = new IntersectionObserver(getStickyNav, {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0,
});

observerHeader.observe(header);


///////////////////////////////////////////////
// Появление частей сайта
const allSections = document.querySelectorAll('.section');

const showSection = function(entries, observer) {
  const entry  = entries[0];
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  }
};

const sectionObserver = new IntersectionObserver(showSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});


///////////////////////////////////////////////
// Имплементация lazy loading для изображений

const lazyImgs = document.querySelectorAll('img[data-src]');

const loadImgs = function(entries, observer) {
  const entry = entries[0];
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src; //замена img

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const lazyImagesObserver = new IntersectionObserver(loadImgs, {
  root: null,
  threshold: 0.9,
  //rootMargin: '300px', // для прогрузки заранее
});

lazyImgs.forEach(image => lazyImagesObserver.observe(image));


/////////////////////////////////////////////
//Создание слайдера
const slides = document.querySelectorAll('.slide');
const btnPrev = document.querySelector('.slider__btn--left');
const btnNext = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currentSlide = 0;

const createDots = function() {
  slides.forEach((_, index) => {
    dotContainer.insertAdjacentHTML('beforeend', 
    `<button class="dots__dot" data-slide="${index}"></button>`);
  });
};
createDots();

const activeteCurrentDot = function(slide) {
  const dots = document.querySelectorAll('.dots__dot');
  dots.forEach(dot => dot.classList.remove('dots__dot--active'));
  dots[slide].classList.add('dots__dot--active');
};
activeteCurrentDot(0);

const moveToSlide = function(slideNum) {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${(index - slideNum) * 100}%)`;
  });
};
moveToSlide(0);

const nextSlide = function() {
  if (currentSlide == slides.length - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  moveToSlide(currentSlide);
  activeteCurrentDot(currentSlide)
};

const prevSlide = function() {
  if (currentSlide == 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide--;
  }
  moveToSlide(currentSlide);
  activeteCurrentDot(currentSlide)
};

btnNext.addEventListener('click', nextSlide);
btnPrev.addEventListener('click', prevSlide);

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

dotContainer.addEventListener('click', (e) => {
  if (e.target && e.target.matches('.dots__dot')) {
    const slide = e.target.dataset.slide;
    currentSlide = slide;
    moveToSlide(slide);
    activeteCurrentDot(currentSlide);
  }
});
