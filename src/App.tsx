import { useMemo, useState } from 'react'
import { TutorAvatar } from './TutorAvatar'
import { TutorStudio } from './TutorStudio'
import {
  defaultTutorProfile, getTutorComment, getTutorOutfit, parseTutorProfile,
  type TutorExpression, type TutorProfile,
} from './tutorProfile'

type Screen = 'login' | 'avatar' | 'home' | 'lesson' | 'result'
type Island = 1 | 2 | 3 | 4 | 5 | 6
type Item = { id: string; symbol: string; label: string }
type SetGroup = { id: string; name: string; label: string; elements: Item[] }
type Challenge = {
  eyebrow: string
  title: string
  instruction: string
  setName: string
  items: Item[]
  answers: string[]
  tip: string
}
type MembershipChallenge = Challenge & {
  rule: string
  showNotation: boolean
}
type InclusionChallenge = {
  eyebrow: string
  title: string
  instruction: string
  outerName: string
  outerRule: string
  groups: SetGroup[]
  answers: string[]
  tip: string
  concept: string
  showNotation: boolean
}
type EqualityChallenge = {
  eyebrow: string
  title: string
  instruction: string
  reference: SetGroup
  groups: SetGroup[]
  answers: string[]
  tip: string
  concept: string
  showNotation: boolean
}
type ClassificationOption = {
  id: string
  name: string
  notation: string
  detail: string
  symbol: string
}
type ClassificationChallenge = {
  eyebrow: string
  title: string
  instruction: string
  concept: string
  options: ClassificationOption[]
  answers: string[]
  tip: string
  multiple?: boolean
}
type OperationChallenge = {
  eyebrow: string
  title: string
  instruction: string
  concept: string
  operator: '∪' | '∩' | '−'
  setA: SetGroup
  setB: SetGroup
  items: Item[]
  answers: string[]
  tip: string
}

const INTRO_PROGRESS_KEY = 'ilha-dos-conjuntos-progress'
const MEMBERSHIP_PROGRESS_KEY = 'ilha-dos-conjuntos-membership-progress'
const INCLUSION_PROGRESS_KEY = 'ilha-dos-conjuntos-inclusion-progress'
const EQUALITY_PROGRESS_KEY = 'ilha-dos-conjuntos-equality-progress'
const CLASSIFICATION_PROGRESS_KEY = 'ilha-dos-conjuntos-classification-progress'
const OPERATIONS_PROGRESS_KEY = 'ilha-dos-conjuntos-operations-progress'
const TUTOR_PROFILE_KEY = 'ilha-dos-conjuntos-tutor-profile'

function loadTutorProfile(): TutorProfile | null {
  try {
    const savedProfile = localStorage.getItem(TUTOR_PROFILE_KEY)
    if (!savedProfile) return null
    return parseTutorProfile(JSON.parse(savedProfile))
  } catch {
    return null
  }
}

const challenges: Challenge[] = [
  {
    eyebrow: 'Missão 1 de 5',
    title: 'Monte o conjunto das frutas',
    instruction: 'Toque em todos os elementos que pertencem ao conjunto.',
    setName: 'A = { frutas }',
    items: [
      { id: 'apple', symbol: '🍎', label: 'maçã' },
      { id: 'dog', symbol: '🐶', label: 'cachorro' },
      { id: 'banana', symbol: '🍌', label: 'banana' },
      { id: 'ball', symbol: '⚽', label: 'bola' },
      { id: 'grape', symbol: '🍇', label: 'uva' },
      { id: 'book', symbol: '📕', label: 'livro' },
    ],
    answers: ['apple', 'banana', 'grape'],
    tip: 'Maçã, banana e uva são frutas. Cachorro, bola e livro não seguem essa regra.',
  },
  {
    eyebrow: 'Missão 2 de 5',
    title: 'Quem pertence ao conjunto?',
    instruction: 'Selecione todos os animais. Eles ficarão dentro do conjunto B.',
    setName: 'B = { animais }',
    items: [
      { id: 'cat', symbol: '🐱', label: 'gato' },
      { id: 'pencil', symbol: '✏️', label: 'lápis' },
      { id: 'fish', symbol: '🐟', label: 'peixe' },
      { id: 'tree', symbol: '🌳', label: 'árvore' },
      { id: 'butterfly', symbol: '🦋', label: 'borboleta' },
      { id: 'kite', symbol: '🪁', label: 'pipa' },
    ],
    answers: ['cat', 'fish', 'butterfly'],
    tip: 'Gato, peixe e borboleta são animais: eles nascem, crescem e se alimentam.',
  },
  {
    eyebrow: 'Missão 3 de 5',
    title: 'Encontre os números pares',
    instruction: 'Escolha os números que podem ser divididos por 2 sem deixar resto.',
    setName: 'C = { pares menores que 10 }',
    items: [
      { id: '2', symbol: '2', label: 'dois' },
      { id: '3', symbol: '3', label: 'três' },
      { id: '4', symbol: '4', label: 'quatro' },
      { id: '5', symbol: '5', label: 'cinco' },
      { id: '6', symbol: '6', label: 'seis' },
      { id: '8', symbol: '8', label: 'oito' },
    ],
    answers: ['2', '4', '6', '8'],
    tip: '2, 4, 6 e 8 podem ser divididos por 2 sem deixar resto; por isso são pares.',
  },
  {
    eyebrow: 'Missão 4 de 5',
    title: 'Separe as formas com quatro lados',
    instruction: 'Observe o contorno e escolha apenas as formas que possuem quatro lados.',
    setName: 'D = { formas com 4 lados }',
    items: [
      { id: 'square', symbol: '■', label: 'quadrado' },
      { id: 'triangle', symbol: '▲', label: 'triângulo' },
      { id: 'rectangle', symbol: '▭', label: 'retângulo' },
      { id: 'circle', symbol: '●', label: 'círculo' },
      { id: 'diamond', symbol: '◆', label: 'losango' },
      { id: 'star', symbol: '★', label: 'estrela' },
    ],
    answers: ['square', 'rectangle', 'diamond'],
    tip: 'Quadrado, retângulo e losango possuem quatro lados. Triângulo tem três, círculo não tem lados e estrela tem mais pontas.',
  },
  {
    eyebrow: 'Missão 5 de 5',
    title: 'Descubra os múltiplos de 3',
    instruction: 'Escolha os números que aparecem na tabuada do 3.',
    setName: 'M = { múltiplos de 3 até 18 }',
    items: [
      { id: '3', symbol: '3', label: 'três' },
      { id: '5', symbol: '5', label: 'cinco' },
      { id: '6', symbol: '6', label: 'seis' },
      { id: '9', symbol: '9', label: 'nove' },
      { id: '12', symbol: '12', label: 'doze' },
      { id: '14', symbol: '14', label: 'quatorze' },
      { id: '15', symbol: '15', label: 'quinze' },
      { id: '18', symbol: '18', label: 'dezoito' },
    ],
    answers: ['3', '6', '9', '12', '15', '18'],
    tip: 'Conte de 3 em 3: 3, 6, 9, 12, 15 e 18. Os números 5 e 14 não aparecem nessa sequência.',
  },
]

const membershipChallenges: MembershipChallenge[] = [
  {
    eyebrow: 'Missão 1 de 5',
    title: 'Quem entra no conjunto?',
    instruction: 'Mova para dentro do conjunto E somente os materiais escolares.',
    setName: 'Conjunto E',
    rule: 'materiais escolares',
    showNotation: false,
    items: [
      { id: 'pencil', symbol: '✏️', label: 'lápis' },
      { id: 'notebook', symbol: '📓', label: 'caderno' },
      { id: 'ruler', symbol: '📏', label: 'régua' },
      { id: 'cat', symbol: '🐱', label: 'gato' },
      { id: 'ball', symbol: '⚽', label: 'bola' },
      { id: 'apple', symbol: '🍎', label: 'maçã' },
    ],
    answers: ['pencil', 'notebook', 'ruler'],
    tip: 'Lápis, caderno e régua são usados nas tarefas escolares. Gato, bola e maçã ficam fora desse grupo.',
  },
  {
    eyebrow: 'Missão 2 de 5',
    title: 'Pertence ou não pertence?',
    instruction: 'Use a regra “ser um animal” para organizar todos os elementos.',
    setName: 'Conjunto A',
    rule: 'animais',
    showNotation: true,
    items: [
      { id: 'cat', symbol: '🐱', label: 'gato' },
      { id: 'fish', symbol: '🐟', label: 'peixe' },
      { id: 'butterfly', symbol: '🦋', label: 'borboleta' },
      { id: 'book', symbol: '📕', label: 'livro' },
      { id: 'kite', symbol: '🪁', label: 'pipa' },
      { id: 'flower', symbol: '🌻', label: 'flor' },
    ],
    answers: ['cat', 'fish', 'butterfly'],
    tip: 'Gato, peixe e borboleta pertencem ao conjunto dos animais. Livro, pipa e flor não pertencem.',
  },
  {
    eyebrow: 'Missão 3 de 5',
    title: 'Leia os símbolos ∈ e ∉',
    instruction: 'Dentro significa ∈; fora significa ∉. Organize os números maiores que 5.',
    setName: 'Conjunto N',
    rule: 'números maiores que 5',
    showNotation: true,
    items: [
      { id: '2', symbol: '2', label: 'dois' },
      { id: '4', symbol: '4', label: 'quatro' },
      { id: '6', symbol: '6', label: 'seis' },
      { id: '7', symbol: '7', label: 'sete' },
      { id: '8', symbol: '8', label: 'oito' },
      { id: '9', symbol: '9', label: 'nove' },
    ],
    answers: ['6', '7', '8', '9'],
    tip: 'Compare cada número com 5: 6, 7, 8 e 9 são maiores e pertencem a N. 2 e 4 não pertencem.',
  },
  {
    eyebrow: 'Missão 4 de 5',
    title: 'Entre 10 e 20',
    instruction: 'Coloque dentro de I somente os números maiores que 10 e menores que 20.',
    setName: 'Conjunto I',
    rule: 'números entre 10 e 20',
    showNotation: true,
    items: [
      { id: '8', symbol: '8', label: 'oito' },
      { id: '10', symbol: '10', label: 'dez' },
      { id: '11', symbol: '11', label: 'onze' },
      { id: '15', symbol: '15', label: 'quinze' },
      { id: '19', symbol: '19', label: 'dezenove' },
      { id: '20', symbol: '20', label: 'vinte' },
    ],
    answers: ['11', '15', '19'],
    tip: '11, 15 e 19 são maiores que 10 e menores que 20. Os extremos 10 e 20 não entram quando dizemos “entre”.',
  },
  {
    eyebrow: 'Missão 5 de 5',
    title: 'Pertinência na tabuada do 4',
    instruction: 'Organize os números usando a regra “ser múltiplo de 4 e menor que 25”.',
    setName: 'Conjunto T',
    rule: 'múltiplos de 4 menores que 25',
    showNotation: true,
    items: [
      { id: '4', symbol: '4', label: 'quatro' },
      { id: '8', symbol: '8', label: 'oito' },
      { id: '12', symbol: '12', label: 'doze' },
      { id: '18', symbol: '18', label: 'dezoito' },
      { id: '20', symbol: '20', label: 'vinte' },
      { id: '24', symbol: '24', label: 'vinte e quatro' },
    ],
    answers: ['4', '8', '12', '20', '24'],
    tip: 'A tabuada do 4 segue 4, 8, 12, 16, 20 e 24. O número 18 não pertence a essa sequência.',
  },
]

