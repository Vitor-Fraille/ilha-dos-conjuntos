import { isCorrect, levels as setLevels, questions as setQuestions, type LevelId, type Option } from './gameData'
import { dataActivities, dataLevels, flowActivities, flowLevels } from './dataAndFlowActivities'

export type ModuleId = 'conjuntos' | 'fracoes' | 'decimais' | 'volume' | 'massa' | 'temperatura' | 'graficos' | 'fluxogramas'
export type Visual =
  | { kind: 'fraction'; parts: number; filled: number; label: string }
  | { kind: 'decimal'; value: string }
  | { kind: 'box'; width: number; depth: number; height: number; unit: string }
  | { kind: 'mass'; left: string; right: string }
  | { kind: 'thermometer'; value: number }
  | { kind: 'data'; chart: 'table' | 'bar' | 'line' | 'pie' | 'pictogram'; title: string; unit: string; rows: { label: string; value: number }[]; perSymbol?: number }
  | { kind: 'flow'; steps: string[]; decision?: string; yes?: string; no?: string }

export type Activity = {
  id: string
  level: LevelId
  phase: 1 | 2
  prompt: string
  context?: string
  options: Option[]
  answer: string[]
  many: boolean
  ordered?: boolean
  explanation: string
  input?: 'number' | 'fraction'
  unit?: string
  visual?: Visual
}
export type ModuleLevel = { id: LevelId; name: string; subtitle: string; topics: [string, string]; symbol: string }
export type LearningModule = {
  id: ModuleId
  title: string
  summary: string
  symbol: string
  category: 'Comece aqui' | 'Números' | 'Medidas' | 'Dados e caminhos'
  levels: ModuleLevel[]
  activities: Activity[]
}

type Extra = { context?: string; visual?: Visual; unit?: string }
function choose(id: string, level: LevelId, phase: 1 | 2, prompt: string, labels: string[], answer: number | number[], explanation: string, extra: Extra = {}): Activity {
  const correct = Array.isArray(answer) ? answer : [answer]
  return { id, level, phase, prompt, options: labels.map((label, index) => ({ id: String(index), label })), answer: correct.map(String), many: Array.isArray(answer), explanation, ...extra }
}
function write(id: string, level: LevelId, phase: 1 | 2, prompt: string, answer: string, explanation: string, extra: Extra = {}): Activity {
  return { id, level, phase, prompt, options: [], answer: [answer], many: false, input: answer.includes('/') ? 'fraction' : 'number', explanation, ...extra }
}

