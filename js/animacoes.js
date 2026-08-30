/* =====================================================
   ANIMAÇÕES — GSAP 3 + ScrollTrigger + ScrollToPlugin
   Melhoria progressiva: se o GSAP não carregar (sem
   internet) ou o JS estiver desligado, nada fica
   escondido — o site aparece normalmente.
   ===================================================== */

(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);

  document.documentElement.classList.add('tem-gsap');
  gsap.defaults({ ease: 'power3.out', duration: 0.9 });

  var temST = typeof ScrollTrigger !== 'undefined';
  var topo = document.getElementById('topo');
  var barra = document.querySelector('.topo__barra');
  var menuToggle = document.getElementById('menu-toggle');

  /* ---------- Utilitário: quebra um título em palavras ---------- */
  function dividirPalavras(el) {
    if (!el || el.dataset.dividido) return [];
    var texto = el.textContent.trim();
    el.setAttribute('aria-label', texto);
    el.innerHTML = texto
      .split(/\s+/)
      .map(function (p) {
        return '<span class="palavra" aria-hidden="true"><span class="palavra__in">' + p + '</span></span>';
      })
      .join(' ');
    el.dataset.dividido = '1';
    return el.querySelectorAll('.palavra__in');
  }

  /* =====================================================
     CABEÇALHO: barra cheia no topo → "ilha" ao rolar
     ===================================================== */
  var ilha = null;

  function montarIlha(animar) {
    if (!barra || !temST) return;

    var ehCelular = function () { return window.innerWidth <= 768; };
    var marca = barra.querySelector('.marca');
    var menu = barra.querySelector('.menu');

    /* Largura da ilha no desktop: o que o conteúdo precisa (logo + links + botão),
       com uma folga, limitada à largura da janela. */
    var larguraIlha = function () {
      if (ehCelular()) return window.innerWidth - 24;
      var precisa = marca.offsetWidth + menu.offsetWidth + 22 + 10 + 40 + 24;
      return Math.min(window.innerWidth - 48, Math.max(760, precisa));
    };

    ilha = gsap.timeline({
      paused: true,
      defaults: { duration: animar ? 0.6 : 0, ease: 'power3.inOut' }
    });

    ilha
      .to(barra, {
        width: larguraIlha,
        y: function () { return ehCelular() ? 10 : 14; },
        borderRadius: 40,
        backgroundColor: 'rgba(38, 32, 27, 0.78)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        boxShadow: '0 18px 50px rgba(38, 32, 27, 0.28)'
      }, 0)
      .to('.topo__linha', {
        minHeight: function () { return ehCelular() ? 56 : 58; },
        paddingLeft: function () { return ehCelular() ? 16 : 22; },
        paddingRight: function () { return ehCelular() ? 12 : 10; }
      }, 0)
      .to(menu, {
        gap: function () { return ehCelular() ? 0 : (window.innerWidth < 1100 ? '1rem' : '1.4rem'); },
        fontSize: function () { return ehCelular() ? '1.05rem' : (window.innerWidth < 1100 ? '0.88rem' : '0.95rem'); }
      }, 0)
      .to('.marca, .menu > a:not(.botao)', { color: '#f6f1e8' }, 0)
      .to('.marca__simbolo', { color: '#c8965a', scale: 0.9 }, 0)
      .to('.marca__nome', { scale: 0.9, transformOrigin: 'left center' }, 0)
      .to('.marca__nome em', { color: '#c8965a' }, 0)
      .to('.menu > a.botao', { backgroundColor: '#f6f1e8', borderColor: '#f6f1e8', color: '#26201b' }, 0)
      .to('.menu-botao span', { backgroundColor: '#f6f1e8' }, 0)
      .to('.topo__progresso', { backgroundColor: '#c8965a' }, 0);

    ScrollTrigger.create({
      start: 80,
      end: 'max',
      onToggle: function (self) {
        if (self.isActive) ilha.play(); else ilha.reverse();
      }
    });

    /* Barra de progresso de leitura */
    gsap.to('.topo__progresso', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.4 }
    });

    /* Recalcula a largura da ilha quando a janela muda de tamanho */
    window.addEventListener('resize', function () {
      if (!ilha) return;
      var p = ilha.progress();
      ilha.progress(0);      /* volta ao estado "barra cheia" ... */
      ilha.invalidate();     /* ... para regravar os valores iniciais corretos ... */
      ilha.progress(p);      /* ... e retorna ao ponto em que estava */
    });
  }

  /* ---------- Rolagem suave nos links do menu, abertura e rodapé ---------- */
  function rolagemSuave() {
    if (typeof ScrollToPlugin === 'undefined') return;
    var links = document.querySelectorAll('.menu a[href^="#"], .rodape a[href^="#"], .abertura__acoes a[href^="#"], .marca[href^="#"]');
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var alvo = document.querySelector(a.getAttribute('href'));
        if (!alvo) return;
        e.preventDefault();
        if (menuToggle) menuToggle.checked = false;
        gsap.to(window, {
          scrollTo: { y: alvo, offsetY: 84 },
          duration: 1.1,
          ease: 'power3.inOut'
        });
      });
    });
  }

  var mm = gsap.matchMedia();

  /* =====================================================
     Usuário pediu menos movimento: só o essencial
     ===================================================== */
  mm.add('(prefers-reduced-motion: reduce)', function () {
    montarIlha(false);
  });

  /* =====================================================
     Animações completas
     ===================================================== */
  mm.add('(prefers-reduced-motion: no-preference)', function () {
    montarIlha(true);
    rolagemSuave();

    /* ---------- Abertura ---------- */
    var palavrasH1 = dividirPalavras(document.querySelector('.abertura h1'));

    var intro = gsap.timeline({ defaults: { ease: 'power4.out' } });

    intro
      /* a barra desce de cima e os itens entram em seguida */
      .from(barra, { yPercent: -100, duration: 0.9, ease: 'power3.out' })
      .from('.marca, .menu > a, .menu-botao', {
        y: -10,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.05
      }, 0.35)
      .from(palavrasH1, {
        yPercent: 115,
        rotation: 2,
        transformOrigin: 'left bottom',
        duration: 1.2,
        stagger: 0.05
      }, 0.3)
      .from('.abertura__intro', { y: 28, autoAlpha: 0, duration: 1 }, 0.9)
      .from('.abertura__acoes > *', { y: 20, autoAlpha: 0, duration: 0.8, stagger: 0.12 }, 1.1)
      .from('.abertura__nota', { autoAlpha: 0, duration: 0.6 }, 1.35)
      .from('.abertura__foto', {
        clipPath: 'inset(0 0 100% 0)',
        duration: 1.5,
        ease: 'expo.inOut'
      }, 0.5)
      .from('.abertura__foto img', {
        scale: 1.3,
        duration: 2,
        ease: 'expo.out'
      }, 0.5);

    if (!temST) return;

    /* ---------- Parallax na abertura ---------- */
    gsap.to('.abertura__foto', {
      y: -70,
      ease: 'none',
      scrollTrigger: { trigger: '.abertura', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.abertura__texto', {
      y: 50,
      autoAlpha: 0.15,
      ease: 'none',
      scrollTrigger: { trigger: '.abertura', start: 'top top', end: 'bottom top', scrub: true }
    });

    /* ---------- Títulos das faixas: palavra por palavra ---------- */
    gsap.utils.toArray('.secao__titulo h2, .contato h2').forEach(function (h) {
      var palavras = dividirPalavras(h);
      gsap.from(palavras, {
        yPercent: 110,
        rotation: 3,
        transformOrigin: 'left bottom',
        duration: 1,
        stagger: 0.06,
        ease: 'power4.out',
        scrollTrigger: { trigger: h, start: 'top 88%', once: true }
      });
    });

    gsap.utils.toArray('.secao__apoio').forEach(function (p) {
      gsap.from(p, {
        y: 20,
        autoAlpha: 0,
        delay: 0.2,
        scrollTrigger: { trigger: p, start: 'top 90%', once: true }
      });
    });

    /* ---------- Fotos: revelação de baixo para cima com zoom ---------- */
    gsap.utils.toArray('.sobre__foto img, .trabalho img').forEach(function (img) {
      gsap.from(img, {
        clipPath: 'inset(100% 0 0 0)',
        scale: 1.25,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: img, start: 'top 85%', once: true }
      });
    });

    /* ---------- Números das etapas saltam ---------- */
    gsap.from('.etapa__n', {
      scale: 0,
      rotation: -25,
      duration: 0.9,
      stagger: 0.12,
      ease: 'back.out(2.2)',
      scrollTrigger: { trigger: '.etapas', start: 'top 85%', once: true }
    });

    /* ---------- Blocos de texto em lote ---------- */
    var blocos = gsap.utils.toArray([
      '.sobre__texto p',
      '.fatos li',
      '.trabalho h3',
      '.trabalho p',
      '.regra',
      '.etapas h3',
      '.etapas p',
      '.relato',
      '.contato__texto p',
      '.contato__dados',
      '.formulario > *',
      '.rodape__marca',
      '.rodape__coluna'
    ]);

    gsap.set(blocos, { autoAlpha: 0, y: 30 });

    ScrollTrigger.batch(blocos, {
      start: 'top 90%',
      once: true,
      onEnter: function (lote) {
        gsap.to(lote, {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.07,
          overwrite: true
        });
      }
    });

    /* Linhas divisórias das regras "desenham" da esquerda pra direita */
    gsap.utils.toArray('.regra').forEach(function (r) {
      gsap.from(r, {
        '--linha-escala': 0,
        duration: 1.2,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: r, start: 'top 90%', once: true }
      });
    });

    /* ---------- Depoimentos: a linha lateral cresce ---------- */
    gsap.utils.toArray('.relato').forEach(function (r) {
      gsap.from(r, {
        borderLeftWidth: 0,
        paddingLeft: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: r, start: 'top 88%', once: true }
      });
    });

    /* ---------- Faixa de contato: escurece ao entrar ---------- */
    gsap.from('.contato', {
      backgroundColor: '#f6f1e8',
      ease: 'none',
      scrollTrigger: { trigger: '.contato', start: 'top 95%', end: 'top 35%', scrub: true }
    });

    /* ---------- Campos do formulário: destaque ao focar ---------- */
    gsap.utils.toArray('.campo input, .campo select, .campo textarea').forEach(function (campo) {
      campo.addEventListener('focus', function () {
        gsap.to(campo, { scale: 1.015, duration: 0.3, ease: 'power2.out', transformOrigin: 'left center' });
      });
      campo.addEventListener('blur', function () {
        gsap.to(campo, { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    });

    /* ---------- Depois que as imagens carregarem, recalcula posições ---------- */
    window.addEventListener('load', function () {
      ScrollTrigger.refresh();
    });

    /* ---------- Rede de segurança ----------
       Se por qualquer motivo o relógio do GSAP não andar
       (aba em segundo plano, navegador antigo), nada pode
       ficar escondido: revela tudo de uma vez.            */
    setTimeout(function () {
      if (intro.progress() >= 0.99) return;
      intro.progress(1);
      gsap.set(blocos, { clearProps: 'all' });
      ScrollTrigger.getAll().forEach(function (t) {
        if (t.animation && !t.vars.scrub) t.animation.progress(1);
      });
    }, 4000);
  });

  /* =====================================================
     Interações com o mouse (só em telas com ponteiro fino)
     ===================================================== */
  mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', function () {

    /* ---------- Cursor personalizado ---------- */
    var cursor = document.querySelector('.cursor');
    if (cursor) {
      gsap.set(cursor, { xPercent: 0, yPercent: 0, scale: 0 });
      var cx = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3.out' });
      var cy = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3.out' });

      window.addEventListener('mousemove', function (e) {
        cx(e.clientX);
        cy(e.clientY);
      });
      document.addEventListener('mouseenter', function () { gsap.to(cursor, { scale: 1, duration: 0.3 }); });
      document.addEventListener('mouseleave', function () { gsap.to(cursor, { scale: 0, duration: 0.3 }); });
      gsap.to(cursor, { scale: 1, duration: 0.4, delay: 0.5 });

      document.querySelectorAll('a, button, label, input, select, textarea').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          gsap.to(cursor, { scale: 2.6, backgroundColor: 'rgba(122, 74, 31, 0.25)', duration: 0.35, ease: 'power3.out' });
        });
        el.addEventListener('mouseleave', function () {
          gsap.to(cursor, { scale: 1, backgroundColor: '#7a4a1f', duration: 0.35, ease: 'power3.out' });
        });
      });
    }

    /* ---------- Foto de abertura inclina com o mouse (3D) ---------- */
    var moldura = document.querySelector('.abertura__foto');
    var fotoAbertura = moldura && moldura.querySelector('img');
    if (fotoAbertura) {
      var rx = gsap.quickTo(fotoAbertura, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      var ry = gsap.quickTo(fotoAbertura, 'rotationY', { duration: 0.6, ease: 'power3.out' });

      moldura.addEventListener('mousemove', function (e) {
        var r = moldura.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * 10);
        rx(-py * 10);
      });
      moldura.addEventListener('mouseleave', function () {
        gsap.to(fotoAbertura, { rotationX: 0, rotationY: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' });
      });
    }

    /* ---------- Botões magnéticos ---------- */
    gsap.utils.toArray('.botao').forEach(function (botao) {
      var moverX = gsap.quickTo(botao, 'x', { duration: 0.4, ease: 'power3.out' });
      var moverY = gsap.quickTo(botao, 'y', { duration: 0.4, ease: 'power3.out' });

      botao.addEventListener('mousemove', function (e) {
        var r = botao.getBoundingClientRect();
        moverX((e.clientX - (r.left + r.width / 2)) * 0.28);
        moverY((e.clientY - (r.top + r.height / 2)) * 0.28);
      });
      botao.addEventListener('mouseleave', function () {
        gsap.to(botao, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
      });
    });

    /* ---------- Fotos dos trabalhos: zoom suave ao passar o mouse ---------- */
    gsap.utils.toArray('.trabalho').forEach(function (item) {
      var img = item.querySelector('img');
      if (!img) return;
      item.addEventListener('mouseenter', function () {
        gsap.to(img, { scale: 1.06, duration: 0.9, ease: 'power3.out', overwrite: 'auto' });
      });
      item.addEventListener('mouseleave', function () {
        gsap.to(img, { scale: 1, duration: 0.9, ease: 'power3.out', overwrite: 'auto' });
      });
    });
  });
})();
