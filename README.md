# Ilha dos Conjuntos

Jogo web educativo criado como projeto de extensão para apoiar estudantes do 5º ano no aprendizado de conjuntos matemáticos.

## Versão atual

O jogo apresenta seis ilhas jogáveis, com cinco missões progressivas em cada uma — 30 atividades no total. A primeira trabalha a formação de conjuntos:

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

- robô vetorial original com rosto expressivo, mãos, calçados, bolsos e ferramentas;
- nome fictício, 6 cores, 8 chapéus (incluindo ficar sem chapéu) e 5 acessórios;
- 8 roupas e profissões: explorador, cientista, marinheiro, artista, astronauta, jardineiro, engenheiro e chef;
- oficina com prévia, sugestões de nomes e combinação aleatória, sem salvar até a confirmação;
- reações a acertos, erros, movimentos e conquistas;
- 24 curiosidades de profissões, 8 falas de incentivo e dicas em dois níveis para as 30 missões;
- acompanhamento visual do progresso das ilhas.

A entrada não solicita e-mail, senha, foto ou nome da criança. O perfil do tutor fica salvo somente no dispositivo.

As falas são previamente escritas, não um chat com inteligência artificial. As profissões não mudam as regras ou a dificuldade das atividades. Perfis antigos são compatíveis com os novos acessórios, sem apagar o progresso.

A quarta ilha ensina igualdade de conjuntos:

- comparação de coleções com os mesmos elementos em ordens diferentes;
- verificação de elementos que faltam, sobram ou foram trocados;
- leitura dos símbolos `=` e `≠`.

A quinta ilha apresenta a classificação de conjuntos:

- reconhecimento do conjunto vazio;
- reconhecimento do conjunto unitário;
- comparação entre conjuntos finitos e infinitos.

A sexta ilha pratica operações com conjuntos:

- união de elementos sem repetição;
- interseção dos elementos em comum;
- diferença entre dois conjuntos.

A experiência não possui cronômetro, oferece explicações após tentativas incorretas e salva a conclusão de cada ilha localmente no dispositivo. Cada resposta correta rende uma estrela de progresso, sem perder pontos por erro, e o cenário muda de cor e atmosfera em cada ilha.

Além do mapa de atividades, a criança constrói a **Ilha do Explorador**. Cada ilha concluída colore e acrescenta uma parte ao mundo — terreno, bosque, lagoa, vila, caverna e farol — até a construção ficar completa após a sexta etapa.

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

Para testar perfis antigos, as 1.920 combinações do tutor e a cobertura das dicas:

```bash
npm test
```

## Organização do tutor e do visual

- `src/tutorProfile.ts`: opções, profissões, falas e leitura compatível de perfis salvos.
- `src/TutorAvatar.tsx` e `src/TutorWardrobe.tsx`: personagem, roupas, acessórios e ferramentas em SVG.
- `src/TutorStudio.tsx`: oficina de personalização.
- `src/App.tsx`: navegação, integração do tutor e regras das seis ilhas.
- `src/style.css`: base das atividades e cenários; `src/experience.css`: identidade visual, oficina e responsividade do tutor.
- `tests/tutor.test.mjs`: testes sem dependências adicionais.

## Colaboração

Antes de desenvolver, atualize a `main` e combine com a equipe qual parte será alterada. Os colaboradores podem enviar commits diretamente para a `main`; branches e pull requests são opcionais para mudanças maiores. Faça commits pequenos e execute `npm run build` antes de enviar.

Consulte [CONTRIBUTING.md](CONTRIBUTING.md), a [proposta pedagógica](docs/proposta-pedagogica.md) e o [guia de colaboração para o Codex](docs/Guia_Colaboracao_Codex_Ilha_dos_Conjuntos.docx).

## Publicação

O workflow em `.github/workflows/deploy.yml` compila e publica a branch `main` no GitHub Pages. No repositório remoto, selecione **Settings → Pages → Source → GitHub Actions** uma única vez.

## Licença

Distribuído sob a licença MIT.
