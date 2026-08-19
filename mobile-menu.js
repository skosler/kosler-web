(function(){
  'use strict';

  function initMobileMenu(){
    var header=document.querySelector('header.nav,.nav');
    var menu=header&&header.querySelector('.nav-links');
    if(!header||!menu)return;

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

    function setOpen(open,restoreFocus){
      menu.classList.toggle('open',open);
      header.classList.toggle('kosler-menu-active',open);
      document.body.classList.toggle('kosler-menu-open',open);
      backdrop.classList.toggle('open',open);
      burger.setAttribute('aria-expanded',String(open));
      burger.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
      if(!open&&restoreFocus)burger.focus();
    }

    burger.addEventListener('click',function(){
      setOpen(!menu.classList.contains('open'),false);
    });
    backdrop.addEventListener('click',function(){setOpen(false,true)});
    menu.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click',function(){setOpen(false,false)});
    });
    document.addEventListener('keydown',function(event){
      if(event.key==='Escape'&&menu.classList.contains('open'))setOpen(false,true);
    });
    window.addEventListener('resize',function(){
      if(window.innerWidth>900&&menu.classList.contains('open'))setOpen(false,false);
    },{passive:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initMobileMenu);
  else initMobileMenu();
})();