const fractionLevels: ModuleLevel[] = [
  { id: 1, name: 'Começar', subtitle: 'Frações com partes iguais', topics: ['Somar', 'Subtrair'], symbol: '½' },
  { id: 2, name: 'Avançar', subtitle: 'Denominadores diferentes', topics: ['Ajustar as partes', 'Resolver juntos'], symbol: '¾' },
  { id: 3, name: 'Desafio', subtitle: 'Multiplicar e dividir', topics: ['Multiplicar', 'Dividir'], symbol: '×' },
]
const fractionActivities: Activity[] = [
  choose('f1',1,1,'Quanto é 1/4 + 2/4?',['2/4','3/4','3/8','1/2'],1,'As partes têm o mesmo tamanho. Some os numeradores: 1 + 2 = 3. O denominador continua 4.',{visual:{kind:'fraction',parts:4,filled:1,label:'1/4'}}),
  write('f2',1,1,'Quanto é 2/5 + 1/5?','3/5','Some 2 + 1 e mantenha o 5, pois as partes são quintos.'),
  choose('f3',1,1,'Uma barra tem 3/6 pintados. Pintamos mais 2/6. Quanto ficou?',['4/6','5/6','5/12','1/6'],1,'3 sextos mais 2 sextos são 5 sextos.',{visual:{kind:'fraction',parts:6,filled:3,label:'3/6'}}),
  choose('f4',1,2,'Quanto é 5/8 − 2/8?',['3/8','3/16','7/8','2/8'],0,'Retire 2 das 5 partes pintadas. Sobram 3 partes de um total de 8.'),
  write('f5',1,2,'Quanto é 6/9 − 4/9?','2/9','Subtraia os numeradores: 6 − 4 = 2. O denominador continua 9.'),
  choose('f6',1,2,'Comi 2/7 de uma pizza de manhã e 3/7 à tarde. Quanto comi?',['5/7','5/14','1/7','6/7'],0,'São sétimos nos dois momentos: 2 + 3 = 5 sétimos.'),
  choose('f7',2,1,'Quanto é 1/2 + 1/4?',['2/6','3/4','1/4','2/4'],1,'Metade é o mesmo que 2/4. Então 2/4 + 1/4 = 3/4.',{visual:{kind:'fraction',parts:4,filled:2,label:'1/2 = 2/4'}}),
  write('f8',2,1,'Quanto é 1/3 + 1/6?','1/2','Um terço vale 2/6. Somando 2/6 + 1/6, temos 3/6, que é 1/2.'),
  choose('f9',2,1,'Quanto é 3/4 − 1/2?',['2/2','1/4','2/4','1/2'],1,'1/2 equivale a 2/4. Então 3/4 − 2/4 = 1/4.'),
  choose('f10',2,2,'Quanto é 1/2 + 1/3?',['2/5','5/6','2/6','1/6'],1,'Em sextos: 1/2 = 3/6 e 1/3 = 2/6. A soma é 5/6.'),
  write('f11',2,2,'Quanto é 5/6 − 1/3?','1/2','1/3 = 2/6. Então 5/6 − 2/6 = 3/6, ou 1/2.'),
  choose('f12',2,2,'Lia juntou 2/3 L e 1/6 L de suco. Quanto juntou?',['3/9 L','5/6 L','3/6 L','1/2 L'],1,'2/3 = 4/6. Somando mais 1/6, fica 5/6 L.'),
  choose('f13',3,1,'Quanto é 1/2 × 1/3?',['1/5','2/3','1/6','2/6'],2,'Multiplique em cima e embaixo: 1 × 1 = 1 e 2 × 3 = 6.'),
  write('f14',3,1,'Quanto é 2/3 × 3/4?','1/2','2 × 3 = 6 e 3 × 4 = 12. A fração 6/12 equivale a 1/2.'),
  choose('f15',3,1,'Quanto é 3/5 × 2/3?',['6/12','5/8','2/5','6/8'],2,'O produto é 6/15. Dividindo as duas partes por 3, fica 2/5.'),
  choose('f16',3,2,'Quantos quartos cabem em uma metade?',['1','2','3','4'],1,'Uma metade equivale a 2 quartos. Por isso, 1/2 ÷ 1/4 = 2.',{visual:{kind:'fraction',parts:4,filled:2,label:'1/2 = 2/4'}}),
  write('f17',3,2,'Quanto é 3/4 ÷ 1/2?','3/2','Dividir por 1/2 é multiplicar por 2. Assim, 3/4 × 2 = 6/4 = 3/2.'),
  choose('f18',3,2,'Quanto é 2/3 ÷ 2/5?',['4/15','5/3','4/8','2/3'],1,'Multiplique pela fração inversa: 2/3 × 5/2 = 10/6 = 5/3.'),
]

