import { useMemo, useState } from 'react'

type Screen = 'home' | 'lesson' | 'result'
type Item = { id: string; symbol: string; label: string }
type Challenge = {
  eyebrow: string
  title: string
  instruction: string
  setName: string
  items: Item[]
  answers: string[]
  tip: string
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
    tip: 'Observe quais elementos nascem em plantas e podem ser comidos como frutas.',
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
    tip: 'Animais se alimentam, crescem e podem se movimentar por conta própria.',
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
    tip: 'Os números pares terminam em 0, 2, 4, 6 ou 8.',
  },
]

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [firstIslandCompleted, setFirstIslandCompleted] = useState(
    () => localStorage.getItem('ilha-dos-conjuntos-progress') === '1',
  )
  const challenge = challenges[challengeIndex]
  const progress = screen === 'result' ? 100 : (challengeIndex / challenges.length) * 100

  const selectedLabels = useMemo(
    () => challenge?.items.filter((item) => selected.includes(item.id)).map((item) => item.symbol),
    [challenge, selected],
  )

  function startLesson() {
    setChallengeIndex(0)
    setSelected([])
    setMessage('')
    setAttempts(0)
    setScreen('lesson')
  }

  function toggleItem(id: string) {
    setMessage('')
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  function checkAnswer() {
    const expected = [...challenge.answers].sort().join(',')
    const given = [...selected].sort().join(',')
    if (expected !== given) {
      setAttempts((value) => value + 1)
      setMessage(attempts === 0 ? 'Quase! Revise os elementos escolhidos e tente de novo.' : challenge.tip)
      return
    }
    if (challengeIndex === challenges.length - 1) {
      localStorage.setItem('ilha-dos-conjuntos-progress', '1')
      setFirstIslandCompleted(true)
      setScreen('result')
      return
    }
    setChallengeIndex((value) => value + 1)
    setSelected([])
    setMessage('')
    setAttempts(0)
  }

  return (
    <div className="site-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setScreen('home')} aria-label="Voltar ao início">
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
              <button className="primary-button" onClick={startLesson}>Começar aventura <span aria-hidden="true">→</span></button>
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
            <div className="section-heading"><div><span className="section-kicker">SEU MAPA DE AVENTURAS</span><h2 id="trail-title">Uma descoberta de cada vez</h2></div><span className="progress-label">{firstIslandCompleted ? '1 ilha concluída' : '1 de 6 ilhas abertas'}</span></div>
            <div className="stage-grid">
              <article className={`stage-card active ${firstIslandCompleted ? 'completed' : ''}`}><span className="stage-number">01</span><div className="stage-icon yellow">{firstIslandCompleted ? '★' : '🧺'}</div><span className="status-tag">{firstIslandCompleted ? 'ILHA CONCLUÍDA' : 'PRONTO PARA JOGAR'}</span><h3>O que é um conjunto?</h3><p>Agrupe objetos que possuem algo em comum.</p><button onClick={startLesson}>{firstIslandCompleted ? 'Jogar novamente' : 'Explorar esta ilha'} <span>→</span></button></article>
              <article className="stage-card locked"><span className="stage-number">02</span><div className="stage-icon coral">∈</div><span className="status-tag">PRÓXIMA ILHA</span><h3>Quem pertence?</h3><p>Descubra a relação de pertinência.</p></article>
              <article className="stage-card locked"><span className="stage-number">03</span><div className="stage-icon blue">⊂</div><span className="status-tag">EM BREVE</span><h3>Conjuntos dentro de conjuntos</h3><p>Conheça subconjuntos e inclusão.</p></article>
            </div>
          </section>
        </main>
      )}

      {screen === 'lesson' && (
        <main className="lesson-page">
          <div className="lesson-progress" aria-label={`Progresso: ${Math.round(progress)}%`}><button className="back-button" onClick={() => setScreen('home')} aria-label="Sair da atividade">←</button><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><strong>{challengeIndex + 1}/{challenges.length}</strong></div>
          <section className="challenge-card">
            <div className="challenge-copy"><span className="section-kicker">{challenge.eyebrow}</span><h1>{challenge.title}</h1><p>{challenge.instruction}</p></div>
            <div className="set-board"><div className="set-label">{challenge.setName}</div><div className="selected-set" aria-live="polite"><span className="brace">{'{'}</span><div>{selectedLabels.length === 0 ? <span className="empty-hint">seus elementos aparecerão aqui</span> : selectedLabels.map((symbol, index) => <span className="selected-symbol" key={`${symbol}-${index}`}>{symbol}</span>)}</div><span className="brace">{'}'}</span></div></div>
            <div className="item-grid" aria-label="Elementos disponíveis">
              {challenge.items.map((item) => { const isSelected = selected.includes(item.id); return <button key={item.id} className={`item-button ${isSelected ? 'selected' : ''}`} aria-pressed={isSelected} aria-label={`${item.label}${isSelected ? ', selecionado' : ''}`} onClick={() => toggleItem(item.id)}><span>{item.symbol}</span><small>{item.label}</small><i aria-hidden="true">{isSelected ? '✓' : '+'}</i></button> })}
            </div>
            <div className="challenge-footer"><p className={message ? 'feedback visible' : 'feedback'} aria-live="polite">{message || 'Escolha com calma. Você pode mudar sua resposta.'}</p><button className="primary-button" disabled={selected.length === 0} onClick={checkAnswer}>Conferir resposta</button></div>
          </section>
        </main>
      )}

      {screen === 'result' && (
        <main className="result-page"><section className="result-card"><div className="confetti" aria-hidden="true">✦ • ▲ • ✦</div><div className="result-medal" aria-hidden="true">★</div><span className="section-kicker">ILHA CONCLUÍDA</span><h1>Você sabe formar conjuntos!</h1><p>Um conjunto é uma coleção de elementos que compartilham uma característica.</p><div className="stars" aria-label="Três estrelas conquistadas">★ ★ ★</div><button className="primary-button" onClick={() => setScreen('home')}>Voltar ao mapa</button></section></main>
      )}
      <footer><span>Projeto de extensão • Reforço de Matemática</span><span>Feito para aprender brincando ♥</span></footer>
    </div>
  )
}

export default App
