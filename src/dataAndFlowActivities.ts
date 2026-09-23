import type { Activity, ModuleLevel, Visual } from './moduleData'
import type { LevelId } from './gameData'

function pick(id: string, level: LevelId, phase: 1 | 2, prompt: string, labels: string[], correct: number, explanation: string, visual: Visual): Activity {
  return { id, level, phase, prompt, options: labels.map((label, index) => ({ id: String(index), label })), answer: [String(correct)], many: false, explanation, visual }
}
function order(id: string, level: LevelId, phase: 1 | 2, prompt: string, labels: string[], answer: number[], explanation: string): Activity {
  return { id, level, phase, prompt, options: labels.map((label, index) => ({ id: String(index), label })), answer: answer.map(String), many: false, ordered: true, explanation }
}

const fruitRows = [{ label: 'Banana', value: 8 }, { label: 'Maçã', value: 6 }, { label: 'Uva', value: 4 }]
const table: Visual = { kind: 'data', chart: 'table', title: 'Frutas escolhidas pela turma', unit: 'alunos', rows: fruitRows }
const bars: Visual = { kind: 'data', chart: 'bar', title: 'Livros lidos no mês', unit: 'livros', rows: [{ label: 'Ana', value: 4 }, { label: 'Bia', value: 6 }, { label: 'Caio', value: 2 }] }
const lines: Visual = { kind: 'data', chart: 'line', title: 'Temperatura às 14h', unit: '°C', rows: [{ label: 'Seg', value: 20 }, { label: 'Ter', value: 24 }, { label: 'Qua', value: 22 }, { label: 'Qui', value: 26 }] }
const pie: Visual = { kind: 'data', chart: 'pie', title: 'Esporte preferido de 20 alunos', unit: 'alunos', rows: [{ label: 'Futebol', value: 10 }, { label: 'Vôlei', value: 5 }, { label: 'Natação', value: 5 }] }
const pictures: Visual = { kind: 'data', chart: 'pictogram', title: 'Livros emprestados', unit: 'livros', perSymbol: 2, rows: [{ label: 'Seg', value: 6 }, { label: 'Ter', value: 4 }, { label: 'Qua', value: 8 }] }

