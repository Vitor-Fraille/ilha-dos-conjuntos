import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

const source = readFileSync(new URL('../src/gameData.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 },
})
const game = await import('data:text/javascript;base64,' + Buffer.from(outputText).toString('base64'))

test('three levels contain ten questions each and cover all six topics', () => {
  assert.equal(game.levels.length, 3)
  assert.equal(game.questions.length, 30)
  assert.equal(new Set(game.questions.map(question => question.id)).size, 30)
  for (const level of game.levels) {
    const questions = game.questionsForLevel(level.id)
    assert.equal(questions.length, 10)
    for (const topic of [level.id * 2 - 1, level.id * 2]) {
      assert.equal(questions.filter(question => question.topic === topic).length, 5)
    }
  }
})

test('every question has a reachable answer and explanatory feedback', () => {
  for (const question of game.questions) {
    const optionIds = question.options.map(option => option.id)
    assert.equal(new Set(optionIds).size, optionIds.length, question.id)
    assert.ok(question.answer.length > 0, question.id)
    assert.ok(question.many || question.answer.length === 1, question.id)
    assert.ok(question.answer.every(id => optionIds.includes(id)), question.id)
    assert.ok(question.explanation.length >= 40, question.id)
    assert.ok(game.isCorrect(question, question.answer), question.id)
    assert.ok(game.isCorrect(question, [...question.answer].reverse()), question.id)
    assert.ok(!game.isCorrect(question, []), question.id)
    const wrong = optionIds.find(id => !question.answer.includes(id))
    if (wrong) assert.ok(!game.isCorrect(question, [...question.answer, wrong]), question.id)
  }
})
