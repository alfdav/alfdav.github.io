const test = require('node:test');
const assert = require('node:assert/strict');

const {
  parseCommand,
  resolveCommandAlias,
  addCommandToHistory,
  getPrintableCharacter,
  moveHistoryUp,
  moveHistoryDown,
} = require('../terminal-input-utils.js');

test('parseCommand normalizes command name to lowercase and preserves args', () => {
  assert.deepEqual(parseCommand('  HeLp   now please '), {
    cmd: 'help',
    args: 'now please',
  });
  assert.deepEqual(parseCommand('   '), { cmd: '', args: '' });
});

test('resolveCommandAlias maps ls and dir to help', () => {
  assert.equal(resolveCommandAlias('ls'), 'help');
  assert.equal(resolveCommandAlias('dir'), 'help');
  assert.equal(resolveCommandAlias('help'), 'help');
  assert.equal(resolveCommandAlias('projects'), 'projects');
});

test('addCommandToHistory skips empty commands and duplicate consecutive commands', () => {
  const start = [];
  const withEmpty = addCommandToHistory(start, '   ');
  assert.deepEqual(withEmpty, []);

  const withHelp = addCommandToHistory(withEmpty, 'help');
  assert.deepEqual(withHelp, ['help']);

  const withDuplicate = addCommandToHistory(withHelp, 'help');
  assert.deepEqual(withDuplicate, ['help']);

  const withNext = addCommandToHistory(withDuplicate, 'about');
  assert.deepEqual(withNext, ['help', 'about']);
});

test('getPrintableCharacter excludes backspace and non-character keys', () => {
  assert.equal(
    getPrintableCharacter('a', { key: 'a', ctrlKey: false, altKey: false, metaKey: false }),
    'a'
  );
  assert.equal(
    getPrintableCharacter('\x7f', { key: 'Backspace', ctrlKey: false, altKey: false, metaKey: false }),
    ''
  );
  assert.equal(
    getPrintableCharacter('\r', { key: 'Enter', ctrlKey: false, altKey: false, metaKey: false }),
    ''
  );
  assert.equal(
    getPrintableCharacter('x', { key: 'x', ctrlKey: true, altKey: false, metaKey: false }),
    ''
  );
});

test('history navigation preserves temp input and restores on down at end', () => {
  const history = ['help', 'about'];

  const upState = moveHistoryUp({
    history,
    historyIndex: history.length,
    commandBuffer: 'ver',
    tempBuffer: '',
  });

  assert.equal(upState.historyIndex, 1);
  assert.equal(upState.commandBuffer, 'about');
  assert.equal(upState.tempBuffer, 'ver');

  const downState = moveHistoryDown({
    history,
    historyIndex: upState.historyIndex,
    commandBuffer: upState.commandBuffer,
    tempBuffer: upState.tempBuffer,
  });

  assert.equal(downState.historyIndex, history.length);
  assert.equal(downState.commandBuffer, 'ver');
});
