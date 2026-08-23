# Ilha dos Conjuntos - instruções para agentes

## Objetivo

Este repositório contém um jogo web educativo sobre conjuntos matemáticos para estudantes de 10 e 11 anos do 5º ano. Preserve linguagem simples, feedback educativo, acessibilidade e funcionamento em celular.

## Fluxo obrigatório

- Nunca desenvolver diretamente na branch `main`.
- Antes de começar, atualizar a `main` e criar uma branch curta: `feature/...`, `fix/...`, `docs/...`, `test/...` ou `style/...`.
- Fazer commits pequenos no padrão Conventional Commits.
- Executar `npm run build` antes de enviar alterações.
- Abrir Pull Request para `main` e solicitar revisão de outro integrante.
- A `main` exige uma aprovação, conversas resolvidas e aprovação posterior ao último push.
- Não usar force-push e não excluir a `main`.

## Arquitetura atual

- React + TypeScript + Vite.
- Interface principal e regras dos desafios: `src/App.tsx`.
- Identidade visual e responsividade: `src/style.css`.
- Conteúdo pedagógico: `docs/proposta-pedagogica.md`.
- Registro de atividades: `docs/diario-de-bordo.md`.
- Publicação: `.github/workflows/deploy.yml`.
- O progresso da primeira ilha é local e usa `localStorage`.

## Critérios de qualidade

- Instruções curtas e adequadas ao 5º ano.
- Feedback deve explicar o raciocínio; nunca apenas informar que está errado.
- Toda interação deve funcionar com mouse, toque e teclado.
- Não depender apenas de cor para comunicar estado.
- Respeitar `prefers-reduced-motion`.
- Não coletar nome, e-mail, foto ou outro dado pessoal de estudante.
- Validar conteúdo matemático com um professor antes de marcar uma ilha como concluída.

## Publicação

Somente pushes e merges na `main` acionam o GitHub Pages. Branches de trabalho não alteram o jogo público. Link: https://vitor-fraille.github.io/ilha-dos-conjuntos/

## Ao receber uma tarefa no Codex

Leia `README.md`, `CONTRIBUTING.md`, este arquivo e os documentos relevantes em `docs/`. Inspecione as mudanças existentes antes de editar, preserve trabalho de outros colaboradores e descreva no final os arquivos alterados, testes executados e eventual risco pendente.
