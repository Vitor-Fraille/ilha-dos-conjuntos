import type { Visual } from './moduleData'

export default function QuestionVisual({ visual }: { visual: Visual }) {
  if (visual.kind === 'flow') return <figure className="flow-visual" aria-label="Fluxograma: siga as setas de cima para baixo">
    <ol className="flow-steps">{visual.steps.map((step, index) => <li key={index}><span className={step === 'Início' || step === 'Fim' ? 'flow-terminal' : 'flow-process'}>{step}</span>{(index < visual.steps.length - 1 || visual.decision) && <span className="flow-arrow" aria-label="depois">↓</span>}</li>)}</ol>
    {visual.decision && <><div className="flow-decision"><span>{visual.decision}</span></div><div className="flow-branches"><div><b>Sim ↓</b><span>{visual.yes}</span><b>↓</b></div><div><b>Não ↓</b><span>{visual.no}</span><b>↓</b></div></div><span className="flow-terminal">Fim</span></>}
  </figure>
  if (visual.kind === 'data') {
    const total = visual.rows.reduce((sum, row) => sum + row.value, 0)
    const maximum = Math.max(...visual.rows.map(row => row.value))
    const colors = ['#153755', '#59794a', '#ffcc29', '#a6c5db']
    let angle = 0
    const sectors = visual.rows.map((row, index) => {
      const start = angle
      angle += row.value / total * 360
      return `${colors[index % colors.length]} ${start}deg ${angle}deg`
    })
    return <figure className="data-visual">
      <figcaption>{visual.title}</figcaption>
      {visual.chart === 'table' ? <table><thead><tr><th scope="col">Fruta</th><th scope="col">Alunos</th></tr></thead><tbody>{visual.rows.map(row => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.value}</td></tr>)}</tbody></table> : <>
        <p className="data-unit">{visual.chart === 'pictogram' ? `Cada ● representa ${visual.perSymbol ?? 1} ${visual.unit}.` : `Valores em ${visual.unit}`}</p>
        {visual.chart === 'bar' && <div className="chart-bars">{visual.rows.map(row => <div key={row.label}><span>{row.label}</span><div className="bar-track" aria-hidden="true"><i style={{ width: `${row.value / maximum * 100}%` }} /></div><strong>{row.value}</strong></div>)}</div>}
        {visual.chart === 'pictogram' && <ul className="pictogram-rows">{visual.rows.map(row => <li key={row.label}><strong>{row.label}</strong><span aria-label={`${row.value / (visual.perSymbol ?? 1)} símbolos, ${row.value} ${visual.unit}`}>{Array.from({ length: row.value / (visual.perSymbol ?? 1) }, (_, index) => <span key={index} aria-hidden="true">● </span>)}</span></li>)}</ul>}
        {visual.chart === 'line' && <svg className="line-chart" viewBox="0 0 320 220" role="img" aria-label={visual.rows.map(row => `${row.label}: ${row.value} ${visual.unit}`).join('; ')}>
          {[0, 10, 20, 30].map(value => <g key={value}><path d={`M40 ${180 - value * 5}H300`} stroke="#ccd6df" /><text x="8" y={184 - value * 5}>{value}</text></g>)}
          <path d="M40 20V180H300" fill="none" stroke="#153755" strokeWidth="2" />
          <polyline points={visual.rows.map((row, index) => `${55 + index * 75},${180 - row.value * 5}`).join(' ')} fill="none" stroke="#33552c" strokeWidth="3" />
          {visual.rows.map((row, index) => <g key={row.label}><circle cx={55 + index * 75} cy={180 - row.value * 5} r="5" fill="#153755" /><text x={55 + index * 75} y={165 - row.value * 5} textAnchor="middle">{row.value}</text><text x={55 + index * 75} y="205" textAnchor="middle">{row.label}</text></g>)}
        </svg>}
        {visual.chart === 'pie' && <div className="pie-layout"><div className="pie-chart" role="img" aria-label={visual.rows.map(row => `${row.label}: ${row.value} de ${total} ${visual.unit}`).join('; ')} style={{ background: `conic-gradient(${sectors.join(',')})` }}>{visual.rows.map((row, index) => {
          const before = visual.rows.slice(0, index).reduce((sum, item) => sum + item.value, 0)
          const radians = (before + row.value / 2) / total * Math.PI * 2
          return <b key={row.label} style={{ left: `${50 + Math.sin(radians) * 31}%`, top: `${50 - Math.cos(radians) * 31}%` }}>{index + 1}</b>
        })}</div><ol className="pie-legend">{visual.rows.map(row => <li key={row.label}>{row.label}: <strong>{row.value}</strong></li>)}</ol></div>}
      </>}
    </figure>
  }
  if (visual.kind === 'fraction') return <div className="activity-visual fraction-visual" role="img" aria-label={'Barra com ' + visual.filled + ' de ' + visual.parts + ' partes pintadas: ' + visual.label}>
    <div className="fraction-bar">{Array.from({ length: visual.parts }, (_, index) => <span key={index} className={index < visual.filled ? 'filled' : ''} />)}</div>
    <strong>{visual.label}</strong>
  </div>
  if (visual.kind === 'decimal') return <div className="activity-visual decimal-visual" role="img" aria-label={'Conta ' + visual.value}>
    <span>FAÇA A CONTA</span><strong>{visual.value}</strong>
  </div>
  if (visual.kind === 'box') return <div className="activity-visual box-visual" role="img" aria-label={'Caixa de ' + visual.width + ' por ' + visual.depth + ' por ' + visual.height + ' ' + visual.unit}>
    <svg viewBox="0 0 260 150" aria-hidden="true">
      <path d="M58 49 143 26 218 58 132 84Z" fill="#ffe2a1" stroke="#203438" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M58 49v64l74 31V84Z" fill="#8bd6c4" stroke="#203438" strokeWidth="3" strokeLinejoin="round"/>
      <path d="M132 84v60l86-30V58Z" fill="#5abcae" stroke="#203438" strokeWidth="3" strokeLinejoin="round"/>
      <text x="94" y="40">{visual.width} {visual.unit}</text>
      <text x="184" y="34">{visual.depth} {visual.unit}</text>
      <text x="222" y="103">{visual.height} {visual.unit}</text>
    </svg>
  </div>
  if (visual.kind === 'mass') return <div className="activity-visual mass-visual" role="img" aria-label={'Compare ' + visual.left + ' com ' + visual.right}>
    <span>{visual.left}</span><b>ou</b><span>{visual.right}</span>
  </div>
  const fillTop = 20 + (40 - visual.value) / 50 * 130
  return <div className="activity-visual temperature-visual" role="img" aria-label={'Termômetro marcando ' + visual.value + ' graus Celsius'}>
    <svg viewBox="0 0 140 180" aria-hidden="true">
      <rect x="35" y="20" width="26" height="130" rx="13" fill="#fffdf7" stroke="#203438" strokeWidth="3"/>
      <rect x="39" y={fillTop} width="18" height={150 - fillTop} rx="8" fill="#e8684e"/>
      <circle cx="48" cy="151" r="15" fill="#e8684e" stroke="#203438" strokeWidth="3"/>
      {[40, 20, 0, -10].map(value => {
        const y = 20 + (40 - value) / 50 * 130
        return <g key={value}><path d={'M65 ' + y + 'h10'} stroke="#203438" strokeWidth="2"/><text x="81" y={y + 4}>{value} °C</text></g>
      })}
    </svg>
  </div>
}
