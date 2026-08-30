# PTI — Landing Page para Autônomo

**Disciplina:** Fundamentos de Programação Web — Senac EAD
**Tema:** Landing Page para Autônomo
**Ramo escolhido:** Marceneiro autônomo — *Marcenaria Silva*

## Estrutura do projeto

```
landing-page-marcenaria/
├── index.html            # Página final (Parte B)
├── css/
│   └── style.css         # Estilos, Flexbox e responsividade
├── prototipo/
│   └── prototipo.html    # Wireframe desktop + celular (Parte A)
└── README.md
```

## Parte A — Prototipação

O arquivo `prototipo/prototipo.html` traz o wireframe de baixa fidelidade
da página nas versões desktop e celular, além das decisões de projeto
(público, faixas, paleta, layout e chamadas para ação).

## Parte B — Implementação

Site feito **somente com HTML e CSS puros** (sem JavaScript, sem frameworks).

Faixas da página:

1. **Abertura** — chamada principal, foto da oficina e botão de orçamento
2. **Quem faz** — história do marceneiro, em primeira pessoa
3. **O que eu faço** — 6 tipos de trabalho, cada um com foto
4. **Como trabalho** — orçamento, prazo, material, garantia e pagamento
5. **Do contato à instalação** — 4 etapas do atendimento
6. **Clientes** — relatos de clientes
7. **Contato** — dados de contato + formulário de orçamento

Tom do texto: primeira pessoa, com detalhes concretos (bairro, materiais, prazos,
forma de pagamento), evitando jargão de marketing. Visual editorial: tipografia
serifada (Fraunces), fundo cor de papel, faixas separadas por linhas finas.

Mais cabeçalho fixo com menu e rodapé.

### Técnicas aplicadas

- Layout de todas as faixas com **Flexbox** (`display: flex`, `flex-wrap`, `flex: 1 1 ...`, `gap`)
- **Responsividade** com media queries em 992px, 768px e 420px
- Menu hambúrguer para celular usando apenas CSS (`checkbox` + `:checked ~`)
- Ícones em SVG inline (sem dependência de arquivos externos)
- Formulário com validação nativa do HTML (`required`, `type="email"`, `type="tel"`, `pattern`)
- Limitadores de caracteres nos campos (`minlength` / `maxlength`) com a dica do limite ao lado de cada rótulo
- Modal "Cadastro realizado com sucesso" exibido sobre o formulário após o envio, feito só com CSS (`:target`) — sem JavaScript
- **Extra opcional (`js/animacoes.js`, GSAP 3 + ScrollTrigger + ScrollToPlugin via CDN):** barra superior que entra ao abrir e vira uma "ilha" flutuante translúcida ao rolar; título palavra por palavra; revelação das fotos com zoom; blocos de texto aparecendo ao rolar; parallax e inclinação 3D da foto de abertura; barra de progresso; cursor personalizado; números das etapas saltando; botões "magnéticos"; rolagem suave nos links do menu. Respeita `prefers-reduced-motion`. Sem internet ou sem JS, nada fica escondido — o site aparece normalmente.
- **Extra opcional (`js/mascaras.js`):** máscara de telefone `(11) 99999-9999`, filtro de letras no nome, e-mail em minúsculas e contador de caracteres da mensagem. É melhoria progressiva: se remover a linha `<script>` do `index.html`, o site continua funcionando com as validações nativas do HTML.
- Variáveis CSS (`:root`) para paleta e medidas

## Imagens

As fotos da pasta `img/` são do [Unsplash](https://unsplash.com) (licença Unsplash — uso gratuito, inclusive comercial, sem necessidade de atribuição):

| Arquivo | Uso | Foto original |
|---|---|---|
| `hero.jpg` | Faixa principal | [Minh Đức](https://unsplash.com/photos/lQIUbkn6jj4) |
| `sobre.jpg` | Sobre a empresa | [unsplash.com/photos/o8C5SxNCGaw](https://unsplash.com/photos/o8C5SxNCGaw) |
| `cozinha.jpg` | Cozinhas planejadas | [Clay Banks](https://unsplash.com/photos/XU_ODlSO9ac) |
| `guarda-roupa.jpg` | Guarda-roupas e closets | [Alex Tyson](https://unsplash.com/photos/_3fxpQzcRss) |
| `home-office.jpg` | Home office | [Li Zhang](https://unsplash.com/photos/3MeXRKCw59Q) |
| `sala.jpg` | Móveis para sala | [Caroline Badran](https://unsplash.com/photos/z9xJE03D988) |
| `restauracao.jpg` | Restauração | [unsplash.com/photos/y54M7lMwfX0](https://unsplash.com/photos/y54M7lMwfX0) |
| `personalizado.jpg` | Projeto personalizado | [unsplash.com/photos/GfYA6q5ESLI](https://unsplash.com/photos/GfYA6q5ESLI) |

## Como visualizar

Abra `index.html` em qualquer navegador. Para testar a responsividade,
use as ferramentas do desenvolvedor (F12 → modo dispositivo) ou redimensione a janela.

## Publicação no Netlify (gratuito)

1. Acesse <https://app.netlify.com> e crie uma conta (pode usar o e-mail ou GitHub).
2. No painel, clique em **Add new site → Deploy manually**.
3. Arraste a pasta `landing-page-marcenaria` (a pasta que contém o `index.html`) para a área de upload.
4. Aguarde alguns segundos; o Netlify gera um link no formato `https://nome-aleatorio.netlify.app`.
5. (Opcional) Em **Site configuration → Change site name** defina um nome como `marcenaria-silva`.
6. Copie o link gerado e envie junto com o arquivo `.zip` na entrega da PTI.
