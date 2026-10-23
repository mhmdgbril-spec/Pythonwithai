import test from 'node:test';
import assert from 'node:assert/strict';
import { BOOK_CHAPTERS, BOOK_INTRO, BOOK_APPENDICES, BOOK_METADATA } from './bookChaptersData';
import { PythonRuntime } from '../utils/pythonRunner';

test('BOOK_CHAPTERS contains all 14 units with 3D icons and complete structure', () => {
  assert.equal(BOOK_CHAPTERS.length, 14);
  assert.equal(BOOK_METADATA.totalUnits, 14);
  assert.ok(BOOK_INTRO.goldenRule.length > 10);
  assert.equal(BOOK_INTRO.howToUseTable.rows.length, 6);
  assert.equal(BOOK_APPENDICES.sections[0].librariesTable?.rows.length, 22);
  assert.equal(BOOK_APPENDICES.sections[1].troubleshooting?.length, 8);

  BOOK_CHAPTERS.forEach((ch, idx) => {
    assert.equal(ch.unitNumber, idx + 1);
    assert.equal(ch.iconName, `unit-${idx + 1}`);
    assert.ok(ch.objectives.length >= 3, `Unit ${ch.unitNumber} should have objectives`);
    assert.ok(ch.sections.length >= 2, `Unit ${ch.unitNumber} should have sections`);
    assert.ok(ch.codeSnippets.length >= 2, `Unit ${ch.unitNumber} should have code snippets`);
    assert.ok(ch.projects.length >= 1, `Unit ${ch.unitNumber} should have projects`);
    assert.ok(ch.summary.length >= 3, `Unit ${ch.unitNumber} should have summary points`);
  });
});

test('All 123 textbook questions are present and properly structured', () => {
  const expectedCounts = [5, 10, 14, 14, 10, 10, 10, 10, 10, 13, 5, 5, 4, 3];
  const actualCounts = BOOK_CHAPTERS.map(c => c.questions.length);
  assert.deepEqual(actualCounts, expectedCounts);

  const totalQuestions = actualCounts.reduce((a, b) => a + b, 0);
  assert.equal(totalQuestions, 123);

  for (const ch of BOOK_CHAPTERS) {
    for (const q of ch.questions) {
      assert.equal(q.options.length, 4, `Question ${q.id} must have 4 options`);
      assert.ok(['أ', 'ب', 'ج', 'د'].includes(q.correctLetter), `Question ${q.id} must have valid correctLetter`);
      assert.ok(q.explanation.length > 10, `Question ${q.id} must have explanation`);
    }
  }
});

test('All textbook code snippets execute cleanly in PythonRuntime without error', () => {
  const runner = new PythonRuntime();

  for (const ch of BOOK_CHAPTERS) {
    for (const snippet of ch.codeSnippets) {
      const res = runner.execute(snippet.code);
      assert.equal(
        res.success,
        true,
        `Snippet ${snippet.id} (${snippet.title}) in Unit ${ch.unitNumber} failed: ${res.error}`
      );
      assert.ok(
        res.output.trim().length > 0,
        `Snippet ${snippet.id} (${snippet.title}) in Unit ${ch.unitNumber} produced empty output`
      );
    }
  }
});
