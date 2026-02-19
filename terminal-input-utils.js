(function initTerminalInputUtils(root, factory) {
  const api = factory();

  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }

  root.terminalInputUtils = api;
})(typeof globalThis !== 'undefined' ? globalThis : window, () => {
  const commandAliases = {
    ls: 'help',
    dir: 'help',
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
    if (!trimmed) {
      return history.slice();
    }

    if (history[history.length - 1] === trimmed) {
      return history.slice();
    }

    return history.concat(trimmed);
  }

  function getPrintableCharacter(key, domEvent = {}) {
    if (domEvent.altKey || domEvent.ctrlKey || domEvent.metaKey) {
      return '';
    }

    if (domEvent.key === 'Backspace' || domEvent.key === 'Enter' || domEvent.key === 'Tab') {
      return '';
    }

    if (typeof domEvent.key === 'string' && domEvent.key.length === 1) {
      return key;
    }

    return '';
  }

  function moveHistoryUp(state) {
    const { history = [], historyIndex = 0, commandBuffer = '', tempBuffer = '' } = state || {};

    if (!history.length || historyIndex <= 0) {
      return { historyIndex, commandBuffer, tempBuffer };
    }

    const nextTempBuffer = historyIndex === history.length ? commandBuffer : tempBuffer;
    const nextHistoryIndex = historyIndex - 1;
    const nextCommandBuffer = history[nextHistoryIndex] || '';

    return {
      historyIndex: nextHistoryIndex,
      commandBuffer: nextCommandBuffer,
      tempBuffer: nextTempBuffer,
    };
  }

  function moveHistoryDown(state) {
    const { history = [], historyIndex = 0, commandBuffer = '', tempBuffer = '' } = state || {};

    if (!history.length) {
      return { historyIndex, commandBuffer, tempBuffer };
    }

    if (historyIndex < history.length - 1) {
      const nextHistoryIndex = historyIndex + 1;
      return {
        historyIndex: nextHistoryIndex,
        commandBuffer: history[nextHistoryIndex] || '',
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
    if (!normalized) {
      return '';
    }

    return commandAliases[normalized] || normalized;
  }

  function toTerminalHyperlink(url = '', label = '') {
    const normalizedUrl = typeof url === 'string' ? url.trim() : '';
    if (!normalizedUrl) {
      return '';
    }

    const normalizedLabel =
      typeof label === 'string' && label.trim() ? label.trim() : normalizedUrl;

    return `\x1b]8;;${normalizedUrl}\x07${normalizedLabel}\x1b]8;;\x07`;
  }

  return {
    parseCommand,
    resolveCommandAlias,
    toTerminalHyperlink,
    addCommandToHistory,
    getPrintableCharacter,
    moveHistoryUp,
    moveHistoryDown,
  };
});
