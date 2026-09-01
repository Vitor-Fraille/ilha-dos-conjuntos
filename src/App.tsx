import { type FormEvent, useMemo, useState } from 'react'
import {
  defaultTutorProfile,
  TutorAvatar,
  tutorColors,
  tutorHats,
  tutorOutfits,
  type TutorExpression,
  type TutorProfile,
} from './TutorAvatar'

type Screen = 'login' | 'avatar' | 'home' | 'lesson' | 'result'
type Island = 1 | 2 | 3
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

const INTRO_PROGRESS_KEY = 'ilha-dos-conjuntos-progress'
const MEMBERSHIP_PROGRESS_KEY = 'ilha-dos-conjuntos-membership-progress'
const INCLUSION_PROGRESS_KEY = 'ilha-dos-conjuntos-inclusion-progress'
const TUTOR_PROFILE_KEY = 'ilha-dos-conjuntos-tutor-profile'

function loadTutorProfile(): TutorProfile | null {
  try {
    const savedProfile = localStorage.getItem(TUTOR_PROFILE_KEY)
    if (!savedProfile) return null
    const profile = JSON.parse(savedProfile) as Partial<TutorProfile>
    const hasValidColor = tutorColors.some((option) => option.id === profile.color)
    const hasValidHat = tutorHats.some((option) => option.id === profile.hat)
    const hasValidOutfit = tutorOutfits.some((option) => option.id === profile.outfit)
    if (typeof profile.name !== 'string' || !profile.name.trim() || !hasValidColor || !hasValidHat || !hasValidOutfit) return null
    return { name: profile.name.slice(0, 14), color: profile.color!, hat: profile.hat!, outfit: profile.outfit! }
  } catch {
    return null
  }
}

