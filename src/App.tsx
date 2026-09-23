import { useState } from 'react'
import { isCorrect, levels, questionsForLevel, type LevelId } from './gameData'

type Screen = 'home' | 'play' | 'result'
type Feedback = { correct: boolean; text: string }
const SCORE_KEY = 'conjuntos-em-jogo-level-scores-v1'

function loadScores(): (number | null)[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(SCORE_KEY) ?? 'null')
    if (Array.isArray(saved) && saved.length === levels.length) {
      return saved.map(value => typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 10 ? value : null)
    }
  } catch { /* O jogo funciona mesmo sem armazenamento local. */ }
  return levels.map(() => null)
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [levelId, setLevelId] = useState<LevelId>(1)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [hadWrongAttempt, setHadWrongAttempt] = useState(false)
  const [firstTryCorrect, setFirstTryCorrect] = useState(0)
  const [solved, setSolved] = useState(0)
  const [scores, setScores] = useState<(number | null)[]>(loadScores)

  const level = levels[levelId - 1]
  const levelQuestions = questionsForLevel(levelId)
  const question = levelQuestions[questionIndex]
  const phase = questionIndex < 5 ? 1 : 2
  const finishedLevels = scores.filter(score => score !== null).length

  function scrollToTop() {
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
  }

  function startLevel(id: LevelId) {
    setLevelId(id)
    setQuestionIndex(0)
    setSelected([])
    setFeedback(null)
    setHadWrongAttempt(false)
    setFirstTryCorrect(0)
    setSolved(0)
    setScreen('play')
    scrollToTop()
  }

  function goHome() {
    setScreen('home')
    scrollToTop()
  }

  function choose(id: string) {
    if (feedback?.correct) return
    setSelected(current => question.many
      ? current.includes(id) ? current.filter(value => value !== id) : [...current, id]
      : [id])
    setFeedback(null)
  }

  function checkAnswer() {
    if (selected.length === 0 || feedback?.correct) return
    if (isCorrect(question, selected)) {
      setSolved(questionIndex + 1)
      if (!hadWrongAttempt) setFirstTryCorrect(value => value + 1)
      setFeedback({ correct: true, text: `Isso mesmo! ${question.explanation}` })
    } else {
      setHadWrongAttempt(true)
      setFeedback({ correct: false, text: `Ainda não. ${question.explanation} Tente novamente.` })
    }
  }

  function nextQuestion() {
    if (!feedback?.correct) return
    if (questionIndex === levelQuestions.length - 1) {
      const nextScores = [...scores]
      nextScores[levelId - 1] = Math.max(nextScores[levelId - 1] ?? 0, firstTryCorrect)
      setScores(nextScores)
      try { localStorage.setItem(SCORE_KEY, JSON.stringify(nextScores)) } catch { /* Resultado visível até fechar a página. */ }
      setScreen('result')
    } else {
      setQuestionIndex(value => value + 1)
      setSelected([])
      setFeedback(null)
      setHadWrongAttempt(false)
    }
    scrollToTop()
  }

  return <div className={`game-shell screen-${screen} level-theme-${levelId}`}>
    <header className="game-header">
      <button className="game-brand" onClick={goHome} aria-label="Voltar à escolha de níveis"><span className="brand-symbol" aria-hidden="true">∴</span><span>Conjuntos em jogo</span></button>
      {screen === 'home' && <span className="header-progress">{finishedLevels}/3 níveis feitos</span>}
      {screen === 'play' && <span className="header-progress">✓ {solved} {solved === 1 ? 'acerto' : 'acertos'}</span>}
    </header>

    {screen === 'home' && <main className="home-screen">
      <div className="home-intro">
        <div className="intro-art" aria-hidden="true"><span>{'{ 2, 4, 6 }'}</span><i>∈</i><b>✦</b></div>
        <span className="eyebrow">MATEMÁTICA PARA JOGAR</span>
        <h1>Escolha um nível e comece!</h1>
        <p>Questões curtas, resposta na hora e quantas tentativas você quiser.</p>
      </div>
      <div className="level-list" aria-label="Níveis disponíveis">
        {levels.map((entry, index) => <button key={entry.id} className={`level-card level-card-${entry.id}`} onClick={() => startLevel(entry.id)}>
          <span className="level-art" aria-hidden="true">{entry.symbol}</span>
          <span className="level-copy"><small>NÍVEL {entry.id} · {index === 0 ? 'FÁCIL' : index === 1 ? 'MÉDIO' : 'DESAFIO'}</small><strong>{entry.name}</strong><span>{entry.subtitle}</span><em>{entry.topics.join(' + ')}</em></span>
          <span className="level-meta"><span>{scores[index] === null ? '10 questões' : `Melhor: ${scores[index]}/10`}</span><b>{scores[index] === null ? 'Jogar →' : 'Jogar de novo →'}</b></span>
        </button>)}
      </div>
      <p className="home-note">Sem tempo e sem ranking. O importante é praticar.</p>
    </main>}

    {screen === 'play' && <main className="play-screen">
      <div className="play-topline"><button className="back-button" onClick={goHome} aria-label="Voltar aos níveis">←</button><div><small>NÍVEL {levelId} · {level.name.toUpperCase()}</small><strong>Questão {questionIndex + 1} de {levelQuestions.length}</strong></div><span className="question-count">{questionIndex + 1}/{levelQuestions.length}</span></div>
      <div className="progress-track" role="progressbar" aria-label="Questões resolvidas" aria-valuemin={0} aria-valuemax={levelQuestions.length} aria-valuenow={solved}><span style={{ width: `${solved / levelQuestions.length * 100}%` }} /></div>
      <div className="phase-label"><span>FASE {phase} DE 2</span><strong>{level.topics[phase - 1]}</strong></div>
      <section className="question-panel" aria-labelledby="question-title">
        <span className="question-kind">{question.many ? 'ESCOLHA TODAS AS RESPOSTAS' : 'ESCOLHA UMA RESPOSTA'}</span>
        <h1 id="question-title">{question.prompt}</h1>
        {question.context && <div className="question-context">{question.context}</div>}
        <div className={`options-grid ${question.options.length === 2 ? 'two-options' : ''}`} aria-label="Opções de resposta">
          {question.options.map(option => <button key={option.id} className={`answer-option ${option.icon ? '' : 'text-only'} ${selected.includes(option.id) ? 'selected' : ''}`} aria-pressed={selected.includes(option.id)} disabled={feedback?.correct} onClick={() => choose(option.id)}>{option.icon && <span className="option-icon" aria-hidden="true">{option.icon}</span>}<span className="option-label">{option.label}</span><span className="option-check" aria-hidden="true">{selected.includes(option.id) ? '✓' : '+'}</span></button>)}
        </div>
        {question.many && <p className="selected-count">{selected.length} {selected.length === 1 ? 'opção marcada' : 'opções marcadas'}</p>}
        <div className="answer-footer">
          {feedback ? <p className={`answer-feedback ${feedback.correct ? 'is-correct' : 'is-retry'}`} role="status" aria-live="polite"><strong>{feedback.correct ? '✓ Acertou!' : '↻ Vamos tentar de novo'}</strong><span>{feedback.text}</span></p> : <p className="answer-prompt">{question.many ? 'Toque em todas as opções que combinam.' : 'Toque na resposta que você escolher.'}</p>}
          {feedback?.correct
            ? <button className="action-button" onClick={nextQuestion}>{questionIndex === levelQuestions.length - 1 ? 'Ver meu resultado' : questionIndex === 4 ? 'Ir para a fase 2' : 'Próxima questão'} <span aria-hidden="true">→</span></button>
            : <button className="action-button" onClick={checkAnswer} disabled={selected.length === 0}>Conferir resposta <span aria-hidden="true">→</span></button>}
        </div>
      </section>
    </main>}

    {screen === 'result' && <main className="result-screen">
      <div className="result-symbol" aria-hidden="true">✦</div>
      <span className="eyebrow">NÍVEL {levelId} FINALIZADO</span>
      <h1>Você completou o nível!</h1>
      <p>Praticar, errar e tentar de novo faz parte do aprendizado.</p>
      <div className="result-numbers"><div><strong>{solved}/{levelQuestions.length}</strong><span>questões feitas</span></div><div><strong>{firstTryCorrect}/{levelQuestions.length}</strong><span>de primeira</span></div></div>
      <p className="best-result">Seu melhor resultado neste nível: <strong>{scores[levelId - 1]}/10 de primeira</strong></p>
      <div className="result-actions"><button className="action-button" onClick={goHome}>Escolher outro nível <span aria-hidden="true">→</span></button><button className="secondary-button" onClick={() => startLevel(levelId)}>Jogar este nível de novo</button></div>
    </main>}
    <footer className="game-footer">Projeto de extensão · Reforço de Matemática</footer>
  </div>
}

export default App
