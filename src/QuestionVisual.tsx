import type { Visual } from './moduleData'

export default function QuestionVisual({ visual }: { visual: Visual }) {
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
