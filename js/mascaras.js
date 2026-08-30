/* =====================================================
   MÁSCARAS E CONTADOR DE CARACTERES DO FORMULÁRIO
   Melhoria progressiva: o site funciona sem este arquivo,
   pois as validações (required, pattern, maxlength)
   estão no próprio HTML.
   ===================================================== */

(function () {
  'use strict';

  /* ---------- Máscara de telefone / WhatsApp ----------
     (11) 99999-9999  → celular (11 dígitos)
     (11) 9999-9999   → fixo    (10 dígitos)               */
  function mascaraTelefone(valor) {
    var digitos = valor.replace(/\D/g, '').slice(0, 11);

    if (digitos.length === 0) return '';
    if (digitos.length <= 2) return '(' + digitos;
    if (digitos.length <= 6) return '(' + digitos.slice(0, 2) + ') ' + digitos.slice(2);
    if (digitos.length <= 10) {
      return '(' + digitos.slice(0, 2) + ') ' + digitos.slice(2, 6) + '-' + digitos.slice(6);
    }
    return '(' + digitos.slice(0, 2) + ') ' + digitos.slice(2, 7) + '-' + digitos.slice(7);
  }

  var telefone = document.getElementById('telefone');
  if (telefone) {
    telefone.addEventListener('input', function () {
      this.value = mascaraTelefone(this.value);
    });
    // Ajusta o padrão para aceitar somente o formato mascarado
    telefone.setAttribute('pattern', '\\(\\d{2}\\) \\d{4,5}-\\d{4}');
    telefone.setAttribute('title', 'Digite o DDD e o número. Ex.: (11) 99999-9999');
  }

  /* ---------- Nome: apenas letras, espaços e acentos ---------- */
  var nome = document.getElementById('nome');
  if (nome) {
    nome.addEventListener('input', function () {
      this.value = this.value
        .replace(/[^A-Za-zÀ-ÿ\s'.-]/g, '')
        .replace(/\s{2,}/g, ' ');
    });
  }

  /* ---------- E-mail: sem espaços e em minúsculas ---------- */
  var email = document.getElementById('email');
  if (email) {
    email.addEventListener('input', function () {
      this.value = this.value.replace(/\s/g, '').toLowerCase();
    });
  }

  /* ---------- Contador de caracteres da mensagem ---------- */
  var mensagem = document.getElementById('mensagem');
  var contador = document.getElementById('contador-mensagem');
  if (mensagem && contador) {
    var maximo = parseInt(mensagem.getAttribute('maxlength'), 10) || 300;

    function atualizarContador() {
      var usado = mensagem.value.length;
      contador.textContent = usado + ' / ' + maximo + ' caracteres';
      contador.classList.toggle('contador--limite', usado >= maximo);
    }

    mensagem.addEventListener('input', atualizarContador);
    atualizarContador();
  }
})();
