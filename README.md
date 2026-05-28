# MarkEdit-vim

Vim Keybindings for [MarkEdit](https://github.com/MarkEdit-app/MarkEdit) that leverages [markedit-api](https://github.com/MarkEdit-app/MarkEdit-api).

Learn more about [codemirror-vim](https://github.com/replit/codemirror-vim).

## Installation

Copy [dist/markedit-vim.js](dist/markedit-vim.js?raw=true) to `~/Library/Containers/app.cyan.markedit/Data/Documents/scripts/`.

You can also run `yarn install && yarn build` to build and deploy the script.

## Custom Mappings

You can define custom key mappings in two ways:

1.  Add `extension.markeditVim` to `~/Library/Containers/app.cyan.markedit/Data/Documents/settings.json`:

    ```json
    {
      "extension.markeditVim": {
        "mappings": [
          { "before": "jj", "after": "<Esc>", "mode": "insert" },
          { "before": "Y", "after": "y$" }
        ]
      }
    }
    ```

2.  Create `~/Library/Containers/app.cyan.markedit/Data/Documents/scripts/markedit-vim.json` alongside the extension:

    ```json
    {
      "mappings": [
        { "before": "jj", "after": "<Esc>", "mode": "insert" },
        { "before": "Y", "after": "y$" }
      ]
    }
    ```

Available modes: `normal`, `insert`, `visual`, `replace`.
