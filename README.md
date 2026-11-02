# Seu Bezerra Brigaderia — página de links

Página no estilo Linktree para a bio do Instagram de @seubezerrabrigaderia. Direção visual A ("caixa de chocolate"): fundo chocolate com o dourado do logo.

## Arquivos

| Arquivo | O que tem |
|---|---|
| `index.html` | Todo o conteúdo: textos, botões e mensagens do WhatsApp |
| `styles.css` | Cores, fontes e layout |
| `app.js` | Número do WhatsApp e confirmação de idade da linha +18 |
| `img/` | Logo e fotos dos produtos (tiradas dos stories) |

Site estático: não precisa de build. Basta abrir `index.html` ou publicar a pasta.

## Como editar

- **Mensagem de um botão:** mude o atributo `data-wa="..."` do botão em `index.html`. Para quebrar linha na mensagem, use `&#10;`.
- **Número do WhatsApp:** `WHATSAPP` em `app.js`.
- **Agenda fechada:** no cabeçalho, troque `class="status open"` por `class="status closed"` e o texto para, por exemplo, "Agenda de dezembro fechada".
- **Carrossel de destaques:** cada item é um bloco `<a class="slide">` dentro de `CARROSSEL DE DESTAQUES`. Para adicionar, copie um bloco e troque a foto, o título, a descrição e o `data-wa`. O primeiro é o destaque da campanha (com o selo "Destaque"). As fotos aparecem quadradas.
- **Fotos:** substitua os arquivos em `img/` mantendo os nomes. Formato quadrado ou horizontal funciona melhor.

## Pendências (aguardando a cliente)

- [ ] Antecedência mínima para encomendas
- [x] Entrega: disponível, combinada pelo WhatsApp
- [x] Retirada: disponível (local combinado pelo WhatsApp)
- [x] Sinal de 50% para iniciar a produção
- [ ] Formas de pagamento (Pix? cartão?)
- [x] Fotos em alta de ovos de colher, brigadeiros, modelados, presentes e bombons
- [ ] Foto em alta dos brownies e da Caixa Morango & Brigadeiro (destaque)
- [ ] Confirmar nomes dos produtos do carrossel
- [ ] Sabores e preços atuais, se forem entrar na página

Quando chegarem, preencha as linhas com `hidden` no bloco `class="info"` em `index.html` e remova o atributo.

## Publicar

Qualquer hospedagem estática serve (Vercel, Netlify, GitHub Pages). Depois, troque o link da bio no Instagram pelo endereço novo.