const decimalLevels: ModuleLevel[] = [
  { id: 1, name: 'Começar', subtitle: 'Somar e subtrair decimais', topics: ['Adição', 'Subtração'], symbol: '0,5' },
  { id: 2, name: 'Avançar', subtitle: 'Multiplicar decimais', topics: ['Produtos', 'Por 10, 100 e 1.000'], symbol: '×' },
  { id: 3, name: 'Desafio', subtitle: 'Dividir decimais', topics: ['Quocientes', 'Por 10, 100 e 1.000'], symbol: '÷' },
]
const decimalActivities: Activity[] = [
  choose('d1',1,1,'Quanto é 1,2 + 0,5?',['1,7','1,25','0,7','6,2'],0,'Alinhe as vírgulas: 1,2 + 0,5 = 1,7.',{visual:{kind:'decimal',value:'1,2 + 0,5'}}),
  write('d2',1,1,'Quanto é 2,35 + 1,20?','3,55','Some centésimos com centésimos e décimos com décimos: 2,35 + 1,20 = 3,55.'),
  choose('d3',1,1,'Um lápis custa R$ 2,50 e uma borracha R$ 1,25. Quanto custam juntos?',['R$ 3,75','R$ 3,25','R$ 4,75','R$ 2,75'],0,'R$ 2,50 + R$ 1,25 = R$ 3,75.'),
  choose('d4',1,2,'Quanto é 4,8 − 1,3?',['3,5','3,15','5,5','2,5'],0,'Alinhe as vírgulas e subtraia: 4,8 − 1,3 = 3,5.'),
  write('d5',1,2,'Quanto é 7,00 − 2,65?','4,35','Subtraia centésimos, décimos e unidades: 7,00 − 2,65 = 4,35.'),
  choose('d6',1,2,'Uma fita de 3,6 m perdeu 0,8 m. Quanto sobrou?',['2,8 m','3,2 m','4,4 m','2,6 m'],0,'Subtraia os décimos: 3,6 m − 0,8 m = 2,8 m.'),
  choose('d7',2,1,'Quanto é 3 × 1,5?',['3,5','4,5','0,45','45'],1,'Três grupos de 1,5 fazem 1,5 + 1,5 + 1,5 = 4,5.'),
  write('d8',2,1,'Quanto é 2,5 × 0,4?','1','25 × 4 = 100. Como os fatores têm duas casas decimais ao todo, o resultado é 1,00.'),
  choose('d9',2,1,'Quanto é 1,2 × 1,5?',['1,8','2,7','0,18','18'],0,'12 × 15 = 180. Há duas casas decimais nos fatores, então fica 1,80.'),
  choose('d10',2,2,'Quanto é 4,7 × 10?',['0,47','4,70','47','470'],2,'Multiplicar por 10 desloca a vírgula uma casa à direita.',{visual:{kind:'decimal',value:'4,7 × 10'}}),
  write('d11',2,2,'Quanto é 0,36 × 100?','36','Multiplicar por 100 desloca a vírgula duas casas à direita: 0,36 vira 36.'),
  choose('d12',2,2,'Quanto é 0,125 × 1.000?',['1,25','12,5','125','1.250'],2,'Multiplicar por 1.000 desloca a vírgula três casas à direita: 125.'),
  choose('d13',3,1,'Quanto é 5 ÷ 2?',['2,5','2,2','3,5','0,4'],0,'Cada metade de 5 é 2,5. O resultado de uma divisão de naturais pode ser decimal.'),
  write('d14',3,1,'Quanto é 6,4 ÷ 2?','3,2','Dividir por 2 é achar a metade: metade de 6,4 é 3,2.'),
  choose('d15',3,1,'Quanto é 4,8 ÷ 0,6?',['0,8','8','80','2,88'],1,'Multiplique os dois números por 10: 48 ÷ 6 = 8.'),
  choose('d16',3,2,'Quanto é 35,7 ÷ 10?',['3,57','357','0,357','35,07'],0,'Dividir por 10 desloca a vírgula uma casa à esquerda.'),
  write('d17',3,2,'Quanto é 48,5 ÷ 100?','0,485','Dividir por 100 desloca a vírgula duas casas à esquerda.'),
  choose('d18',3,2,'Quanto é 72,5 ÷ 1.000?',['7,25','0,725','0,0725','725'],2,'Dividir por 1.000 desloca a vírgula três casas à esquerda.'),
]

