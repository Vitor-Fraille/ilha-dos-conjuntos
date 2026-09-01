# Ilha dos Conjuntos

Jogo web educativo criado como projeto de extensão para apoiar estudantes do 5º ano no aprendizado de conjuntos matemáticos.

## Versão atual

O jogo apresenta três ilhas jogáveis. A primeira trabalha a formação de conjuntos em três desafios:

- formação de conjuntos por características em comum;
- identificação de elementos que pertencem a um conjunto;
- formação do conjunto dos números pares menores que 10.

A segunda ilha trabalha a relação de pertinência em três etapas:

- organização visual de elementos dentro e fora de um conjunto;
- associação das ideias de pertencer e não pertencer;
- leitura dos símbolos `∈` e `∉` em situações concretas.

A terceira ilha trabalha a inclusão entre conjuntos em três etapas:

- identificação visual de conjuntos que cabem por inteiro em um conjunto maior;
- apresentação simples da ideia de subconjunto;
- leitura dos símbolos `⊂` e `⊄` depois da compreensão visual.

Antes de explorar o mapa, a criança cria um tutor original e personalizável:

- escolha de nome do personagem, cor, chapéu e roupa;
- reações a acertos, erros, movimentos e conquistas;
- dicas curtas e específicas para cada desafio;
- acompanhamento visual do progresso das ilhas.

A entrada não solicita e-mail, senha, foto ou nome da criança. O perfil do tutor e a conclusão de cada ilha ficam salvos somente no dispositivo. A experiência não possui cronômetro e oferece explicações após tentativas incorretas.

## Tecnologias

- React
- TypeScript
- Vite
- CSS responsivo
- GitHub Actions e GitHub Pages

## Executar localmente

Requisitos: Node.js 22 ou superior.

```bash
npm install
npm run dev
```

Para validar a versão de produção:

```bash
npm run build
```

## Colaboração

Antes de desenvolver uma atividade, abra uma issue descrevendo o objetivo pedagógico e os critérios de aceite. Crie uma branch curta, como `feature/ilha-pertinencia`, e envie a alteração por pull request.

Consulte [CONTRIBUTING.md](CONTRIBUTING.md), a [proposta pedagógica](docs/proposta-pedagogica.md) e o [guia de colaboração para o Codex](docs/Guia_Colaboracao_Codex_Ilha_dos_Conjuntos.docx).

## Publicação

O workflow em `.github/workflows/deploy.yml` compila e publica a branch `main` no GitHub Pages. No repositório remoto, selecione **Settings → Pages → Source → GitHub Actions** uma única vez.

## Licença

Distribuído sob a licença MIT.
