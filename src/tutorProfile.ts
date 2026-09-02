export type TutorColor = 'ocean' | 'forest' | 'coral' | 'violet' | 'sunshine' | 'rose'
export type TutorHat = 'cap' | 'crown' | 'top-hat' | 'flower' | 'none' | 'beret' | 'helmet' | 'chef'
export type TutorOutfit = 'explorer' | 'scientist' | 'sailor' | 'artist' | 'astronaut' | 'gardener' | 'engineer' | 'chef'
export type TutorAccessory = 'none' | 'glasses' | 'scarf' | 'headphones' | 'backpack'
export type TutorExpression = 'happy' | 'curious' | 'thinking' | 'celebrate'

export type TutorProfile = {
  name: string
  color: TutorColor
  hat: TutorHat
  outfit: TutorOutfit
  accessory: TutorAccessory
}

export const tutorColors: Array<{ id: TutorColor; label: string; value: string; dark: string; light: string }> = [
  { id: 'ocean', label: 'Oceano', value: '#40bbc5', dark: '#157b94', light: '#b6f5ee' },
  { id: 'forest', label: 'Floresta', value: '#61b786', dark: '#267454', light: '#d2f3ba' },
  { id: 'coral', label: 'Coral', value: '#f58c66', dark: '#c35a46', light: '#ffe4bf' },
  { id: 'violet', label: 'Violeta', value: '#9c8bde', dark: '#6653ae', light: '#e9dcff' },
  { id: 'sunshine', label: 'Sol', value: '#f3c74f', dark: '#ad7923', light: '#fff3b3' },
  { id: 'rose', label: 'Pitaya', value: '#e994b5', dark: '#b2517c', light: '#ffe0eb' },
]

export const tutorHats: Array<{ id: TutorHat; label: string; symbol: string }> = [
  { id: 'none', label: 'Só a antena', symbol: '✦' },
  { id: 'cap', label: 'Boné', symbol: '🧢' },
  { id: 'beret', label: 'Boina', symbol: '🎨' },
  { id: 'helmet', label: 'Capacete', symbol: '⛑️' },
  { id: 'flower', label: 'Chapéu florido', symbol: '🌻' },
  { id: 'crown', label: 'Coroa', symbol: '👑' },
  { id: 'top-hat', label: 'Cartola', symbol: '🎩' },
  { id: 'chef', label: 'Chapéu de chef', symbol: '👨‍🍳' },
]

type OutfitOption = {
  id: TutorOutfit
  label: string
  symbol: string
  fabric: string
  accent: string
  clothing: string
  description: string
  greeting: string
  comments: string[]
}

export const tutorOutfits: OutfitOption[] = [
  {
    id: 'explorer', label: 'Explorador', symbol: '🧭', fabric: '#e0b779', accent: '#775635', clothing: 'Colete com bolsos e bússola',
    description: 'Observa pistas e descobre novos caminhos.',
    greeting: 'Bússola pronta! Cada descoberta começa com uma boa pergunta.',
    comments: ['Na minha mochila, separo mapas de ferramentas. Cada grupo tem uma regra!', 'Explorar também é observar. Que detalhe você ainda não tinha percebido?', 'Duas trilhas podem levar ao mesmo lugar. Podemos experimentar outra estratégia.'],
  },
  {
    id: 'scientist', label: 'Cientista', symbol: '🧪', fabric: '#f5fbff', accent: '#639dba', clothing: 'Jaleco, crachá e tubo de ensaio',
    description: 'Faz perguntas, testa ideias e compara resultados.',
    greeting: 'Laboratório pronto! Vamos observar, testar e descobrir juntos.',
    comments: ['No meu laboratório imaginário, organizo os frascos pelo formato. Qual outra regra serviria?', 'Uma ideia não funcionou? Cientistas testam outra. A descoberta continua!', 'Se dois grupos têm o mesmo tamanho, eles têm os mesmos elementos? Compare um por um.'],
  },
  {
    id: 'sailor', label: 'Marinheiro', symbol: '⚓', fabric: '#eaf7fa', accent: '#316b91', clothing: 'Blusa listrada e lenço de bordo',
    description: 'Navega com atenção e cuida da tripulação.',
    greeting: 'Tudo a bordo! Vamos navegar por uma ideia de cada vez.',
    comments: ['Organizei as cordas em uma caixa e os mapas em outra. São dois conjuntos!', 'Um mapa ajuda a escolher a rota. A regra do conjunto ajuda a escolher os elementos.', 'No porto há barcos grandes e pequenos. Que regra você usaria para agrupá-los?'],
  },
  {
    id: 'artist', label: 'Artista', symbol: '🎨', fabric: '#bdc6ec', accent: '#6363a5', clothing: 'Avental com tintas e pincel',
    description: 'Imagina, mistura ideias e cria com as formas.',
    greeting: 'Pincéis preparados! Vamos dar cor às nossas descobertas.',
    comments: ['Posso agrupar meus lápis por cor ou por tamanho. A regra muda o conjunto!', 'Desenhe dois círculos no papel. Quais elementos poderiam aparecer nos dois?', 'Meu avental tem várias manchas, mas cada uma faz parte da criação. Experimentar faz parte!'],
  },
  {
    id: 'astronaut', label: 'Astronauta', symbol: '🚀', fabric: '#edf2ff', accent: '#6476b6', clothing: 'Traje espacial e painel de missão',
    description: 'Explora o espaço com curiosidade e trabalho em equipe.',
    greeting: 'Missão descoberta: decolar! Você escolhe a rota e eu ajudo nas pistas.',
    comments: ['Na nave, separo ferramentas de alimentos. Cada conjunto tem sua função!', 'Imagine um conjunto de planetas. A Lua pertence a ele? Ela é um satélite natural.', 'Antes de decolar, reviso cada item. Antes de conferir, podemos revisar cada escolha!'],
  },
  {
    id: 'gardener', label: 'Jardineiro', symbol: '🌱', fabric: '#77a779', accent: '#355f4f', clothing: 'Jardineira, bolso e mudinha',
    description: 'Cuida das plantas e observa pequenas mudanças.',
    greeting: 'Uma ideia é como uma semente. Vamos cuidar dela com paciência!',
    comments: ['No meu jardim, as flores amarelas formam um grupo dentro do grupo de todas as flores.', 'Posso separar sementes por tipo. Como você organizaria uma coleção de folhas?', 'Aprender pede cuidado, como um jardim. Um passo pequeno também é progresso.'],
  },
  {
    id: 'engineer', label: 'Engenheiro', symbol: '🔧', fabric: '#f7ba53', accent: '#9a6233', clothing: 'Colete refletivo e cinto de ferramentas',
    description: 'Planeja, constrói e procura soluções.',
    greeting: 'Projeto na mesa! Vamos construir uma solução, peça por peça.',
    comments: ['Guardo parafusos e porcas em grupos diferentes. Assim encontro a peça certa!', 'Para comparar duas caixas, não basta contar: preciso conferir quais peças estão dentro.', 'Uma construção começa com uma base. Nossa base é ler a regra com atenção.'],
  },
  {
    id: 'chef', label: 'Chef de cozinha', symbol: '🥣', fabric: '#fff9ee', accent: '#ba6352', clothing: 'Dólmã, botões e lenço de chef',
    description: 'Combina ingredientes com criatividade e cuidado.',
    greeting: 'Receita de hoje: uma pitada de curiosidade e muita descoberta!',
    comments: ['Para uma salada de frutas, só entram ingredientes que seguem essa regra. O que você escolheria?', 'Duas receitas usam banana. Ela faz parte do grupo de ingredientes em comum!', 'Se eu mudar a ordem das frutas na tigela, continuam sendo as mesmas frutas. O conjunto não muda!'],
  },
]

