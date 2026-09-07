const commandAliases = {
  ls: 'help',
  dir: 'help',
  certs: 'certifications',
};

function parseCommand(input = '') {
  const trimmed = input.trim();
  if (!trimmed) {
    return { cmd: '', args: '' };
  }
  const [rawCmd, ...args] = trimmed.split(/\s+/);
  return { cmd: rawCmd.toLowerCase(), args: args.join(' ') };
}

function addCommandToHistory(history = [], input = '') {
  const trimmed = input.trim();
  if (!trimmed || history[history.length - 1] === trimmed) {
    return history.slice();
  }
  return history.concat(trimmed);
}

function moveHistoryUp(state) {
  const { history = [], historyIndex = 0, commandBuffer = '', tempBuffer = '' } = state || {};
  if (!history.length || historyIndex <= 0) {
    return { historyIndex, commandBuffer, tempBuffer };
  }
  return {
    historyIndex: historyIndex - 1,
    commandBuffer: history[historyIndex - 1] || '',
    tempBuffer: historyIndex === history.length ? commandBuffer : tempBuffer,
  };
}

function moveHistoryDown(state) {
  const { history = [], historyIndex = 0, commandBuffer = '', tempBuffer = '' } = state || {};
  if (!history.length) {
    return { historyIndex, commandBuffer, tempBuffer };
  }
  if (historyIndex < history.length - 1) {
    return {
      historyIndex: historyIndex + 1,
      commandBuffer: history[historyIndex + 1] || '',
      tempBuffer,
    };
  }
  return {
    historyIndex: history.length,
    commandBuffer: tempBuffer,
    tempBuffer,
  };
}

function resolveCommandAlias(command = '') {
  const normalized = command.trim().toLowerCase();
  return normalized ? commandAliases[normalized] || normalized : '';
}

var terminalInputUtils = {
  parseCommand,
  resolveCommandAlias,
  addCommandToHistory,
  moveHistoryUp,
  moveHistoryDown,
};

if (typeof module === 'object' && module.exports) {
  module.exports = terminalInputUtils;
}
