import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import ts from 'typescript'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

// Compile in memory using the project's TypeScript; no test dependency or output files.
function moduleUrl(source, imports = {}) {
  let { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2023 },
  })
  for (const [name, url] of Object.entries(imports)) {
    outputText = outputText.replaceAll(`from '${name}'`, `from '${url}'`).replaceAll(`from "${name}"`, `from "${url}"`)
  }
  return 'data:text/javascript;base64,' + Buffer.from(outputText).toString('base64')
}
const readSource = name => readFileSync(new URL('../src/' + name, import.meta.url), 'utf8')
const profileUrl = moduleUrl(readSource('tutorProfile.ts'))
const profile = await import(profileUrl)
const imports = { react: import.meta.resolve('react'), 'react/jsx-runtime': import.meta.resolve('react/jsx-runtime'), './tutorProfile': profileUrl }
const wardrobeUrl = moduleUrl(readSource('TutorWardrobe.tsx'), imports)
const { TutorAvatar } = await import(moduleUrl(readSource('TutorAvatar.tsx'), { ...imports, './TutorWardrobe': wardrobeUrl }))

test('old profiles retain name, color, hat and outfit and receive a default accessory', () => {
  const old = { name: 'Pingo', color: 'violet', hat: 'flower', outfit: 'artist' }
  assert.deepEqual(profile.parseTutorProfile(old), { ...old, accessory: 'none' })
})

test('malformed profiles are rejected or safely normalized', () => {
  for (const value of [null, undefined, false, 42, {}, { name: '  ' }, { name: 42 }]) {
    assert.equal(profile.parseTutorProfile(value), null)
  }
  assert.deepEqual(profile.parseTutorProfile({ name: ' Lumi ', hat: 'missing', accessory: 'missing' }), profile.defaultTutorProfile)
  assert.equal(profile.parseTutorProfile({ name: 'abcdefghijklmnop' }).name.length, 14)
})

test('all customization choices round-trip through saved profiles', () => {
  for (const [field, options] of Object.entries({ color: profile.tutorColors, hat: profile.tutorHats, outfit: profile.tutorOutfits, accessory: profile.tutorAccessories })) {
    assert.equal(new Set(options.map(option => option.id)).size, options.length)
    for (const option of options) {
      const saved = { ...profile.defaultTutorProfile, [field]: option.id }
      assert.deepEqual(profile.parseTutorProfile(JSON.parse(JSON.stringify(saved))), saved)
    }
  }
})

test('each profession has distinct clothing and three cycling comments', () => {
  assert.equal(profile.tutorOutfits.length, 8)
  for (const outfit of profile.tutorOutfits) {
    const tutor = { ...profile.defaultTutorProfile, outfit: outfit.id }
    assert.ok(outfit.clothing && outfit.greeting && outfit.description)
    assert.equal(new Set(outfit.comments).size, 3)
    for (let i = 0; i < 20; i++) {
      assert.equal(profile.getTutorComment(tutor, 'profession', i, 2), outfit.comments[i % 3])
      assert.ok(profile.getTutorComment(tutor, 'encourage', i, 2).length > 20)
    }
  }
})

test('all 1,920 color, outfit, hat and accessory combinations render an SVG', () => {
  let count = 0
  const expressions = ['happy', 'curious', 'thinking', 'celebrate']
  for (const color of profile.tutorColors) for (const outfit of profile.tutorOutfits) for (const hat of profile.tutorHats) for (const accessory of profile.tutorAccessories) {
    const markup = renderToStaticMarkup(createElement(TutorAvatar, {
      profile: { name: 'Lumi', color: color.id, outfit: outfit.id, hat: hat.id, accessory: accessory.id },
      expression: expressions[count % 4], animated: true,
    }))
    assert.ok(markup.includes('viewBox="0 0 240 300"'))
    assert.ok(!/undefined|NaN/.test(markup))
    assert.equal((markup.match(/<svg /g) ?? []).length, 1)
    count++
  }
  assert.equal(count, 1920)
})

test('every one of the 30 missions has a first hint and a detailed explanation', async () => {
  const source = readSource('App.tsx')
  const file = ts.createSourceFile('App.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const names = ['challenges', 'membershipChallenges', 'inclusionChallenges', 'equalityChallenges', 'classificationChallenges', 'operationChallenges', 'tutorHints']
  const declarations = []
  for (const statement of file.statements) {
    if (ts.isVariableStatement(statement)) for (const declaration of statement.declarationList.declarations) {
      if (names.includes(declaration.name.getText(file))) declarations.push('export const ' + declaration.getText(file))
    }
  }
  assert.equal(declarations.length, 7)
  const missions = await import(moduleUrl(declarations.join(';\n')))
  names.slice(0, 6).forEach((name, index) => {
    assert.equal(missions[name].length, 5)
    assert.equal(missions.tutorHints[index + 1].length, missions[name].length)
    missions[name].forEach((challenge, challengeIndex) => {
      assert.ok(challenge.tip.length > 20)
      assert.ok(missions.tutorHints[index + 1][challengeIndex].length > 20)
    })
  })
})
