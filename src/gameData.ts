export type LevelId = 1 | 2 | 3
export type TopicId = 1 | 2 | 3 | 4 | 5 | 6

export type Option = { id: string; label: string; icon?: string }
export type Question = {
  id: string
  topic: TopicId
  prompt: string
  context?: string
  many: boolean
  options: Option[]
  answer: string[]
  explanation: string
}

export const levels: { id: LevelId; name: string; subtitle: string; topics: [string, string]; symbol: string }[] = [
  { id: 1, name: 'Começar', subtitle: 'Agrupar e pertencer', topics: ['Formar conjuntos', 'Quem pertence?'], symbol: '✦' },
  { id: 2, name: 'Avançar', subtitle: 'Inclusão e igualdade', topics: ['Conjuntos dentro de outros', 'Conjuntos iguais'], symbol: '⊂' },
  { id: 3, name: 'Desafio', subtitle: 'Tipos e operações', topics: ['Tipos de conjuntos', 'Juntar e comparar'], symbol: '∪' },
]

export const questions: Question[] = [
  // Nível 1: agrupamento e pertinência. Os exemplos concretos vêm antes dos números.
  {
    id: 'form-1', topic: 1, prompt: 'Quais são frutas?', many: true,
    options: [
      { id: 'apple', label: 'Maçã', icon: '🍎' }, { id: 'dog', label: 'Cachorro', icon: '🐶' },
      { id: 'banana', label: 'Banana', icon: '🍌' }, { id: 'ball', label: 'Bola', icon: '⚽' },
      { id: 'grape', label: 'Uva', icon: '🍇' }, { id: 'book', label: 'Livro', icon: '📕' },
    ],
    answer: ['apple', 'banana', 'grape'],
    explanation: 'Maçã, banana e uva são frutas. Cachorro, bola e livro não são.',
  },
  {
    id: 'form-2', topic: 1, prompt: 'Quais são animais?', many: true,
    options: [
      { id: 'cat', label: 'Gato', icon: '🐱' }, { id: 'pencil', label: 'Lápis', icon: '✏️' },
      { id: 'fish', label: 'Peixe', icon: '🐟' }, { id: 'tree', label: 'Árvore', icon: '🌳' },
      { id: 'butterfly', label: 'Borboleta', icon: '🦋' }, { id: 'kite', label: 'Pipa', icon: '🪁' },
    ],
    answer: ['cat', 'fish', 'butterfly'],
    explanation: 'Gato, peixe e borboleta são animais. Os outros elementos não são.',
  },
  {
    id: 'form-3', topic: 1, prompt: 'Quais formas têm quatro lados?', many: true,
    options: [
      { id: 'square', label: 'Quadrado', icon: '■' }, { id: 'triangle', label: 'Triângulo', icon: '▲' },
      { id: 'rectangle', label: 'Retângulo', icon: '▭' }, { id: 'circle', label: 'Círculo', icon: '●' },
      { id: 'diamond', label: 'Losango', icon: '◆' }, { id: 'star', label: 'Estrela', icon: '★' },
    ],
    answer: ['square', 'rectangle', 'diamond'],
    explanation: 'Quadrado, retângulo e losango têm quatro lados. Triângulo tem três; círculo não tem lados retos.',
  },
  {
    id: 'form-4', topic: 1, prompt: 'Quais são pares menores que 10?', many: true,
    options: ['2', '3', '4', '5', '6', '8'].map(value => ({ id: value, label: value })),
    answer: ['2', '4', '6', '8'],
    explanation: '2, 4, 6 e 8 podem ser divididos por 2 sem deixar resto.',
  },
  {
    id: 'form-5', topic: 1, prompt: 'Quais aparecem na tabuada do 3?', many: true,
    context: 'Números até 18',
    options: ['3', '5', '6', '9', '12', '14', '15', '18'].map(value => ({ id: value, label: value })),
    answer: ['3', '6', '9', '12', '15', '18'],
    explanation: 'Conte de 3 em 3: 3, 6, 9, 12, 15 e 18. O 5 e o 14 não entram.',
  },
  {
    id: 'belongs-1', topic: 2, prompt: 'Quais pertencem ao conjunto dos materiais escolares?', many: true,
    options: [
      { id: 'pencil', label: 'Lápis', icon: '✏️' }, { id: 'notebook', label: 'Caderno', icon: '📓' },
      { id: 'ruler', label: 'Régua', icon: '📏' }, { id: 'cat', label: 'Gato', icon: '🐱' },
      { id: 'ball', label: 'Bola', icon: '⚽' }, { id: 'apple', label: 'Maçã', icon: '🍎' },
    ],
    answer: ['pencil', 'notebook', 'ruler'],
    explanation: 'Lápis, caderno e régua são materiais escolares. Os outros não seguem essa regra.',
  },
  {
    id: 'belongs-2', topic: 2, prompt: 'Peixe pertence ao conjunto A?', context: 'A = { animais }', many: false,
    options: [{ id: 'yes', label: 'Sim, pertence', icon: '∈' }, { id: 'no', label: 'Não pertence', icon: '∉' }],
    answer: ['yes'], explanation: 'Peixe é um animal. Por isso, peixe pertence a A.',
  },
  {
    id: 'belongs-3', topic: 2, prompt: 'Quem NÃO pertence ao conjunto B?', context: 'B = { frutas }', many: false,
    options: [
      { id: 'banana', label: 'Banana', icon: '🍌' }, { id: 'apple', label: 'Maçã', icon: '🍎' },
      { id: 'book', label: 'Livro', icon: '📕' }, { id: 'grape', label: 'Uva', icon: '🍇' },
    ],
    answer: ['book'], explanation: 'Livro não é fruta. Banana, maçã e uva pertencem ao conjunto B.',
  },
  {
    id: 'belongs-4', topic: 2, prompt: 'Quais números pertencem a N?', context: 'N = { números maiores que 5 }', many: true,
    options: ['2', '4', '6', '7', '8', '9'].map(value => ({ id: value, label: value })),
    answer: ['6', '7', '8', '9'], explanation: '6, 7, 8 e 9 são maiores que 5. O 2 e o 4 ficam fora.',
  },
  {
    id: 'belongs-5', topic: 2, prompt: 'Quais números pertencem a T?', context: 'T = { múltiplos de 4 menores que 25 }', many: true,
    options: ['4', '8', '12', '15', '20', '24'].map(value => ({ id: value, label: value })),
    answer: ['4', '8', '12', '20', '24'], explanation: '4, 8, 12, 20 e 24 aparecem na tabuada do 4 e são menores que 25. O 15 não.',
  },

  // Nível 2: comparar conjuntos, inclusive quando a ordem ou a repetição muda.
  {
    id: 'inside-1', topic: 3, prompt: 'Qual conjunto cabe inteiro em A?', context: 'A = { 🍎, 🍌, 🍇 }', many: false,
    options: [
      { id: 'a', label: '{ 🍎, 🍌 }' }, { id: 'b', label: '{ 🍎, ⚽ }' },
      { id: 'c', label: '{ 🍇, 📕 }' }, { id: 'd', label: '{ 🍌, 🐶 }' },
    ],
    answer: ['a'], explanation: 'Maçã e banana estão em A. Nos outros conjuntos há pelo menos um elemento que não está em A.',
  },
  {
    id: 'inside-2', topic: 3, prompt: 'Quais conjuntos cabem inteiros em P?', context: 'P = { 2, 4, 6, 8 }', many: true,
    options: [
      { id: 'a', label: '{ 2, 4 }' }, { id: 'b', label: '{ 4, 9 }' },
      { id: 'c', label: '{ 6 }' }, { id: 'd', label: '{ 2, 8 }' },
      { id: 'e', label: '{ 1, 2 }' },
    ],
    answer: ['a', 'c', 'd'], explanation: '{2, 4}, {6} e {2, 8} só usam elementos de P. O 9 e o 1 não estão em P.',
  },
  {
    id: 'inside-3', topic: 3, prompt: 'B está contido em A?', context: 'A = { gato, peixe, borboleta }  ·  B = { gato, peixe }', many: false,
    options: [{ id: 'yes', label: 'Sim, está contido', icon: '⊂' }, { id: 'no', label: 'Não está contido', icon: '⊄' }],
    answer: ['yes'], explanation: 'Todos os elementos de B também estão em A. Logo, B está contido em A.',
  },
  {
    id: 'inside-4', topic: 3, prompt: 'Qual conjunto NÃO cabe em D?', context: 'D = { 1, 2, 3, 4, 6, 12 }', many: false,
    options: [
      { id: 'a', label: '{ 2, 6 }' }, { id: 'b', label: '{ 3, 12 }' },
      { id: 'c', label: '{ 4, 8 }' }, { id: 'd', label: '{ 1, 4 }' },
    ],
    answer: ['c'], explanation: '{4, 8} não cabe em D porque o 8 não pertence a D.',
  },
  {
    id: 'inside-5', topic: 3, prompt: 'Qual frase está correta?', context: 'P = { 2, 4, 6, 8 }', many: false,
    options: [
      { id: 'a', label: '{ 2, 6 } está contido em P' },
      { id: 'b', label: '{ 2, 9 } está contido em P' },
      { id: 'c', label: '{ 1, 4 } está contido em P' },
      { id: 'd', label: '{ 6, 10 } está contido em P' },
    ],
    answer: ['a'], explanation: '2 e 6 pertencem a P. Nas outras frases aparece um número de fora de P.',
  },
  {
    id: 'equal-1', topic: 4, prompt: 'Qual conjunto é igual a A?', context: 'A = { 🍎, 🍌 }', many: false,
    options: [
      { id: 'a', label: '{ 🍌, 🍎 }' }, { id: 'b', label: '{ 🍎 }' },
      { id: 'c', label: '{ 🍎, 🍇 }' }, { id: 'd', label: '{ 🍎, 🍌, 🍇 }' },
    ],
    answer: ['a'], explanation: 'A ordem não importa: {banana, maçã} tem exatamente os elementos de A.',
  },
  {
    id: 'equal-2', topic: 4, prompt: 'A e B são iguais?', context: 'A = { 2, 4, 6 }  ·  B = { 6, 2, 4 }', many: false,
    options: [{ id: 'yes', label: 'Sim, são iguais', icon: '=' }, { id: 'no', label: 'Não são iguais', icon: '≠' }],
    answer: ['yes'], explanation: 'A e B têm os mesmos números. A ordem em que aparecem não muda o conjunto.',
  },
  {
    id: 'equal-3', topic: 4, prompt: 'A e B são iguais?', context: 'A = { 2, 4, 6 }  ·  B = { 2, 4 }', many: false,
    options: [{ id: 'yes', label: 'Sim, são iguais', icon: '=' }, { id: 'no', label: 'Não são iguais', icon: '≠' }],
    answer: ['no'], explanation: 'O 6 está em A, mas não está em B. Por isso, os conjuntos são diferentes.',
  },
  {
    id: 'equal-4', topic: 4, prompt: 'Quais conjuntos são iguais a A?', context: 'A = { 🍎, 🍌 }', many: true,
    options: [
      { id: 'a', label: '{ 🍌, 🍎 }' }, { id: 'b', label: '{ 🍎, 🍎, 🍌 }' },
      { id: 'c', label: '{ 🍎, 🍌, 🍇 }' }, { id: 'd', label: '{ 🍌, 🍎, 🍌 }' },
    ],
    answer: ['a', 'b', 'd'], explanation: 'Ordem e repetição não mudam um conjunto. Os três têm só maçã e banana; o outro também tem uva.',
  },
  {
    id: 'equal-5', topic: 4, prompt: 'Qual conjunto é igual a M?', context: 'M = { números pares positivos menores que 7 }', many: false,
    options: [
      { id: 'a', label: '{ 2, 4, 6 }' }, { id: 'b', label: '{ 2, 4, 6, 8 }' },
      { id: 'c', label: '{ 1, 3, 5 }' }, { id: 'd', label: '{ 2, 4 }' },
    ],
    answer: ['a'], explanation: 'Os pares positivos menores que 7 são 2, 4 e 6. Não pode faltar nem sobrar número.',
  },

  // Nível 3: classificação e operações. A resposta sempre pode ser refeita.
  {
    id: 'types-1', topic: 5, prompt: 'Como é esse conjunto?', context: 'E = { meses do ano com 32 dias }', many: false,
    options: [
      { id: 'empty', label: 'Vazio', icon: '∅' }, { id: 'single', label: 'Unitário', icon: '1' },
      { id: 'finite', label: 'Com 12 elementos', icon: '12' }, { id: 'infinite', label: 'Infinito', icon: '∞' },
    ],
    answer: ['empty'], explanation: 'Nenhum mês tem 32 dias. E não possui elementos: é vazio.',
  },
  {
    id: 'types-2', topic: 5, prompt: 'Como é esse conjunto?', context: 'S = { números pares entre 3 e 5 }', many: false,
    options: [
      { id: 'empty', label: 'Vazio', icon: '∅' }, { id: 'single', label: 'Unitário', icon: '1' },
      { id: 'two', label: 'Com dois elementos', icon: '2' }, { id: 'infinite', label: 'Infinito', icon: '∞' },
    ],
    answer: ['single'], explanation: 'Entre 3 e 5, só o 4 é par. S tem um elemento: é unitário.',
  },
  {
    id: 'types-3', topic: 5, prompt: 'Qual conjunto não termina?', many: false,
    options: [
      { id: 'natural', label: 'Números naturais', icon: '∞' }, { id: 'week', label: 'Dias da semana', icon: '📅' },
      { id: 'traffic', label: 'Cores do semáforo', icon: '🚦' }, { id: 'letters', label: 'Letras do alfabeto', icon: '🔤' },
    ],
    answer: ['natural'], explanation: 'Sempre é possível contar mais um número natural. Os outros grupos têm fim.',
  },
  {
    id: 'types-4', topic: 5, prompt: 'Como é esse conjunto?', context: 'C = { 2, 4, 6 }', many: false,
    options: [
      { id: 'finite', label: 'Finito', icon: '3' }, { id: 'empty', label: 'Vazio', icon: '∅' },
      { id: 'single', label: 'Unitário', icon: '1' }, { id: 'infinite', label: 'Infinito', icon: '∞' },
    ],
    answer: ['finite'], explanation: 'C tem três elementos. Podemos terminar de contá-los, então é finito.',
  },
  {
    id: 'types-5', topic: 5, prompt: 'Quais conjuntos têm só um elemento?', many: true,
    options: [
      { id: 'a', label: '{ 🍎 }' }, { id: 'b', label: '{ }' },
      { id: 'c', label: '{ 1, 2 }' }, { id: 'd', label: '{ 5, 5 }' },
      { id: 'e', label: '{ a, b }' },
    ],
    answer: ['a', 'd'], explanation: '{maçã} tem um elemento. Em {5, 5}, o 5 repetido conta uma vez só.',
  },
  {
    id: 'ops-1', topic: 6, prompt: 'Quais elementos estão em A ∪ B?', context: 'A = { 🍎, 🍌 }  ·  B = { 🍌, 🍇 }', many: true,
    options: [
      { id: 'apple', label: 'Maçã', icon: '🍎' }, { id: 'banana', label: 'Banana', icon: '🍌' },
      { id: 'grape', label: 'Uva', icon: '🍇' }, { id: 'dog', label: 'Cachorro', icon: '🐶' },
    ],
    answer: ['apple', 'banana', 'grape'], explanation: 'União (∪) junta os elementos dos dois conjuntos, sem repetir a banana.',
  },
  {
    id: 'ops-2', topic: 6, prompt: 'Quais elementos estão em A ∩ B?', context: 'A = { 2, 4, 6 }  ·  B = { 4, 6, 8 }', many: true,
    options: ['2', '4', '6', '8'].map(value => ({ id: value, label: value })),
    answer: ['4', '6'], explanation: 'Interseção (∩) mostra o que está nos dois conjuntos: 4 e 6.',
  },
  {
    id: 'ops-3', topic: 6, prompt: 'Quais elementos estão em A − B?', context: 'A = { 2, 4, 6, 8 }  ·  B = { 4, 8 }', many: true,
    options: ['2', '4', '6', '8'].map(value => ({ id: value, label: value })),
    answer: ['2', '6'], explanation: 'Diferença (−) deixa em A só o que não está em B: 2 e 6.',
  },
  {
    id: 'ops-4', topic: 6, prompt: 'Quais elementos de U ficaram fora de A?', context: 'U = { 1, 2, 3, 4, 5 }  ·  A = { 2, 4 }', many: true,
    options: ['1', '2', '3', '4', '5'].map(value => ({ id: value, label: value })),
    answer: ['1', '3', '5'], explanation: 'No conjunto U, os elementos que não estão em A são 1, 3 e 5.',
  },
  {
    id: 'ops-5', topic: 6, prompt: 'Qual é o resultado de A ∩ B?', context: 'A = { 2, 4, 6, 8 }  ·  B = { 3, 6, 9 }', many: false,
    options: [
      { id: 'a', label: '{ 6 }' }, { id: 'b', label: '{ 2, 3, 4, 6, 8, 9 }' },
      { id: 'c', label: '{ 2, 4, 8 }' }, { id: 'd', label: '{ 3, 9 }' },
    ],
    answer: ['a'], explanation: 'Interseção pega só o que aparece nos dois conjuntos. Apenas o 6 aparece em A e B.',
  },
]

export function questionsForLevel(level: LevelId): Question[] {
  return questions.filter(question => Math.ceil(question.topic / 2) === level)
}

export function isCorrect(question: Pick<Question, 'answer'>, selected: string[]): boolean {
  return selected.length === question.answer.length && question.answer.every(id => selected.includes(id))
}
