# Conjuntos em Jogo - instruções para agentes

## Objetivo

Este repositório contém um jogo web de prática de matemática para estudantes de 10 a 12 anos. Há seis módulos: Conjuntos, Frações, Números decimais, Volume, Medidas de massa e Temperatura. Preserve linguagem simples, feedback educativo, acessibilidade e funcionamento em celular. O aluno deve poder entrar, escolher um módulo e nível e jogar sem cadastro ou personagem.

## Fluxo de colaboração

- Os colaboradores têm liberdade para desenvolver e enviar commits diretamente para a branch `main`.
- Branches e Pull Requests são opcionais e podem ser usados quando ajudarem a organizar mudanças maiores.
- Antes de começar, atualizar a `main` e combinar com a equipe qual parte será alterada.
- Fazer commits pequenos no padrão Conventional Commits.
- Executar `npm run build` antes de enviar alterações.
- Manter comunicação diária para evitar que duas pessoas editem a mesma parte ao mesmo tempo.
- Evitar force-push e exclusões desnecessárias, mesmo sem bloqueio técnico.

## Arquitetura atual

- React + TypeScript + Vite.
- Interface e fluxo das tentativas: `src/App.tsx`.
- Questões de Conjuntos: `src/gameData.ts`.
- Catálogo dos módulos, outras questões, respostas e níveis: `src/moduleData.ts`.
- Visuais das atividades: `src/QuestionVisual.tsx`.
- Identidade visual e responsividade: `src/style.css`.
- Conteúdo pedagógico: `docs/proposta-pedagogica.md`.
- Registro de atividades: `docs/diario-de-bordo.md`.
- Publicação: `.github/workflows/deploy.yml`.
- O melhor resultado por módulo e nível é local e usa `localStorage`; o progresso antigo de Conjuntos é preservado.

## Critérios de qualidade

- Instruções curtas e adequadas ao 5º ano.
- Atividades diretas, sem telas de teoria antes de jogar.
- Feedback deve explicar o raciocínio; nunca apenas informar que está errado.
- Toda interação deve funcionar com mouse, toque e teclado.
- Não depender apenas de cor para comunicar estado.
- Respeitar `prefers-reduced-motion`.
- Não coletar nome, e-mail, foto ou outro dado pessoal de estudante.
- Validar conteúdo matemático com um professor antes de considerar um nível pedagogicamente finalizado.

## Publicação

Qualquer push direto ou merge na `main` aciona o GitHub Pages. Branches de trabalho não alteram o jogo público. Link: https://vitor-fraille.github.io/ilha-dos-conjuntos/

## Ao receber uma tarefa no Codex

Leia `README.md`, `CONTRIBUTING.md`, este arquivo e os documentos relevantes em `docs/`. Inspecione as mudanças existentes antes de editar, preserve trabalho de outros colaboradores e descreva no final os arquivos alterados, testes executados e eventual risco pendente.
