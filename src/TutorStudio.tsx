import { useState, type FormEvent } from 'react'
import { TutorAvatar } from './TutorAvatar'
import {
  getTutorOutfit, tutorAccessories, tutorColors, tutorHats, tutorOutfits,
  type TutorExpression, type TutorProfile,
} from './tutorProfile'

const categories = [
  { id: 'outfit', label: 'Profissões', symbol: '✦', title: 'O que vamos ser hoje?', detail: 'Cada profissão tem uma roupa, ferramentas e novas histórias.' },
  { id: 'color', label: 'Cores', symbol: '◒', title: 'Uma cor com a sua cara', detail: 'Escolha a cor do robô. A roupa continua do jeitinho que você escolheu.' },
  { id: 'hat', label: 'Chapéus', symbol: '♧', title: 'Uma ideia na cabeça', detail: 'Pode misturar! Que tal um cientista de coroa?' },
  { id: 'accessory', label: 'Acessórios', symbol: '⊕', title: 'O detalhe faz a diferença', detail: 'Complete o visual com um acessório especial.' },
] as const
type Category = typeof categories[number]['id']

type TutorStudioProps = {
  profile: TutorProfile
  onSave: (profile: TutorProfile) => void
  onCancel: () => void
  error: string
}

export function TutorStudio({ profile, onSave, onCancel, error }: TutorStudioProps) {
  const [draft, setDraft] = useState(profile)
  const [category, setCategory] = useState<Category>('outfit')
  const [expression, setExpression] = useState<TutorExpression>('happy')
  const [previewComment, setPreviewComment] = useState('')
  const [commentIndex, setCommentIndex] = useState(0)
  const outfit = getTutorOutfit(draft.outfit)
  const activeCategory = categories.find(option => option.id === category)!
  const validName = draft.name.trim().length >= 2

  function changeDetail<K extends keyof TutorProfile>(key: K, value: TutorProfile[K]) {
    setDraft(current => ({ ...current, [key]: value }))
    setExpression('happy')
    setPreviewComment('')
    setCommentIndex(0)
  }

  function tryComment() {
    setPreviewComment(outfit.comments[commentIndex % outfit.comments.length])
    setExpression(commentIndex % 2 === 0 ? 'curious' : 'celebrate')
    setCommentIndex(current => current + 1)
  }

  function surprise() {
    const pick = <T,>(options: readonly T[]) => options[Math.floor(Math.random() * options.length)]
    setDraft(current => ({ ...current, color: pick(tutorColors).id, outfit: pick(tutorOutfits).id, hat: pick(tutorHats).id, accessory: pick(tutorAccessories).id }))
    setExpression('celebrate')
    setPreviewComment('Um visual novinho! Você pode mudar qualquer detalhe antes de salvar.')
    setCommentIndex(0)
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (validName) onSave({ ...draft, name: draft.name.trim().slice(0, 14) })
  }

  const options = category === 'color' ? tutorColors : category === 'hat' ? tutorHats : category === 'accessory' ? tutorAccessories : tutorOutfits

  return (
    <main className="studio-page">
      <form className="studio" onSubmit={save}>
        <header className="studio-header">
          <button className="round-button" type="button" onClick={onCancel} aria-label="Voltar sem salvar">←</button>
          <div><span className="studio-kicker">LABORATÓRIO DE COMPANHEIROS</span><h1>Seu tutor, do seu jeito.</h1></div>
          <span className="studio-header-note">Feito de ideias. E de você!</span>
        </header>
        <div className="studio-body">
          <section className="studio-preview" aria-label="Prévia do personagem">
            <span className="studio-preview-label"><i aria-hidden="true" /> PRONTO PARA DESCOBRIR</span>
            <div className="studio-speech" aria-live="polite">{previewComment || outfit.greeting}</div>
            <div className="studio-stage">
              <span className="studio-orbit orbit-a" aria-hidden="true">∈</span><span className="studio-orbit orbit-b" aria-hidden="true">✦</span>
              <TutorAvatar profile={draft} size="large" expression={expression} animated />
            </div>
            <div className="studio-identity"><h2>{draft.name.trim() || 'Seu novo tutor'}</h2><span>{outfit.symbol} {outfit.label}</span></div>
            <p className="studio-profession-detail">{outfit.description}</p>
            <div className="studio-preview-actions">
              <button type="button" onClick={tryComment}>☺ Testar uma fala</button>
              <button type="button" onClick={surprise}>⤨ Me surpreenda</button>
            </div>
            <p className="studio-caption">Você inventa o personagem. Ele acompanha suas descobertas.</p>
          </section>
          <section className="studio-editor" aria-label="Personalizar tutor">
            <div className="studio-name-field">
              <label htmlFor="tutor-name">Como seu tutor vai se chamar?</label>
              <div className="studio-name-input"><input id="tutor-name" value={draft.name} maxLength={14} minLength={2} required autoComplete="off" aria-describedby="tutor-name-help" onChange={event => changeDetail('name', event.target.value)} placeholder="Ex.: Lumi" /><span aria-hidden="true">✎</span></div>
              <small id="tutor-name-help">Invente um nome com 2 a 14 letras. Não use seu nome real.</small>
              <div className="studio-name-suggestions" aria-label="Sugestões de nomes fictícios">
                {['Lumi', 'Pingo', 'Tico', 'Zuca', 'Nimbo'].map(name => <button type="button" key={name} onClick={() => changeDetail('name', name)}>{name}</button>)}
              </div>
            </div>
            <div className="studio-categories" role="group" aria-label="Categorias de personalização">
              {categories.map(option => <button type="button" key={option.id} aria-pressed={category === option.id} aria-controls="studio-options-panel" onClick={() => setCategory(option.id)}><span aria-hidden="true">{option.symbol}</span>{option.label}</button>)}
            </div>
            <section id="studio-options-panel" className="studio-option-panel" aria-labelledby="studio-options-title">
              <div className="studio-options-heading"><h2 id="studio-options-title">{activeCategory.title}</h2><span>{options.length} opções</span></div>
              <p>{activeCategory.detail}</p>
              <div className={'studio-options-grid studio-options-' + category}>
                {options.map(option => {
                  const selected = draft[category] === option.id
                  const optionProfile = { ...draft, [category]: option.id }
                  return <button type="button" key={option.id} aria-pressed={selected} className={selected ? 'is-selected' : ''} onClick={() => {
                    // Category and option come from the same typed catalog above.
                    setDraft(optionProfile as TutorProfile)
                    setPreviewComment('')
                    setExpression('happy')
                    setCommentIndex(0)
                  }}>
                    {category === 'color' && 'value' in option
                      ? <span className="studio-swatch" style={{ background: option.value }} aria-hidden="true" />
                      : <TutorAvatar profile={optionProfile as TutorProfile} size="medium" />}
                    <strong>{option.label}</strong>
                    <span className="studio-selection" aria-hidden="true">{selected ? '✓' : '+'}</span>
                  </button>
                })}
              </div>
              <p className="studio-selected-summary"><span aria-hidden="true">✓</span> {category === 'outfit' ? outfit.clothing : 'Tudo combina. Sua escolha aparece na prévia do personagem.'}</p>
            </section>
            {error && <p className="studio-error" role="alert">{error}</p>}
            <div className="studio-save-bar"><p><strong>Gostou da combinação?</strong><small>Você pode mudar tudo depois.</small></p><button className="primary-button" type="submit" disabled={!validName}>Salvar meu tutor <span aria-hidden="true">→</span></button></div>
          </section>
        </div>
      </form>
    </main>
  )
}
