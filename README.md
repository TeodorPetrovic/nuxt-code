# Nuxt Code Editor

A sleek, VS Code-like editor built with Nuxt.js v4, featuring Monaco Editor, multiple themes, keyboard shortcuts, tabs, and a resizable split-pane layout.

## Features

- 🎨 **Monaco Editor** - Full-featured code editor with syntax highlighting for multiple languages
- 📑 **Tab System** - Open and manage multiple files simultaneously
- 🌓 **Theme Support** - Dark, Light, and High Contrast themes
- 📁 **File Explorer** - Browse, create, edit, rename, and delete files
- 🔧 **Resizable Panels** - Drag to adjust the explorer width
- ⌨️ **Keyboard Shortcuts** - Ctrl+S (Cmd+S) to save files
- 🔒 **Secure Backend** - Nitro-powered API with directory traversal prevention
- 💾 **Persistent Storage** - All file changes are saved to disk

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Usage

1. Open your browser to `http://localhost:3000`
2. Browse files in the explorer on the left
3. Click any file to open it in the editor
4. Edit files and press Ctrl+S (Cmd+S) to save
5. Create new files/folders using the toolbar buttons
6. Switch themes using the dropdown in the title bar
7. Resize panels by dragging the divider

## API Endpoints

The Nitro backend provides the following REST API endpoints:

- `GET /api/files?path=<path>` - List files and directories
- `GET /api/files/read?path=<path>` - Read file content
- `POST /api/files/write` - Write/update file content
- `POST /api/files/create` - Create new file or directory
- `PATCH /api/files/rename` - Rename file or directory
- `DELETE /api/files/delete?path=<path>` - Delete file or directory

## Tech Stack

- **Frontend**: Nuxt.js 4, Vue 3, TypeScript
- **Editor**: Monaco Editor
- **Backend**: Nitro
- **Styling**: Custom CSS (VS Code-inspired)

## Security

- All file operations are restricted to the workspace directory
- Directory traversal attacks are prevented
- No authentication/authorization (as per requirements)

Check out the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) and [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