const inclusionChallenges: InclusionChallenge[] = [
  {
    eyebrow: 'Missão 1 de 5',
    title: 'Quais conjuntos cabem aqui?',
    instruction: 'Mova para dentro de Alimentos os conjuntos em que todos os elementos são alimentos.',
    outerName: 'Alimentos',
    outerRule: 'tudo o que pode ser comido',
    groups: [
      {
        id: 'fruits',
        name: 'F',
        label: 'Frutas',
        elements: [
          { id: 'apple', symbol: '🍎', label: 'maçã' },
          { id: 'banana', symbol: '🍌', label: 'banana' },
        ],
      },
      {
        id: 'snacks',
        name: 'L',
        label: 'Lanches',
        elements: [
          { id: 'bread', symbol: '🍞', label: 'pão' },
          { id: 'cheese', symbol: '🧀', label: 'queijo' },
        ],
      },
      {
        id: 'toys',
        name: 'B',
        label: 'Brinquedos',
        elements: [
          { id: 'ball', symbol: '⚽', label: 'bola' },
          { id: 'kite', symbol: '🪁', label: 'pipa' },
        ],
      },
      {
        id: 'mixed-food',
        name: 'M',
        label: 'Misturado',
        elements: [
          { id: 'grape', symbol: '🍇', label: 'uva' },
          { id: 'book', symbol: '📕', label: 'livro' },
        ],
      },
    ],
    answers: ['fruits', 'snacks'],
    tip: 'Frutas e Lanches cabem em Alimentos porque todos os seus elementos podem ser comidos. Brinquedos e Misturado têm elementos que não são alimentos.',
    concept: 'Um conjunto menor só pode ficar dentro de outro quando todos os seus elementos seguem a regra do conjunto maior.',
    showNotation: false,
  },
  {
    eyebrow: 'Missão 2 de 5',
    title: 'Encontre os subconjuntos',
    instruction: 'Coloque dentro de Seres vivos os conjuntos formados somente por seres vivos.',
    outerName: 'Seres vivos',
    outerRule: 'seres que nascem e crescem',
    groups: [
      {
        id: 'animals',
        name: 'A',
        label: 'Animais',
        elements: [
          { id: 'cat', symbol: '🐱', label: 'gato' },
          { id: 'fish', symbol: '🐟', label: 'peixe' },
        ],
      },
      {
        id: 'plants',
        name: 'P',
        label: 'Plantas',
        elements: [
          { id: 'tree', symbol: '🌳', label: 'árvore' },
          { id: 'flower', symbol: '🌻', label: 'flor' },
        ],
      },
      {
        id: 'school-objects',
        name: 'E',
        label: 'Materiais escolares',
        elements: [
          { id: 'pencil', symbol: '✏️', label: 'lápis' },
          { id: 'notebook', symbol: '📓', label: 'caderno' },
        ],
      },
      {
        id: 'mixed-life',
        name: 'M',
        label: 'Misturado',
        elements: [
          { id: 'butterfly', symbol: '🦋', label: 'borboleta' },
          { id: 'ruler', symbol: '📏', label: 'régua' },
        ],
      },
    ],
    answers: ['animals', 'plants'],
    tip: 'Animais e Plantas são subconjuntos de Seres vivos. Materiais escolares não têm seres vivos, e Misturado contém uma régua.',
    concept: 'Chamamos de subconjunto um conjunto menor cujos elementos também pertencem ao conjunto maior.',
    showNotation: false,
  },
  {
    eyebrow: 'Missão 3 de 5',
    title: 'Leia os símbolos ⊂ e ⊄',
    instruction: 'Coloque dentro de P os conjuntos formados somente por números pares menores que 10.',
    outerName: 'P = { pares menores que 10 }',
    outerRule: 'números 2, 4, 6 e 8',
    groups: [
      {
        id: 'even-low',
        name: 'A',
        label: 'Conjunto A',
        elements: [
          { id: '2', symbol: '2', label: 'dois' },
          { id: '4', symbol: '4', label: 'quatro' },
        ],
      },
      {
        id: 'even-high',
        name: 'B',
        label: 'Conjunto B',
        elements: [
          { id: '6', symbol: '6', label: 'seis' },
          { id: '8', symbol: '8', label: 'oito' },
        ],
      },
      {
        id: 'odd',
        name: 'C',
        label: 'Conjunto C',
        elements: [
          { id: '1', symbol: '1', label: 'um' },
          { id: '3', symbol: '3', label: 'três' },
        ],
      },
      {
        id: 'mixed-numbers',
        name: 'D',
        label: 'Conjunto D',
        elements: [
          { id: '2', symbol: '2', label: 'dois' },
          { id: '5', symbol: '5', label: 'cinco' },
        ],
      },
    ],
    answers: ['even-low', 'even-high'],
    tip: 'A e B estão contidos em P porque usam apenas 2, 4, 6 e 8. C tem números ímpares, e D contém o número 5.',
    concept: 'O símbolo ⊂ significa “está contido”. O símbolo ⊄ significa “não está contido”.',
    showNotation: true,
  },
  {
    eyebrow: 'Missão 4 de 5',
    title: 'Subconjuntos dos divisores de 12',
    instruction: 'Coloque dentro de D os conjuntos formados somente por divisores de 12.',
    outerName: 'D = { divisores de 12 }',
    outerRule: 'números 1, 2, 3, 4, 6 e 12',
    groups: [
      { id: 'small-divisors', name: 'E', label: 'Conjunto E', elements: [
        { id: '1', symbol: '1', label: 'um' }, { id: '3', symbol: '3', label: 'três' },
      ] },
      { id: 'large-divisors', name: 'F', label: 'Conjunto F', elements: [
        { id: '4', symbol: '4', label: 'quatro' }, { id: '6', symbol: '6', label: 'seis' }, { id: '12', symbol: '12', label: 'doze' },
      ] },
      { id: 'mixed-divisors', name: 'G', label: 'Conjunto G', elements: [
        { id: '2', symbol: '2', label: 'dois' }, { id: '5', symbol: '5', label: 'cinco' },
      ] },
      { id: 'not-divisor', name: 'H', label: 'Conjunto H', elements: [
        { id: '7', symbol: '7', label: 'sete' }, { id: '8', symbol: '8', label: 'oito' },
      ] },
    ],
    answers: ['small-divisors', 'large-divisors'],
    tip: 'E e F usam apenas números que dividem 12 sem deixar resto. G tem o 5, e H tem 7 e 8, que não são divisores de 12.',
    concept: 'Para provar que um conjunto está contido, verifique cada elemento, sem pular nenhum.',
    showNotation: true,
  },
  {
    eyebrow: 'Missão 5 de 5',
    title: 'Subconjuntos dos múltiplos de 3',
    instruction: 'Encontre os conjuntos que estão contidos em M.',
    outerName: 'M = { múltiplos de 3 até 18 }',
    outerRule: 'números 3, 6, 9, 12, 15 e 18',
    groups: [
      { id: 'odd-multiples', name: 'J', label: 'Conjunto J', elements: [
        { id: '3', symbol: '3', label: 'três' }, { id: '9', symbol: '9', label: 'nove' }, { id: '15', symbol: '15', label: 'quinze' },
      ] },
      { id: 'even-multiples', name: 'K', label: 'Conjunto K', elements: [
        { id: '6', symbol: '6', label: 'seis' }, { id: '12', symbol: '12', label: 'doze' }, { id: '18', symbol: '18', label: 'dezoito' },
      ] },
      { id: 'almost-multiples', name: 'L', label: 'Conjunto L', elements: [
        { id: '3', symbol: '3', label: 'três' }, { id: '6', symbol: '6', label: 'seis' }, { id: '10', symbol: '10', label: 'dez' },
      ] },
      { id: 'powers-two', name: 'N', label: 'Conjunto N', elements: [
        { id: '2', symbol: '2', label: 'dois' }, { id: '4', symbol: '4', label: 'quatro' }, { id: '8', symbol: '8', label: 'oito' },
      ] },
    ],
    answers: ['odd-multiples', 'even-multiples'],
    tip: 'J e K usam somente múltiplos de 3. L não cabe por causa do 10, e N não segue a regra de M.',
    concept: 'Um único elemento fora da regra já impede a inclusão do conjunto inteiro.',
    showNotation: true,
  },
]