const volumeLevels: ModuleLevel[] = [
  { id: 1, name: 'Começar', subtitle: 'Cubos e unidades cúbicas', topics: ['Contar cubinhos', 'Volume do cubo'], symbol: '◼' },
  { id: 2, name: 'Avançar', subtitle: 'Caixas retangulares', topics: ['Camadas', 'Multiplicar medidas'], symbol: '▣' },
  { id: 3, name: 'Desafio', subtitle: 'Descobrir medidas', topics: ['Comparar volumes', 'Encontrar a medida que falta'], symbol: '³' },
]
const volumeActivities: Activity[] = [
  choose('v1',1,1,'Um cubo tem 2 cubinhos em cada aresta. Quantos cubinhos há nele?',['4','6','8','12'],2,'São 2 × 2 × 2 = 8 cubinhos.',{visual:{kind:'box',width:2,depth:2,height:2,unit:'cubinhos'}}),
  write('v2',1,1,'Um cubo mede 3 cm em cada aresta. Qual é o volume em cm³?','27','Calcule 3 × 3 × 3 = 27 cm³.',{unit:'cm³',visual:{kind:'box',width:3,depth:3,height:3,unit:'cm'}}),
  choose('v3',1,1,'Qual conta encontra o volume de um cubo de aresta 4 cm?',['4 + 4 + 4','4 × 4 × 4','4 × 3','4 ÷ 4'],1,'O cubo tem três medidas iguais: comprimento × largura × altura = 4 × 4 × 4.'),
  choose('v4',1,2,'Qual é o volume de um cubo de aresta 1 m?',['1 m³','3 m³','6 m³','10 m³'],0,'Multiplique as três arestas: 1 × 1 × 1 = 1 m³.'),
  write('v5',1,2,'Um cubo tem aresta de 5 cm. Qual é o volume em cm³?','125','Multiplique 5 cm três vezes: 5 × 5 × 5 = 125 cm³.',{unit:'cm³'}),
  choose('v6',1,2,'Dois cubos de 2 cm de aresta têm juntos qual volume?',['8 cm³','12 cm³','16 cm³','24 cm³'],2,'Cada cubo ocupa 2 × 2 × 2 = 8 cm³. Dois cubos ocupam 16 cm³.'),
  choose('v7',2,1,'Uma caixa tem base de 3 por 2 cubinhos e altura de 2 cubinhos. Quantos cabem?',['7','10','12','14'],2,'Cada camada tem 3 × 2 = 6. Duas camadas têm 12 cubinhos.',{visual:{kind:'box',width:3,depth:2,height:2,unit:'cubinhos'}}),
  write('v8',2,1,'A base tem 4 por 3 cubinhos. São 2 camadas. Qual é o volume?','24','Cada camada tem 4 × 3 = 12 cubinhos. Duas camadas têm 24.',{unit:'cubinhos'}),
  choose('v9',2,1,'Em uma caixa de 5 cm × 2 cm × 1 cm, qual é o volume?',['8 cm³','10 cm³','12 cm³','15 cm³'],1,'Multiplique as três medidas: 5 × 2 × 1 = 10 cm³.'),
  choose('v10',2,2,'Qual é o volume de uma caixa de 4 cm × 3 cm × 2 cm?',['9 cm³','12 cm³','24 cm³','36 cm³'],2,'Multiplique as três medidas da caixa: 4 × 3 × 2 = 24 cm³.',{visual:{kind:'box',width:4,depth:3,height:2,unit:'cm'}}),
  write('v11',2,2,'Uma caixa mede 6 cm × 2 cm × 3 cm. Qual é o volume em cm³?','36','Multiplique comprimento, largura e altura: 6 × 2 × 3 = 36 cm³.',{unit:'cm³'}),
  choose('v12',2,2,'Uma caixa mede 2 m × 3 m × 4 m. O volume é...',['9 m³','12 m³','24 m³','48 m³'],2,'2 × 3 × 4 = 24 m³. A unidade de volume é cúbica.'),
  choose('v13',3,1,'Qual tem maior volume?',['Cubo de aresta 3 cm','Caixa de 2 × 3 × 4 cm','Têm o mesmo volume'],0,'O cubo tem 3 × 3 × 3 = 27 cm³; a caixa tem 2 × 3 × 4 = 24 cm³.'),
  write('v14',3,1,'Um cubo tem volume de 64 cm³. Quanto mede sua aresta em cm?','4','4 × 4 × 4 = 64. Portanto a aresta mede 4 cm.',{unit:'cm'}),
  choose('v15',3,1,'Uma caixa de 5 × 4 × 2 cm comporta quantos cubinhos de 1 cm³?',['11','20','40','100'],2,'5 × 4 × 2 = 40 cm³; cabem 40 cubinhos de 1 cm³.'),
  choose('v16',3,2,'Uma caixa tem volume de 30 cm³, largura 3 cm e altura 2 cm. Qual o comprimento?',['3 cm','5 cm','6 cm','10 cm'],1,'3 × 2 = 6. Para chegar a 30, falta multiplicar por 5.'),
  write('v17',3,2,'Uma caixa de 2 cm × 2 cm × ? tem volume de 20 cm³. Qual é a altura em cm?','5','2 × 2 = 4. Como 4 × 5 = 20, a altura é 5 cm.',{unit:'cm'}),
  choose('v18',3,2,'Se dobrarmos só a altura de uma caixa, o volume...',['Fica igual','Dobra','Triplica','Cai pela metade'],1,'Volume é comprimento × largura × altura. Dobrar um fator dobra o produto.'),
]

