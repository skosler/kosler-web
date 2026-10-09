(function(){
  'use strict';

  function initMobileMenu(){
    var header=document.querySelector('header.nav,.nav');
    var menu=header&&header.querySelector('.nav-links');
    if(!header||!menu)return;
    function markActive(){var current=location.pathname.replace(/\/$/,'')||'/';var hash=location.hash;menu.querySelectorAll('a').forEach(function(a){var url=new URL(a.href,location.origin);var path=url.pathname.replace(/\/$/,'')||'/';var active=path===current&&(url.hash?url.hash===hash:(!hash||current!=='/'));a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});var ecosystem=menu.querySelector('.eco-menu');if(ecosystem)ecosystem.querySelector('summary').classList.toggle('active',!!ecosystem.querySelector('a.active'))}
    markActive();window.addEventListener('hashchange',markActive);

    if(!menu.id)menu.id='kosler-mobile-menu';

    var burger=header.querySelector('.burger');
    if(!burger){
      burger=document.createElement('button');
      burger.type='button';
      burger.className='burger';
      burger.dataset.koslerGenerated='true';
      burger.innerHTML='<span></span><span></span><span></span>';
      (header.querySelector('.nav-in,.nav-inner')||header).appendChild(burger);
    }

    burger.type='button';
    burger.setAttribute('aria-controls',menu.id);
    burger.setAttribute('aria-expanded','false');
    burger.setAttribute('aria-label','Abrir menú');

    var backdrop=document.createElement('button');
    backdrop.type='button';
    backdrop.className='kosler-menu-backdrop';
    backdrop.setAttribute('aria-label','Cerrar menú');
    document.body.appendChild(backdrop);

    var inertElements=[];
    function setOpen(open,restoreFocus){
      if(open&&window.innerWidth<=1100){Array.from(document.body.children).forEach(function(el){if(el!==header&&el!==backdrop&&!el.contains(header)&&!['SCRIPT','STYLE','LINK'].includes(el.tagName)&&!el.inert){el.inert=true;inertElements.push(el)}});setTimeout(function(){var first=menu.querySelector('a,summary');if(first)first.focus()},0)}else{inertElements.forEach(function(el){el.inert=false});inertElements=[]}

      menu.classList.toggle('open',open);
      header.classList.toggle('kosler-menu-active',open);
      document.body.classList.toggle('kosler-menu-open',open);
      backdrop.classList.toggle('open',open);
      burger.setAttribute('aria-expanded',String(open));
      burger.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
      if(!open&&restoreFocus)burger.focus();
    }

    function closeDetails(){
      menu.querySelectorAll('details[open]').forEach(function(details){
        details.removeAttribute('open');
      });
    }

    burger.addEventListener('click',function(){
      setOpen(!menu.classList.contains('open'),false);
    });
    backdrop.addEventListener('click',function(){setOpen(false,true)});
    menu.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click',function(){closeDetails();setOpen(false,false)});
    });
    document.addEventListener('click',function(event){
      if(!header.contains(event.target))closeDetails();
    });
    document.addEventListener('keydown',function(event){
      if(event.key==='Tab'&&menu.classList.contains('open')&&window.innerWidth<=1100){var items=Array.from(header.querySelectorAll('a,button,summary')).filter(function(el){return el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden'}),first=items[0],last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}
      if(event.key==='Escape'){
        closeDetails();
        if(menu.classList.contains('open'))setOpen(false,true);
      }
    });
    window.addEventListener('resize',function(){
      if(window.innerWidth>1100&&menu.classList.contains('open'))setOpen(false,false);
    },{passive:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initMobileMenu);
  else initMobileMenu();
})();
