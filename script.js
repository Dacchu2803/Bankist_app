'use strict';

///////////////////////////////////////
// Modal window
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const contents = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('.section');

const openModal = function (e) {
  //to disable default behaviour of anchor tag which has href=# need it
  e.preventDefault(); 
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click',openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

 btnScrollTo.addEventListener('click',(e)=>{
  section1.scrollIntoView({behavior:'smooth'});
 });

//page-nav
// document.querySelectorAll('.nav__link').forEach((elmnt)=>{
//   elmnt.addEventListener('click',function(e){
//     e.preventDefault();
//     const id = e.target.getAttribute('href');
//     document.querySelector(id).scrollIntoView({behavior:'smooth'});
//   });
//   });


  //Above same thing done using event delegation
  //1. Add event listener to common parent element
  //2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click',function(e){
  e.preventDefault();
  //matching strategy
  if(e.target.classList.contains('nav__link')&&!e.target.classList.contains('nav__link--btn')){
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
  }
});

//Tabbed component


//Event delegation
tabContainer.addEventListener('click',function(e){
  const clicked = e.target.closest('.operations__tab');
  
  //Guard clause
  if(!clicked) return;

  //remove active class
  tabs.forEach((t)=>t.classList.remove('operations__tab--active'));
  contents.forEach((c)=>c.classList.remove('operations__content--active'));

  //activate tabs
  clicked.classList.add('operations__tab--active');

  //activate content area
 document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

//Menu Fade animation
const handlerHover = function(e){
  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach((el)=>{
      if(el!==link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
} 

//passing argument into handler
nav.addEventListener('mouseover',handlerHover.bind(0.5));
nav.addEventListener('mouseout',handlerHover.bind(1));


//adding sticky class using scroll
// const sectionCords = section1.getBoundingClientRect();
// console.log(sectionCords);
// window.addEventListener('scroll',function(){
//   //console.log(window.scrollY);
//   if(window.scrollY>sectionCords.top)
//     nav.classList.add('sticky');
//   else
//   nav.classList.remove('sticky');
// });


//Intersection Observer web API
// const observCallFun = function(entries){
//   entries.forEach(entry => console.log(entry));
// };

// const obsOpt = {
//   root : null,
//   threshold : 0.1
// };

// const observer = new IntersectionObserver(observCallFun,obsOpt);
// observer.observe(section1); 

const navHeight = nav.getBoundingClientRect().height;
const obsCallFn = function(entries){
  const [entry] = entries;
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const observer = new IntersectionObserver(obsCallFn,{
  root : null,
  threshold : 0,
  rootMargin : `-${navHeight}px`
});

observer.observe(header);


//Revealing elements on scroll

const revealSection = function(entries,observer){
  entries.forEach(entry=>{
  if(!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
  });
};

const sectionObserver = new IntersectionObserver(revealSection,{
  root:null,
  threshold : 0.15 
});

sections.forEach(function(section){
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//lazy image loading
const targImgs = document.querySelectorAll('img[data-src]');
const revealImg = function(entries,observer){
  const [entry] = entries;
  if(!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load',function(){
    entry.target.classList.remove('lazy-img');
  });
  
  observer.unobserve(entry.target);

}
const imgObs = new IntersectionObserver(revealImg,{
  root : null,
  threshold : 0,
  rootMargin : '200px'
});

targImgs.forEach(img=>imgObs.observe(img));


//building slider

const slider = function(){

      let currSlide = 0;
      const slides = document.querySelectorAll('.slide');
      const noOfSlides = slides.length;
      const dotContainer = document.querySelector('.dots');
      const btnRight = document.querySelector('.slider__btn--right');
      const btnLeft = document.querySelector('.slider__btn--left');

//functions
const creatingDots = function(){
  slides.forEach((_,i)=>{
    dotContainer.insertAdjacentHTML('beforeend',
      `<button class="dots__dot" data-slide="${i}">
      </button>`);
  });
}
creatingDots();

const activateDot = function(slide){
  document.querySelectorAll('.dots__dot').forEach((dot)=>{
    dot.classList.remove('dots__dot--active');
  });

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}

const goToSlide = function(currSlide){
  slides.forEach((slide,i)=>slide.style.transform = `translateX(${(i-currSlide)*100}%)`);
}

const nextSlide = function(){
    if(currSlide===noOfSlides-1){
      currSlide = 0;
    }else{
    currSlide++;
    }
    goToSlide(currSlide);
    activateDot(currSlide);
}

const prevSlide = function(){
  if(currSlide===0) currSlide = noOfSlides-1;
  else currSlide--;
  goToSlide(currSlide);
  activateDot(currSlide);
}

const init = function(){
  activateDot(0);
  goToSlide(0);
}

init();

btnRight.addEventListener('click',nextSlide);

btnLeft.addEventListener('click',prevSlide);

document.addEventListener('keydown',function(e){
  if(e.key==='ArrowLeft') prevSlide();
  e.key==='ArrowRight'&&nextSlide(); //short ciruciting
  
});

dotContainer.addEventListener('click',function(e){
  if(e.target.classList.contains('dots__dot')){
    const {slide} = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
  
});
}
slider();


// //creating element
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML= 'We use cookies for improved functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>';
// //inserting element
// header.append(message);
// document.querySelector('.btn--close--cookie').addEventListener('click',function(){
//   //removing element
//   message.remove();
//   //message.parentElement.removeChild(message);
// });

// const section1 = document.querySelector('#section--1');
// btnScrollTo.addEventListener('click',(e)=>{
//   const s1coords = section1.getBoundingClientRect();
//   // console.log('s1coords',s1coords);
//   // console.log(e.target.getBoundingClientRect());
//   // console.log('Current Scroll (x/Y):',window.scrollX,window.scrollY);
//   // console.log('height/width viewport',document.documentElement.clientHeight,document.documentElement.clientWidth);
//   //window.scrollTo(s1coords.left+window.scrollX,s1coords.top+window.scrollY);
//   // window.scrollTo({
//   //   left : s1coords.left+window.scrollX,
//   //   top : s1coords.top+window.scrollY,
//   //   behavior : 'smooth'
//   // });
//   section1.scrollIntoView({behavior:'smooth'});
// });


// //event propagation
// /*All are working with the same event but working in different phases
// 'nav' element works in capturing phase while 'nav-links' and 'nav-link' works in bubbling phase.
// As 3rd argument as 'true' is passed only in '.nav' addEventListener so..
// */

// const randInt = (min,max)=>Math.floor(Math.random()*(max-min+1)+min);
// const randomCol = ()=>`rgb(${randInt(0,255)},${randInt(0,255)},${randInt(0,255)})`;
// document.querySelector('.nav__link').addEventListener('click',(e)=>{
//     e.target.style.backgroundColor = randomCol();
//     //e.stopPropagation();
//     console.log(e.target,e.currentTarget);
// });

// document.querySelector('.nav__links').addEventListener('click',function(e){
//   this.style.backgroundColor = randomCol();
//   console.log(e.target,e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click',function(e){
//   this.style.backgroundColor = randomCol();
//   console.log(e.target,e.currentTarget);
// },true);