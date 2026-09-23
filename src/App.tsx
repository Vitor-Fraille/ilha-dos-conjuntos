import { useEffect, useRef, useState } from 'react'
import type { LevelId } from './gameData'
import { activitiesForLevel, isActivityCorrect, modules, type ModuleId } from './moduleData'
import QuestionVisual from './QuestionVisual'

type Screen = 'entry' | 'modules' | 'play' | 'result'
type Feedback = { correct: boolean; text: string }
const SCORE_KEY = 'conjuntos-em-jogo-level-scores-v1'
const MODULE_SCORE_KEY = 'matematica-ja-module-scores-v1'
type Scores = Record<ModuleId, (number | null)[]>

function validScores(value: unknown, maximums: number[]): (number | null)[] {
  return maximums.map((maximum, index) => {
    const score = Array.isArray(value) ? value[index] : null
    return typeof score === 'number' && Number.isInteger(score) && score >= 0 && score <= maximum ? score : null
  })
}
function loadScores(): Scores {
  let previous: unknown = null
  let saved: Record<string, unknown> = {}
  try {
    previous = JSON.parse(localStorage.getItem(SCORE_KEY) ?? 'null')
    const stored: unknown = JSON.parse(localStorage.getItem(MODULE_SCORE_KEY) ?? 'null')
    if (stored && typeof stored === 'object' && !Array.isArray(stored)) saved = stored as Record<string, unknown>
  } catch { /* O jogo funciona mesmo sem armazenamento local. */ }
  const result = {} as Scores
  for (const module of modules) {
    const maximums = module.levels.map(level => activitiesForLevel(module.id, level.id).length)
    result[module.id] = validScores(saved[module.id] ?? (module.id === 'conjuntos' ? previous : null), maximums)
  }
  return result
}