const massLevels: ModuleLevel[] = [
  { id: 1, name: 'Começar', subtitle: 'Quilo, hecto, deca e grama', topics: ['Ler massas', 'Trocar unidades'], symbol: 'kg' },
  { id: 2, name: 'Avançar', subtitle: 'Partes menores do grama', topics: ['Decigrama e centigrama', 'Miligrama'], symbol: 'mg' },
  { id: 3, name: 'Desafio', subtitle: 'Comparar e calcular massas', topics: ['Comparar', 'Resolver situações'], symbol: '⚖' },
]
const massActivities: Activity[] = [
  choose('m1',1,1,'Qual unidade combina com a massa de um pacote de arroz?',['Quilograma (kg)','Miligrama (mg)','Centímetro (cm)','Litro (L)'],0,'Um pacote de arroz costuma ter massa em quilogramas.'),
  write('m2',1,1,'1 kg tem quantos gramas?','1000','1 quilograma = 1.000 gramas.',{unit:'g'}),
  choose('m3',1,1,'Qual massa é maior?',['1 kg','900 g','São iguais'],0,'1 kg = 1.000 g, que é mais que 900 g.',{visual:{kind:'mass',left:'1 kg',right:'900 g'}}),
  choose('m4',1,2,'1 hg equivale a...',['10 g','100 g','1.000 g','0,1 g'],1,'Hecto significa cem: 1 hectograma = 100 gramas.'),
  write('m5',1,2,'1 dag tem quantos gramas?','10','Deca significa dez: 1 decagrama = 10 gramas.',{unit:'g'}),
  choose('m6',1,2,'Quanto é 2 kg em gramas?',['20 g','200 g','2.000 g','20.000 g'],2,'Cada kg tem 1.000 g. Dois kg têm 2.000 g.'),
  choose('m7',2,1,'1 dg equivale a...',['0,1 g','1 g','10 g','100 g'],0,'Deci é a décima parte: 1 dg = 0,1 g.'),
  write('m8',2,1,'10 dg formam quantos gramas?','1','Cada dg é 0,1 g. Dez décimos formam 1 g.',{unit:'g'}),
  choose('m9',2,1,'1 cg é qual parte de 1 g?',['Décima','Centésima','Milésima','Dez vezes maior'],1,'Centi significa centésima parte: 1 cg = 0,01 g.'),
  choose('m10',2,2,'1 g tem quantos miligramas?',['10 mg','100 mg','1.000 mg','10.000 mg'],2,'Mili é a milésima parte: 1 g = 1.000 mg.'),
  write('m11',2,2,'500 mg são quantos gramas?','0,5','500 mg é metade de 1.000 mg, portanto 0,5 g.',{unit:'g'}),
  choose('m12',2,2,'Qual massa é maior?',['1 cg','5 mg','São iguais'],0,'1 cg = 10 mg. Dez miligramas são mais que cinco.',{visual:{kind:'mass',left:'1 cg',right:'5 mg'}}),
  choose('m13',3,1,'Coloque em ordem do maior para o menor.',['kg, hg, dag, g','g, dag, hg, kg','hg, kg, g, dag','dag, g, kg, hg'],0,'Cada passo de kg para hg, dag e g divide a unidade por 10.'),
  write('m14',3,1,'Quanto é 3 hg em gramas?','300','Cada hg tem 100 g. Então 3 hg = 300 g.',{unit:'g'}),
  choose('m15',3,1,'Qual pesa mais?',['2 dag','15 g','São iguais'],0,'2 dag = 20 g; 20 g é maior que 15 g.',{visual:{kind:'mass',left:'2 dag',right:'15 g'}}),
  choose('m16',3,2,'Uma receita pede 1 kg de farinha. Já temos 750 g. Quanto falta?',['150 g','250 g','350 g','750 g'],1,'1 kg = 1.000 g. Falta 1.000 − 750 = 250 g.'),
  write('m17',3,2,'Uma balança marca 2,5 g. Quantos mg são?','2500','1 g = 1.000 mg. Logo, 2,5 g = 2.500 mg.',{unit:'mg'}),
  choose('m18',3,2,'Juntamos 5 dg e 20 cg. Quantos gramas são?',['0,25 g','0,7 g','2,5 g','7 g'],1,'5 dg = 0,5 g e 20 cg = 0,2 g. A soma é 0,7 g.'),
]

