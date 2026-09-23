import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'

function transpile(path) {
  return ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2023 },
  }).outputText
}
function dataUrl(code) {
  return 'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
}
const gameUrl = dataUrl(transpile('../src/gameData.ts'))
const moduleCode = transpile('../src/moduleData.ts').replace(/from ['"]\.\/gameData['"]/, 'from "' + gameUrl + '"')
const { modules, activitiesForLevel, isActivityCorrect } = await import(dataUrl(moduleCode))

test('all six modules have three playable levels and unique activities', () => {
  assert.deepEqual(modules.map(item => item.id), ['conjuntos', 'fracoes', 'decimais', 'volume', 'massa', 'temperatura'])
  const ids = new Set()
  for (const module of modules) {
    assert.equal(module.levels.length, 3, module.id)
    for (const level of module.levels) {
      const activities = activitiesForLevel(module.id, level.id)
      assert.equal(activities.length, module.id === 'conjuntos' ? 10 : 6, module.id + '/' + level.id)
      assert.equal(activities.filter(item => item.phase === 1).length, activities.length / 2)
      assert.equal(activities.filter(item => item.phase === 2).length, activities.length / 2)
      for (const activity of activities) {
        const key = module.id + '/' + activity.id
        assert.ok(!ids.has(key), key)
        ids.add(key)
      }
    }
  }
  assert.equal(ids.size, 120)
})

test('every activity has a valid answer, explanation and retry path', () => {
  const shortExplanations = modules.flatMap(module => module.activities.filter(activity => activity.explanation.length < 25).map(activity => module.id + '/' + activity.id))
  assert.deepEqual(shortExplanations, [])
  for (const module of modules) for (const activity of module.activities) {
    const key = module.id + '/' + activity.id
    assert.ok(isActivityCorrect(activity, activity.answer), key)
    assert.ok(!isActivityCorrect(activity, []), key)
    if (activity.input) {
      assert.equal(activity.options.length, 0, key)
      assert.ok(!isActivityCorrect(activity, ['xyz']), key)
    } else {
      const optionIds = activity.options.map(option => option.id)
      assert.equal(new Set(optionIds).size, optionIds.length, key)
      assert.ok(activity.answer.every(id => optionIds.includes(id)), key)
      assert.ok(optionIds.length >= 2, key)
      const wrong = optionIds.find(id => !activity.answer.includes(id))
      if (wrong) assert.ok(!isActivityCorrect(activity, [...activity.answer, wrong]), key)
    }
  }
})

test('numeric entry accepts decimal comma and equivalent fractions', () => {
  const fractions = modules.find(item => item.id === 'fracoes').activities
  const decimals = modules.find(item => item.id === 'decimais').activities
  assert.ok(isActivityCorrect(fractions.find(item => item.id === 'f8'), ['3/6']))
  assert.ok(!isActivityCorrect(fractions.find(item => item.id === 'f8'), ['1/0']))
  assert.ok(isActivityCorrect(decimals.find(item => item.id === 'd2'), ['3.55']))
  assert.ok(!isActivityCorrect(decimals.find(item => item.id === 'd2'), ['3,5']))
  assert.ok(isActivityCorrect(modules.find(item => item.id === 'massa').activities.find(item => item.id === 'm2'), ['1.000']))
})

test('single-choice fraction distractors are not equivalent to the right answer', () => {
  for (const activity of modules.find(item => item.id === 'fracoes').activities) {
    if (activity.input || activity.many) continue
    const parse = label => {
      const match = label.match(/^(\d+)\/(\d+)$/)
      return match ? Number(match[1]) / Number(match[2]) : null
    }
    const correct = parse(activity.options[Number(activity.answer[0])].label)
    if (correct === null) continue
    for (const option of activity.options) {
      if (option.id === activity.answer[0]) continue
      const value = parse(option.label)
      if (value !== null) assert.notEqual(value, correct, activity.id)
    }
  }
})
