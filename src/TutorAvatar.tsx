import type { CSSProperties } from 'react'

export type TutorColor = 'ocean' | 'forest' | 'coral' | 'violet'
export type TutorHat = 'cap' | 'crown' | 'top-hat' | 'flower'
export type TutorOutfit = 'explorer' | 'scientist' | 'sailor' | 'artist'
export type TutorExpression = 'happy' | 'curious' | 'thinking' | 'celebrate'

export type TutorProfile = {
  name: string
  color: TutorColor
  hat: TutorHat
  outfit: TutorOutfit
}

export const tutorColors: Array<{ id: TutorColor; label: string; value: string; dark: string }> = [
  { id: 'ocean', label: 'Oceano', value: '#3197ad', dark: '#206c80' },
  { id: 'forest', label: 'Floresta', value: '#28a184', dark: '#14715f' },
  { id: 'coral', label: 'Coral', value: '#ef715f', dark: '#b94b3d' },
  { id: 'violet', label: 'Violeta', value: '#8065c5', dark: '#574294' },
]

export const tutorHats: Array<{ id: TutorHat; label: string; symbol: string }> = [
  { id: 'cap', label: 'Boné aventureiro', symbol: '🧢' },
  { id: 'crown', label: 'Coroa brilhante', symbol: '👑' },
  { id: 'top-hat', label: 'Cartola mágica', symbol: '🎩' },
  { id: 'flower', label: 'Chapéu florido', symbol: '🌻' },
]

export const tutorOutfits: Array<{ id: TutorOutfit; label: string; symbol: string }> = [
  { id: 'explorer', label: 'Explorador', symbol: '🧭' },
  { id: 'scientist', label: 'Cientista', symbol: '🔬' },
  { id: 'sailor', label: 'Marinheiro', symbol: '⚓' },
  { id: 'artist', label: 'Artista', symbol: '🎨' },
]

export const defaultTutorProfile: TutorProfile = {
  name: 'Lumi',
  color: 'ocean',
  hat: 'cap',
  outfit: 'explorer',
}

type TutorAvatarProps = {
  profile: TutorProfile
  size?: 'mini' | 'medium' | 'large'
  expression?: TutorExpression
  animated?: boolean
}

export function TutorAvatar({
  profile,
  size = 'medium',
  expression = 'happy',
  animated = false,
}: TutorAvatarProps) {
  const color = tutorColors.find((option) => option.id === profile.color) ?? tutorColors[0]
  const hat = tutorHats.find((option) => option.id === profile.hat) ?? tutorHats[0]
  const outfit = tutorOutfits.find((option) => option.id === profile.outfit) ?? tutorOutfits[0]
  const style = {
    '--tutor-color': color.value,
    '--tutor-color-dark': color.dark,
  } as CSSProperties

  return (
    <div
      className={`tutor-avatar tutor-avatar-${size} tutor-${expression} ${animated ? 'tutor-animated' : ''}`}
      style={style}
      aria-hidden="true"
    >
      <span className="tutor-hat">{hat.symbol}</span>
      <span className="tutor-antenna"><i /></span>
      <div className="tutor-head">
        <span className="tutor-ear tutor-ear-left" />
        <span className="tutor-ear tutor-ear-right" />
        <div className="tutor-face">
          <i className="tutor-eye tutor-eye-left" />
          <i className="tutor-eye tutor-eye-right" />
          <i className="tutor-mouth" />
        </div>
      </div>
      <div className={`tutor-body tutor-outfit-${profile.outfit}`}>
        <span className="tutor-arm tutor-arm-left" />
        <span className="tutor-arm tutor-arm-right" />
        <span className="tutor-outfit-symbol">{outfit.symbol}</span>
      </div>
      <div className="tutor-feet"><i /><i /></div>
    </div>
  )
}
