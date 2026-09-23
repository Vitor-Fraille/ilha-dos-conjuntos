# Reforço Matemático · UNEMAT

Jogo web de reforço de matemática para estudantes de 10 a 12 anos. O aluno entra sem cadastro, escolhe um módulo e um nível e começa a resolver. A entrada apresenta a iniciativa UNEMAT e o botão Iniciar. Não há personagem, tela de teoria, cronômetro ou ranking. As aulas apresentam o conteúdo; o jogo serve para praticar.

## Módulos e níveis

O jogo tem oito módulos com três atividades livres cada, totalizando 156 questões. Conjuntos mantém as 30 questões originais; os sete temas do bimestre têm 18 questões cada.

| Módulo | Nível 1 | Nível 2 | Nível 3 |
| --- | --- | --- | --- |
| Conjuntos | Agrupar e pertencer | Inclusão e igualdade | Tipos e operações |
| Frações | Mesmo denominador | Denominadores diferentes | Multiplicação e divisão |
| Números decimais | Adição e subtração | Multiplicação, inclusive por 10/100/1.000 | Divisão, inclusive por 10/100/1.000 |
| Volume | Cubos | Paralelepípedos retângulos | Comparação e medidas faltantes |
| Medidas de massa | kg, hg, dag e g | dg, cg e mg | Comparação e problemas |
| Temperatura | Unidades e leitura | Comparações e variações | Temperaturas negativas e situações |
| Tabelas e gráficos | Tabelas e barras | Linhas e setores | Pictogramas e interpretação |
| Fluxogramas | Setas e sequências | Decisões sim/não | Construção e teste |

As atividades alternam escolha de uma ou várias respostas, resposta por teclado numérico e construção de fluxogramas por seleção ordenada de blocos. Barras de fração, caixas, comparações de massas e termômetros ajudam a interpretar algumas questões. A criança recebe feedback explicativo imediatamente, pode alterar a seleção e tentar novamente sem perder pontos. Depois de acertar, ela escolhe quando avançar. A tela mostra o progresso por questão e os acertos de primeira; o melhor resultado de cada nível fica salvo apenas neste navegador.

A interface foi desenhada primeiro para celular. O fluxo é Página inicial → Escolha da atividade → Prática. Cada tema mostra suas três atividades no próprio catálogo, sem uma tela intermediária de níveis. Cada questão ocupa sua própria etapa, com uma barra de progresso segmentada, botões grandes, texto curto, foco visível para teclado e estados indicados também por palavras e símbolos, não só por cor. Não há vidas, punição por erro ou bloqueio de níveis.

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
- `src/moduleData.ts`: catálogo dos oito módulos, níveis e atividades;
- `src/dataAndFlowActivities.ts`: questões de tabelas, gráficos e fluxogramas;
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

A cobertura de cada item do bimestre está registrada em [docs/cobertura-bimestre.md](docs/cobertura-bimestre.md).