function App() {
  const [screen, setScreen] = useState<Screen>('entry')
  const [moduleId, setModuleId] = useState<ModuleId>('conjuntos')
  const [levelId, setLevelId] = useState<LevelId>(1)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [hadWrongAttempt, setHadWrongAttempt] = useState(false)
  const [firstTryCorrect, setFirstTryCorrect] = useState(0)
  const [solved, setSolved] = useState(0)
  const [scores, setScores] = useState<Scores>(loadScores)

  const module = modules.find(item => item.id === moduleId)!
  const level = module.levels[levelId - 1]
  const levelQuestions = activitiesForLevel(moduleId, levelId)
  const question = levelQuestions[questionIndex]
  const phase = question.phase
  const moduleScores = scores[moduleId]
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => { headingRef.current?.focus() }, [screen, questionIndex])

  function scrollToTop() {
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
  }

  function startLevel(id: LevelId, nextModule: ModuleId = moduleId) {
    setModuleId(nextModule)
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

  function navigate(to: Screen) {
    setScreen(to)
    scrollToTop()
  }

  function choose(id: string) {
    if (feedback?.correct) return
    setSelected(current => question.many || question.ordered
      ? current.includes(id) ? current.filter(value => value !== id) : [...current, id]
      : [id])
    setFeedback(null)
  }

  function setInput(value: string) {
    if (feedback?.correct || value.length > 12 || !/^[0-9,./-]*$/.test(value)) return
    setSelected(value ? [value] : [])
    setFeedback(null)
  }

  function pressKey(key: string) {
    const current = selected[0] ?? ''
    setInput(key === '⌫' ? current.slice(0, -1) : current + key)
  }

  function checkAnswer() {
    if (selected.length === 0 || feedback?.correct) return
    if (isActivityCorrect(question, selected)) {
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
      const nextScores = { ...scores, [moduleId]: [...moduleScores] }
      nextScores[moduleId][levelId - 1] = Math.max(nextScores[moduleId][levelId - 1] ?? 0, firstTryCorrect)
      setScores(nextScores)
      try {
        localStorage.setItem(MODULE_SCORE_KEY, JSON.stringify(nextScores))
        if (moduleId === 'conjuntos') localStorage.setItem(SCORE_KEY, JSON.stringify(nextScores.conjuntos))
      } catch { /* Resultado visível até fechar a página. */ }
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
      <button className="game-brand" onClick={() => navigate('entry')} aria-label="UNEMAT — voltar ao início"><img className="institution-logo" src={`${import.meta.env.BASE_URL}brand/unemat-colorido.png`} alt="UNEMAT — Universidade do Estado de Mato Grosso" width="1200" height="464" /></button>
      {screen === 'entry' && <span className="header-progress">prática sem cadastro</span>}
      {screen === 'play' && <span className="header-progress">✓ {solved} {solved === 1 ? 'acerto' : 'acertos'}</span>}
    </header>

    {screen === 'entry' && <main className="entry-screen">
      <section className="entry-hero">
        <div className="entry-copy">
          <span className="eyebrow">UMA INICIATIVA UNEMAT</span>
          <h1 ref={headingRef} tabIndex={-1}>Reforço <em>Matemático</em></h1>
          <p className="entry-institution">Universidade do Estado de Mato Grosso</p>
          <p>Escolha uma atividade e pratique no seu ritmo.</p>
          <button className="action-button entry-action" onClick={() => navigate('modules')}>Iniciar <span aria-hidden="true">→</span></button>
          <span className="entry-assurance">Sem conta, sem senha e sem pressa.</span>
        </div>
      </section>
      <div className="entry-steps" aria-label="Como funciona"><span><b>01</b> Escolha uma atividade</span><span><b>02</b> Resolva questões</span><span><b>03</b> Veja seu avanço</span></div>
    </main>}

    {screen === 'modules' && <main className="modules-screen">
      <div className="section-heading"><button className="text-back" onClick={() => navigate('entry')}>← Início</button><h1 ref={headingRef} tabIndex={-1}>Escolha uma atividade</h1><p>Escolha um tema e toque no que quer praticar.</p></div>
      <div className="activity-catalog">
        {[...modules.filter(item => item.id !== 'conjuntos'), ...modules.filter(item => item.id === 'conjuntos')].map(item => <section className="activity-topic" key={item.id} aria-labelledby={`topic-${item.id}`}>
          <h2 id={`topic-${item.id}`}><span aria-hidden="true">{item.symbol}</span>{item.title}</h2>
          <p>{item.summary}</p>
          <div className="activity-choices">{item.levels.map(entry => <button key={entry.id} onClick={() => startLevel(entry.id, item.id)}>
            <span><strong>{entry.subtitle}</strong><small>{activitiesForLevel(item.id, entry.id).length} questões{scores[item.id][entry.id - 1] !== null ? ` · Melhor: ${scores[item.id][entry.id - 1]}/${activitiesForLevel(item.id, entry.id).length}` : ''}</small></span><b aria-hidden="true">→</b>
          </button>)}</div>
        </section>)}
      </div>
    </main>}

    {screen === 'play' && <main className="play-screen">
      <div className="play-topline"><button className="back-button" onClick={() => navigate('modules')} aria-label="Voltar às atividades">←</button><div><small>{module.title.toUpperCase()} · NÍVEL {levelId}</small><strong>Questão {questionIndex + 1} de {levelQuestions.length}</strong></div><span className="question-count">{questionIndex + 1}/{levelQuestions.length}</span></div>
      <div className="progress-track" role="progressbar" aria-label="Questões resolvidas" aria-valuemin={0} aria-valuemax={levelQuestions.length} aria-valuenow={solved}>{levelQuestions.map((item, index) => <span key={item.id} className={index < solved ? 'done' : index === questionIndex ? 'current' : ''} />)}</div>
      <div className="phase-label"><span>FASE {phase} DE 2</span><strong>{level.topics[phase - 1]}</strong></div>
      <section className="question-panel" aria-labelledby="question-title">
        <span className="question-kind">{question.ordered ? 'MONTE O CAMINHO' : question.input === 'fraction' ? 'ESCREVA UMA FRAÇÃO' : question.input ? 'MONTE SUA RESPOSTA' : question.many ? 'ESCOLHA TODAS AS RESPOSTAS' : 'ESCOLHA UMA RESPOSTA'}</span>
        <h1 id="question-title" ref={headingRef} tabIndex={-1}>{question.prompt}</h1>
        {question.visual && <QuestionVisual visual={question.visual} />}
        {question.context && <div className="question-context">{question.context}</div>}
        {question.ordered && <div className="order-builder">
          <p>Toque nos blocos na ordem certa. Para retirar um bloco, toque nele novamente.</p>
          <ol aria-label="Seu fluxograma" aria-live="polite">{selected.map((id, index) => <li key={id}><span>{index + 1}. {question.options.find(option => option.id === id)?.label}</span>{index < selected.length - 1 && <b aria-hidden="true">↓</b>}</li>)}</ol>
          {selected.length === 0 && <p className="order-empty">Seu caminho aparece aqui.</p>}
          <button className="text-back" disabled={selected.length === 0 || feedback?.correct} onClick={() => { setSelected([]); setFeedback(null) }}>Recomeçar montagem</button>
        </div>}
        {question.input ? <div className="number-activity">
          <label htmlFor="number-answer">{question.input === 'fraction' ? 'Sua fração' : 'Sua resposta'}</label>
          <div className="number-answer-wrap"><input id="number-answer" type="text" inputMode={question.input === 'fraction' ? 'text' : 'decimal'} autoComplete="off" value={selected[0] ?? ''} onChange={event => setInput(event.target.value)} disabled={feedback?.correct} placeholder={question.input === 'fraction' ? 'Ex.: 3/4' : 'Ex.: 2,5'} />{question.unit && <span>{question.unit}</span>}</div>
          <div className="number-keypad" aria-label="Teclado de resposta">{['1','2','3','4','5','6','7','8','9', question.input === 'fraction' ? '/' : ',', '0','⌫'].map(key => <button key={key} type="button" onClick={() => pressKey(key)} disabled={feedback?.correct} aria-label={key === '⌫' ? 'Apagar último caractere' : key}>{key}</button>)}</div>
        </div> : <div className={`options-grid ${question.options.length === 2 ? 'two-options' : ''}`} aria-label="Opções de resposta">
          {question.options.map(option => <button key={option.id} className={`answer-option ${option.icon ? '' : 'text-only'} ${selected.includes(option.id) ? 'selected' : ''}`} aria-pressed={selected.includes(option.id)} disabled={feedback?.correct} onClick={() => choose(option.id)}>{option.icon && <span className="option-icon" aria-hidden="true">{option.icon}</span>}<span className="option-label">{option.label}</span><span className="option-check" aria-hidden="true">{selected.includes(option.id) ? question.ordered ? selected.indexOf(option.id) + 1 : '✓' : '+'}</span></button>)}
        </div>}
        {question.many && <p className="selected-count">{selected.length} {selected.length === 1 ? 'opção marcada' : 'opções marcadas'}</p>}
        <div className="answer-footer">
          {feedback ? <p className={`answer-feedback ${feedback.correct ? 'is-correct' : 'is-retry'}`} role="status" aria-live="polite"><strong>{feedback.correct ? '✓ Acertou!' : '↻ Vamos tentar de novo'}</strong><span>{feedback.text}</span></p> : <p className="answer-prompt">{question.ordered ? 'Monte todos os blocos e confira seu caminho.' : question.input === 'fraction' ? 'Use / para separar o número de cima e o de baixo.' : question.input ? 'Use os botões ou digite sua resposta.' : question.many ? 'Toque em todas as opções que combinam.' : 'Toque na resposta que você escolher.'}</p>}
          {feedback?.correct
            ? <button className="action-button" onClick={nextQuestion}>{questionIndex === levelQuestions.length - 1 ? 'Ver meu resultado' : 'Próxima questão'} <span aria-hidden="true">→</span></button>
            : <button className="action-button" onClick={checkAnswer} disabled={selected.length === 0 || (question.ordered && selected.length !== question.options.length)}>Conferir resposta <span aria-hidden="true">→</span></button>}
        </div>
      </section>
    </main>}

    {screen === 'result' && <main className="result-screen">
      <div className="result-symbol" aria-hidden="true">✓</div>
      <span className="eyebrow">{module.title.toUpperCase()} · NÍVEL {levelId} FINALIZADO</span>
      <h1 ref={headingRef} tabIndex={-1}>Atividade concluída!</h1>
      <p>Praticar, errar e tentar de novo faz parte do aprendizado.</p>
      <div className="result-numbers"><div><strong>{solved}/{levelQuestions.length}</strong><span>questões feitas</span></div><div><strong>{firstTryCorrect}/{levelQuestions.length}</strong><span>de primeira</span></div></div>
      <p className="best-result">Seu melhor resultado neste nível: <strong>{moduleScores[levelId - 1]}/{levelQuestions.length} de primeira</strong></p>
      <div className="result-actions"><button className="action-button" onClick={() => navigate('modules')}>Escolher outra atividade <span aria-hidden="true">→</span></button><button className="secondary-button" onClick={() => startLevel(levelId)}>Praticar de novo</button></div>
    </main>}
    <footer className="game-footer"><img src={`${import.meta.env.BASE_URL}brand/unemat-branco.png`} alt="UNEMAT" width="1200" height="464" /><div><strong>Reforço Matemático</strong><span>Uma iniciativa da Universidade do Estado de Mato Grosso</span></div></footer>
  </div>
}

export default App
