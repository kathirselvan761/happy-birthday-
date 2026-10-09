// ---- typewriter ----
(function(){
  const el=document.getElementById('typewriter');
  if(!el) return;
  const phrases=[
    'Happy Birthday, THAGAMEYYYY 💖',
    'To My Dearest & Closest Friend 🌸',
    'Forever Friends & Unbreakable Bond ✨',
    'Have The Best Birthday Ever 🌙'
  ];
  let p=0;
  async function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
  async function cycle(){
    const text=phrases[p%phrases.length];
    for(let i=1;i<=text.length;i++){el.textContent=text.slice(0,i);await sleep(70+Math.random()*40);}
    await sleep(1400);
    for(let i=text.length;i>=0;i--){el.textContent=text.slice(0,i);await sleep(35+Math.random()*20);}
    await sleep(300);
    p++;
  }
  (async function loop(){while(true){await cycle();}})();
})();

// ---- multi-photo gallery & lightbox ----
(function(){
  const photos = [
    { src: 'img/WhatsApp Image 2026-10-09 at 11.33.36 PM.jpeg', caption: 'Unforgettable Memories 🌟' },
    { src: 'img/WhatsApp Image 2026-10-09 at 11.33.38 PM.jpeg', caption: 'Crazy Moments 🤪' },
    { src: 'img/WhatsApp Image 2026-10-09 at 11.33.39 PM.jpeg', caption: 'Forever Friends 💖' },
    { src: 'img/WhatsApp Image 2026-10-09 at 11.33.39 PM (1).jpeg', caption: 'Happiness & Laughter ✨' },
    { src: 'img/WhatsApp Image 2026-10-09 at 11.33.39 PM (2).jpeg', caption: 'Best Times Together 🌸' },
    { src: 'img/WhatsApp Image 2026-10-09 at 11.33.40 PM.jpeg', caption: 'Unbreakable Bond 🤝' },
    { src: 'img/WhatsApp Image 2026-10-09 at 11.33.40 PM (1).jpeg', caption: 'Sweet Smiles 😊' },
    { src: 'img/WhatsApp Image 2026-10-09 at 11.33.40 PM (2).jpeg', caption: 'Late Night Conversations 🌙' },
    { src: 'img/WhatsApp Image 2026-10-09 at 11.33.41 PM.jpeg', caption: 'True Friendship 💕' },
    { src: 'img/WhatsApp Image 2026-10-09 at 11.33.42 PM.jpeg', caption: 'Precious Memories 📸' },
    { src: 'img/WhatsApp Image 2026-10-09 at 11.33.43 PM.jpeg', caption: 'Making Memories 🌺' },
    { src: 'img/WhatsApp Image 2026-10-09 at 11.33.43 PM (1).jpeg', caption: 'Side by Side 💖' },
    { src: 'img/WhatsApp Image 2026-10-09 at 11.33.44 PM.jpeg', caption: 'Pure Joy & Fun 🎉' },
    { src: 'img/WhatsApp Image 2026-10-09 at 11.33.44 PM (1).jpeg', caption: 'Soulmates & Friends 💫' },
    { src: 'img/WhatsApp Image 2026-10-09 at 11.33.44 PM (2).jpeg', caption: 'Golden Days ✨' },
    { src: 'img/1.jpg', caption: 'Special Memory #1 🌸' },
    { src: 'img/2.jpg', caption: 'Special Memory #2 ⭐' },
    { src: 'img/3.jpg', caption: 'Special Memory #3 💖' },
    { src: 'img/4.jpg', caption: 'Special Memory #4 🌟' }
  ];

  let currentIndex = 0;
  let autoplayTimer = null;

  const mainImg = document.getElementById('mainGalleryImg');
  const mainCard = document.getElementById('galleryMainCard');
  const captionEl = document.getElementById('activePhotoCaption');
  const counterEl = document.getElementById('photoCounter');
  const prevBtn = document.getElementById('prevImg');
  const nextBtn = document.getElementById('nextImg');
  const playBtn = document.getElementById('playPauseBtn');
  const thumbStrip = document.getElementById('thumbnailStrip');
  const expandBtn = document.getElementById('expandPhotoBtn');

  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightboxBtn = document.getElementById('closeLightboxBtn');

  if(!mainImg) return;

  function initThumbnails(){
    if(!thumbStrip) return;
    thumbStrip.innerHTML = '';
    photos.forEach((photo, idx) => {
      const item = document.createElement('div');
      item.className = `thumb-item ${idx === currentIndex ? 'active' : ''}`;
      item.dataset.index = idx;

      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.caption;
      img.onerror = () => { item.style.display = 'none'; };

      item.appendChild(img);
      item.addEventListener('click', () => {
        goToPhoto(idx);
      });
      thumbStrip.appendChild(item);
    });
  }

  function updateGallery(dir = 1){
    const photo = photos[currentIndex];
    
    // Smooth directional slide transition (move one by one)
    mainImg.style.transition = 'transform 0.2s ease-in, opacity 0.2s ease-in';
    mainImg.style.transform = `translateX(${dir * -70}px) scale(0.95)`;
    mainImg.style.opacity = '0';

    setTimeout(() => {
      mainImg.src = photo.src;
      mainImg.style.transform = `translateX(${dir * 70}px) scale(0.95)`;
      
      requestAnimationFrame(() => {
        mainImg.style.transition = 'transform 0.38s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.38s ease-out';
        mainImg.style.transform = 'translateX(0) scale(1)';
        mainImg.style.opacity = '1';
      });
    }, 180);

    if(captionEl) captionEl.textContent = photo.caption;
    if(counterEl) counterEl.textContent = `Photo ${currentIndex + 1} of ${photos.length}`;

    // Update thumbnails and scroll active thumbnail smoothly into view
    if(thumbStrip){
      const items = thumbStrip.querySelectorAll('.thumb-item');
      items.forEach((item, idx) => {
        if(idx === currentIndex){
          item.classList.add('active');
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  function goToPhoto(idx, dir = 1){
    currentIndex = (idx + photos.length) % photos.length;
    updateGallery(dir);
  }

  function nextPhoto(){
    goToPhoto(currentIndex + 1, 1);
  }

  function prevPhoto(){
    goToPhoto(currentIndex - 1, -1);
  }

  function toggleAutoplay(){
    if(autoplayTimer){
      clearInterval(autoplayTimer);
      autoplayTimer = null;
      if(playBtn) playBtn.textContent = '▶ Play';
    } else {
      nextPhoto();
      autoplayTimer = setInterval(nextPhoto, 3000);
      if(playBtn) playBtn.textContent = '⏸ Pause';
    }
  }

  function openLightbox(){
    if(!lightboxModal || !lightboxImg) return;
    const photo = photos[currentIndex];
    lightboxImg.src = photo.src;
    if(lightboxCaption) lightboxCaption.textContent = photo.caption;
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox(){
    if(lightboxModal){
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
    }
  }

  if(prevBtn) prevBtn.addEventListener('click', prevPhoto);
  if(nextBtn) nextBtn.addEventListener('click', nextPhoto);
  if(playBtn) playBtn.addEventListener('click', toggleAutoplay);
  if(expandBtn) expandBtn.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(); });
  if(mainCard) mainCard.addEventListener('click', openLightbox);

  if(closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
  if(lightboxModal){
    lightboxModal.addEventListener('click', (e) => {
      if(e.target === lightboxModal) closeLightbox();
    });
  }

  // Swipe support
  let touchStartX = 0;
  if(mainCard){
    mainCard.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    mainCard.addEventListener('touchend', e => {
      const touchEndX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : 0;
      const diff = touchEndX - touchStartX;
      if(Math.abs(diff) > 45){
        diff < 0 ? nextPhoto() : prevPhoto();
      }
    });
  }

  document.addEventListener('keydown', e => {
    if(e.key === 'ArrowRight') nextPhoto();
    if(e.key === 'ArrowLeft') prevPhoto();
    if(e.key === 'Escape') closeLightbox();
  });

  initThumbnails();
  updateGallery();
})();

// ---- flip card + sparkle burst ----
(function(){
  const card=document.getElementById('card');
  const btn=document.getElementById('toggleButton');
  const container=document.getElementById('cardContainer');
  if(!card || !container) return;

  function burst(){
    if(typeof confetti!=='function')return;
    const rect=container.getBoundingClientRect();
    confetti({
      particleCount:65,spread:75,startVelocity:30,scalar:.75,
      origin:{x:(rect.left+rect.width/2)/window.innerWidth,y:(rect.top+rect.height/2)/window.innerHeight},
      colors:['#ffb3d9','#c9a7ff','#ffd166','#fff6fb']
    });
  }
  function flip(){card.classList.toggle('flipped');if(card.classList.contains('flipped'))burst();}
  if(btn) btn.addEventListener('click',e=>{e.stopPropagation();flip();});
  container.addEventListener('click',flip);
})();

// ---- sparkles in wish card ----
(function(){
  const box=document.getElementById('sparkles');
  if(!box) return;
  for(let i=0;i<16;i++){
    const s=document.createElement('span');
    s.style.left=Math.random()*100+'%';
    s.style.top=Math.random()*100+'%';
    s.style.animationDelay=(Math.random()*2.6)+'s';
    box.appendChild(s);
  }
})();

// ---- floating CSS petals ----
(function(){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const count=reduced?6:16;
  const colors=['#ffb3d9','#ffd9ec','#ffffff','#ffd166'];
  for(let i=0;i<count;i++){
    const p=document.createElement('div');
    p.className='petal-css';
    const size=6+Math.random()*7;
    p.style.left=Math.random()*100+'vw';
    p.style.width=size+'px';
    p.style.height=size*1.3+'px';
    p.style.background=colors[i%colors.length];
    p.style.animationDuration=(9+Math.random()*10)+'s';
    p.style.animationDelay=(-Math.random()*18)+'s';
    document.body.appendChild(p);
  }
})();

// ---- SPECIAL SURPRISE MODAL & CONFETTI ----
(function(){
  const surpriseBtn = document.getElementById('surpriseBtn');
  const modal = document.getElementById('surpriseModal');
  const closeBtn = document.getElementById('closeModalBtn');

  function spawnHearts(){
    const heartSymbols = ['💖', '🌸', '✨', '💕', '🎂', '🌟'];
    for(let i=0; i<24; i++){
      setTimeout(()=>{
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartSymbols[Math.floor(Math.random()*heartSymbols.length)];
        heart.style.left = (Math.random()*90 + 5) + 'vw';
        heart.style.fontSize = (Math.random()*1.5 + 1.2) + 'rem';
        heart.style.animationDuration = (Math.random()*2 + 3) + 's';
        document.body.appendChild(heart);
        setTimeout(()=>heart.remove(), 4500);
      }, i * 120);
    }
  }

  function launchConfettiCelebration(){
    if(typeof confetti !== 'function') return;
    // Multi-burst confetti
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ffb3d9', '#ffd9ec', '#c9a7ff', '#ffd166', '#ffffff']
    });
    setTimeout(()=>{
      confetti({
        particleCount: 70,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffb3d9', '#ffd166']
      });
      confetti({
        particleCount: 70,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#c9a7ff', '#ffffff']
      });
    }, 350);
  }

  if(surpriseBtn && modal){
    surpriseBtn.addEventListener('click', ()=>{
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      launchConfettiCelebration();
      spawnHearts();
    });
  }

  function closeModal(){
    if(modal){
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  if(modal){
    modal.addEventListener('click', (e)=>{
      if(e.target === modal) closeModal();
    });
  }
})();

// ---- 3D pointer tilt ----
(function(){
  const els=document.querySelectorAll('.tilt');
  if(!els.length)return;
  const isTouch=window.matchMedia('(hover: none)').matches;
  els.forEach((el,idx)=>{
    if(!isTouch){
      el.addEventListener('pointermove',e=>{
        const r=el.getBoundingClientRect();
        const px=(e.clientX-r.left)/r.width-0.5;
        const py=(e.clientY-r.top)/r.height-0.5;
        el.style.transform=`perspective(900px) rotateY(${px*14}deg) rotateX(${-py*14}deg) scale(1.02)`;
      });
      el.addEventListener('pointerleave',()=>{ el.style.transform=''; });
    }else{
      let t=idx*1.3;
      setInterval(()=>{
        t+=0.04;
        el.style.transform=`perspective(900px) rotateY(${Math.sin(t)*6}deg) rotateX(${Math.cos(t*0.8)*4}deg)`;
      },60);
    }
  });
})();

// ---- scroll reveal ----
(function(){
  const items=document.querySelectorAll('.reveal');
  function show(el){el.classList.add('in');}
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{ if(entry.isIntersecting){ show(entry.target); io.unobserve(entry.target); } });
    },{threshold:0.15,rootMargin:'0px 0px -6% 0px'});
    items.forEach(el=>io.observe(el));
  }else{
    items.forEach(show);
  }
  setTimeout(()=>{items.forEach(el=>{
    const r=el.getBoundingClientRect();
    if(r.top < window.innerHeight+400) show(el);
  });},1200);
// ---- back to top button ----
(function(){
  const topBtn = document.getElementById('backToTopBtn');
  if(!topBtn) return;
  window.addEventListener('scroll', () => {
    if(window.scrollY > 280){
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  });
  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ---- confetti burst on load ----
window.addEventListener('load',()=>{
  if(typeof confetti==='function'){
    confetti({particleCount:160,spread:110,origin:{y:.15},
      colors:['#ffb3d9','#c9a7ff','#ffd166','#fff6fb']});
  }
});