const challenges: Challenge[] = [
  {
    eyebrow: 'Desafio 1 de 3',
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
    eyebrow: 'Desafio 2 de 3',
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
    eyebrow: 'Desafio 3 de 3',
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
]

const membershipChallenges: MembershipChallenge[] = [
  {
    eyebrow: 'Desafio 1 de 3',
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
    eyebrow: 'Desafio 2 de 3',
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
    eyebrow: 'Desafio 3 de 3',
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
]

const inclusionChallenges: InclusionChallenge[] = [
  {
    eyebrow: 'Desafio 1 de 3',
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
    eyebrow: 'Desafio 2 de 3',
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
    eyebrow: 'Desafio 3 de 3',
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
]

const tutorHints: Record<Island, string[]> = {
  1: [
    'Fale o nome de cada figura e pergunte: isso é uma fruta?',
    'Procure os seres que nascem, crescem e se alimentam.',
    'Um número par pode formar duplas sem sobrar nenhum.',
  ],
  2: [
    'Leia a regra do conjunto e observe um elemento de cada vez.',
    'Dentro quer dizer que pertence. Fora quer dizer que não pertence.',
    'Compare cada número com 5 antes de decidir onde ele fica.',
  ],
  3: [
    'Olhe todos os elementos do conjunto menor. Um só diferente já muda a resposta.',
    'Para ser subconjunto, todos os elementos precisam seguir a regra do conjunto maior.',
    'Teste cada número: ele aparece entre 2, 4, 6 e 8?',
  ],
}

function selectionsMatch(selected: string[], answers: string[]) {
  return [...selected].sort().join(',') === [...answers].sort().join(',')
}

function App() {
  const [storedTutorProfile] = useState<TutorProfile | null>(() => loadTutorProfile())
  const [screen, setScreen] = useState<Screen>('login')
  const [profileReady, setProfileReady] = useState(() => storedTutorProfile !== null)
  const [tutorProfile, setTutorProfile] = useState<TutorProfile>(storedTutorProfile ?? defaultTutorProfile)
  const [draftTutorProfile, setDraftTutorProfile] = useState<TutorProfile>(storedTutorProfile ?? defaultTutorProfile)
  const [customizerReturnScreen, setCustomizerReturnScreen] = useState<Screen>('login')
  const [tutorOpen, setTutorOpen] = useState(true)
  const [tutorMessage, setTutorMessage] = useState('')
  const [tutorExpression, setTutorExpression] = useState<TutorExpression>('happy')
  const [interactionIndex, setInteractionIndex] = useState(0)
  const [activeIsland, setActiveIsland] = useState<Island>(1)
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [movementMessage, setMovementMessage] = useState('')
  const [firstIslandCompleted, setFirstIslandCompleted] = useState(
    () => localStorage.getItem(INTRO_PROGRESS_KEY) === '1',
  )
  const [secondIslandCompleted, setSecondIslandCompleted] = useState(
    () => localStorage.getItem(MEMBERSHIP_PROGRESS_KEY) === '1',
  )
  const [thirdIslandCompleted, setThirdIslandCompleted] = useState(
    () => localStorage.getItem(INCLUSION_PROGRESS_KEY) === '1',
  )

  const challenge = challenges[challengeIndex]
  const membershipChallenge = membershipChallenges[challengeIndex]
  const inclusionChallenge = inclusionChallenges[challengeIndex]
  const activeChallengesLength = activeIsland === 1
    ? challenges.length
    : activeIsland === 2
      ? membershipChallenges.length
      : inclusionChallenges.length
  const progress = screen === 'result' ? 100 : (challengeIndex / activeChallengesLength) * 100

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

  const mapProgressLabel = thirdIslandCompleted
    ? '3 ilhas concluídas'
    : secondIslandCompleted
      ? '3 de 6 ilhas abertas'
    : firstIslandCompleted
      ? '2 de 6 ilhas abertas'
      : '1 de 6 ilhas abertas'
  const completedIslandCount = [firstIslandCompleted, secondIslandCompleted, thirdIslandCompleted].filter(Boolean).length
  const contextTutorMessage = screen === 'result'
    ? `Conseguimos! A Ilha ${activeIsland} ficou mais colorida.`
    : screen === 'lesson'
      ? `Estou com você no desafio ${challengeIndex + 1}. Observe com calma e peça uma dica quando quiser.`
      : thirdIslandCompleted
        ? 'Três ilhas descobertas! Podemos jogar novamente ou esperar a próxima aventura.'
        : secondIslandCompleted
          ? 'A Ilha 3 está aberta. Vamos descobrir conjuntos dentro de conjuntos?'
          : firstIslandCompleted
            ? 'A Ilha 2 está aberta. Agora vamos descobrir quem pertence a cada conjunto.'
            : 'Vamos começar pela Ilha 1. Eu acompanho você em cada descoberta!'
  const visibleTutorMessage = tutorMessage || contextTutorMessage

  function openTutorCustomizer(returnScreen: Screen = screen) {
    setDraftTutorProfile(tutorProfile)
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

  function saveTutorProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedName = draftTutorProfile.name.trim().slice(0, 14) || defaultTutorProfile.name
    const nextProfile = { ...draftTutorProfile, name: normalizedName }
    localStorage.setItem(TUTOR_PROFILE_KEY, JSON.stringify(nextProfile))
    setTutorProfile(nextProfile)
    setDraftTutorProfile(nextProfile)
    setProfileReady(true)
    setTutorMessage(`Pronto! Eu sou ${normalizedName}, seu tutor nesta aventura.`)
    setTutorExpression('celebrate')
    setTutorOpen(true)
    setScreen(customizerReturnScreen === 'login' ? 'home' : customizerReturnScreen)
    scrollToTop()
  }

  function cancelTutorCustomizer() {
    setDraftTutorProfile(tutorProfile)
    setScreen(profileReady ? customizerReturnScreen : 'login')
    scrollToTop()
  }

  function tutorTalk() {
    const messages = [
      'Estou por perto! Podemos observar uma coisa de cada vez.',
      'Errar faz parte da descoberta. A gente tenta de outro jeito!',
      'Você manda nas escolhas e eu ajudo quando precisar.',
      'Que tal explicar em voz alta por que dois elementos formam um grupo?',
    ]
    const nextIndex = (interactionIndex + 1) % messages.length
    setInteractionIndex(nextIndex)
    setTutorMessage(messages[interactionIndex])
    setTutorExpression(interactionIndex % 2 === 0 ? 'curious' : 'happy')
    setTutorOpen(true)
  }

  function showTutorHint() {
    setTutorMessage(tutorHints[activeIsland][challengeIndex])
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
    setActiveIsland(island)
    setChallengeIndex(0)
    setSelected([])
    setMessage('')
    setMovementMessage('')
    reactTutor(`Ilha ${island}, desafio 1. Leia a missão e observe antes de escolher.`, 'curious')
    setScreen('lesson')
    scrollToTop()
  }

  function toggleItem(id: string) {
    setMessage('')
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
    setTutorExpression('curious')
  }

  function moveMembershipItem(item: Item) {
    const movingInside = !selected.includes(item.id)
    setMessage('')
    setSelected((current) => movingInside ? [...current, item.id] : current.filter((id) => id !== item.id))
    setMovementMessage(`${item.label} foi movido para ${movingInside ? 'dentro' : 'fora'} do conjunto.`)
    setTutorMessage(`${item.label} foi para ${movingInside ? 'dentro' : 'fora'}. Agora compare com a regra do conjunto.`)
    setTutorExpression('curious')
    window.requestAnimationFrame(() => document.getElementById(`membership-item-${item.id}`)?.focus())
  }

  function moveInclusionGroup(group: SetGroup) {
    const movingInside = !selected.includes(group.id)
    setMessage('')
    setSelected((current) => movingInside ? [...current, group.id] : current.filter((id) => id !== group.id))
    setMovementMessage(`${group.label} foi movido para ${movingInside ? 'dentro' : 'fora'} do conjunto maior.`)
    setTutorMessage(`${group.label} foi para ${movingInside ? 'dentro' : 'fora'}. Você conferiu todos os elementos?`)
    setTutorExpression('curious')
    window.requestAnimationFrame(() => document.getElementById(`inclusion-group-${group.id}`)?.focus())
  }

  function completeIsland(island: Island) {
    if (island === 1) {
      localStorage.setItem(INTRO_PROGRESS_KEY, '1')
      setFirstIslandCompleted(true)
    } else if (island === 2) {
      localStorage.setItem(MEMBERSHIP_PROGRESS_KEY, '1')
      setSecondIslandCompleted(true)
    } else {
      localStorage.setItem(INCLUSION_PROGRESS_KEY, '1')
      setThirdIslandCompleted(true)
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
    reactTutor('Muito bem! Você explicou a regra com suas escolhas. Vamos ao próximo desafio!', 'celebrate')
    setChallengeIndex((value) => value + 1)
    setSelected([])
    setMessage('')
    setMovementMessage('')
  }

  function checkIntroAnswer() {
    if (!selectionsMatch(selected, challenge.answers)) {
      setMessage(challenge.tip)
      reactTutor('Quase! Leia a explicação abaixo e compare cada figura com a regra.', 'thinking')
      return
    }
    advanceChallenge()
  }

  function checkMembershipAnswer() {
    if (!selectionsMatch(selected, membershipChallenge.answers)) {
      setMessage(membershipChallenge.tip)
      reactTutor('Vamos conferir de novo: quem segue a regra fica dentro e quem não segue fica fora.', 'thinking')
      return
    }
    advanceChallenge()
  }

  function checkInclusionAnswer() {
    if (!selectionsMatch(selected, inclusionChallenge.answers)) {
      setMessage(inclusionChallenge.tip)
      reactTutor('Olhe um conjunto por vez. Todos os elementos precisam caber na regra do conjunto maior.', 'thinking')
      return
    }
    advanceChallenge()
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

  const resultContent = activeIsland === 1
    ? {
        kicker: 'ILHA 1 CONCLUÍDA',
        title: 'Você sabe formar conjuntos!',
        description: 'Um conjunto é uma coleção de elementos que compartilham uma característica.',
        symbol: '★',
      }
    : activeIsland === 2
      ? {
        kicker: 'ILHA 2 CONCLUÍDA',
        title: 'Você descobriu quem pertence!',
        description: 'O símbolo ∈ indica que um elemento pertence ao conjunto. O símbolo ∉ indica que não pertence.',
        symbol: '∈',
      }
      : {
          kicker: 'ILHA 3 CONCLUÍDA',
          title: 'Você encontrou os subconjuntos!',
          description: 'Um subconjunto fica contido em outro conjunto quando todos os seus elementos também pertencem ao conjunto maior.',
          symbol: '⊂',
        }

  function renderTutorCompanion() {
    return (
      <aside className={`tutor-companion ${tutorOpen ? 'is-open' : 'is-closed'}`} aria-label={`Tutor ${tutorProfile.name}`}>
        <button
          className="tutor-toggle"
          onClick={() => setTutorOpen((current) => !current)}
          aria-expanded={tutorOpen}
          aria-label={tutorOpen ? `Fechar conversa com ${tutorProfile.name}` : `Abrir conversa com ${tutorProfile.name}`}
        >
          <TutorAvatar profile={tutorProfile} size="medium" expression={tutorExpression} animated={tutorOpen} />
          {!tutorOpen && <span>💡</span>}
        </button>
        {tutorOpen && (
          <div className="tutor-bubble">
            <div className="tutor-bubble-heading"><span>SEU TUTOR</span><strong>{tutorProfile.name}</strong></div>
            {screen === 'home' && <span className="tutor-progress-badge">★ {completedIslandCount}/3 ilhas concluídas</span>}
            <p aria-live="polite">{visibleTutorMessage}</p>
            <div className="tutor-actions">
              {screen === 'lesson'
                ? <button onClick={showTutorHint}>💡 Quero uma dica</button>
                : <button onClick={tutorTalk}>👋 Falar com {tutorProfile.name}</button>}
              <button onClick={() => openTutorCustomizer(screen)}>🎨 Personalizar</button>
            </div>
          </div>
        )}
      </aside>
    )
  }

  return (
    <div className="site-shell">
      {screen !== 'login' && screen !== 'avatar' && (
        <header className="topbar">
          <button className="brand" onClick={goHome} aria-label="Voltar ao início">
            <span className="brand-mark" aria-hidden="true">∴</span><span>Ilha dos Conjuntos</span>
          </button>
          <button className="student-chip tutor-profile-button" onClick={() => openTutorCustomizer(screen)} aria-label={`Personalizar o tutor ${tutorProfile.name}`}>
            <TutorAvatar profile={tutorProfile} size="mini" expression={tutorExpression} />
            <span><small>MEU TUTOR</small><strong>{tutorProfile.name}</strong></span>
          </button>
        </header>
      )}

      {screen === 'login' && (
        <main className="entry-page">
          <section className="login-card" aria-labelledby="login-title">
            <div className="login-copy">
              <div className="entry-brand"><span className="brand-mark" aria-hidden="true">∴</span><strong>Ilha dos Conjuntos</strong></div>
              <span className="login-kicker">PORTO DE ENTRADA</span>
              <h1 id="login-title">Entre na aventura matemática</h1>
              <p>Explore ilhas, resolva missões e aprenda no seu ritmo com um tutor sempre por perto.</p>
              {profileReady ? (
                <div className="returning-profile">
                  <span>Seu tutor está esperando:</span>
                  <strong>{tutorProfile.name}</strong>
                </div>
              ) : (
                <div className="first-access-note"><span aria-hidden="true">✨</span><p>Na primeira entrada, você vai criar seu próprio tutor.</p></div>
              )}
              <div className="login-actions">
                <button className="primary-button" onClick={enterAdventure}>
                  {profileReady ? `Continuar com ${tutorProfile.name}` : 'Entrar e criar meu tutor'} <span aria-hidden="true">→</span>
                </button>
                {profileReady && <button className="text-button" onClick={() => openTutorCustomizer('login')}>Mudar meu tutor</button>}
              </div>
              <p className="privacy-note"><span aria-hidden="true">🔒</span><span><strong>Entrada segura:</strong> sem e-mail, senha, foto ou nome da criança. Tudo fica somente neste dispositivo.</span></p>
            </div>
            <div className="login-tutor-preview" aria-label={`Prévia do tutor ${tutorProfile.name}`}>
              <span className="preview-orbit orbit-one" aria-hidden="true">∈</span>
              <span className="preview-orbit orbit-two" aria-hidden="true">★</span>
              <div className="login-speech">{profileReady ? `Oi! Sou ${tutorProfile.name}. Vamos continuar?` : 'Oi! Vou ajudar em cada descoberta.'}</div>
              <TutorAvatar profile={tutorProfile} size="large" expression="happy" animated />
              <span className="preview-shadow" aria-hidden="true" />
            </div>
          </section>
        </main>
      )}

      {screen === 'avatar' && (
        <main className="workshop-page">
          <form className="workshop-card" onSubmit={saveTutorProfile}>
            <div className="workshop-preview">
              <button className="workshop-back" type="button" onClick={cancelTutorCustomizer} aria-label="Voltar">←</button>
              <span className="login-kicker">OFICINA DO TUTOR</span>
              <h1>Crie seu companheiro</h1>
              <p>Escolha cada detalhe. Você pode voltar aqui e mudar quando quiser.</p>
              <div className="avatar-stage" aria-label={`Prévia do tutor ${draftTutorProfile.name || 'sem nome'}`}>
                <div className="avatar-preview-speech">{draftTutorProfile.name.trim() ? `Oi! Eu sou ${draftTutorProfile.name.trim()}.` : 'Qual será o meu nome?'}</div>
                <TutorAvatar profile={draftTutorProfile} size="large" expression="happy" animated />
                <span className="preview-shadow" aria-hidden="true" />
              </div>
            </div>
            <div className="workshop-options">
              <div className="name-field">
                <label htmlFor="tutor-name">Nome do tutor</label>
                <input
                  id="tutor-name"
                  value={draftTutorProfile.name}
                  maxLength={14}
                  autoComplete="off"
                  aria-describedby="tutor-name-help"
                  onChange={(event) => setDraftTutorProfile((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Ex.: Lumi"
                />
                <small id="tutor-name-help">Dê um nome ao personagem. Não use seu próprio nome.</small>
                <div className="name-suggestions" aria-label="Sugestões de nomes">
                  {['Lumi', 'Pingo', 'Tico', 'Zuca'].map((name) => <button type="button" key={name} onClick={() => setDraftTutorProfile((current) => ({ ...current, name }))}>{name}</button>)}
                </div>
              </div>
              <fieldset>
                <legend>1. Escolha uma cor</legend>
                <div className="custom-option-grid color-options">
                  {tutorColors.map((color) => (
                    <button type="button" key={color.id} className={draftTutorProfile.color === color.id ? 'selected' : ''} aria-pressed={draftTutorProfile.color === color.id} onClick={() => setDraftTutorProfile((current) => ({ ...current, color: color.id }))}>
                      <span className="color-swatch" style={{ background: color.value }} aria-hidden="true" /><strong>{color.label}</strong><i aria-hidden="true">{draftTutorProfile.color === color.id ? '✓' : ''}</i>
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>2. Escolha um chapéu</legend>
                <div className="custom-option-grid">
                  {tutorHats.map((hat) => (
                    <button type="button" key={hat.id} className={draftTutorProfile.hat === hat.id ? 'selected' : ''} aria-pressed={draftTutorProfile.hat === hat.id} onClick={() => setDraftTutorProfile((current) => ({ ...current, hat: hat.id }))}>
                      <span aria-hidden="true">{hat.symbol}</span><strong>{hat.label}</strong><i aria-hidden="true">{draftTutorProfile.hat === hat.id ? '✓' : ''}</i>
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend>3. Escolha uma roupa</legend>
                <div className="custom-option-grid">
                  {tutorOutfits.map((outfit) => (
                    <button type="button" key={outfit.id} className={draftTutorProfile.outfit === outfit.id ? 'selected' : ''} aria-pressed={draftTutorProfile.outfit === outfit.id} onClick={() => setDraftTutorProfile((current) => ({ ...current, outfit: outfit.id }))}>
                      <span aria-hidden="true">{outfit.symbol}</span><strong>{outfit.label}</strong><i aria-hidden="true">{draftTutorProfile.outfit === outfit.id ? '✓' : ''}</i>
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="workshop-actions">
                <button className="text-button" type="button" onClick={cancelTutorCustomizer}>Cancelar</button>
                <button className="primary-button" type="submit" disabled={draftTutorProfile.name.trim().length < 2}>Salvar meu tutor <span aria-hidden="true">→</span></button>
              </div>
            </div>
          </form>
        </main>
      )}

      {screen === 'home' && (
        <main>
          <section className="hero-section">
            <div className="hero-copy">
              <div className="eyebrow"><span>★</span> Uma aventura matemática</div>
              <h1>Descubra o poder de <em>agrupar!</em></h1>
              <p>Explore ilhas, organize elementos e aprenda conjuntos brincando. Cada missão deixa o mapa um pouco mais colorido.</p>
              <button className="primary-button" onClick={() => startIsland(1)}>Começar aventura <span aria-hidden="true">→</span></button>
              <div className="hero-notes" aria-label="Características da atividade"><span>✓ Sem cronômetro</span><span>✓ Aprenda no seu ritmo</span></div>
            </div>
            <div className="island-scene" aria-label="Ilustração de uma ilha com objetos agrupados">
              <span className="cloud cloud-one" aria-hidden="true"></span><span className="cloud cloud-two" aria-hidden="true"></span>
              <div className="sun" aria-hidden="true">☀</div>
              <div className="floating-card card-fruit"><span>🍎</span><small>frutas</small></div>
              <div className="floating-card card-animal"><span>🐱</span><small>animais</small></div>
              <div className="island"><span className="tree" aria-hidden="true">🌴</span><div className="island-sign"><span>Conjunto</span><strong>A</strong></div><span className="flower flower-one" aria-hidden="true">✿</span><span className="flower flower-two" aria-hidden="true">✿</span></div>
            </div>
          </section>
          <section className="trail-section" aria-labelledby="trail-title">
            <div className="section-heading"><div><span className="section-kicker">SEU MAPA DE AVENTURAS</span><h2 id="trail-title">Uma descoberta de cada vez</h2></div><span className="progress-label">{mapProgressLabel}</span></div>
            <div className="stage-grid">
              <article className={`stage-card active ${firstIslandCompleted ? 'completed' : ''}`}><span className="stage-number">01</span><div className="stage-icon yellow">{firstIslandCompleted ? '★' : '🧺'}</div><span className="status-tag">{firstIslandCompleted ? 'ILHA CONCLUÍDA' : 'PRONTO PARA JOGAR'}</span><h3>O que é um conjunto?</h3><p>Agrupe objetos que possuem algo em comum.</p><button onClick={() => startIsland(1)}>{firstIslandCompleted ? 'Jogar novamente' : 'Explorar esta ilha'} <span>→</span></button></article>
              <article className={`stage-card ${firstIslandCompleted ? 'active' : 'locked'} ${secondIslandCompleted ? 'completed' : ''}`}><span className="stage-number">02</span><div className="stage-icon coral">{secondIslandCompleted ? '★' : '∈'}</div><span className="status-tag">{secondIslandCompleted ? 'ILHA CONCLUÍDA' : firstIslandCompleted ? 'PRONTO PARA JOGAR' : 'BLOQUEADA'}</span><h3>Quem pertence?</h3><p>Descubra a relação de pertinência.</p>{firstIslandCompleted ? <button onClick={() => startIsland(2)}>{secondIslandCompleted ? 'Jogar novamente' : 'Explorar esta ilha'} <span>→</span></button> : <span className="locked-note">Conclua a Ilha 1 para liberar.</span>}</article>
              <article className={`stage-card ${secondIslandCompleted ? 'active' : 'locked'} ${thirdIslandCompleted ? 'completed' : ''}`}><span className="stage-number">03</span><div className="stage-icon blue">{thirdIslandCompleted ? '★' : '⊂'}</div><span className="status-tag">{thirdIslandCompleted ? 'ILHA CONCLUÍDA' : secondIslandCompleted ? 'PRONTO PARA JOGAR' : 'BLOQUEADA'}</span><h3>Conjuntos dentro de conjuntos</h3><p>Conheça subconjuntos e inclusão.</p>{secondIslandCompleted ? <button onClick={() => startIsland(3)}>{thirdIslandCompleted ? 'Jogar novamente' : 'Explorar esta ilha'} <span>→</span></button> : <span className="locked-note">Conclua a Ilha 2 para liberar.</span>}</article>
            </div>
          </section>
        </main>
      )}

      {screen === 'lesson' && (
        <main className="lesson-page">
          <div className="lesson-progress" aria-label={`Progresso: ${Math.round(progress)}%`}><button className="back-button" onClick={goHome} aria-label="Sair da atividade">←</button><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><strong>{challengeIndex + 1}/{activeChallengesLength}</strong></div>
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
          ) : (
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
          )}
        </main>
      )}

      {screen === 'result' && (
        <main className="result-page"><section className="result-card"><div className="confetti" aria-hidden="true">✦ • ▲ • ✦</div><div className="result-medal" aria-hidden="true">{resultContent.symbol}</div><span className="section-kicker">{resultContent.kicker}</span><h1>{resultContent.title}</h1><p>{resultContent.description}</p><div className="stars" aria-label="Três estrelas conquistadas">★ ★ ★</div><button className="primary-button" onClick={goHome}>Voltar ao mapa</button></section></main>
      )}
      {screen !== 'login' && screen !== 'avatar' && renderTutorCompanion()}
      {screen !== 'login' && screen !== 'avatar' && <footer><span>Projeto de extensão • Reforço de Matemática</span><span>Feito para aprender brincando ♥</span></footer>}
    </div>
  )
}

export default App
