import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DAILY_CHALLENGES_POOL,
  getDayKey,
  getDailyChallengeForDate,
  getTimeUntilNextChallenge,
  validateDailyChallengeSubmission,
  calculateUpdatedStreak
} from './dailyChallenge';
import { defaultPythonRunner } from './pythonRunner';

test('getDayKey formats local date as YYYY-MM-DD', () => {
  const d = new Date(2026, 2, 15, 14, 30, 0); // March 15, 2026
  assert.equal(getDayKey(d), '2026-03-15');
});

test('getDailyChallengeForDate stays identical within same 24h day and rotates on next day', () => {
  const morning = new Date(2026, 4, 10, 8, 15, 0);
  const night = new Date(2026, 4, 10, 23, 59, 59);
  const nextDay = new Date(2026, 4, 11, 0, 0, 1);

  const challengeMorning = getDailyChallengeForDate(morning);
  const challengeNight = getDailyChallengeForDate(night);
  const challengeNextDay = getDailyChallengeForDate(nextDay);

  assert.equal(challengeMorning.id, challengeNight.id);
  assert.notEqual(challengeMorning.id, challengeNextDay.id);
});

test('getTimeUntilNextChallenge computes accurate HH:MM:SS countdown to midnight', () => {
  const sampleTime = new Date(2026, 4, 10, 22, 30, 15); // 22:30:15 -> 1h 29m 45s left
  const countdown = getTimeUntilNextChallenge(sampleTime);

  assert.equal(countdown.hours, 1);
  assert.equal(countdown.minutes, 29);
  assert.equal(countdown.seconds, 45);
  assert.equal(countdown.formatted, '01:29:45');
});

test('all 14 daily challenges solutionCode executes cleanly in PythonRuntime and passes validation', () => {
  for (const challenge of DAILY_CHALLENGES_POOL) {
    const execResult = defaultPythonRunner.execute(challenge.solutionCode);
    assert.equal(
      execResult.success,
      true,
      `Challenge ${challenge.id} failed execution: ${execResult.error}`
    );

    const validation = validateDailyChallengeSubmission(
      challenge,
      challenge.solutionCode,
      execResult.output,
      execResult.success,
      execResult.error
    );

    assert.equal(
      validation.passed,
      true,
      `Challenge ${challenge.id} failed validation: ${validation.feedback}`
    );
  }
});

test('validateDailyChallengeSubmission rejects empty code, wrong output, or missing keywords', () => {
  const challenge = DAILY_CHALLENGES_POOL[1]; // requires 'if' and 'print', output 'تحذير: حرارة مرتفعة'

  const emptyCheck = validateDailyChallengeSubmission(challenge, '   ', '', true);
  assert.equal(emptyCheck.passed, false);

  const wrongOutputCheck = validateDailyChallengeSubmission(
    challenge,
    'if True:\n    print("الحرارة طبيعية")',
    'الحرارة طبيعية',
    true
  );
  assert.equal(wrongOutputCheck.passed, false);
  assert.equal(wrongOutputCheck.matchedOutput, false);

  const missingIfCheck = validateDailyChallengeSubmission(
    challenge,
    'print("تحذير: حرارة مرتفعة")',
    'تحذير: حرارة مرتفعة',
    true
  );
  assert.equal(missingIfCheck.passed, false);
  assert.equal(missingIfCheck.usedRequiredConstructs, false);
});

test('calculateUpdatedStreak increments once per 24h day', () => {
  const today = new Date(2026, 4, 10, 12, 0, 0);
  const firstClaim = calculateUpdatedStreak(3, '2026-05-09', today);
  assert.equal(firstClaim.newStreak, 4);
  assert.equal(firstClaim.streakIncremented, true);

  const duplicateSameDay = calculateUpdatedStreak(4, '2026-05-10', today);
  assert.equal(duplicateSameDay.newStreak, 4);
  assert.equal(duplicateSameDay.streakIncremented, false);
});
