(function(){
  // menu mobilne
  var burger=document.getElementById('burger'),menu=document.getElementById('menu');
  function zamknij(){menu.classList.remove('otw');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');}
  burger.addEventListener('click',function(){
    var otw=menu.classList.toggle('otw');
    burger.setAttribute('aria-expanded',otw?'true':'false');
    burger.setAttribute('aria-label',otw?'Zamknij menu':'Otwórz menu');
  });
  menu.addEventListener('click',function(e){if(e.target.tagName==='A')zamknij();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij();});

  // aktywna pozycja menu
  var linki=[].slice.call(menu.querySelectorAll('a'));
  var sekcje=linki.map(function(a){return document.querySelector(a.getAttribute('href'));});
  function aktywna(){
    var y=window.scrollY+window.innerHeight*0.35,akt=-1;
    sekcje.forEach(function(s,i){if(s&&s.offsetTop<=y)akt=i;});
    linki.forEach(function(a,i){a.classList.toggle('akt',i===akt);if(i===akt)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
  }
  window.addEventListener('scroll',aktywna,{passive:true});aktywna();

  // dolny pasek po przewinieciu za przycisk w hero
  var mob=document.getElementById('mob'),cta=document.querySelector('.hero .btn');
  if(mob&&cta&&'IntersectionObserver' in window){
    new IntersectionObserver(function(w){
      var e=w[0];mob.classList.toggle('widac',!e.isIntersecting&&e.boundingClientRect.top<0);
    }).observe(cta);
  }

  // galerie: palec (natywny scroll), mysz (przeciaganie), strzalki, licznik
  var strz='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 2L4 8l6 6" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>';
  [].slice.call(document.querySelectorAll('[data-galeria]')).forEach(function(g){
    var tor=g.querySelector('.tor'),el=[].slice.call(tor.children);
    if(el.length<2)return;
    var nav=document.createElement('div');nav.className='gal-nav';
    nav.innerHTML='<button type="button" aria-label="Poprzednie">'+strz+'</button><span class="gal-licz" aria-live="polite"></span><button type="button" aria-label="Następne" style="transform:scaleX(-1)">'+strz+'</button>';
    g.appendChild(nav);
    var bP=nav.children[0],licz=nav.children[1],bN=nav.children[2];
    function krok(){return el[0].getBoundingClientRect().width+(parseFloat(getComputedStyle(tor).columnGap)||0);}
    function idx(){return Math.round(tor.scrollLeft/krok());}
    function odswiez(){
      var max=tor.scrollWidth-tor.clientWidth-2,i=Math.min(idx(),el.length-1);
      var widoczne=Math.max(1,Math.round(tor.clientWidth/krok()));
      licz.textContent=(tor.scrollLeft>=max?el.length:Math.min(i+1,el.length))+' / '+el.length;
      if(widoczne>1)licz.textContent=Math.min(i+widoczne,el.length)+' / '+el.length;
      bP.disabled=tor.scrollLeft<=2;bN.disabled=tor.scrollLeft>=max;
    }
    bP.addEventListener('click',function(){tor.scrollBy({left:-krok(),behavior:'smooth'});});
    bN.addEventListener('click',function(){tor.scrollBy({left:krok(),behavior:'smooth'});});
    tor.addEventListener('scroll',function(){window.requestAnimationFrame(odswiez);},{passive:true});
    window.addEventListener('resize',odswiez);
    tor.setAttribute('tabindex','0');
    tor.addEventListener('keydown',function(e){
      if(e.key==='ArrowRight'){e.preventDefault();bN.click();}
      if(e.key==='ArrowLeft'){e.preventDefault();bP.click();}
    });
    // przeciaganie mysza
    var x0=0,s0=0,ciag=false,ruch=false;
    tor.addEventListener('pointerdown',function(e){
      if(e.pointerType!=='mouse'||e.button!==0)return;
      ciag=true;ruch=false;x0=e.clientX;s0=tor.scrollLeft;
    });
    window.addEventListener('pointermove',function(e){
      if(!ciag)return;
      var dx=e.clientX-x0;
      if(Math.abs(dx)>4){ruch=true;tor.classList.add('ciag');}
      if(ruch){tor.scrollLeft=s0-dx;e.preventDefault();}
    });
    window.addEventListener('pointerup',function(){
      if(!ciag)return;ciag=false;
      if(ruch){
        var k=krok(),cel=Math.round(tor.scrollLeft/k)*k;
        tor.classList.remove('ciag');
        tor.scrollTo({left:cel,behavior:'smooth'});
      }
    });
    tor.addEventListener('click',function(e){if(ruch){e.preventDefault();e.stopPropagation();ruch=false;}},true);
    odswiez();
  });

  // formularz pokazowy
  var f=document.getElementById('formularz'),info=document.getElementById('form-info');
  f.addEventListener('submit',function(e){e.preventDefault();info.hidden=false;});
})();
