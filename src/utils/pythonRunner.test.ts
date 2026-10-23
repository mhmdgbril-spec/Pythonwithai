import test from 'node:test';
import assert from 'node:assert/strict';
import { PythonRuntime } from './pythonRunner.ts';

test('PythonRuntime prints simple strings and arithmetic', () => {
  const runner = new PythonRuntime();
  const res = runner.execute('print("Hello from Dammam!")\nprint(2 + 3 * 4)');
  assert.equal(res.success, true);
  assert.equal(res.output, 'Hello from Dammam!\n14');
});

test('PythonRuntime handles variables and conditions', () => {
  const runner = new PythonRuntime();
  const code = `
x = 15
if x > 10:
    print("Greater")
else:
    print("Smaller")
`;
  const res = runner.execute(code);
  assert.equal(res.success, true);
  assert.equal(res.output, 'Greater');
});

test('PythonRuntime handles for loops and range', () => {
  const runner = new PythonRuntime();
  const code = `
total = 0
for i in range(5):
    total = total + i
print(total)
`;
  const res = runner.execute(code);
  assert.equal(res.success, true);
  assert.equal(res.output, '10');
});

test('PythonRuntime handles function definition and returns', () => {
  const runner = new PythonRuntime();
  const code = `
def multiply(a, b):
    return a * b

print(multiply(6, 7))
`;
  const res = runner.execute(code);
  assert.equal(res.success, true);
  assert.equal(res.output, '42');
});

test('PythonRuntime handles error reporting gracefully', () => {
  const runner = new PythonRuntime();
  const code = `
print(non_existent_var_123)
`;
  const res = runner.execute(code);
  assert.equal(res.success, false);
  assert.ok(res.error?.includes('خطأ في التسمية (NameError)'));
});