const equalityChallenges: EqualityChallenge[] = [
  {
    eyebrow: 'Missão 1 de 5',
    title: 'A ordem muda o conjunto?',
    instruction: 'Escolha o conjunto que tem exatamente as mesmas frutas de F.',
    reference: {
      id: 'fruit-reference', name: 'F', label: 'Frutas de referência',
      elements: [
        { id: 'apple', symbol: '🍎', label: 'maçã' },
        { id: 'banana', symbol: '🍌', label: 'banana' },
        { id: 'grape', symbol: '🍇', label: 'uva' },
      ],
    },
    groups: [
      {
        id: 'same-fruits', name: 'A', label: 'Conjunto A',
        elements: [
          { id: 'grape', symbol: '🍇', label: 'uva' },
          { id: 'apple', symbol: '🍎', label: 'maçã' },
          { id: 'banana', symbol: '🍌', label: 'banana' },
        ],
      },
      {
        id: 'missing-fruit', name: 'B', label: 'Conjunto B',
        elements: [
          { id: 'apple', symbol: '🍎', label: 'maçã' },
          { id: 'banana', symbol: '🍌', label: 'banana' },
        ],
      },
      {
        id: 'different-fruit', name: 'C', label: 'Conjunto C',
        elements: [
          { id: 'apple', symbol: '🍎', label: 'maçã' },
          { id: 'banana', symbol: '🍌', label: 'banana' },
          { id: 'pear', symbol: '🍐', label: 'pera' },
        ],
      },
    ],
    answers: ['same-fruits'],
    tip: 'A tem maçã, banana e uva, como F. A ordem é diferente, mas nenhum elemento foi retirado ou trocado.',
    concept: 'Dois conjuntos são iguais quando possuem exatamente os mesmos elementos. A ordem não importa.',
    showNotation: false,
  },
  {
    eyebrow: 'Missão 2 de 5',
    title: 'Compare cada número',
    instruction: 'Encontre o conjunto igual a N. Conte e compare todos os elementos.',
    reference: {
      id: 'number-reference', name: 'N', label: 'Números de referência',
      elements: [
        { id: '2', symbol: '2', label: 'dois' },
        { id: '4', symbol: '4', label: 'quatro' },
        { id: '6', symbol: '6', label: 'seis' },
      ],
    },
    groups: [
      {
        id: 'same-numbers', name: 'P', label: 'Conjunto P',
        elements: [
          { id: '6', symbol: '6', label: 'seis' },
          { id: '2', symbol: '2', label: 'dois' },
          { id: '4', symbol: '4', label: 'quatro' },
        ],
      },
      {
        id: 'extra-number', name: 'Q', label: 'Conjunto Q',
        elements: [
          { id: '2', symbol: '2', label: 'dois' },
          { id: '4', symbol: '4', label: 'quatro' },
          { id: '6', symbol: '6', label: 'seis' },
          { id: '8', symbol: '8', label: 'oito' },
        ],
      },
      {
        id: 'changed-number', name: 'R', label: 'Conjunto R',
        elements: [
          { id: '2', symbol: '2', label: 'dois' },
          { id: '4', symbol: '4', label: 'quatro' },
          { id: '5', symbol: '5', label: 'cinco' },
        ],
      },
    ],
    answers: ['same-numbers'],
    tip: 'P tem os mesmos números 2, 4 e 6 de N. Q tem um elemento a mais, e R trocou o 6 pelo 5.',
    concept: 'Para verificar a igualdade, confira se não falta e não sobra nenhum elemento.',
    showNotation: true,
  },
  {
    eyebrow: 'Missão 3 de 5',
    title: 'Use os símbolos = e ≠',
    instruction: 'Escolha o conjunto que completa corretamente a igualdade S = ?',
    reference: {
      id: 'shape-reference', name: 'S', label: 'Formas de referência',
      elements: [
        { id: 'circle', symbol: '●', label: 'círculo' },
        { id: 'triangle', symbol: '▲', label: 'triângulo' },
        { id: 'square', symbol: '■', label: 'quadrado' },
      ],
    },
    groups: [
      {
        id: 'same-shapes', name: 'T', label: 'Conjunto T',
        elements: [
          { id: 'square', symbol: '■', label: 'quadrado' },
          { id: 'circle', symbol: '●', label: 'círculo' },
          { id: 'triangle', symbol: '▲', label: 'triângulo' },
        ],
      },
      {
        id: 'two-shapes', name: 'U', label: 'Conjunto U',
        elements: [
          { id: 'circle', symbol: '●', label: 'círculo' },
          { id: 'triangle', symbol: '▲', label: 'triângulo' },
        ],
      },
      {
        id: 'changed-shape', name: 'V', label: 'Conjunto V',
        elements: [
          { id: 'circle', symbol: '●', label: 'círculo' },
          { id: 'triangle', symbol: '▲', label: 'triângulo' },
          { id: 'diamond', symbol: '◆', label: 'losango' },
        ],
      },
    ],
    answers: ['same-shapes'],
    tip: 'T possui círculo, triângulo e quadrado, como S. Por isso escrevemos S = T. Nos outros casos, usamos ≠.',
    concept: 'O símbolo = indica conjuntos iguais. O símbolo ≠ indica que existe alguma diferença entre eles.',
    showNotation: true,
  },
  {
    eyebrow: 'Missão 4 de 5',
    title: 'Elemento repetido conta de novo?',
    instruction: 'Escolha o conjunto igual a X, lembrando que repetir um elemento não cria um elemento novo.',
    reference: { id: 'repeat-reference', name: 'X', label: 'Conjunto com repetição', elements: [
      { id: '1', symbol: '1', label: 'um' }, { id: '2a', symbol: '2', label: 'dois' }, { id: '2b', symbol: '2', label: 'dois repetido' }, { id: '3', symbol: '3', label: 'três' },
    ] },
    groups: [
      { id: 'unique-equal', name: 'A', label: 'Conjunto A', elements: [
        { id: '3', symbol: '3', label: 'três' }, { id: '2', symbol: '2', label: 'dois' }, { id: '1', symbol: '1', label: 'um' },
      ] },
      { id: 'missing-repeat', name: 'B', label: 'Conjunto B', elements: [
        { id: '1', symbol: '1', label: 'um' }, { id: '2', symbol: '2', label: 'dois' },
      ] },
      { id: 'extra-four', name: 'C', label: 'Conjunto C', elements: [
        { id: '1', symbol: '1', label: 'um' }, { id: '2', symbol: '2', label: 'dois' }, { id: '3', symbol: '3', label: 'três' }, { id: '4', symbol: '4', label: 'quatro' },
      ] },
    ],
    answers: ['unique-equal'],
    tip: 'X possui os elementos 1, 2 e 3. Escrever o 2 duas vezes não muda o conjunto, então X = A.',
    concept: 'Em um conjunto, cada elemento é considerado uma vez, mesmo quando aparece repetido na escrita.',
    showNotation: true,
  },
  {
    eyebrow: 'Missão 5 de 5',
    title: 'Compare quadrados perfeitos',
    instruction: 'Escolha o conjunto igual a Q = { quadrados perfeitos até 16 }.',
    reference: { id: 'squares-reference', name: 'Q', label: 'Quadrados perfeitos até 16', elements: [
      { id: '1', symbol: '1', label: 'um' }, { id: '4', symbol: '4', label: 'quatro' }, { id: '9', symbol: '9', label: 'nove' }, { id: '16', symbol: '16', label: 'dezesseis' },
    ] },
    groups: [
      { id: 'same-squares', name: 'R', label: 'Conjunto R', elements: [
        { id: '16', symbol: '16', label: 'dezesseis' }, { id: '9', symbol: '9', label: 'nove' }, { id: '4', symbol: '4', label: 'quatro' }, { id: '1', symbol: '1', label: 'um' },
      ] },
      { id: 'even-squares', name: 'S', label: 'Conjunto S', elements: [
        { id: '4', symbol: '4', label: 'quatro' }, { id: '16', symbol: '16', label: 'dezesseis' },
      ] },
      { id: 'almost-squares', name: 'T', label: 'Conjunto T', elements: [
        { id: '1', symbol: '1', label: 'um' }, { id: '4', symbol: '4', label: 'quatro' }, { id: '8', symbol: '8', label: 'oito' }, { id: '16', symbol: '16', label: 'dezesseis' },
      ] },
    ],
    answers: ['same-squares'],
    tip: '1 = 1×1, 4 = 2×2, 9 = 3×3 e 16 = 4×4. R possui todos eles, apenas em ordem inversa.',
    concept: 'Conjuntos descritos por uma regra continuam iguais quando produzem exatamente os mesmos elementos.',
    showNotation: true,
  },
]

const classificationChallenges: ClassificationChallenge[] = [
  {
    eyebrow: 'Missão 1 de 5',
    title: 'Qual conjunto está vazio?',
    instruction: 'Escolha o conjunto que não possui nenhum elemento.',
    concept: 'Um conjunto vazio não possui elementos. Podemos representá-lo por { } ou pelo símbolo ∅.',
    options: [
      { id: 'empty', name: 'A', notation: 'A = { }', detail: 'nenhum elemento', symbol: '∅' },
      { id: 'one', name: 'B', notation: 'B = { 7 }', detail: 'um elemento', symbol: '7' },
      { id: 'three', name: 'C', notation: 'C = { 2, 4, 6 }', detail: 'três elementos', symbol: '246' },
    ],
    answers: ['empty'],
    tip: 'A não possui elementos entre as chaves. Por isso A é o conjunto vazio, representado também por ∅.',
  },
  {
    eyebrow: 'Missão 2 de 5',
    title: 'Encontre o conjunto unitário',
    instruction: 'Escolha o conjunto que possui exatamente um elemento.',
    concept: 'Um conjunto unitário possui um único elemento. “Unitário” lembra a palavra “um”.',
    options: [
      { id: 'many-animals', name: 'D', notation: 'D = { 🐱, 🐟 }', detail: 'dois animais', symbol: '🐱🐟' },
      { id: 'single-star', name: 'E', notation: 'E = { ★ }', detail: 'uma estrela', symbol: '★' },
      { id: 'no-elements', name: 'F', notation: 'F = { }', detail: 'nenhum elemento', symbol: '∅' },
    ],
    answers: ['single-star'],
    tip: 'E possui somente a estrela. D tem dois elementos, e F não tem nenhum.',
  },
  {
    eyebrow: 'Missão 3 de 5',
    title: 'Finito ou infinito?',
    instruction: 'Escolha a coleção que podemos terminar de contar.',
    concept: 'Um conjunto finito termina; um conjunto infinito continua sem fim.',
    options: [
      { id: 'weekdays', name: 'G', notation: 'dias da semana', detail: '7 dias ao todo', symbol: '7' },
      { id: 'natural-numbers', name: 'H', notation: 'números naturais', detail: '0, 1, 2, 3, ...', symbol: '∞' },
      { id: 'line-points', name: 'I', notation: 'pontos de uma reta', detail: 'sempre há mais pontos', symbol: '•••' },
    ],
    answers: ['weekdays'],
    tip: 'Os dias da semana são 7, então conseguimos terminar a contagem. Os números naturais e os pontos de uma reta continuam sem fim.',
  },
  {
    eyebrow: 'Missão 4 de 5',
    title: 'Qual conjunto é infinito?',
    instruction: 'Escolha a coleção que sempre permite encontrar um próximo elemento.',
    concept: 'No conjunto infinito, a contagem nunca termina, mesmo que continuemos por muito tempo.',
    options: [
      { id: 'months', name: 'J', notation: 'meses do ano', detail: '12 meses', symbol: '12' },
      { id: 'letters', name: 'K', notation: 'letras do alfabeto', detail: 'quantidade limitada', symbol: 'ABC' },
      { id: 'even-numbers', name: 'L', notation: 'números pares', detail: '2, 4, 6, 8, ...', symbol: '∞' },
    ],
    answers: ['even-numbers'],
    tip: 'Depois de qualquer número par, podemos somar 2 e encontrar outro. Meses e letras possuem uma quantidade que termina.',
  },
  {
    eyebrow: 'Missão 5 de 5',
    title: 'Um conjunto pode ter dois tipos',
    instruction: 'O conjunto P = { 9 } recebe quais classificações? Escolha todas as corretas.',
    concept: 'As classificações podem se combinar. Um conjunto com um elemento também termina de ser contado.',
    options: [
      { id: 'empty-type', name: 'A', notation: 'vazio', detail: 'não possui elementos', symbol: '∅' },
      { id: 'unit-type', name: 'B', notation: 'unitário', detail: 'possui um elemento', symbol: '1' },
      { id: 'finite-type', name: 'C', notation: 'finito', detail: 'a contagem termina', symbol: '✓' },
    ],
    answers: ['unit-type', 'finite-type'],
    tip: 'P possui exatamente um elemento, então é unitário. Como sua contagem termina em 1, também é finito. Não é vazio.',
    multiple: true,
  },
]

