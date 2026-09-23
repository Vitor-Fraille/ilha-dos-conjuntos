# Conjuntos em Jogo

Jogo web de reforço de matemática para estudantes de 10 a 12 anos. O aluno abre a página, escolhe um nível e começa a resolver. Não há cadastro, personagem, tela de teoria, cronômetro ou ranking. As aulas apresentam o conteúdo; o jogo serve para praticar.

## Versão atual

O módulo **Conjuntos** tem 30 questões, distribuídas em três níveis livres:

| Nível | Fases | Atividades |
| --- | --- | --- |
| 1 · Começar | Formar conjuntos; quem pertence? | 10 |
| 2 · Avançar | Inclusão; igualdade | 10 |
| 3 · Desafio | Tipos de conjuntos; operações | 10 |

As questões alternam escolha de uma e de várias respostas. A criança recebe feedback explicativo imediatamente, pode alterar a seleção e tentar novamente sem perder pontos. Depois de acertar, ela escolhe quando avançar. A tela mostra o progresso e os acertos de primeira; o melhor resultado de cada nível fica salvo apenas neste navegador.

A interface foi desenhada primeiro para celular, com cartões grandes, texto curto, foco visível para teclado e estados indicados também por palavras e símbolos, não só por cor. Os outros módulos de matemática serão definidos posteriormente com a equipe.

## Executar localmente

Requisito: Node.js 22 ou superior.

```bash
npm install
npm run dev
```

Validação:

```bash
npm test
npm run build
```

## Arquivos principais

- `src/gameData.ts`: as 30 questões, explicações e a divisão dos níveis;
- `src/App.tsx`: navegação, tentativas, acertos e progresso;
- `src/style.css`: interface responsiva;
- `tests/game.test.mjs`: consistência matemática estrutural e respostas alcançáveis;
- `docs/proposta-pedagogica.md`: objetivos e critérios de validação;
- `docs/diario-de-bordo.md`: histórico do projeto.

Os dados antigos de progresso e tutor não são apagados do navegador, mas a nova interface começa um acompanhamento próprio dos três níveis. Nenhum dado pessoal de estudante é coletado.

## Colaboração e publicação

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) e [AGENTS.md](AGENTS.md). Antes de editar, atualize a `main`, combine o trecho com a equipe, teste e faça commits pequenos. Pushes na `main` publicam automaticamente no [GitHub Pages](https://vitor-fraille.github.io/ilha-dos-conjuntos/).

O conteúdo das questões ainda precisa de revisão de um professor do ensino fundamental e de teste com estudantes antes de ser considerado final.

## Licença

MIT.