export const dataLevels: ModuleLevel[] = [
  { id: 1, name: 'Ler e comparar', subtitle: 'Tabelas e barras', topics: ['Tabelas', 'Gráficos de barras'], symbol: '▥' },
  { id: 2, name: 'Observar mudanças', subtitle: 'Linhas e setores', topics: ['Gráficos de linhas', 'Gráficos de setores'], symbol: '↗' },
  { id: 3, name: 'Contar símbolos', subtitle: 'Pictogramas e comparação', topics: ['Pictogramas', 'Interpretar dados'], symbol: '●' },
]
export const dataActivities: Activity[] = [
  pick('g1',1,1,'Quantos alunos escolheram maçã?',['4','6','8','18'],1,'Na linha Maçã, a coluna de alunos mostra 6. Leia a linha e a coluna juntas.',table),
  pick('g2',1,1,'Qual fruta recebeu mais escolhas?',['Banana','Maçã','Uva'],0,'Banana tem 8 escolhas, mais que as 6 da maçã e as 4 da uva.',table),
  pick('g3',1,1,'Cada aluno escolheu uma fruta. Quantos participaram?',['12','14','18','20'],2,'Some as três linhas: 8 + 6 + 4 = 18 alunos participaram.',table),
  pick('g4',1,2,'Quem leu mais livros?',['Ana','Bia','Caio'],1,'A barra de Bia chega a 6 livros e é a mais comprida.',bars),
  pick('g5',1,2,'Quantos livros Ana leu a mais que Caio?',['2','4','6','8'],0,'Ana leu 4 e Caio leu 2. A diferença é 4 − 2 = 2 livros.',bars),
  pick('g6',1,2,'Quantos livros os três leram ao todo?',['6','8','10','12'],3,'Some os valores das barras: 4 + 6 + 2 = 12 livros.',bars),
  pick('g7',2,1,'Qual foi a temperatura na terça-feira?',['20 °C','22 °C','24 °C','26 °C'],2,'Localize Ter no eixo dos dias. O ponto desse dia indica 24 °C.',lines),
  pick('g8',2,1,'Entre quais dias a temperatura diminuiu?',['Seg e Ter','Ter e Qua','Qua e Qui'],1,'A linha desce de terça para quarta: a temperatura passa de 24 °C para 22 °C.',lines),
  pick('g9',2,1,'Quanto a temperatura subiu de quarta para quinta?',['2 °C','4 °C','6 °C','8 °C'],1,'Na quarta eram 22 °C e na quinta, 26 °C. Aumentou 26 − 22 = 4 °C.',lines),
  pick('g10',2,2,'Qual esporte ocupa metade do círculo?',['Futebol','Vôlei','Natação'],0,'Futebol foi escolhido por 10 dos 20 alunos. 10/20 é metade do total.',pie),
  pick('g11',2,2,'Qual fração representa os alunos que escolheram vôlei?',['1/2','1/4','3/4','1/5'],1,'Vôlei tem 5 dos 20 alunos. A fração 5/20 equivale a 1/4.',pie),
  pick('g12',2,2,'Quantos alunos escolheram vôlei ou natação?',['5','10','15','20'],1,'Some os dois setores: 5 alunos do vôlei + 5 da natação = 10 alunos.',pie),
  pick('g13',3,1,'Cada símbolo vale 2 livros. Quantos foram emprestados na segunda?',['3','4','6','8'],2,'Segunda tem 3 símbolos. Como cada um vale 2 livros, 3 × 2 = 6.',pictures),
  pick('g14',3,1,'Qual dia teve 4 livros emprestados?',['Segunda','Terça','Quarta'],1,'Terça tem 2 símbolos. Dois símbolos de 2 livros representam 4 livros.',pictures),
  pick('g15',3,1,'Quantos livros foram emprestados nos três dias?',['9','12','16','18'],3,'São 3 + 2 + 4 = 9 símbolos. Cada um vale 2 livros: 9 × 2 = 18.',pictures),
  pick('g16',3,2,'Quantos símbolos seriam necessários para representar 10 livros?',['2','5','8','10'],1,'A legenda diz que cada símbolo vale 2 livros. Então 10 ÷ 2 = 5 símbolos.',pictures),
  pick('g17',3,2,'Quais esportes tiveram a mesma quantidade de escolhas?',['Futebol e vôlei','Futebol e natação','Vôlei e natação'],2,'Vôlei e natação têm 5 alunos cada e ocupam setores do mesmo tamanho.',pie),
  pick('g18',3,2,'Bia quer chegar a 10 livros. Quantos ainda precisa ler?',['2','4','6','10'],1,'A barra de Bia mostra 6 livros. Para chegar a 10 faltam 10 − 6 = 4.',bars),
]

const calculation: Visual = { kind: 'flow', steps: ['Início', 'Comece com 3', 'Some 2', 'Multiplique por 4', 'Fim'] }
const rain: Visual = { kind: 'flow', steps: ['Início', 'Observe o tempo'], decision: 'Está chovendo?', yes: 'Pegue o guarda-chuva', no: 'Saia sem guarda-chuva' }
const compare: Visual = { kind: 'flow', steps: ['Início', 'Leia um número'], decision: 'O número é maior que 10?', yes: 'Some 1', no: 'Some 2' }
const recycle: Visual = { kind: 'flow', steps: ['Início', 'Observe o objeto'], decision: 'É de papel?', yes: 'Coloque na caixa de papel', no: 'Procure a caixa adequada' }

