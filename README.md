# YouTube Speed Time Remaining

<<<<<<< HEAD
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
=======
Extensão para navegadores Chromium (Chrome, Edge, Brave) que corrige o tempo restante exibido no player do YouTube para refletir a **velocidade de reprodução atual**.

Quando você assiste em 1.5x, 2x ou qualquer outra velocidade, o tempo que o YouTube mostra continua sendo o do vídeo em 1x — o que não corresponde a quanto falta de verdade. Esta extensão recalcula esse valor em tempo real.

> **Exemplo:** um vídeo de 20:00 assistido em 1.5x mostra `-13:20` — o tempo de relógio real que ainda falta, não os 20 minutos nominais.

## Recursos

- **Ajuste pela velocidade** — recalcula o tempo restante usando a velocidade de reprodução ativa.
- **Tempo real** — atualiza continuamente enquanto o vídeo toca (a cada 0,5s).
- **Reação automática** — responde na hora quando você muda a velocidade ou arrasta a barra de progresso.
- **Sem poluição visual** — reescreve o próprio campo nativo do YouTube, sem adicionar elementos estranhos à interface.
- **Respeita o modo do player** — só age quando o player está no modo "tempo restante"; no modo de tempo decorrido, não interfere.
- **Navegação SPA** — continua funcionando ao trocar de vídeo sem recarregar a página.

## Instalação (modo desenvolvedor)

Esta extensão não está publicada na Chrome Web Store; instale-a manualmente:

1. Baixe este repositório (**Code → Download ZIP**) e extraia, ou clone com `git clone`.
2. Abra `chrome://extensions` no navegador.
3. Ative o **Modo do desenvolvedor** no canto superior direito.
4. Clique em **Carregar sem compactação** e selecione a pasta do projeto (a que contém o `manifest.json`).
5. Abra qualquer vídeo do YouTube — o tempo à esquerda da barra passa a mostrar o valor ajustado.

> Se o valor não mudar, verifique se o player está no modo **tempo restante**: clique no tempo decorrido (à esquerda da barra) para alternar até ele aparecer como negativo (ex.: `-13:20`).

## Como funciona

Um content script lê o elemento `<video>` do player (`duration`, `currentTime`, `playbackRate`) e calcula:

```
tempo restante real = (duration - currentTime) / playbackRate
```

Esse resultado reescreve o elemento nativo `.ytp-time-current` do YouTube. Como o YouTube reescreve esse texto a cada segundo, a extensão usa um `MutationObserver` para sobrescrevê-lo imediatamente — pausando o observer durante a própria escrita para evitar loops e o efeito de piscar. A extensão só atua quando o player já está no modo tempo restante, preservando o comportamento nativo no modo de tempo decorrido.

## Estrutura do projeto

```
yt-speed-remaining/
├── manifest.json        # Declaração da extensão (Manifest V3)
├── src/
│   ├── content.js       # Toda a lógica: cálculo, injeção e atualização
│   └── styles.css       # (reservado; a versão atual reescreve o campo nativo)
├── icons/               # Ícones 16/48/128
└── README.md
```

## Privacidade

Roda 100% localmente no seu navegador. Não coleta, envia nem armazena nenhum dado. Não requer permissões especiais além de rodar em páginas do YouTube.

## Limitações conhecidas

- Depende da classe interna do player `.ytp-time-current`. Ela é estável há anos, mas se o YouTube renomeá-la, o valor deixa de ser reescrito — nesse caso basta atualizar o seletor em `src/content.js`.
- O valor ajustado só aparece no modo tempo restante do player.

## Licença

MIT — sinta-se livre para usar, modificar e distribuir.
>>>>>>> 8a958851f7fdf969c796ae1552993310200d2a86
