(function(){
  var d=document,root=d.documentElement,EMAIL='villanaturaresidenciasenior@gmail.com';
  root.classList.remove('sem-js');
  function guardar(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  function ler(k){try{return localStorage.getItem(k)}catch(e){return null}}

  /* tema */
  var t=ler('vn-tema'); if(t==='dark'||t==='light') root.setAttribute('data-theme',t);
  d.addEventListener('click',function(e){
    var b=e.target.closest('.tema'); if(!b) return;
    var escuro=root.getAttribute('data-theme')==='dark'||(!root.getAttribute('data-theme')&&matchMedia('(prefers-color-scheme: dark)').matches);
    var novo=escuro?'light':'dark'; root.setAttribute('data-theme',novo); guardar('vn-tema',novo);
  });

  /* menu */
  var topo=d.querySelector('.topo');
  d.addEventListener('click',function(e){
    var b=e.target.closest('.menu-btn');
    if(b){var ab=topo.classList.toggle('menu-aberto');b.setAttribute('aria-expanded',ab);return}
    if(e.target.closest('.nav a')){topo.classList.remove('menu-aberto');var m=d.querySelector('.menu-btn');if(m)m.setAttribute('aria-expanded','false')}
  });
  function sombra(){topo&&topo.classList.toggle('rolou',scrollY>8)}
  addEventListener('scroll',sombra,{passive:true});sombra();

  /* revelar e gráficos */
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){
    es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('visivel');io.unobserve(en.target)}})
  },{threshold:.18,rootMargin:'0px 0px -40px 0px'}):null;
  function observar(ctx){
    (ctx||d).querySelectorAll('.revela:not(.visivel),.mes:not(.visivel),.aneis:not(.visivel)').forEach(function(el){io?io.observe(el):el.classList.add('visivel')});
  }

  /* abertura */
  function abrir(ctx){
    var f=(ctx||d).querySelector('.fachada'); if(!f||f.classList.contains('aberta')) return;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){f.classList.add('aberta');return}
    requestAnimationFrame(function(){setTimeout(function(){f.classList.add('aberta')},250)});
  }

  /* quartos */
  d.addEventListener('click',function(e){
    var b=e.target.closest('.separadores button'); if(!b) return;
    var grupo=b.closest('[data-quartos]');
    grupo.querySelectorAll('.separadores button').forEach(function(x){x.setAttribute('aria-selected',x===b);x.tabIndex=x===b?0:-1});
    grupo.querySelectorAll('.quartos-fotos figure').forEach(function(f){f.classList.toggle('ativo',f.dataset.q===b.dataset.q&&f.dataset.n==='1')});
    grupo.querySelectorAll('.painel-texto').forEach(function(p){p.hidden=p.dataset.q!==b.dataset.q});
    var dois=grupo.querySelector('figure[data-q="'+b.dataset.q+'"][data-n="2"] img'),sg=grupo.querySelector('.quartos-fotos .seg img');
    if(dois&&sg)sg.src=dois.currentSrc||dois.src;
  });
  d.addEventListener('keydown',function(e){
    var b=e.target.closest&&e.target.closest('.separadores button'); if(!b) return;
    if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft') return;
    var bs=[].slice.call(b.parentNode.children),i=bs.indexOf(b)+(e.key==='ArrowRight'?1:-1);
    i=(i+bs.length)%bs.length; bs[i].focus(); bs[i].click();
  });
  d.addEventListener('click',function(e){
    var s=e.target.closest('.quartos-fotos .seg'); if(!s) return;
    var box=s.closest('.quartos-fotos'),at=box.querySelector('figure.ativo'),q=at.dataset.q,n=at.dataset.n==='1'?'2':'1';
    box.querySelectorAll('figure').forEach(function(f){f.classList.toggle('ativo',f.dataset.q===q&&f.dataset.n===n)});
    var outra=box.querySelector('figure[data-q="'+q+'"]:not([data-n="'+n+'"]) img');
    s.querySelector('img').src=outra.currentSrc||outra.src;
  });

  /* galeria em ecrã inteiro */
  var ecra,lista=[],idx=0,x0=null;
  function mostrar(){var a=lista[idx];ecra.querySelector('img').src=a.getAttribute('href');ecra.querySelector('img').alt=a.dataset.leg||'';ecra.querySelector('p').textContent=(a.dataset.leg||'')+'  ·  '+(idx+1)+' de '+lista.length}
  function fechar(){ecra.classList.remove('aberto');d.body.style.overflow=''}
  d.addEventListener('click',function(e){
    var a=e.target.closest('.galeria a'); if(!a) return; e.preventDefault();
    ecra=ecra||d.querySelector('.ecra'); lista=[].slice.call(a.closest('.pagina,main').querySelectorAll('.galeria a')); idx=lista.indexOf(a);
    mostrar(); ecra.classList.add('aberto'); d.body.style.overflow='hidden'; ecra.querySelector('.fechar').focus();
  });
  d.addEventListener('click',function(e){
    if(!ecra||!ecra.classList.contains('aberto')) return;
    if(e.target.closest('.fechar')||e.target===ecra) fechar();
    else if(e.target.closest('.ant')){idx=(idx-1+lista.length)%lista.length;mostrar()}
    else if(e.target.closest('.seg')){idx=(idx+1)%lista.length;mostrar()}
  });
  d.addEventListener('keydown',function(e){
    if(!ecra||!ecra.classList.contains('aberto')) return;
    if(e.key==='Escape') fechar();
    if(e.key==='ArrowLeft'){idx=(idx-1+lista.length)%lista.length;mostrar()}
    if(e.key==='ArrowRight'){idx=(idx+1)%lista.length;mostrar()}
  });
  d.addEventListener('touchstart',function(e){if(ecra&&ecra.classList.contains('aberto'))x0=e.touches[0].clientX},{passive:true});
  d.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>50){idx=(idx+(dx<0?1:-1)+lista.length)%lista.length;mostrar()}});

  /* formulários: Netlify Forms; fora do Netlify abre o email */
  d.addEventListener('submit',function(e){
    var f=e.target; if(!f.matches('form[data-netlify]')) return; e.preventDefault();
    var dados=new FormData(f),corpo=new URLSearchParams(dados).toString();
    var caixa=f.closest('.formulario'),btn=f.querySelector('button[type=submit]');btn.disabled=true;
    function porEmail(){
      var linhas=[];dados.forEach(function(v,k){if(k!=='form-name'&&k!=='bot-field'&&v)linhas.push(f.querySelector('[name="'+k+'"]').dataset.rotulo+': '+v)});
      location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent(f.dataset.assunto||'Contacto pelo site')+'&body='+encodeURIComponent(linhas.join('\n'));
      caixa.classList.add('enviado');btn.disabled=false;
    }
    if(location.protocol==='file:'||window.PREVIA){caixa.classList.add('enviado');btn.disabled=false;return}
    fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:corpo})
      .then(function(r){if(!r.ok)throw 0;caixa.classList.add('enviado');btn.disabled=false})
      .catch(porEmail);
  });

  /* cookies e mapa */
  var cx=d.querySelector('.cookies');
  function aplicarMapa(){
    d.querySelectorAll('.mapa[data-src]').forEach(function(m){
      if(ler('vn-cookies')==='todos'&&!m.querySelector('iframe')){var i=d.createElement('iframe');i.src=m.dataset.src;i.title='Mapa da Villa Natura';i.loading='lazy';i.referrerPolicy='no-referrer-when-downgrade';m.appendChild(i)}
    });
  }
  d.addEventListener('click',function(e){
    var b=e.target.closest('[data-cookies]'); if(!b) return;
    var v=b.dataset.cookies;
    if(v==='abrir'){e.preventDefault();cx.classList.add('mostrar');return}
    guardar('vn-cookies',v);cx.classList.remove('mostrar');aplicarMapa();
  });
  aplicarMapa();

  /* prévia num ficheiro só: navegação por hash */
  function rota(){
    var h=decodeURIComponent(location.hash.slice(1))||'inicio',ps=d.querySelectorAll('.pagina'),alvo=null;
    ps.forEach(function(p){if(p.dataset.slug===h)alvo=p});
    if(!alvo){var s=d.getElementById(h);if(s){var pg=s.closest('.pagina');if(pg&&pg.hidden){ps.forEach(function(p){p.hidden=p!==pg});abrir(pg);observar(pg)}return}alvo=d.querySelector('.pagina[data-slug="404"]')}
    ps.forEach(function(p){p.hidden=p!==alvo});
    d.title=alvo.dataset.titulo;scrollTo(0,0);
    var sec=alvo.dataset.sec;
    d.querySelectorAll('.nav a').forEach(function(a){if(a.dataset.sec===sec)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    abrir(alvo);observar(alvo);aplicarMapa();
  }
  if(window.PREVIA){addEventListener('hashchange',rota);rota()}else{abrir();observar()}
})();
