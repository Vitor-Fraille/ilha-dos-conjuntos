import { useId } from 'react'
import { Clothing, HandTool, Headwear } from './TutorWardrobe'
import { getTutorOutfit, tutorColors, type TutorExpression, type TutorProfile } from './tutorProfile'

type TutorAvatarProps = {
  profile: TutorProfile
  size?: 'mini' | 'medium' | 'large'
  expression?: TutorExpression
  animated?: boolean
}

export function TutorAvatar({ profile, size = 'medium', expression = 'happy', animated = false }: TutorAvatarProps) {
  const id = useId()
  const color = tutorColors.find(option => option.id === profile.color) ?? tutorColors[0]
  const outfit = getTutorOutfit(profile.outfit)
  const shell = id + '-shell'
  const glass = id + '-glass'
  const metal = id + '-metal'
  return (
    <div className={'robot robot-' + size + ' robot-' + expression + (animated ? ' robot-animated' : '')} aria-hidden="true">
      <svg viewBox="0 0 240 300" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <defs>
          <linearGradient id={shell} x1="68" y1="75" x2="170" y2="165" gradientUnits="userSpaceOnUse"><stop stopColor={color.light} /><stop offset=".42" stopColor={color.value} /><stop offset="1" stopColor={color.dark} /></linearGradient>
          <linearGradient id={glass} x1="87" y1="86" x2="145" y2="151" gradientUnits="userSpaceOnUse"><stop stopColor="#315e73" /><stop offset="1" stopColor="#152c46" /></linearGradient>
          <linearGradient id={metal} x1="75" y1="70" x2="161" y2="240" gradientUnits="userSpaceOnUse"><stop stopColor="#fffef8" /><stop offset=".5" stopColor="#e8f0f3" /><stop offset="1" stopColor="#a8bfce" /></linearGradient>
        </defs>
        <ellipse cx="120" cy="283" rx="60" ry="8" fill="#183b56" opacity=".1" />
        {profile.accessory === 'backpack' && <g><rect x="60" y="170" width="119" height="65" rx="20" fill="#bb8264" stroke="#785a4a" strokeWidth="3" /><rect x="54" y="191" width="23" height="33" rx="8" fill="#dca884" /><rect x="163" y="191" width="23" height="33" rx="8" fill="#dca884" /></g>}
        {profile.outfit === 'astronaut' && <rect x="70" y="173" width="99" height="60" rx="18" fill="#b1c4df" stroke="#8199b8" strokeWidth="3" />}
        <g stroke="#829fb3" strokeWidth="2"><rect x="90" y="232" width="21" height="33" rx="9" fill={'url(#' + metal + ')'} /><rect x="129" y="232" width="21" height="33" rx="9" fill={'url(#' + metal + ')'} /></g>
        <path d="M90 254q-17 3-16 17 0 9 29 8 14 0 12-12l-3-13Z" fill={color.dark} />
        <path d="M133 254q-8 9-7 18 0 8 27 7 19-1 10-15l-11-10Z" fill={color.dark} />
        <path d="M80 268h28m26 0h24" stroke={color.light} strokeWidth="5" strokeLinecap="round" />
        <g><path d="M84 183q-21 1-26 30" stroke="#9ab2bf" strokeWidth="19" strokeLinecap="round" /><path d="M79 184q-16 3-19 20" stroke={outfit.fabric} strokeWidth="22" strokeLinecap="round" /><circle cx="57" cy="220" r="13" fill={'url(#' + metal + ')'} /><path d="M53 216v8m6-7v6" stroke="#8ea7b5" strokeWidth="2" strokeLinecap="round" /></g>
        <g className="robot-wave"><path d="M157 185q23 2 28 30" stroke="#9ab2bf" strokeWidth="19" strokeLinecap="round" /><path d="M160 185q14 3 19 17" stroke={outfit.fabric} strokeWidth="22" strokeLinecap="round" /><HandTool kind={profile.outfit} /><circle cx="185" cy="219" r="12" fill={'url(#' + metal + ')'} /><path d="m185 214 3 7" stroke="#8ea7b5" strokeWidth="2" strokeLinecap="round" /></g>
        <rect x="108" y="155" width="24" height="28" rx="8" fill="#94acbd" />
        <path d="M92 172q28-10 56 0 17 8 17 31l-5 30q-4 16-40 16t-40-16l-5-30q0-23 17-31Z" fill={outfit.fabric} stroke="#658195" strokeOpacity=".35" strokeWidth="2" />
        <Clothing kind={profile.outfit} />
        <path d="M88 232q30 13 64 0" stroke={outfit.accent} strokeOpacity=".25" strokeWidth="5" strokeLinecap="round" />
        {profile.accessory === 'scarf' && <g><path d="m135 171 17 3-5 45-14-5Z" fill="#d67f7e" /><path d="m136 196 12 3m-13 5 12 3" stroke="#f6c69c" strokeWidth="4" /><path d="M89 165q31 15 63 0v16q-30 13-63-1Z" fill="#eca896" /></g>}
        <path d="M120 79V48" stroke={color.dark} strokeWidth="6" strokeLinecap="round" /><circle cx="120" cy="43" r="9" fill="#ffda81" stroke="#fff4d2" strokeWidth="3" />
        <rect x="40" y="101" width="25" height="41" rx="12" fill={color.dark} stroke="#e4f0f3" strokeWidth="4" /><rect x="175" y="101" width="25" height="41" rx="12" fill={color.dark} stroke="#e4f0f3" strokeWidth="4" />
        <path d="M60 89Q65 70 120 70t60 19q10 22 0 56-8 23-60 23t-60-23q-10-34 0-56Z" fill={'url(#' + shell + ')'} stroke={'url(#' + metal + ')'} strokeWidth="7" />
        <path d="M70 91q50-24 100 0" stroke="white" strokeOpacity=".6" strokeWidth="5" strokeLinecap="round" />
        <rect x="71" y="91" width="98" height="61" rx="25" fill={'url(#' + glass + ')'} stroke="#20405b" strokeWidth="3" />
        <path d="M83 104q34-15 71-3" stroke="#799fae" strokeOpacity=".3" strokeWidth="5" strokeLinecap="round" />
        <g className="robot-eyes" stroke="#adf6ef" strokeWidth="7" strokeLinecap="round">
          {expression === 'celebrate' ? <path d="m91 120q8-12 15 0m29 0q8-12 15 0" /> : <><path d="M98 112v12" /><path d={expression === 'curious' ? 'M141 117v7' : 'M141 112v12'} /></>}
        </g>
        <ellipse cx="86" cy="133" rx="6" ry="3" fill="#edaba6" opacity=".65" /><ellipse cx="154" cy="133" rx="6" ry="3" fill="#edaba6" opacity=".65" />
        {expression === 'thinking' ? <circle cx="120" cy="137" r="4" stroke="#adf6ef" strokeWidth="3" /> : <path d="M112 135q8 9 16 0" stroke="#adf6ef" strokeWidth="3" strokeLinecap="round" />}
        <circle cx="60" cy="90" r="2" fill="#f3fafb" /><circle cx="180" cy="90" r="2" fill="#f3fafb" />
        <Headwear kind={profile.hat} />
        {profile.accessory === 'glasses' && <g stroke="#f9dc97" strokeWidth="3"><rect x="79" y="105" width="30" height="26" rx="9" /><rect x="131" y="105" width="30" height="26" rx="9" /><path d="M109 114q11-6 22 0m-60-3 8 3m82 0 8-3" /></g>}
        {profile.accessory === 'headphones' && <g><path d="M47 107q-7-53 31-52m84 0q38-1 31 52" stroke="#344d70" strokeWidth="8" /><rect x="33" y="106" width="22" height="38" rx="9" fill="#f6c880" stroke="#af844d" strokeWidth="2" /><rect x="185" y="106" width="22" height="38" rx="9" fill="#f6c880" stroke="#af844d" strokeWidth="2" /><path d="M194 141q-8 24-27 18" stroke="#344d70" strokeWidth="3" /><rect x="157" y="154" width="15" height="7" rx="3" fill="#344d70" /></g>}
        {expression === 'celebrate' && <g fill="#e9b852"><path d="m30 61 3-8 3 8 8 3-8 3-3 8-3-8-8-3Z" /><path d="m204 148 3-7 3 7 7 3-7 3-3 7-3-7-7-3Z" /></g>}
      </svg>
    </div>
  )
}