const operationChallenges: OperationChallenge[] = [
  {
    eyebrow: 'Missão 1 de 5',
    title: 'Junte sem repetir',
    instruction: 'Monte A ∪ B escolhendo tudo o que aparece em A ou em B.',
    concept: 'União (∪) reúne os elementos dos dois conjuntos. Um elemento repetido aparece uma só vez no resultado.',
    operator: '∪',
    setA: { id: 'union-a', name: 'A', label: 'Conjunto A', elements: [
      { id: 'apple', symbol: '🍎', label: 'maçã' },
      { id: 'banana', symbol: '🍌', label: 'banana' },
    ] },
    setB: { id: 'union-b', name: 'B', label: 'Conjunto B', elements: [
      { id: 'banana', symbol: '🍌', label: 'banana' },
      { id: 'grape', symbol: '🍇', label: 'uva' },
    ] },
    items: [
      { id: 'apple', symbol: '🍎', label: 'maçã' },
      { id: 'banana', symbol: '🍌', label: 'banana' },
      { id: 'grape', symbol: '🍇', label: 'uva' },
      { id: 'pear', symbol: '🍐', label: 'pera' },
    ],
    answers: ['apple', 'banana', 'grape'],
    tip: 'A união reúne maçã, banana e uva. A banana está nos dois conjuntos, mas não precisa ser repetida.',
  },
  {
    eyebrow: 'Missão 2 de 5',
    title: 'Descubra o que há em comum',
    instruction: 'Monte A ∩ B escolhendo apenas o que aparece nos dois conjuntos.',
    concept: 'Interseção (∩) mostra somente os elementos que pertencem aos dois conjuntos ao mesmo tempo.',
    operator: '∩',
    setA: { id: 'intersection-a', name: 'A', label: 'Conjunto A', elements: [
      { id: 'cat', symbol: '🐱', label: 'gato' },
      { id: 'fish', symbol: '🐟', label: 'peixe' },
    ] },
    setB: { id: 'intersection-b', name: 'B', label: 'Conjunto B', elements: [
      { id: 'fish', symbol: '🐟', label: 'peixe' },
      { id: 'butterfly', symbol: '🦋', label: 'borboleta' },
    ] },
    items: [
      { id: 'cat', symbol: '🐱', label: 'gato' },
      { id: 'fish', symbol: '🐟', label: 'peixe' },
      { id: 'butterfly', symbol: '🦋', label: 'borboleta' },
      { id: 'dog', symbol: '🐶', label: 'cachorro' },
    ],
    answers: ['fish'],
    tip: 'Somente o peixe aparece em A e também em B. Por isso A ∩ B = { peixe }.',
  },
  {
    eyebrow: 'Missão 3 de 5',
    title: 'O que ficou somente em A?',
    instruction: 'Monte A − B: escolha o que está em A, mas não está em B.',
    concept: 'Diferença (−) retira de A os elementos que também aparecem em B.',
    operator: '−',
    setA: { id: 'difference-a', name: 'A', label: 'Conjunto A', elements: [
      { id: '2', symbol: '2', label: 'dois' },
      { id: '4', symbol: '4', label: 'quatro' },
      { id: '6', symbol: '6', label: 'seis' },
      { id: '8', symbol: '8', label: 'oito' },
    ] },
    setB: { id: 'difference-b', name: 'B', label: 'Conjunto B', elements: [
      { id: '4', symbol: '4', label: 'quatro' },
      { id: '8', symbol: '8', label: 'oito' },
    ] },
    items: [
      { id: '2', symbol: '2', label: 'dois' },
      { id: '4', symbol: '4', label: 'quatro' },
      { id: '6', symbol: '6', label: 'seis' },
      { id: '8', symbol: '8', label: 'oito' },
    ],
    answers: ['2', '6'],
    tip: 'Retire de A os números 4 e 8, pois eles também estão em B. Restam 2 e 6.',
  },
  {
    eyebrow: 'Missão 4 de 5',
    title: 'Interseção de duas tabuadas',
    instruction: 'Monte A ∩ B encontrando os números que aparecem nas duas tabuadas.',
    concept: 'Na interseção, um elemento precisa cumprir as duas regras ao mesmo tempo.',
    operator: '∩',
    setA: { id: 'multiples-two', name: 'A', label: 'Múltiplos de 2', elements: [
      { id: '2', symbol: '2', label: 'dois' }, { id: '4', symbol: '4', label: 'quatro' }, { id: '6', symbol: '6', label: 'seis' }, { id: '8', symbol: '8', label: 'oito' }, { id: '10', symbol: '10', label: 'dez' }, { id: '12', symbol: '12', label: 'doze' }, { id: '14', symbol: '14', label: 'quatorze' },
    ] },
    setB: { id: 'multiples-three', name: 'B', label: 'Múltiplos de 3', elements: [
      { id: '3', symbol: '3', label: 'três' }, { id: '6', symbol: '6', label: 'seis' }, { id: '9', symbol: '9', label: 'nove' }, { id: '12', symbol: '12', label: 'doze' },
    ] },
    items: [
      { id: '2', symbol: '2', label: 'dois' }, { id: '3', symbol: '3', label: 'três' }, { id: '6', symbol: '6', label: 'seis' }, { id: '9', symbol: '9', label: 'nove' }, { id: '12', symbol: '12', label: 'doze' }, { id: '14', symbol: '14', label: 'quatorze' },
    ],
    answers: ['6', '12'],
    tip: '6 e 12 aparecem na tabuada do 2 e também na tabuada do 3. Eles são múltiplos de 6.',
  },
  {
    eyebrow: 'Missão 5 de 5',
    title: 'Descubra o complemento',
    instruction: 'Monte U − P: retire de U todos os números pares.',
    concept: 'O complemento de P em U é formado pelos elementos do universo U que não pertencem a P.',
    operator: '−',
    setA: { id: 'universe', name: 'U', label: 'Universo de 1 a 10', elements: [
      { id: '1', symbol: '1', label: 'um' }, { id: '2', symbol: '2', label: 'dois' }, { id: '3', symbol: '3', label: 'três' }, { id: '4', symbol: '4', label: 'quatro' }, { id: '5', symbol: '5', label: 'cinco' }, { id: '6', symbol: '6', label: 'seis' }, { id: '7', symbol: '7', label: 'sete' }, { id: '8', symbol: '8', label: 'oito' }, { id: '9', symbol: '9', label: 'nove' }, { id: '10', symbol: '10', label: 'dez' },
    ] },
    setB: { id: 'even-set', name: 'P', label: 'Números pares', elements: [
      { id: '2', symbol: '2', label: 'dois' }, { id: '4', symbol: '4', label: 'quatro' }, { id: '6', symbol: '6', label: 'seis' }, { id: '8', symbol: '8', label: 'oito' }, { id: '10', symbol: '10', label: 'dez' },
    ] },
    items: [
      { id: '1', symbol: '1', label: 'um' }, { id: '2', symbol: '2', label: 'dois' }, { id: '3', symbol: '3', label: 'três' }, { id: '4', symbol: '4', label: 'quatro' }, { id: '5', symbol: '5', label: 'cinco' }, { id: '6', symbol: '6', label: 'seis' }, { id: '7', symbol: '7', label: 'sete' }, { id: '8', symbol: '8', label: 'oito' }, { id: '9', symbol: '9', label: 'nove' }, { id: '10', symbol: '10', label: 'dez' },
    ],
    answers: ['1', '3', '5', '7', '9'],
    tip: 'Ao retirar 2, 4, 6, 8 e 10 do universo U, restam os ímpares 1, 3, 5, 7 e 9.',
  },
]

const tutorHints: Record<Island, string[]> = {
  1: [
    'Fale o nome de cada figura e pergunte: isso é uma fruta?',
    'Pergunte: é um animal? Uma planta também cresce e se alimenta, mas não é um animal.',
    'Um número par pode formar duplas sem sobrar nenhum.',
    'Percorra o contorno da forma e conte os lados retos. Precisamos de quatro.',
    'Conte de 3 em 3 e veja quais números aparecem entre as opções.',
  ],
  2: [
    'Leia a regra do conjunto e observe um elemento de cada vez.',
    'Dentro quer dizer que pertence. Fora quer dizer que não pertence.',
    'Compare cada número com 5 antes de decidir onde ele fica.',
    'O número precisa ser maior que 10 e menor que 20. As duas pistas valem juntas.',
    'Conte de 4 em 4. Quais opções aparecem nessa contagem?',
  ],
  3: [
    'Olhe todos os elementos do conjunto menor. Um só diferente já muda a resposta.',
    'Para ser subconjunto, todos os elementos precisam seguir a regra do conjunto maior.',
    'Teste cada número: ele aparece entre 2, 4, 6 e 8?',
    'Compare os conjuntos menores com o conjunto maior, elemento por elemento.',
    'Antes de escolher, verifique se nenhum elemento ficou fora da regra.',
  ],
  4: [
    'Conjuntos iguais têm exatamente os mesmos elementos, mesmo quando a ordem muda.',
    'Compare um elemento de cada vez e veja se existe algum a mais ou a menos.',
    'A posição dos elementos não altera a igualdade entre os conjuntos.',
    'Um elemento repetido só conta uma vez. Compare os elementos diferentes de cada conjunto.',
    'Use os símbolos = para iguais e ≠ para diferentes.',
  ],
  5: [
    'Observe quantos elementos existem no conjunto antes de escolher sua classificação.',
    'O conjunto unitário possui exatamente um elemento.',
    'Finito quer dizer que a contagem termina. Infinito continua sem fim.',
    'Imagine continuar contando. Existe um último elemento ou sempre aparece outro?',
    'Leia cada pista e veja se mais de uma classificação pode servir.',
  ],
  6: [
    'Na união, reúna os elementos dos dois conjuntos sem repetir.',
    'Na interseção, escolha somente os elementos que aparecem nos dois conjuntos.',
    'Na diferença, comece pelo primeiro conjunto e retire o que aparece no segundo.',
    'O número precisa aparecer nas duas tabuadas. Compare os dois conjuntos com calma.',
    'No complemento, procure no universo os elementos que ficaram fora do conjunto indicado.',
  ],
}

function selectionsMatch(selected: string[], answers: string[]) {
  return [...selected].sort().join(',') === [...answers].sort().join(',')
}

const islandAtmospheres: Record<Island, { name: string; detail: string; symbols: string }> = {
  1: { name: 'Praia dos Primeiros Grupos', detail: 'Observe, experimente e descubra o que combina.', symbols: '🌴 🧺 🍎' },
  2: { name: 'Bosque da Pertinência', detail: 'Decida quem fica dentro e quem fica fora.', symbols: '🌿 ∈ 🐾' },
  3: { name: 'Lagoa dos Subconjuntos', detail: 'Encontre conjuntos que cabem por inteiro em outros.', symbols: '💧 ⊂ 🐚' },
  4: { name: 'Montanha da Igualdade', detail: 'Compare com atenção: a ordem pode enganar.', symbols: '⛰️ = 🔎' },
  5: { name: 'Caverna das Classificações', detail: 'Use as pistas para reconhecer cada tipo.', symbols: '🔮 ∅ 💎' },
  6: { name: 'Vulcão das Operações', detail: 'Combine estratégias para resolver as missões finais.', symbols: '🌋 ∪ ∩' },
}

const islandBuildSteps: Array<{ island: Island; name: string; shortName: string; icon: string }> = [
  { island: 1, name: 'Praia e gramado', shortName: 'Terreno', icon: '🏖️' },
  { island: 2, name: 'Bosque dos exploradores', shortName: 'Bosque', icon: '🌴' },
  { island: 3, name: 'Lagoa dos subconjuntos', shortName: 'Lagoa', icon: '💧' },
  { island: 4, name: 'Vila da igualdade', shortName: 'Vila', icon: '🏡' },
  { island: 5, name: 'Caverna dos cristais', shortName: 'Caverna', icon: '💎' },
  { island: 6, name: 'Farol do conhecimento', shortName: 'Farol', icon: '⭐' },
]

function ExplorerIsland({ completedCount, compact = false }: { completedCount: number; compact?: boolean }) {
  return (
    <div className={`explorer-island ${compact ? 'compact' : ''} ${completedCount === 6 ? 'complete' : ''}`} aria-label={`Ilha do Explorador com ${completedCount} de 6 partes construídas`}>
      <span className="builder-cloud builder-cloud-one" aria-hidden="true" />
      <span className="builder-cloud builder-cloud-two" aria-hidden="true" />
      <span className="builder-sun" aria-hidden="true">☀</span>
      <div className={`builder-land ${completedCount >= 1 ? 'built' : 'waiting'}`}>
        <span className={`builder-piece builder-beach ${completedCount >= 1 ? 'built' : 'waiting'}`} aria-hidden="true">🐚</span>
        <span className={`builder-piece builder-forest ${completedCount >= 2 ? 'built' : 'waiting'}`} aria-hidden="true">🌴</span>
        <span className={`builder-piece builder-lagoon ${completedCount >= 3 ? 'built' : 'waiting'}`} aria-hidden="true">💧</span>
        <span className={`builder-piece builder-village ${completedCount >= 4 ? 'built' : 'waiting'}`} aria-hidden="true">🏡</span>
        <span className={`builder-piece builder-cave ${completedCount >= 5 ? 'built' : 'waiting'}`} aria-hidden="true">💎</span>
        <span className={`builder-piece builder-lighthouse ${completedCount >= 6 ? 'built' : 'waiting'}`} aria-hidden="true"><i>★</i><b /></span>
      </div>
      <div className="builder-water" aria-hidden="true"><span /><span /><span /></div>
      {completedCount === 6 && <div className="builder-celebration" aria-hidden="true">✦ ★ ✦</div>}
    </div>
  )
}

