# Contas Tech Solutions — Website Institucional

Site institucional em HTML, CSS e JavaScript puro (sem frameworks) para a
**CONTAS TECH Prestação de Serviços, LDA**, empresa angolana sedeada em
Luanda que actua nas áreas de contabilidade, fiscalidade, consultoria
empresarial e tecnologia.

## Estrutura do projecto

```
.
├── index.html      # Estrutura da página e conteúdo estático (secções, formulário, sprite de ícones)
├── styles.css       # Estilos globais, tema (azul-marinho + dourado) e responsividade
├── script.js        # Comportamento do site (menu, animações, tabela de planos, formulário)
├── data.js           # Conteúdo dinâmico do site (serviços, planos, depoimentos, etc.)
└── README.md          # Este ficheiro
```

## Como funciona

O `data.js` centraliza todo o conteúdo institucional (serviços, diferenciais,
pilares, planos, tabela comparativa, depoimentos e sectores de actuação) num
único objecto global `window.SITE_DATA`. O `script.js` lê esses dados e
gera dinamicamente o HTML de cada secção, evitando duplicação de conteúdo
directamente no `index.html`.

### Principais funcionalidades

- **Renderização dinâmica de secções** — serviços, diferenciais, pilares,
  planos, depoimentos e sectores são gerados a partir de `data.js`.
- **Tabela comparativa de planos responsiva** — em ecrãs pequenos, colunas
  de planos são ocultadas progressivamente; um botão de expansão (`+`/`-`)
  mostra, por linha, **apenas as colunas actualmente escondidas** num painel
  de detalhe.
- **Menu mobile inteligente** — abre pelo botão de hambúrguer e fecha de
  três formas: botão "X", clique fora do menu (overlay) ou tecla `Esc`.
  O scroll da página é bloqueado enquanto o menu está aberto.
- **Formulário de contacto → WhatsApp** — valida os campos e envia o pedido
  formatado directamente para o WhatsApp da empresa via `wa.me`.
- **Animações ao rolar a página** — secções surgem suavemente usando
  `IntersectionObserver`, com fallback para navegadores sem suporte.
- **Cabeçalho reactivo ao scroll** — muda de transparente para sólido ao
  rolar a página.

## Como visualizar localmente

Basta abrir o `index.html` num navegador, ou servir a pasta com um servidor
estático simples, por exemplo:

```bash
npx serve .
```

## Personalização de conteúdo

Para alterar textos, serviços, planos, contactos ou depoimentos, edite
apenas o ficheiro **`data.js`** — o `script.js` e o `index.html` não
precisam de ser tocados para simples actualizações de conteúdo.

Para alterar o número de WhatsApp usado no formulário e nos botões de
contacto, actualize `contacts.whatsappNumber` em `data.js` (formato:
código do país + número, sem `+` nem espaços).

## Tecnologias

- HTML5 semântico
- CSS3 (variáveis, Grid, Flexbox, media queries)
- JavaScript (ES5, sem dependências externas)
- Google Fonts (Inter e Poppins)

## Contactos da empresa

- **Telefones:** (+244) 959 521 651 · (+244) 931 059 636 · (+244) 976 510 057
- **E-mail:** vladimirolaurindo0@gmail.com
- **Localização:** Luanda, Viana — Vila Nova, Angola
