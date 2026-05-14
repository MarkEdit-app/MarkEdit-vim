import { EditorView } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import { vim, Vim, getCM } from '@replit/codemirror-vim';
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

const applyDefaultMode = (defaultMode: string) => {
  if (defaultMode === 'insert') {
    MarkEdit.onEditorReady((view) => {
      const cm = getCM(view);
      if (cm) {
        Vim.handleKey(cm, 'a', 'map');
      }
    });
  }
};

(async () => {
  const userSettings = MarkEdit.userSettings['extension.markeditVim'] as any;

  if (userSettings) {
    applyMappings(userSettings.mappings);
    if (userSettings.defaultMode) {
      applyDefaultMode(userSettings.defaultMode);
    }
  }

  const documents = MarkEdit.getDirectoryPath('documents');
  const configPath = `${documents}/scripts/markedit-vim.json`;
  const content = await MarkEdit.getFileContent(configPath);

  if (content) {
    try {
      const config = JSON.parse(content);
      applyMappings(config.mappings);
      if (config.defaultMode) {
        applyDefaultMode(config.defaultMode);
      }
    } catch (e) {
      console.error('Failed to parse markedit-vim.json', e);
    }
  }
})();

MarkEdit.onEditorReady((view) => {
  const panel = view.scrollDOM.querySelector('.cm-panels-bottom');
  if (panel === null) {
    return;
  }

  const observer = new MutationObserver(() => {
    const span = Array.from(panel.querySelectorAll('span')).find((span: Element) => (span as HTMLElement).style.top === '1px');
    if (span) {
      (span as HTMLElement).style.display = 'none';
    }
  });

  observer.observe(panel, {
    attributes: true,
    childList: true,
    subtree: true,
  });
});
