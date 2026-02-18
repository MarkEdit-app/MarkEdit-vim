import { EditorView } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import { vim, Vim } from '@replit/codemirror-vim';
import { MarkEdit } from 'markedit-api';

const theme = EditorView.baseTheme({
  '.cm-vim-panel': {
    paddingTop: '3px',
    paddingBottom: '3px',
  },
  '.cm-vim-panel *': {
    fontFamily: 'monospace',
    fontSize: '14px',
  },
});

MarkEdit.addExtension([
  theme,
  Prec.highest(vim({ status: true })),
]);

/**
 * Apply custom key mappings from an array.
 *
 * Example:
 * [
 *   { "before": "jj", "after": "<Esc>", "mode": "insert" },
 *   { "before": "Y", "after": "y$" }
 * ]
 */
const applyMappings = (mappings: any) => {
  if (Array.isArray(mappings)) {
    mappings.forEach(mapping => {
      const { before, after, mode } = mapping;
      if (typeof before === 'string' && typeof after === 'string') {
        Vim.map(before, after, mode);
      }
    });
  }
};

(async () => {
  // From userSettings (settings.json)
  applyMappings(MarkEdit.userSettings['vim.mappings']);

  // From markedit-vim.json
  const documents = MarkEdit.getDirectoryPath('documents');
  const configPath = `${documents}/scripts/markedit-vim.json`;
  const content = await MarkEdit.getFileContent(configPath);

  if (content) {
    try {
      const config = JSON.parse(content);
      applyMappings(config.mappings);
    } catch (e) {
      console.error('Failed to parse markedit-vim.json', e);
    }
  }
})();

// Work around a Safari bug where status label is duplicate
MarkEdit.onEditorReady(({ dom }) => {
  const panel = dom.querySelector('.cm-panels-bottom');
  if (panel === null) {
    return;
  }

  const observer = new MutationObserver(() => {
    const span = Array.from(panel.querySelectorAll('span')).find(span => span.style.top === '1px');
    if (span) {
      span.style.display = 'none';
    }
  });

  observer.observe(panel, {
    attributes: true,
    childList: true,
    subtree: true,
  });
});
