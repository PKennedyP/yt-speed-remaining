# YouTube Speed Time Remaining

Extensao para navegadores Chromium (Chrome, Edge, Brave) que mostra, dentro da
barra de tempo do player do YouTube, quanto tempo de video ainda falta
**ajustado pela velocidade de reproducao atual**, atualizando em tempo real.

Exemplo: um video de 20:00 assistido em 1.5x mostra `(⏱ 13:20)` de tempo real
restante.

## Instalacao (modo desenvolvedor)

1. Baixe/extraia esta pasta em algum lugar do seu computador.
2. Abra `chrome://extensions`.
3. Ative o **Modo do desenvolvedor** (canto superior direito).
4. Clique em **Carregar sem compactacao** e selecione esta pasta
   (a pasta que contem o `manifest.json`).
5. Abra qualquer video do YouTube — o campo aparece na barra de tempo do player.

## Como funciona

Um content script le o elemento `<video>` do player (`duration`, `currentTime`,
`playbackRate`) e calcula `(duration - currentTime) / playbackRate`, o tempo de
relogio real que falta. Esse valor **reescreve o proprio elemento nativo do
YouTube** (`.ytp-time-current`), exibindo-o no formato `-13:20`. Como o YouTube
reescreve esse texto a cada tick, a extensao usa um MutationObserver para
sobrescrever imediatamente, evitando piscar. Atualiza a cada 0,5s e reage a
mudancas de velocidade, seek e troca de video (inclusive a navegacao sem
recarregar a pagina, tipica do YouTube).

Observacao: para ver o valor a esquerda como tempo restante, o player deve estar
no modo "tempo restante" (clique no tempo decorrido para alternar). A extensao
apenas troca o valor exibido pelo equivalente ajustado a velocidade.

## Privacidade

Roda 100% localmente no seu navegador. Nao coleta, envia nem armazena dados.

## Observacao

A extensao depende da classe interna do player do YouTube `.ytp-time-current`.
E estavel ha anos, mas se o YouTube renomea-la o valor deixa de ser reescrito —
nesse caso e so atualizar o seletor em `src/content.js`.
