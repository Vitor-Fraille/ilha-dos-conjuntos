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

<<<<<<< HEAD
Antes de explorar o mapa, a criança cria um tutor original e personalizável:

- escolha de nome do personagem, cor, chapéu e roupa;
- reações a acertos, erros, movimentos e conquistas;
- dicas curtas e específicas para cada desafio;
- acompanhamento visual do progresso das ilhas.

A entrada não solicita e-mail, senha, foto ou nome da criança. O perfil do tutor e a conclusão de cada ilha ficam salvos somente no dispositivo. A experiência não possui cronômetro e oferece explicações após tentativas incorretas.
=======
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
>>>>>>> f12c9085a488cd53f49479656df1c2ef8488f7c4

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

Antes de desenvolver, atualize a `main` e combine com a equipe qual parte será alterada. Os colaboradores podem enviar commits diretamente para a `main`; branches e pull requests são opcionais para mudanças maiores. Faça commits pequenos e execute `npm run build` antes de enviar.

Consulte [CONTRIBUTING.md](CONTRIBUTING.md), a [proposta pedagógica](docs/proposta-pedagogica.md) e o [guia de colaboração para o Codex](docs/Guia_Colaboracao_Codex_Ilha_dos_Conjuntos.docx).

## Publicação

O workflow em `.github/workflows/deploy.yml` compila e publica a branch `main` no GitHub Pages. No repositório remoto, selecione **Settings → Pages → Source → GitHub Actions** uma única vez.

## Licença

Distribuído sob a licença MIT.
