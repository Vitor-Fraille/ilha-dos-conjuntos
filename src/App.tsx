import { useMemo, useState } from 'react'

type Screen = 'home' | 'lesson' | 'result'
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

function selectionsMatch(selected: string[], answers: string[]) {
  return [...selected].sort().join(',') === [...answers].sort().join(',')
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
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

  function scrollToTop() {
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
  }

  function goHome() {
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
    setScreen('lesson')
    scrollToTop()
  }

  function toggleItem(id: string) {
    setMessage('')
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  function moveMembershipItem(item: Item) {
    const movingInside = !selected.includes(item.id)
    setMessage('')
    setSelected((current) => movingInside ? [...current, item.id] : current.filter((id) => id !== item.id))
    setMovementMessage(`${item.label} foi movido para ${movingInside ? 'dentro' : 'fora'} do conjunto.`)
    window.requestAnimationFrame(() => document.getElementById(`membership-item-${item.id}`)?.focus())
  }

  function moveInclusionGroup(group: SetGroup) {
    const movingInside = !selected.includes(group.id)
    setMessage('')
    setSelected((current) => movingInside ? [...current, group.id] : current.filter((id) => id !== group.id))
    setMovementMessage(`${group.label} foi movido para ${movingInside ? 'dentro' : 'fora'} do conjunto maior.`)
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
    setScreen('result')
    scrollToTop()
  }

  function advanceChallenge() {
    if (challengeIndex === activeChallengesLength - 1) {
      completeIsland(activeIsland)
      return
    }
    setChallengeIndex((value) => value + 1)
    setSelected([])
    setMessage('')
    setMovementMessage('')
  }

  function checkIntroAnswer() {
    if (!selectionsMatch(selected, challenge.answers)) {
      setMessage(challenge.tip)
      return
    }
    advanceChallenge()
  }

  function checkMembershipAnswer() {
    if (!selectionsMatch(selected, membershipChallenge.answers)) {
      setMessage(membershipChallenge.tip)
      return
    }
    advanceChallenge()
  }

  function checkInclusionAnswer() {
    if (!selectionsMatch(selected, inclusionChallenge.answers)) {
      setMessage(inclusionChallenge.tip)
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

  return (
    <div className="site-shell">
      <header className="topbar">
        <button className="brand" onClick={goHome} aria-label="Voltar ao início">
          <span className="brand-mark" aria-hidden="true">∴</span><span>Ilha dos Conjuntos</span>
        </button>
        <div className="student-chip" aria-label="Perfil atual: explorador"><span aria-hidden="true">🧢</span><span>Explorador</span></div>
      </header>

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
      <footer><span>Projeto de extensão • Reforço de Matemática</span><span>Feito para aprender brincando ♥</span></footer>
    </div>
  )
}

export default App