export const tutorAccessories: Array<{ id: TutorAccessory; label: string; symbol: string }> = [
  { id: 'none', label: 'Sem acessório', symbol: '○' },
  { id: 'glasses', label: 'Óculos', symbol: '👓' },
  { id: 'scarf', label: 'Cachecol', symbol: '🧣' },
  { id: 'headphones', label: 'Fones', symbol: '🎧' },
  { id: 'backpack', label: 'Mochila', symbol: '🎒' },
]

export const defaultTutorProfile: TutorProfile = {
  name: 'Lumi', color: 'ocean', hat: 'cap', outfit: 'explorer', accessory: 'none',
}

export function getTutorOutfit(id: TutorOutfit) {
  return tutorOutfits.find((option) => option.id === id) ?? tutorOutfits[0]
}

// Existing profiles keep their appearance. New fields get a safe default.
export function parseTutorProfile(value: unknown): TutorProfile | null {
  if (!value || typeof value !== 'object') return null
  const profile = value as Partial<TutorProfile>
  if (typeof profile.name !== 'string' || !profile.name.trim()) return null
  return {
    name: profile.name.trim().slice(0, 14),
    color: tutorColors.find((option) => option.id === profile.color)?.id ?? defaultTutorProfile.color,
    hat: tutorHats.find((option) => option.id === profile.hat)?.id ?? defaultTutorProfile.hat,
    outfit: tutorOutfits.find((option) => option.id === profile.outfit)?.id ?? defaultTutorProfile.outfit,
    accessory: tutorAccessories.find((option) => option.id === profile.accessory)?.id ?? 'none',
  }
}

export function getTutorComment(profile: TutorProfile, topic: 'encourage' | 'profession', index: number, completedCount: number) {
  const encouragement = [
    'Não precisa correr. Escolha um elemento e pense só nele primeiro.',
    'Uma tentativa ensina alguma coisa. O que você percebeu na sua última escolha?',
    'Quer fazer uma pausa? As ilhas que você concluiu continuam guardadas neste dispositivo.',
    'Você pode mudar de ideia! Rever uma escolha também é aprender.',
    'Experimente explicar sua regra em voz alta. Isso pode ajudar a organizar as ideias.',
    completedCount === 0 ? 'A primeira descoberta já começa quando você tenta. Vamos nessa!' : `Você já concluiu ${completedCount} de 6 ilhas. Cada uma guarda uma descoberta sua!`,
    'Eu dou pistas, mas quem faz as descobertas é você. Vamos pensar juntos?',
    'Antes de conferir, veja se faltou algum elemento ou se entrou um que não segue a regra.',
  ]
  const messages = topic === 'profession' ? getTutorOutfit(profile.outfit).comments : encouragement
  return messages[index % messages.length]
}