function App() {
  const [storedTutorProfile] = useState<TutorProfile | null>(() => loadTutorProfile())
  const [screen, setScreen] = useState<Screen>('login')
  const [profileReady, setProfileReady] = useState(() => storedTutorProfile !== null)
  const [tutorProfile, setTutorProfile] = useState<TutorProfile>(storedTutorProfile ?? defaultTutorProfile)
  const [customizerReturnScreen, setCustomizerReturnScreen] = useState<Screen>('login')
  const [tutorOpen, setTutorOpen] = useState(true)
  const [tutorMessage, setTutorMessage] = useState('')
  const [tutorExpression, setTutorExpression] = useState<TutorExpression>('happy')
  const [interactionIndex, setInteractionIndex] = useState({ encourage: 0, profession: 0 })
  const [hintStep, setHintStep] = useState(0)
  const [tutorStorageError, setTutorStorageError] = useState('')
  const [activeIsland, setActiveIsland] = useState<Island>(1)
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [movementMessage, setMovementMessage] = useState('')
  const [rewardMessage, setRewardMessage] = useState('')
  const [earnedStars, setEarnedStars] = useState(0)
  const [wasNewCompletion, setWasNewCompletion] = useState(false)
  const [firstIslandCompleted, setFirstIslandCompleted] = useState(
    () => localStorage.getItem(INTRO_PROGRESS_KEY) === '1',
  )
  const [secondIslandCompleted, setSecondIslandCompleted] = useState(
    () => localStorage.getItem(MEMBERSHIP_PROGRESS_KEY) === '1',
  )
  const [thirdIslandCompleted, setThirdIslandCompleted] = useState(
    () => localStorage.getItem(INCLUSION_PROGRESS_KEY) === '1',
  )
  const [fourthIslandCompleted, setFourthIslandCompleted] = useState(
    () => localStorage.getItem(EQUALITY_PROGRESS_KEY) === '1',
  )
  const [fifthIslandCompleted, setFifthIslandCompleted] = useState(
    () => localStorage.getItem(CLASSIFICATION_PROGRESS_KEY) === '1',
  )
  const [sixthIslandCompleted, setSixthIslandCompleted] = useState(
    () => localStorage.getItem(OPERATIONS_PROGRESS_KEY) === '1',
  )

  const challenge = challenges[challengeIndex]
  const membershipChallenge = membershipChallenges[challengeIndex]
  const inclusionChallenge = inclusionChallenges[challengeIndex]
  const equalityChallenge = equalityChallenges[challengeIndex]
  const classificationChallenge = classificationChallenges[challengeIndex]
  const operationChallenge = operationChallenges[challengeIndex]
  const challengeLengths: Record<Island, number> = {
    1: challenges.length,
    2: membershipChallenges.length,
    3: inclusionChallenges.length,
    4: equalityChallenges.length,
    5: classificationChallenges.length,
    6: operationChallenges.length,
  }
  const activeChallengesLength = challengeLengths[activeIsland]
  const progress = screen === 'result' ? 100 : (challengeIndex / activeChallengesLength) * 100
  const atmosphere = islandAtmospheres[activeIsland]
  const activeBuildStep = islandBuildSteps[activeIsland - 1]

  const selectedLabels = useMemo(
    () => challenge?.items.filter((item) => selected.includes(item.id)).map((item) => item.symbol),
    [challenge, selected],
  )
  const insideMembershipItems = useMemo(
    () => membershipChallenge?.items.filter((item) => selected.includes(item.id)) ?? [],
    [membershipChallenge, selected],
  )
  const outsideMembershipItems = useMemo(
    () => membershipChallenge?.items.filter((item) => !selected.includes(item.id)) ?? [],
    [membershipChallenge, selected],
  )
  const insideInclusionGroups = useMemo(
    () => inclusionChallenge?.groups.filter((group) => selected.includes(group.id)) ?? [],
    [inclusionChallenge, selected],
  )
  const outsideInclusionGroups = useMemo(
    () => inclusionChallenge?.groups.filter((group) => !selected.includes(group.id)) ?? [],
    [inclusionChallenge, selected],
  )
  const operationSelectedLabels = useMemo(
    () => operationChallenge?.items.filter((item) => selected.includes(item.id)).map((item) => item.symbol) ?? [],
    [operationChallenge, selected],
  )

  const completedIslands = [
    firstIslandCompleted,
    secondIslandCompleted,
    thirdIslandCompleted,
    fourthIslandCompleted,
    fifthIslandCompleted,
    sixthIslandCompleted,
  ]
  const completedCount = completedIslands.filter(Boolean).length
  const nextBuildStep = islandBuildSteps[Math.min(completedCount, 5)]
  const nextIslandToBuild = Math.min(completedCount + 1, 6) as Island
  const mapProgressLabel = completedCount === 6
    ? '6 ilhas concluídas'
    : `${Math.min(completedCount + 1, 6)} de 6 ilhas abertas`
  const contextTutorMessage = screen === 'result'
    ? `Conseguimos! A Ilha ${activeIsland} ganhou uma nova parte.`
    : screen === 'lesson'
      ? `Estou com você na missão ${challengeIndex + 1}. Observe com calma e peça uma dica quando quiser.`
      : completedCount === 6
        ? 'As seis ilhas estão completas! Podemos revisitar qualquer missão para praticar.'
        : `A Ilha ${nextIslandToBuild} está aberta. Vamos explorar ${islandAtmospheres[nextIslandToBuild].name}?`
  const visibleTutorMessage = tutorMessage || contextTutorMessage
  const tutorOutfit = getTutorOutfit(tutorProfile.outfit)
  const activeChallenge = ({ 1: challenge, 2: membershipChallenge, 3: inclusionChallenge, 4: equalityChallenge, 5: classificationChallenge, 6: operationChallenge })[activeIsland]

  function openTutorCustomizer(returnScreen: Screen = screen) {
    setTutorStorageError('')
    setCustomizerReturnScreen(returnScreen)
    setScreen('avatar')
    scrollToTop()
  }

  function enterAdventure() {
    if (!profileReady) {
      openTutorCustomizer('login')
      return
    }
    setTutorMessage(`Olá! Eu sou ${tutorProfile.name}. Que bom explorar com você outra vez!`)
    setTutorExpression('happy')
    setTutorOpen(true)
    setScreen('home')
    scrollToTop()
  }

  function saveTutorProfile(nextProfile: TutorProfile) {
    try {
      localStorage.setItem(TUTOR_PROFILE_KEY, JSON.stringify(nextProfile))
    } catch {
      setTutorStorageError('Não foi possível salvar neste navegador. Libere o armazenamento local e tente de novo. Suas escolhas continuam aqui.')
      return
    }
    setTutorProfile(nextProfile)
    setProfileReady(true)
    setInteractionIndex({ encourage: 0, profession: 0 })
    setTutorMessage(`Sou ${nextProfile.name}! ${getTutorOutfit(nextProfile.outfit).greeting}`)
    setTutorExpression('celebrate')
    setTutorOpen(true)
    setScreen(customizerReturnScreen === 'login' ? 'home' : customizerReturnScreen)
    scrollToTop()
  }

  function cancelTutorCustomizer() {
    setScreen(profileReady ? customizerReturnScreen : 'login')
    scrollToTop()
  }

  function tutorTalk(topic: 'encourage' | 'profession' = 'encourage') {
    setTutorMessage(getTutorComment(tutorProfile, topic, interactionIndex[topic], completedCount))
    setInteractionIndex(current => ({ ...current, [topic]: current[topic] + 1 }))
    setTutorExpression(topic === 'profession' ? 'curious' : 'happy')
    setTutorOpen(true)
  }

  function showTutorHint() {
    setTutorMessage(hintStep === 0
      ? tutorHints[activeIsland][challengeIndex] ?? activeChallenge.instruction
      : activeChallenge.tip)
    setHintStep(current => (current + 1) % 2)
    setTutorExpression('thinking')
    setTutorOpen(true)
  }

  function reactTutor(nextMessage: string, expression: TutorExpression = 'happy') {
    setTutorMessage(nextMessage)
    setTutorExpression(expression)
    setTutorOpen(true)
  }

  function scrollToTop() {
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
  }

  function goHome() {
    setTutorMessage('')
    setTutorExpression('happy')
    setScreen('home')
    scrollToTop()
  }

  function startIsland(island: Island) {
    if (island === 2 && !firstIslandCompleted) return
    if (island === 3 && !secondIslandCompleted) return
    if (island === 4 && !thirdIslandCompleted) return
    if (island === 5 && !fourthIslandCompleted) return
    if (island === 6 && !fifthIslandCompleted) return
    setActiveIsland(island)
    setHintStep(0)
    setChallengeIndex(0)
    setSelected([])
    setMessage('')
    setMovementMessage('')
    setRewardMessage('')
    setEarnedStars(0)
    setWasNewCompletion(false)
    reactTutor(`Ilha ${island}, missão 1. Leia o desafio e observe antes de escolher.`, 'curious')
    setScreen('lesson')
    scrollToTop()
  }

  function toggleItem(id: string) {
    setMessage('')
    setRewardMessage('')
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
    setTutorExpression('curious')
  }

  function selectSingleItem(id: string) {
    setMessage('')
    setRewardMessage('')
    setSelected([id])
  }

  function moveMembershipItem(item: Item) {
    const movingInside = !selected.includes(item.id)
    setMessage('')
    setRewardMessage('')
    setSelected((current) => movingInside ? [...current, item.id] : current.filter((id) => id !== item.id))
    setMovementMessage(`${item.label} foi movido para ${movingInside ? 'dentro' : 'fora'} do conjunto.`)
    setTutorMessage(`${item.label} foi para ${movingInside ? 'dentro' : 'fora'}. Agora compare com a regra do conjunto.`)
    setTutorExpression('curious')
    window.requestAnimationFrame(() => document.getElementById(`membership-item-${item.id}`)?.focus())
  }

  function moveInclusionGroup(group: SetGroup) {
    const movingInside = !selected.includes(group.id)
    setMessage('')
    setRewardMessage('')
    setSelected((current) => movingInside ? [...current, group.id] : current.filter((id) => id !== group.id))
    setMovementMessage(`${group.label} foi movido para ${movingInside ? 'dentro' : 'fora'} do conjunto maior.`)
    setTutorMessage(`${group.label} foi para ${movingInside ? 'dentro' : 'fora'}. Você conferiu todos os elementos?`)
    setTutorExpression('curious')
    window.requestAnimationFrame(() => document.getElementById(`inclusion-group-${group.id}`)?.focus())
  }

  function completeIsland(island: Island) {
    setWasNewCompletion(!completedIslands[island - 1])
    if (island === 1) {
      localStorage.setItem(INTRO_PROGRESS_KEY, '1')
      setFirstIslandCompleted(true)
    } else if (island === 2) {
      localStorage.setItem(MEMBERSHIP_PROGRESS_KEY, '1')
      setSecondIslandCompleted(true)
    } else if (island === 3) {
      localStorage.setItem(INCLUSION_PROGRESS_KEY, '1')
      setThirdIslandCompleted(true)
    } else if (island === 4) {
      localStorage.setItem(EQUALITY_PROGRESS_KEY, '1')
      setFourthIslandCompleted(true)
    } else if (island === 5) {
      localStorage.setItem(CLASSIFICATION_PROGRESS_KEY, '1')
      setFifthIslandCompleted(true)
    } else {
      localStorage.setItem(OPERATIONS_PROGRESS_KEY, '1')
      setSixthIslandCompleted(true)
    }
    reactTutor(`Incrível! Você concluiu a Ilha ${island}. Vamos comemorar!`, 'celebrate')
    setScreen('result')
    scrollToTop()
  }

  function advanceChallenge() {
    if (challengeIndex === activeChallengesLength - 1) {
      completeIsland(activeIsland)
      return
    }
    reactTutor(`Boa descoberta! Missão ${challengeIndex + 1} concluída. Agora vamos observar a próxima regra.`, 'celebrate')
    setHintStep(0)
    setChallengeIndex((value) => value + 1)
    setSelected([])
    setMessage('')
    setMovementMessage('')
  }

  function celebrateAndAdvance() {
    setEarnedStars((value) => value + 1)
    setRewardMessage('Muito bem! Sua estratégia funcionou. Você conquistou mais uma estrela.')
    advanceChallenge()
  }

  function checkIntroAnswer() {
    if (!selectionsMatch(selected, challenge.answers)) {
      setMessage(challenge.tip)
      reactTutor('Quase! Leia a explicação abaixo e compare cada figura com a regra.', 'thinking')
      return
    }
    celebrateAndAdvance()
  }

  function checkMembershipAnswer() {
    if (!selectionsMatch(selected, membershipChallenge.answers)) {
      setMessage(membershipChallenge.tip)
      reactTutor('Vamos conferir de novo: quem segue a regra fica dentro e quem não segue fica fora.', 'thinking')
      return
    }
    celebrateAndAdvance()
  }

  function checkInclusionAnswer() {
    if (!selectionsMatch(selected, inclusionChallenge.answers)) {
      setMessage(inclusionChallenge.tip)
      reactTutor('Olhe um conjunto por vez. Todos os elementos precisam caber na regra do conjunto maior.', 'thinking')
      return
    }
    celebrateAndAdvance()
  }

  function checkEqualityAnswer() {
    if (!selectionsMatch(selected, equalityChallenge.answers)) {
      setMessage(equalityChallenge.tip)
      reactTutor('Vamos comparar de novo: não pode faltar nem sobrar elemento. A ordem não importa.', 'thinking')
      return
    }
    celebrateAndAdvance()
  }

  function checkClassificationAnswer() {
    if (!selectionsMatch(selected, classificationChallenge.answers)) {
      setMessage(classificationChallenge.tip)
      reactTutor('Vamos pensar na quantidade de elementos e se a contagem termina. A explicação ajuda!', 'thinking')
      return
    }
    celebrateAndAdvance()
  }

  function checkOperationAnswer() {
    if (!selectionsMatch(selected, operationChallenge.answers)) {
      setMessage(operationChallenge.tip)
      reactTutor('Veja o símbolo da operação. Ele diz se vamos juntar, encontrar o que é comum ou retirar.', 'thinking')
      return
    }
    celebrateAndAdvance()
  }

  function renderMembershipItem(item: Item, isInside: boolean) {
    const relation = isInside ? '∈' : '∉'
    const destination = isInside ? 'fora' : 'dentro'
    return (
      <button
        id={`membership-item-${item.id}`}
        key={item.id}
        className={`membership-item ${isInside ? 'inside' : 'outside'}`}
        aria-pressed={isInside}
        aria-label={`${item.label}, ${isInside ? 'dentro' : 'fora'} do ${membershipChallenge.setName}. Mover para ${destination}`}
        onClick={() => moveMembershipItem(item)}
      >
        <span className="membership-symbol" aria-hidden="true">{item.symbol}</span>
        <strong>{item.label}</strong>
        {membershipChallenge.showNotation && <span className="membership-relation" aria-hidden="true">{item.symbol} {relation} {membershipChallenge.setName.replace('Conjunto ', '')}</span>}
        <small>{isInside ? '← Mover para fora' : 'Mover para dentro →'}</small>
      </button>
    )
  }

  function renderInclusionGroup(group: SetGroup, isInside: boolean) {
    const outerSymbol = inclusionChallenge.outerName.split(' ')[0]
    const relation = isInside ? '⊂' : '⊄'
    const destination = isInside ? 'fora' : 'dentro'
    const elementNames = group.elements.map((element) => element.label).join(' e ')
    return (
      <button
        id={`inclusion-group-${group.id}`}
        key={group.id}
        className={`set-group-card ${isInside ? 'inside' : 'outside'}`}
        aria-pressed={isInside}
        aria-label={`${group.label}, formado por ${elementNames}, ${isInside ? 'dentro' : 'fora'} de ${inclusionChallenge.outerName}. Mover para ${destination}`}
        onClick={() => moveInclusionGroup(group)}
      >
        <span className="set-group-name">Conjunto {group.name}</span>
        <span className="mini-set" aria-hidden="true"><i>{'{'}</i>{group.elements.map((element) => <b key={element.id}>{element.symbol}</b>)}<i>{'}'}</i></span>
        <strong>{group.label}</strong>
        {inclusionChallenge.showNotation && <span className="subset-relation" aria-hidden="true">{group.name} {relation} {outerSymbol}</span>}
        <small>{isInside ? '← Mover para fora' : 'Mover para dentro →'}</small>
      </button>
    )
  }

  const resultContentByIsland: Record<Island, { kicker: string; title: string; description: string; symbol: string }> = {
    1: {
      kicker: 'ILHA 1 CONCLUÍDA',
      title: 'Você sabe formar conjuntos!',
      description: 'Um conjunto é uma coleção de elementos que compartilham uma característica.',
      symbol: '★',
    },
    2: {
      kicker: 'ILHA 2 CONCLUÍDA',
      title: 'Você descobriu quem pertence!',
      description: 'O símbolo ∈ indica que um elemento pertence ao conjunto. O símbolo ∉ indica que não pertence.',
      symbol: '∈',
    },
    3: {
      kicker: 'ILHA 3 CONCLUÍDA',
      title: 'Você encontrou os subconjuntos!',
      description: 'Um subconjunto fica contido em outro quando todos os seus elementos também pertencem ao conjunto maior.',
      symbol: '⊂',
    },
    4: {
      kicker: 'ILHA 4 CONCLUÍDA',
      title: 'Você reconhece conjuntos iguais!',
      description: 'Conjuntos iguais têm exatamente os mesmos elementos, mesmo quando aparecem em outra ordem.',
      symbol: '=',
    },
    5: {
      kicker: 'ILHA 5 CONCLUÍDA',
      title: 'Você classificou os conjuntos!',
      description: 'Agora você reconhece conjuntos vazios, unitários, finitos e infinitos.',
      symbol: '∅',
    },
    6: {
      kicker: 'ILHA 6 CONCLUÍDA',
      title: 'Você dominou as operações!',
      description: 'União reúne, interseção encontra o que há em comum e diferença mostra o que restou.',
      symbol: '∪',
    },
  }
  const resultContent = resultContentByIsland[activeIsland]

  function renderTutorCompanion() {
    return (
      <aside className={`guide-companion ${tutorOpen ? 'is-open' : 'is-closed'}`} aria-label={`Tutor ${tutorProfile.name}`}>
        <div className="guide-header">
          <TutorAvatar profile={tutorProfile} size="medium" expression={tutorExpression} animated={tutorOpen} />
          <div><span className="guide-kicker">SEU COMPANHEIRO</span><h2>{tutorProfile.name}</h2><span className="guide-profession">{tutorOutfit.symbol} {tutorOutfit.label}</span></div>
          <button className="guide-collapse" onClick={() => setTutorOpen(current => !current)} aria-expanded={tutorOpen} aria-controls="guide-conversation" aria-label={tutorOpen ? 'Recolher conversa do tutor' : 'Abrir conversa do tutor'}>{tutorOpen ? '−' : '+'}</button>
        </div>
        {tutorOpen && <div className="guide-conversation" id="guide-conversation">
          <p className="guide-speech" aria-live="polite">{visibleTutorMessage}</p>
          <div className="guide-actions">
            {screen === 'lesson' && <button className="guide-hint" onClick={showTutorHint}>💡 {hintStep === 0 ? 'Quero uma dica' : 'Mais ajuda'}</button>}
            <button onClick={() => tutorTalk('encourage')}>☺ Me anime</button>
            <button onClick={() => tutorTalk('profession')}>✦ Uma curiosidade</button>
          </div>
          <div className="guide-progress"><span>{completedCount} de 6 ilhas concluídas</span><div aria-hidden="true">{completedIslands.map((done, index) => <i key={index} className={done ? 'done' : ''}>{done ? '✓' : index + 1}</i>)}</div></div>
          <button className="guide-customize" onClick={() => openTutorCustomizer(screen)}>✎ Mudar meu visual <span aria-hidden="true">→</span></button>
          <small className="guide-footnote">Dicas prontas para aprender no seu ritmo.</small>
        </div>}
      </aside>
    )
  }

  return (
    <div className={`site-shell screen-${screen} ${screen === 'lesson' ? `theme-island-${activeIsland}` : 'theme-home'}`}>
      {screen !== 'login' && screen !== 'avatar' && (
        <header className="topbar">
          <button className="brand" onClick={goHome} aria-label="Voltar ao início">
            <span className="brand-mark" aria-hidden="true">∴</span><span>Ilha dos Conjuntos</span>
          </button>
          <button className="student-chip tutor-profile-button" onClick={() => openTutorCustomizer(screen)} aria-label={`Personalizar o tutor ${tutorProfile.name}`}>
            <TutorAvatar profile={tutorProfile} size="mini" expression={tutorExpression} />
            <span><small>MEU COMPANHEIRO</small><strong>{tutorProfile.name} <i aria-hidden="true">✎</i></strong></span>
          </button>
        </header>
      )}

      {screen === 'login' && (
        <main className="entry-page">
          <section className="login-card" aria-labelledby="login-title">
            <div className="login-copy">
              <div className="entry-brand"><span className="brand-mark" aria-hidden="true">∴</span><strong>Ilha dos Conjuntos</strong></div>
              <span className="login-kicker">PEQUENAS IDEIAS. GRANDES DESCOBERTAS.</span>
              <h1 id="login-title">Toda aventura começa com <em>uma conexão.</em></h1>
              <p>Um mundo de ilhas, conjuntos e descobertas. E um companheiro feito por você para explorar tudo isso.</p>
              {profileReady ? (
                <div className="returning-profile">
                  <span>Seu tutor está esperando:</span>
                  <strong>{tutorProfile.name}</strong>
                </div>
              ) : (
                <div className="first-access-note"><span aria-hidden="true">✨</span><p>Na primeira entrada, você vai criar seu próprio tutor.</p></div>
              )}
              <div className="entry-milestones"><span><b>01</b> Crie seu tutor</span><span><b>02</b> Explore as ilhas</span><span><b>03</b> Faça descobertas</span></div>
              <div className="login-actions">
                <button className="primary-button" onClick={enterAdventure}>
                  {profileReady ? `Continuar com ${tutorProfile.name}` : 'Entrar e criar meu tutor'} <span aria-hidden="true">→</span>
                </button>
                {profileReady && <button className="text-button" onClick={() => openTutorCustomizer('login')}>Mudar meu tutor</button>}
              </div>
              <p className="privacy-note"><span aria-hidden="true">🔒</span><span><strong>Entrada segura:</strong> sem e-mail, senha, foto ou nome da criança. Tudo fica somente neste dispositivo.</span></p>
            </div>
            <div className="login-tutor-preview" aria-label={`Prévia do tutor ${tutorProfile.name}`}>
              <span className="entry-stage-tag">CONHEÇA SEU COMPANHEIRO</span>
              <span className="preview-orbit orbit-one" aria-hidden="true">∈</span>
              <span className="preview-orbit orbit-two" aria-hidden="true">★</span>
              <div className="login-speech">{profileReady ? `Oi! Sou ${tutorProfile.name}. Vamos continuar?` : 'Oi! Vou ajudar em cada descoberta.'}</div>
              <TutorAvatar profile={tutorProfile} size="large" expression="happy" animated />
              <span className="entry-character-name">{tutorProfile.name}<small>{tutorOutfit.symbol} {tutorOutfit.label} de novas ideias</small></span>
              <div className="entry-stage-footer"><span>6 ilhas para explorar</span><span>∞ possibilidades de aprender</span></div>
            </div>
          </section>
        </main>
      )}

      {screen === 'avatar' && <TutorStudio profile={tutorProfile} onSave={saveTutorProfile} onCancel={cancelTutorCustomizer} error={tutorStorageError} />}

      {screen === 'home' && (
        <main>
          <section className="hero-section">
            <div className="hero-copy">
              <div className="eyebrow"><span>★</span> Uma aventura matemática</div>
              <h1>Descubra o poder de <em>agrupar!</em></h1>
              <p>Explore ilhas, organize elementos e aprenda conjuntos brincando. Cada missão deixa o mapa um pouco mais colorido.</p>
              <button className="primary-button" onClick={() => startIsland(nextIslandToBuild)}>{completedCount === 0 ? 'Começar aventura' : completedCount === 6 ? 'Revisitar a última ilha' : 'Continuar minha aventura'} <span aria-hidden="true">→</span></button>
              <div className="hero-notes" aria-label="Características da atividade"><span>✓ Sem cronômetro</span><span>✓ Aprenda no seu ritmo</span></div>
            </div>
            <div className="expedition-card" aria-label={`Seu tutor ${tutorProfile.name}, ${tutorOutfit.label}`}>
              <span className="expedition-stamp">PASSAPORTE DE DESCOBERTAS</span>
              <div className="expedition-portrait"><span className="expedition-symbol symbol-one" aria-hidden="true">∈</span><span className="expedition-symbol symbol-two" aria-hidden="true">⊂</span><TutorAvatar profile={tutorProfile} size="large" animated /><span className="expedition-spark" aria-hidden="true">✦</span></div>
              <div className="expedition-identity"><div><small>SEU PARCEIRO DE MISSÃO</small><h2>{tutorProfile.name}</h2><p>{tutorOutfit.symbol} {tutorOutfit.label}</p></div><button className="round-button" onClick={() => openTutorCustomizer('home')} aria-label="Abrir oficina do tutor">✎</button></div>
              <div className="expedition-stats"><span><strong>{completedCount}/6</strong> ilhas concluídas</span><span><strong>30</strong> missões no mapa</span></div>
            </div>
          </section>
          <div className="home-guide">{renderTutorCompanion()}</div>
          <section className="island-builder-section" aria-labelledby="builder-title">
            <div className="island-builder-copy">
              <span className="section-kicker">SUA GRANDE CONQUISTA</span>
              <h2 id="builder-title">Construa a Ilha do Explorador</h2>
              <p>{completedCount === 0
                ? 'A ilha ainda está sem cor. Termine a primeira etapa para fazer o terreno despertar.'
                : completedCount === 6
                  ? 'Você completou as seis etapas e deu vida à ilha inteira. Cada parte mostra uma habilidade que conquistou.'
                  : `Você já construiu ${completedCount} de 6 partes. A próxima conquista libera: ${nextBuildStep.name}.`}</p>
              <div className="builder-step-list" aria-label={`${completedCount} de 6 partes construídas`}>
                {islandBuildSteps.map((step) => { const built = completedCount >= step.island; const current = !built && step.island === nextIslandToBuild; return <span key={step.island} className={`${built ? 'built' : 'waiting'} ${current ? 'current' : ''}`}><i aria-hidden="true">{built ? step.icon : step.island}</i><small>{step.shortName}</small><strong>{built ? 'Construído' : current ? 'Próximo' : 'Em espera'}</strong></span> })}
              </div>
              {completedCount < 6 && <button className="primary-button builder-cta" onClick={() => startIsland(nextIslandToBuild)}>Construir a próxima parte <span aria-hidden="true">→</span></button>}
              {completedCount === 6 && <div className="island-complete-badge"><span aria-hidden="true">★</span><strong>ILHA COMPLETA</strong></div>}
            </div>
            <ExplorerIsland completedCount={completedCount} />
          </section>
          <section className="trail-section" aria-labelledby="trail-title">
            <div className="section-heading"><div><span className="section-kicker">SEU MAPA DE AVENTURAS</span><h2 id="trail-title">Uma descoberta de cada vez</h2></div><span className="progress-label">{mapProgressLabel}</span></div>
            <div className="stage-grid">
              <article className={`stage-card active ${firstIslandCompleted ? 'completed' : ''}`}><span className="stage-number">01</span><div className="stage-icon yellow">{firstIslandCompleted ? '★' : '🧺'}</div><span className="status-tag">{firstIslandCompleted ? 'ILHA CONCLUÍDA' : 'PRONTO PARA JOGAR'}</span><h3>O que é um conjunto?</h3><p>Agrupe objetos que possuem algo em comum.</p><small className="mission-count">5 missões • início tranquilo</small><button onClick={() => startIsland(1)}>{firstIslandCompleted ? 'Jogar novamente' : 'Explorar esta ilha'} <span>→</span></button></article>
              <article className={`stage-card ${firstIslandCompleted ? 'active' : 'locked'} ${secondIslandCompleted ? 'completed' : ''}`}><span className="stage-number">02</span><div className="stage-icon coral">{secondIslandCompleted ? '★' : '∈'}</div><span className="status-tag">{secondIslandCompleted ? 'ILHA CONCLUÍDA' : firstIslandCompleted ? 'PRONTO PARA JOGAR' : 'BLOQUEADA'}</span><h3>Quem pertence?</h3><p>Descubra a relação de pertinência.</p><small className="mission-count">5 missões • novas regras</small>{firstIslandCompleted ? <button onClick={() => startIsland(2)}>{secondIslandCompleted ? 'Jogar novamente' : 'Explorar esta ilha'} <span>→</span></button> : <span className="locked-note">Conclua a Ilha 1 para liberar.</span>}</article>
              <article className={`stage-card ${secondIslandCompleted ? 'active' : 'locked'} ${thirdIslandCompleted ? 'completed' : ''}`}><span className="stage-number">03</span><div className="stage-icon blue">{thirdIslandCompleted ? '★' : '⊂'}</div><span className="status-tag">{thirdIslandCompleted ? 'ILHA CONCLUÍDA' : secondIslandCompleted ? 'PRONTO PARA JOGAR' : 'BLOQUEADA'}</span><h3>Conjuntos dentro de conjuntos</h3><p>Conheça subconjuntos e inclusão.</p><small className="mission-count">5 missões • atenção a cada elemento</small>{secondIslandCompleted ? <button onClick={() => startIsland(3)}>{thirdIslandCompleted ? 'Jogar novamente' : 'Explorar esta ilha'} <span>→</span></button> : <span className="locked-note">Conclua a Ilha 2 para liberar.</span>}</article>
              <article className={`stage-card ${thirdIslandCompleted ? 'active' : 'locked'} ${fourthIslandCompleted ? 'completed' : ''}`}><span className="stage-number">04</span><div className="stage-icon purple">{fourthIslandCompleted ? '★' : '='}</div><span className="status-tag">{fourthIslandCompleted ? 'ILHA CONCLUÍDA' : thirdIslandCompleted ? 'PRONTO PARA JOGAR' : 'BLOQUEADA'}</span><h3>Conjuntos iguais</h3><p>Compare coleções, mesmo em ordens diferentes.</p><small className="mission-count">5 missões • comparação cuidadosa</small>{thirdIslandCompleted ? <button onClick={() => startIsland(4)}>{fourthIslandCompleted ? 'Jogar novamente' : 'Explorar esta ilha'} <span>→</span></button> : <span className="locked-note">Conclua a Ilha 3 para liberar.</span>}</article>
              <article className={`stage-card ${fourthIslandCompleted ? 'active' : 'locked'} ${fifthIslandCompleted ? 'completed' : ''}`}><span className="stage-number">05</span><div className="stage-icon mint">{fifthIslandCompleted ? '★' : '∅'}</div><span className="status-tag">{fifthIslandCompleted ? 'ILHA CONCLUÍDA' : fourthIslandCompleted ? 'PRONTO PARA JOGAR' : 'BLOQUEADA'}</span><h3>Tipos de conjuntos</h3><p>Conheça conjuntos vazios, unitários e finitos.</p><small className="mission-count">5 missões • ideias que se combinam</small>{fourthIslandCompleted ? <button onClick={() => startIsland(5)}>{fifthIslandCompleted ? 'Jogar novamente' : 'Explorar esta ilha'} <span>→</span></button> : <span className="locked-note">Conclua a Ilha 4 para liberar.</span>}</article>
              <article className={`stage-card ${fifthIslandCompleted ? 'active' : 'locked'} ${sixthIslandCompleted ? 'completed' : ''}`}><span className="stage-number">06</span><div className="stage-icon orange">{sixthIslandCompleted ? '★' : '∪'}</div><span className="status-tag">{sixthIslandCompleted ? 'ILHA CONCLUÍDA' : fifthIslandCompleted ? 'PRONTO PARA JOGAR' : 'BLOQUEADA'}</span><h3>Operações com conjuntos</h3><p>Pratique união, interseção e diferença.</p><small className="mission-count">5 missões • desafio final</small>{fifthIslandCompleted ? <button onClick={() => startIsland(6)}>{sixthIslandCompleted ? 'Jogar novamente' : 'Explorar esta ilha'} <span>→</span></button> : <span className="locked-note">Conclua a Ilha 5 para liberar.</span>}</article>
            </div>
          </section>
        </main>
      )}

      {screen === 'lesson' && (
        <main className="lesson-page">
          <div className="lesson-progress" aria-label={`Progresso: ${Math.round(progress)}%`}><button className="back-button" onClick={goHome} aria-label="Sair da atividade">←</button><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><strong>{challengeIndex + 1}/{activeChallengesLength}</strong><span className="star-counter" aria-label={`${earnedStars} estrelas conquistadas`}>★ {earnedStars}</span></div>
          <section className="island-atmosphere" aria-label={`Cenário: ${atmosphere.name}`}><span aria-hidden="true">{atmosphere.symbols}</span><div><small>VOCÊ CHEGOU À</small><strong>{atmosphere.name}</strong><p>{atmosphere.detail}</p></div></section>
          {renderTutorCompanion()}
          {rewardMessage && <p className="reward-banner" role="status">★ {rewardMessage}</p>}
          {activeIsland === 1 ? (
            <section className="challenge-card">
              <div className="challenge-copy"><span className="section-kicker">{challenge.eyebrow}</span><h1>{challenge.title}</h1><p>{challenge.instruction}</p></div>
              <div className="set-board"><div className="set-label">{challenge.setName}</div><div className="selected-set" aria-live="polite"><span className="brace">{'{'}</span><div>{selectedLabels.length === 0 ? <span className="empty-hint">seus elementos aparecerão aqui</span> : selectedLabels.map((symbol, index) => <span className="selected-symbol" key={`${symbol}-${index}`}>{symbol}</span>)}</div><span className="brace">{'}'}</span></div></div>
              <div className="item-grid" aria-label="Elementos disponíveis">
                {challenge.items.map((item) => { const isSelected = selected.includes(item.id); return <button key={item.id} className={`item-button ${isSelected ? 'selected' : ''}`} aria-pressed={isSelected} aria-label={`${item.label}${isSelected ? ', selecionado' : ''}`} onClick={() => toggleItem(item.id)}><span>{item.symbol}</span><small>{item.label}</small><i aria-hidden="true">{isSelected ? '✓' : '+'}</i></button> })}
              </div>
              <div className="challenge-footer"><p className={message ? 'feedback visible' : 'feedback'} aria-live="polite">{message || 'Escolha com calma. Você pode mudar sua resposta.'}</p><button className="primary-button" disabled={selected.length === 0} onClick={checkIntroAnswer}>Conferir resposta</button></div>
            </section>
          ) : activeIsland === 2 ? (
            <section className="challenge-card membership-card">
              <div className="challenge-copy"><span className="section-kicker">ILHA 2 • {membershipChallenge.eyebrow}</span><h1>{membershipChallenge.title}</h1><p>{membershipChallenge.instruction}</p></div>
              {membershipChallenge.showNotation && <div className="notation-guide" aria-label="Significado dos símbolos de pertinência"><span><strong>∈</strong> pertence ao conjunto</span><span><strong>∉</strong> não pertence ao conjunto</span></div>}
              <div className="membership-rule"><span>REGRA DO CONJUNTO</span><strong>{membershipChallenge.setName}: {membershipChallenge.rule}</strong></div>
              <div className="membership-board">
                <section className="membership-zone outside-zone" aria-labelledby="outside-title">
                  <div className="membership-zone-heading"><span aria-hidden="true">○</span><div><small id="outside-title">{membershipChallenge.showNotation ? 'NÃO PERTENCE • ∉' : 'FORA DO CONJUNTO'}</small><strong>Elementos do lado de fora</strong></div></div>
                  <div className="membership-item-grid">{outsideMembershipItems.length > 0 ? outsideMembershipItems.map((item) => renderMembershipItem(item, false)) : <p className="zone-empty">Todos os elementos estão dentro.</p>}</div>
                </section>
                <section className="membership-zone inside-zone" aria-labelledby="inside-title">
                  <div className="membership-zone-heading"><span aria-hidden="true">{membershipChallenge.showNotation ? '∈' : '●'}</span><div><small id="inside-title">{membershipChallenge.showNotation ? 'PERTENCE • ∈' : 'DENTRO DO CONJUNTO'}</small><strong>{membershipChallenge.setName}</strong></div></div>
                  <div className="membership-item-grid">{insideMembershipItems.length > 0 ? insideMembershipItems.map((item) => renderMembershipItem(item, true)) : <p className="zone-empty">Mova para cá quem segue a regra.</p>}</div>
                </section>
              </div>
              <p className="sr-only" aria-live="polite">{movementMessage}</p>
              <div className="challenge-footer"><p className={message ? 'feedback visible' : 'feedback'} aria-live="polite">{message || 'Toque em um elemento para movê-lo. Você pode mudar de ideia.'}</p><button className="primary-button" disabled={selected.length === 0} onClick={checkMembershipAnswer}>Conferir resposta</button></div>
            </section>
          ) : activeIsland === 3 ? (
            <section className="challenge-card inclusion-card">
              <div className="challenge-copy"><span className="section-kicker">ILHA 3 • {inclusionChallenge.eyebrow}</span><h1>{inclusionChallenge.title}</h1><p>{inclusionChallenge.instruction}</p></div>
              <div className="inclusion-concept"><span aria-hidden="true">💡</span><div><small>IDEIA IMPORTANTE</small><p>{inclusionChallenge.concept}</p></div></div>
              {inclusionChallenge.showNotation && <div className="notation-guide" aria-label="Significado dos símbolos de inclusão"><span><strong>⊂</strong> está contido</span><span><strong>⊄</strong> não está contido</span></div>}
              <div className="inclusion-rule"><span>CONJUNTO MAIOR</span><strong>{inclusionChallenge.outerName}</strong><small>Regra: {inclusionChallenge.outerRule}</small></div>
              <div className="inclusion-board">
                <section className="inclusion-zone group-palette" aria-labelledby="inclusion-outside-title">
                  <div className="inclusion-zone-heading"><span aria-hidden="true">◇</span><div><small id="inclusion-outside-title">CONJUNTOS PARA ANALISAR</small><strong>Observe todos os elementos</strong></div></div>
                  <div className="set-group-grid">{outsideInclusionGroups.length > 0 ? outsideInclusionGroups.map((group) => renderInclusionGroup(group, false)) : <p className="zone-empty">Todos os conjuntos foram colocados dentro.</p>}</div>
                </section>
                <section className="inclusion-zone outer-set-zone" aria-labelledby="inclusion-inside-title">
                  <div className="inclusion-zone-heading"><span aria-hidden="true">{inclusionChallenge.showNotation ? '⊂' : '◎'}</span><div><small id="inclusion-inside-title">{inclusionChallenge.showNotation ? 'ESTÁ CONTIDO • ⊂' : 'DENTRO DO CONJUNTO MAIOR'}</small><strong>{inclusionChallenge.outerName}</strong></div></div>
                  <p className="outer-rule-reminder">Aqui só entram conjuntos em que <strong>todos</strong> os elementos seguem a regra.</p>
                  <div className="set-group-grid inside-group-grid">{insideInclusionGroups.length > 0 ? insideInclusionGroups.map((group) => renderInclusionGroup(group, true)) : <p className="zone-empty">Mova para cá os conjuntos menores que cabem por inteiro.</p>}</div>
                </section>
              </div>
              <p className="sr-only" aria-live="polite">{movementMessage}</p>
              <div className="challenge-footer"><p className={message ? 'feedback visible' : 'feedback'} aria-live="polite">{message || 'Confira todos os elementos antes de mover um conjunto.'}</p><button className="primary-button" disabled={selected.length === 0} onClick={checkInclusionAnswer}>Conferir resposta</button></div>
            </section>
          ) : activeIsland === 4 ? (
            <section className="challenge-card equality-card">
              <div className="challenge-copy"><span className="section-kicker">ILHA 4 • {equalityChallenge.eyebrow}</span><h1>{equalityChallenge.title}</h1><p>{equalityChallenge.instruction}</p></div>
              <div className="inclusion-concept"><span aria-hidden="true">💡</span><div><small>IDEIA IMPORTANTE</small><p>{equalityChallenge.concept}</p></div></div>
              {equalityChallenge.showNotation && <div className="notation-guide" aria-label="Significado dos símbolos de igualdade"><span><strong>=</strong> conjuntos iguais</span><span><strong>≠</strong> conjuntos diferentes</span></div>}
              <div className="reference-set" aria-label={`Conjunto ${equalityChallenge.reference.name}, usado como referência`}>
                <span>CONJUNTO DE REFERÊNCIA</span>
                <strong>{equalityChallenge.reference.name}</strong>
                <div className="large-mini-set" aria-label={equalityChallenge.reference.elements.map((item) => item.label).join(', ')}><i>{'{'}</i>{equalityChallenge.reference.elements.map((item) => <b key={item.id}>{item.symbol}</b>)}<i>{'}'}</i></div>
              </div>
              <div className="equality-grid" aria-label="Conjuntos para comparar">
                {equalityChallenge.groups.map((group) => { const isSelected = selected.includes(group.id); return (
                  <button key={group.id} className={`comparison-card ${isSelected ? 'selected' : ''}`} aria-pressed={isSelected} onClick={() => selectSingleItem(group.id)} aria-label={`${group.label}: ${group.elements.map((item) => item.label).join(', ')}`}>
                    <span>CONJUNTO {group.name}</span><div className="large-mini-set" aria-hidden="true"><i>{'{'}</i>{group.elements.map((item) => <b key={`${group.id}-${item.id}`}>{item.symbol}</b>)}<i>{'}'}</i></div><strong>{isSelected ? '✓ Escolhido' : `Comparar com ${equalityChallenge.reference.name}`}</strong>
                  </button>
                ) })}
              </div>
              <div className="challenge-footer"><p className={message ? 'feedback visible' : 'feedback'} aria-live="polite">{message || 'Compare cada elemento. A ordem pode mudar, mas o conteúdo precisa ser o mesmo.'}</p><button className="primary-button" disabled={selected.length === 0} onClick={checkEqualityAnswer}>Conferir resposta</button></div>
            </section>
          ) : activeIsland === 5 ? (
            <section className="challenge-card classification-card">
              <div className="challenge-copy"><span className="section-kicker">ILHA 5 • {classificationChallenge.eyebrow}</span><h1>{classificationChallenge.title}</h1><p>{classificationChallenge.instruction}</p></div>
              <div className="inclusion-concept"><span aria-hidden="true">💡</span><div><small>IDEIA IMPORTANTE</small><p>{classificationChallenge.concept}</p></div></div>
              <div className="classification-grid" aria-label="Conjuntos para classificar">
                {classificationChallenge.options.map((option) => { const isSelected = selected.includes(option.id); return (
                  <button key={option.id} className={`classification-option ${isSelected ? 'selected' : ''}`} aria-pressed={isSelected} onClick={() => classificationChallenge.multiple ? toggleItem(option.id) : selectSingleItem(option.id)}>
                    <span className="classification-symbol" aria-hidden="true">{option.symbol}</span><small>CONJUNTO {option.name}</small><strong>{option.notation}</strong><p>{option.detail}</p><i aria-hidden="true">{isSelected ? '✓ Escolhido' : 'Toque para escolher'}</i>
                  </button>
                ) })}
              </div>
              <div className="challenge-footer"><p className={message ? 'feedback visible' : 'feedback'} aria-live="polite">{message || 'Observe quantos elementos existem e se a contagem termina.'}</p><button className="primary-button" disabled={selected.length === 0} onClick={checkClassificationAnswer}>Conferir resposta</button></div>
            </section>
          ) : (
            <section className="challenge-card operation-card">
              <div className="challenge-copy"><span className="section-kicker">ILHA 6 • {operationChallenge.eyebrow}</span><h1>{operationChallenge.title}</h1><p>{operationChallenge.instruction}</p></div>
              <div className="inclusion-concept"><span aria-hidden="true">💡</span><div><small>IDEIA IMPORTANTE</small><p>{operationChallenge.concept}</p></div></div>
              <div className="operation-sets" aria-label={`Operação ${operationChallenge.setA.name} ${operationChallenge.operator} ${operationChallenge.setB.name}`}>
                {[operationChallenge.setA, operationChallenge.setB].map((group, index) => <div className={`operation-set operation-set-${index + 1}`} key={group.id}><small>CONJUNTO {group.name}</small><div className="large-mini-set" aria-label={group.elements.map((item) => item.label).join(', ')}><i>{'{'}</i>{group.elements.map((item) => <b key={`${group.id}-${item.id}`}>{item.symbol}</b>)}<i>{'}'}</i></div></div>)}
                <span className="operation-sign" aria-hidden="true">{operationChallenge.operator}</span>
              </div>
              <div className="operation-result"><span>MONTE O RESULTADO</span><strong>{operationChallenge.setA.name} {operationChallenge.operator} {operationChallenge.setB.name} =</strong><div className="selected-set" aria-live="polite"><span className="brace">{'{'}</span><div>{operationSelectedLabels.length === 0 ? <span className="empty-hint">escolha os elementos</span> : operationSelectedLabels.map((symbol, index) => <span className="selected-symbol" key={`${symbol}-${index}`}>{symbol}</span>)}</div><span className="brace">{'}'}</span></div></div>
              <div className="item-grid operation-items" aria-label="Elementos disponíveis para o resultado">
                {operationChallenge.items.map((item) => { const isSelected = selected.includes(item.id); return <button key={item.id} className={`item-button ${isSelected ? 'selected' : ''}`} aria-pressed={isSelected} aria-label={`${item.label}${isSelected ? ', selecionado' : ''}`} onClick={() => toggleItem(item.id)}><span>{item.symbol}</span><small>{item.label}</small><i aria-hidden="true">{isSelected ? '✓' : '+'}</i></button> })}
              </div>
              <div className="challenge-footer"><p className={message ? 'feedback visible' : 'feedback'} aria-live="polite">{message || 'Use a ideia importante para decidir o que entra no resultado.'}</p><button className="primary-button" disabled={selected.length === 0} onClick={checkOperationAnswer}>Conferir resposta</button></div>
            </section>
          )}
        </main>
      )}

      {screen === 'result' && (
        <main className="result-page"><section className="result-card"><div className="confetti" aria-hidden="true">✦ • ▲ • ✦</div><div className="result-medal" aria-hidden="true">{resultContent.symbol}</div><span className="section-kicker">{resultContent.kicker}</span><h1>{resultContent.title}</h1><p>{resultContent.description}</p><div className="stars" aria-label={`${earnedStars} estrelas conquistadas`}>{Array.from({ length: activeChallengesLength }, () => '★').join(' ')}</div><strong className="result-stars">{earnedStars} missões vencidas no seu ritmo</strong><div className={`result-build-reward ${wasNewCompletion ? 'new' : 'replay'}`}><span>{wasNewCompletion ? 'NOVA PARTE CONSTRUÍDA' : 'PARTE REFORÇADA'}</span><h2><i aria-hidden="true">{activeBuildStep.icon}</i> {activeBuildStep.name}</h2><p>{wasNewCompletion
          ? activeIsland === 6
            ? 'A Ilha do Explorador está completa! Todas as suas descobertas agora fazem parte deste mundo.'
            : `Sua ilha ganhou uma nova parte. Faltam ${6 - completedCount} para completar o mundo inteiro.`
          : 'Você praticou novamente e deixou esta parte ainda mais forte.'}</p><ExplorerIsland completedCount={completedCount} compact /></div><button className="primary-button" onClick={goHome}>{completedCount === 6 ? 'Ver a ilha completa' : 'Ver minha ilha'}</button></section></main>
      )}
      {screen === 'result' && <div className="result-guide">{renderTutorCompanion()}</div>}
      {screen !== 'login' && screen !== 'avatar' && <footer><span>Projeto de extensão • Reforço de Matemática</span><span>Feito para aprender brincando ♥</span></footer>}
    </div>
  )
}

export default App
