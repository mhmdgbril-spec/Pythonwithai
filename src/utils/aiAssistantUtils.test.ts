import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAssistantContext,
  getQuickPromptsForContext,
  buildSystemInstruction,
  parseMessageSegments,
  buildLocalEducationalFallback
} from './aiAssistantUtils';
import { CURRICULUM_CHAPTERS } from '../data/curriculumData';
import { BOOK_CHAPTERS } from '../data/bookChaptersData';

test('buildAssistantContext builds lesson context when activeLesson is provided', () => {
  const firstLesson = CURRICULUM_CHAPTERS[0].lessons[0];
  const ctx = buildAssistantContext({
    activeTab: 'path',
    activeLesson: firstLesson,
    activeBookChapter: null
  });

  assert.equal(ctx.activeTab, 'path');
  assert.ok(ctx.contextTitle.includes(firstLesson.title));
  assert.ok(ctx.contextBadge.includes('درس تفاعلي'));
  assert.ok(ctx.keyTopics.length > 0);
  assert.ok(ctx.sampleCode && ctx.sampleCode.length > 0);
});

test('buildAssistantContext builds textbook unit context when on book tab', () => {
  const unit3 = BOOK_CHAPTERS[2];
  const ctx = buildAssistantContext({
    activeTab: 'book',
    activeLesson: null,
    activeBookChapter: unit3
  });

  assert.equal(ctx.activeTab, 'book');
  assert.ok(ctx.contextTitle.includes(unit3.arabicTitle));
  assert.ok(ctx.contextBadge.includes(String(unit3.unitNumber)));
  assert.ok(ctx.keyTopics.length > 0);
});

test('getQuickPromptsForContext returns 4 relevant Arabic prompts for each context', () => {
  const lessonCtx = buildAssistantContext({
    activeTab: 'path',
    activeLesson: CURRICULUM_CHAPTERS[0].lessons[0]
  });
  const prompts = getQuickPromptsForContext(lessonCtx);
  assert.equal(prompts.length, 4);
  assert.ok(prompts[0].includes(CURRICULUM_CHAPTERS[0].lessons[0].title));
});

test('parseMessageSegments extracts text and fenced python code blocks cleanly', () => {
  const markdown = [
    'إليك شرح دالة الطباعة في بايثون:',
    '```python\nname = "سلمان"\nprint("مرحباً", name)\n```',
    'جرب تشغيل هذا الكود الآن!'
  ].join('\n\n');

  const segments = parseMessageSegments(markdown);
  assert.equal(segments.length, 3);
  assert.equal(segments[0].type, 'text');
  assert.equal(segments[1].type, 'code');
  assert.equal(segments[1].language, 'python');
  assert.ok(segments[1].content.includes('print("مرحباً", name)'));
  assert.equal(segments[2].type, 'text');
});

test('buildSystemInstruction and buildLocalEducationalFallback include context and runnable python code', () => {
  const ctx = buildAssistantContext({
    activeTab: 'playground',
    activeLesson: null
  });
  const sys = buildSystemInstruction(ctx, 'محمد');
  assert.ok(sys.includes('مساعد بايثون الذكي'));
  assert.ok(sys.includes('محمد'));

  const fallback = buildLocalEducationalFallback('اشرح لي جملة if الشرطية', ctx);
  const segments = parseMessageSegments(fallback);
  assert.ok(segments.some(s => s.type === 'code' && s.content.includes('if score >= 90:')));
});