const temperatureLevels: ModuleLevel[] = [
  { id: 1, name: 'Começar', subtitle: 'Ler o termômetro', topics: ['Graus Celsius', 'Temperaturas do dia'], symbol: '°C' },
  { id: 2, name: 'Avançar', subtitle: 'Comparar temperaturas', topics: ['Mais quente e mais frio', 'Mudanças de temperatura'], symbol: '↗' },
  { id: 3, name: 'Desafio', subtitle: 'Interpretar situações', topics: ['Temperaturas negativas', 'Problemas do cotidiano'], symbol: '−°' },
]
const temperatureActivities: Activity[] = [
  choose('t1',1,1,'Qual unidade usamos para registrar a temperatura do ar no Brasil?',['Graus Celsius (°C)','Quilogramas (kg)','Litros (L)','Centímetros (cm)'],0,'A temperatura do ar costuma ser indicada em graus Celsius, com o símbolo °C.'),
  write('t2',1,1,'Qual número o termômetro indica?','20','A coluna chega à marca de 20 graus Celsius.',{unit:'°C',visual:{kind:'thermometer',value:20}}),
  choose('t3',1,1,'Um termômetro mostra 10 °C. Qual opção registra a leitura?',['10 kg','10 °C','10 cm','10 mL'],1,'O símbolo °C indica graus Celsius.',{visual:{kind:'thermometer',value:10}}),
  choose('t4',1,2,'De manhã fez 18 °C e à tarde 25 °C. Quando esteve mais quente?',['De manhã','À tarde','Igual'],1,'25 °C é maior que 18 °C. A tarde esteve mais quente.'),
  write('t5',1,2,'Ontem marcou 22 °C. Hoje marca 24 °C. Quantos graus aumentou?','2','Compare as duas leituras: 24 − 22 = 2 graus.',{unit:'°C'}),
  choose('t6',1,2,'Quais símbolos indicam unidades de temperatura?',['°C','°F','K','kg'],[0,1,2],'°C é Celsius, °F é Fahrenheit e K é kelvin. kg mede massa, não temperatura.'),
  choose('t7',2,1,'Qual está mais quente?',['−2 °C','3 °C','São iguais'],1,'3 °C fica acima de −2 °C na escala de temperatura.',{visual:{kind:'thermometer',value:3}}),
  write('t8',2,1,'A temperatura subiu de 15 °C para 19 °C. Subiu quantos graus?','4','Compare as duas leituras: 19 − 15 = 4 graus.',{unit:'°C'}),
  choose('t9',2,1,'Qual é a ordem do mais frio ao mais quente?',['5 °C, 0 °C, −3 °C','−3 °C, 0 °C, 5 °C','0 °C, 5 °C, −3 °C'],1,'Na escala, −3 vem antes de 0, e 0 vem antes de 5.'),
  choose('t10',2,2,'De 28 °C passou para 23 °C. O que aconteceu?',['Subiu 5 °C','Caiu 5 °C','Ficou igual','Caiu 1 °C'],1,'28 − 23 = 5. A temperatura caiu 5 graus.'),
  write('t11',2,2,'De 0 °C foi para 6 °C. Qual foi o aumento?','6','De zero até seis há uma diferença de 6 graus.',{unit:'°C'}),
  choose('t12',2,2,'Um freezer está a −5 °C e outro a −10 °C. Qual está mais frio?',['−5 °C','−10 °C','São iguais'],1,'−10 °C é menor que −5 °C; indica temperatura mais baixa.'),
  choose('t13',3,1,'Um termômetro marca −4 °C. Isso é...',['4 graus acima de zero','4 graus abaixo de zero','Igual a 4 °C'],1,'O sinal de menos indica temperatura abaixo de zero.',{visual:{kind:'thermometer',value:-4}}),
  write('t14',3,1,'De −2 °C até 3 °C, quantos graus a temperatura subiu?','5','De −2 até 0 são 2 graus; de 0 até 3 são mais 3. Ao todo, 5.',{unit:'°C'}),
  choose('t15',3,1,'Qual temperatura está mais perto de 0 °C?',['−8 °C','−2 °C','7 °C'],1,'−2 está a 2 graus de zero; as outras estão a 8 e 7 graus.'),
  choose('t16',3,2,'Às 8h fazia 11 °C. Ao meio-dia, 18 °C. Qual foi a variação?',['Aumentou 7 °C','Caiu 7 °C','Aumentou 29 °C','Não mudou'],0,'18 − 11 = 7. A temperatura aumentou 7 graus.'),
  write('t17',3,2,'Um freezer foi de −6 °C para −2 °C. Quantos graus aqueceu?','4','De −6 até −2 são 4 graus. A temperatura aumentou.',{unit:'°C'}),
  choose('t18',3,2,'Uma cidade estava a 4 °C e esfriou 7 °C. Qual ficou sendo a temperatura?',['11 °C','3 °C','−3 °C','−11 °C'],2,'4 − 7 = −3. A temperatura ficou 3 graus abaixo de zero.'),
]