export const flowLevels: ModuleLevel[] = [
  { id: 1, name: 'Seguir os passos', subtitle: 'Ler setas e sequências', topics: ['Ler um fluxograma', 'Montar uma sequência'], symbol: '↓' },
  { id: 2, name: 'Escolher caminhos', subtitle: 'Decisões: sim ou não', topics: ['Seguir decisões', 'Completar caminhos'], symbol: '◇' },
  { id: 3, name: 'Construir', subtitle: 'Montar e conferir passos', topics: ['Organizar ações', 'Testar o caminho'], symbol: '↳' },
]
export const flowActivities: Activity[] = [
  pick('fl1',1,1,'Qual ação vem logo depois de começar com 3?',['Some 2','Multiplique por 4','Fim'],0,'Siga a seta depois de Comece com 3. Ela aponta para Some 2.',calculation),
  pick('fl2',1,1,'Quanto vale o número depois de somar 2?',['2','3','5','12'],2,'O número inicial é 3. Ao seguir o bloco Some 2, fica 3 + 2 = 5.',calculation),
  pick('fl3',1,1,'Qual é o resultado ao chegar ao fim?',['9','14','20','24'],2,'Siga a ordem das setas: primeiro 3 + 2 = 5; depois 5 × 4 = 20.',calculation),
  order('fl4',1,2,'Monte o caminho: comece com 2 e depois some 3.',['Some 3','Fim','Início','Comece com 2'],[2,3,0,1],'A sequência é Início → Comece com 2 → Some 3 → Fim. O resultado é 5.'),
  order('fl5',1,2,'Organize os passos para lavar as mãos.',['Seque as mãos','Molhe as mãos','Fim','Use sabão e esfregue','Início','Enxágue'],[4,1,3,5,0,2],'Depois do início, molhe, use sabão e esfregue, enxágue e seque. O fim encerra o caminho.'),
  order('fl6',1,2,'Monte o caminho: comece com 8 e retire 3.',['Fim','Retire 3','Comece com 8','Início'],[3,2,1,0],'Coloque Início, Comece com 8, Retire 3 e Fim. Assim, 8 − 3 = 5.'),
  pick('fl7',2,1,'Está chovendo. Qual caminho devemos seguir?',['Sim: pegue o guarda-chuva','Não: saia sem guarda-chuva'],0,'A resposta para Está chovendo? é sim. Siga a seta Sim até pegar o guarda-chuva.',rain),
  pick('fl8',2,1,'Não está chovendo. Qual ação o fluxograma indica?',['Pegue o guarda-chuva','Saia sem guarda-chuva'],1,'Quando a resposta é não, a seta Não leva a Saia sem guarda-chuva.',rain),
  pick('fl9',2,1,'Para que serve o bloco em forma de losango?',['Encerrar o caminho','Fazer uma pergunta e escolher o caminho','Mostrar sempre o resultado'],1,'O losango traz uma pergunta. A resposta indica qual seta seguir: Sim ou Não.',rain),
  pick('fl10',2,2,'O número lido é 12. Qual será o resultado?',['13','14','10','24'],0,'12 é maior que 10. Siga Sim e some 1: 12 + 1 = 13.',compare),
  pick('fl11',2,2,'O número lido é 10. Qual será o resultado?',['10','11','12','20'],2,'10 é igual a 10, não maior. Siga Não e some 2: 10 + 2 = 12.',compare),
  pick('fl12',2,2,'O objeto é de papel. Qual caixa escolher?',['Caixa de papel','Outra caixa'],0,'A resposta à pergunta É de papel? é sim. A seta Sim aponta para a caixa de papel.',recycle),
  order('fl13',3,1,'Monte o caminho: comece com 4, dobre e depois some 1.',['Some 1','Comece com 4','Fim','Dobre o número','Início'],[4,1,3,0,2],'Início → Comece com 4 → Dobre o número → Some 1 → Fim. O resultado é 4 × 2 + 1 = 9.'),
  order('fl14',3,1,'Monte o caminho: comece com 10, retire 4 e divida por 2.',['Divida por 2','Início','Retire 4','Fim','Comece com 10'],[1,4,2,0,3],'Siga Início → Comece com 10 → Retire 4 → Divida por 2 → Fim. O resultado é 3.'),
  order('fl15',3,1,'Organize uma pesquisa sobre a fruta preferida da turma.',['Conte as respostas','Fim','Pergunte a cada aluno','Início','Registre os totais na tabela'],[3,2,0,4,1],'Primeiro pergunte a cada aluno, depois conte as respostas e registre os totais na tabela.'),
  pick('fl16',3,2,'O número lido é 8. Qual será o resultado?',['9','10','12','16'],1,'8 não é maior que 10. Siga Não e some 2: 8 + 2 = 10.',compare),
  pick('fl17',3,2,'O objeto é uma garrafa de vidro. Qual caminho seguir?',['Sim: caixa de papel','Não: procure a caixa adequada'],1,'Vidro não é papel. Siga a seta Não e procure a caixa adequada para esse material.',recycle),
  pick('fl18',3,2,'Se trocarmos a ordem e multiplicarmos 3 por 4 antes de somar 2, o resultado será...',['14','20','9','24'],0,'A ordem importa: no caminho alterado, 3 × 4 = 12 e 12 + 2 = 14. No original, o resultado é 20.',calculation),
]
