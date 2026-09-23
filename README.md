# Matemática.já

Jogo web de reforço de matemática para estudantes de 10 a 12 anos. O aluno entra sem cadastro, escolhe um módulo e um nível e começa a resolver. A entrada tem um desafio rápido opcional. Não há personagem, tela de teoria, cronômetro ou ranking. As aulas apresentam o conteúdo; o jogo serve para praticar.

## Módulos e níveis

O jogo tem seis módulos com três níveis livres cada, totalizando 120 questões. Conjuntos mantém as 30 atividades originais; os cinco módulos novos têm 18 atividades cada.

| Módulo | Nível 1 | Nível 2 | Nível 3 |
| --- | --- | --- | --- |
| Conjuntos | Agrupar e pertencer | Inclusão e igualdade | Tipos e operações |
| Frações | Mesmo denominador | Denominadores diferentes | Multiplicação e divisão |
| Números decimais | Adição e subtração | Multiplicação, inclusive por 10/100/1.000 | Divisão, inclusive por 10/100/1.000 |
| Volume | Cubos | Paralelepípedos retângulos | Comparação e medidas faltantes |
| Medidas de massa | kg, hg, dag e g | dg, cg e mg | Comparação e problemas |
| Temperatura | Unidades e leitura | Comparações e variações | Temperaturas negativas e situações |

As atividades alternam escolha de uma ou várias respostas e montagem da resposta por teclado numérico. Barras de fração, caixas, comparações de massas e termômetros ajudam a interpretar algumas questões. A criança recebe feedback explicativo imediatamente, pode alterar a seleção e tentar novamente sem perder pontos. Depois de acertar, ela escolhe quando avançar. A tela mostra o progresso por questão e os acertos de primeira; o melhor resultado de cada nível fica salvo apenas neste navegador.

A interface foi desenhada primeiro para celular. Os módulos são agrupados em Números e Medidas, com Conjuntos em destaque e filtros para encontrar o assunto rapidamente. Cada questão ocupa sua própria etapa, com uma barra de progresso segmentada, botões grandes, texto curto, foco visível para teclado e estados indicados também por palavras e símbolos, não só por cor. Não há vidas, punição por erro ou bloqueio de níveis.

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

- `src/gameData.ts`: as 30 questões de Conjuntos;
- `src/moduleData.ts`: catálogo dos seis módulos, níveis e novas atividades;
- `src/QuestionVisual.tsx`: visuais de apoio às questões;
- `src/App.tsx`: navegação, tentativas, acertos e progresso;
- `src/style.css`: interface responsiva;
- `tests/game.test.mjs` e `tests/modules.test.mjs`: estrutura, respostas alcançáveis e validação das entradas numéricas;
- `docs/proposta-pedagogica.md`: objetivos e critérios de validação;
- `docs/diario-de-bordo.md`: histórico do projeto.

O progresso anterior de Conjuntos é preservado. Os outros módulos têm resultados separados no armazenamento local do dispositivo. Os dados antigos de tutor não são apagados do navegador. Nenhum dado pessoal de estudante é coletado.

## Colaboração e publicação

Consulte [CONTRIBUTING.md](CONTRIBUTING.md) e [AGENTS.md](AGENTS.md). Antes de editar, atualize a `main`, combine o trecho com a equipe, teste e faça commits pequenos. Pushes na `main` publicam automaticamente no [GitHub Pages](https://vitor-fraille.github.io/ilha-dos-conjuntos/).

O conteúdo das questões ainda precisa de revisão de um professor do ensino fundamental e de teste com estudantes antes de ser considerado final.

## Licença

MIT.