const setsActivities: Activity[] = setQuestions.map(question => ({
  ...question, level: Math.ceil(question.topic / 2) as LevelId, phase: question.topic % 2 === 1 ? 1 : 2,
}))

export const modules: LearningModule[] = [
  { id: 'conjuntos', title: 'Conjuntos', summary: 'Encontre, compare e combine grupos.', symbol: '∪', category: 'Comece aqui', levels: setLevels, activities: setsActivities },
  { id: 'fracoes', title: 'Frações', summary: 'Junte partes e resolva operações.', symbol: '½', category: 'Números', levels: fractionLevels, activities: fractionActivities },
  { id: 'decimais', title: 'Números decimais', summary: 'Calcule com vírgulas e valores.', symbol: '0,5', category: 'Números', levels: decimalLevels, activities: decimalActivities },
  { id: 'volume', title: 'Volume', summary: 'Descubra o espaço dentro de caixas.', symbol: '▣', category: 'Medidas', levels: volumeLevels, activities: volumeActivities },
  { id: 'massa', title: 'Medidas de massa', summary: 'Compare e transforme massas.', symbol: 'kg', category: 'Medidas', levels: massLevels, activities: massActivities },
  { id: 'temperatura', title: 'Temperatura', summary: 'Leia termômetros e compare graus.', symbol: '°C', category: 'Medidas', levels: temperatureLevels, activities: temperatureActivities },
  { id: 'graficos', title: 'Tabelas e gráficos', summary: 'Leia dados, compare e descubra respostas.', symbol: '▥', category: 'Dados e caminhos', levels: dataLevels, activities: dataActivities },
  { id: 'fluxogramas', title: 'Fluxogramas', summary: 'Siga setas e monte caminhos passo a passo.', symbol: '↓', category: 'Dados e caminhos', levels: flowLevels, activities: flowActivities },
]

export function activitiesForLevel(moduleId: ModuleId, levelId: LevelId): Activity[] {
  return modules.find(item => item.id === moduleId)!.activities.filter(activity => activity.level === levelId)
}

function numericValue(value: string): number | null {
  const raw = value.trim()
  const text = /^-?\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(raw)
    ? raw.replaceAll('.', '').replace(',', '.')
    : raw.replace(',', '.')
  if (/^-?\d+(?:\.\d+)?$/.test(text)) return Number(text)
  return null
}
function fractionValue(value: string): number | null {
  const match = value.trim().match(/^(\d+)\s*\/\s*(\d+)$/)
  if (!match || Number(match[2]) === 0) return null
  return Number(match[1]) / Number(match[2])
}
export function isActivityCorrect(activity: Activity, selected: string[]): boolean {
  if (activity.ordered) return selected.length === activity.answer.length && selected.every((id, index) => id === activity.answer[index])
  if (activity.input) {
    const parse = activity.input === 'fraction' ? fractionValue : numericValue
    const actual = parse(selected[0] ?? '')
    const expected = parse(activity.answer[0])
    return actual !== null && expected !== null && Math.abs(actual - expected) < 1e-9
  }
  return isCorrect(activity, selected)
}
