# Portfólio 3D · Arthur Canzian

Portfólio interativo em 3D: um notebook flutuando na cena que, ao ser clicado, dá zoom e mostra o site do portfólio na tela.

**Site:** [portfolio-arthur-canzian.vercel.app](https://portfolio-arthur-canzian.vercel.app)

## O que tem

- Cena 3D com React Three Fiber e Drei: notebook, iluminação de ambiente, sombras e controle de rotação com o mouse.
- Zoom na tela do notebook e saída animados com GSAP.
- Site do portfólio dentro da tela, com carrossel infinito de projetos (pausa no mouse, arrasta e tem setas).
- Português e inglês, com botão de idioma sincronizado entre a cena e a tela.
- No celular, abre direto uma versão simples do portfólio.
- Se a cena 3D não carregar, mostra o portfólio em tela cheia em vez de uma página em branco.

## Tecnologias

React, React Three Fiber, Three.js, Drei, GSAP e Vite. A página dentro da tela é HTML, CSS e JavaScript puro.

## Estrutura

```
src/                 cena 3D (index.jsx, Experience.jsx, style.css)
public/portfolio/    site dentro da tela (index.html, styles.css, script.js, i18n.js)
public/flags/        bandeiras do botão de idioma
```

## Como rodar

```bash
npm install
npm run dev
```

## Autor

Arthur Canzian · [LinkedIn](https://www.linkedin.com/in/arthur-canzian-1b489a398/) · [GitHub](https://github.com/arthurcanzz)
