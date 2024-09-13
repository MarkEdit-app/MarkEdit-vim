import { EditorView } from '@codemirror/view';
import { Prec } from '@codemirror/state';
import { vim } from '@replit/codemirror-vim';
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
