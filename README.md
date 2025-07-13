# CodeMirror Emacs Editor

A powerful web-based code editor with Emacs keybindings, built with React, Express, and CodeMirror 6.

## Features

- **CodeMirror 6 Integration**: Advanced code editor with syntax highlighting
- **Emacs Keybindings**: Full support for Emacs-style key combinations
- **Multi-Language Support**: JavaScript, Python, HTML, CSS, JSON, Markdown, XML, SQL
- **File Management**: Create, open, save, and manage files
- **Tabbed Interface**: Work with multiple files simultaneously
- **File Explorer**: Navigate and select files easily
- **Customizable Settings**: Theme, font size, line numbers, word wrap
- **Real-time Updates**: Live cursor position and modification tracking
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18 with TypeScript
- CodeMirror 6 for code editing
- Tailwind CSS + shadcn/ui for styling
- TanStack Query for state management
- Wouter for routing

### Backend
- Node.js + Express
- TypeScript
- In-memory storage with PostgreSQL schema
- RESTful API design

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/EdSwarthout/CodeMirrorEmacsReplit.git
cd CodeMirrorEmacsReplit
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:push` - Push database schema

## Emacs Keybindings

The editor supports standard Emacs keybindings:

- `Ctrl+x Ctrl+s` - Save file
- `Ctrl+x Ctrl+f` - Open file
- `Ctrl+x k` - Close file
- `Ctrl+g` - Cancel operation
- `Ctrl+a` - Beginning of line
- `Ctrl+e` - End of line
- `Ctrl+k` - Kill line
- `Ctrl+y` - Yank (paste)
- `Alt+w` - Copy
- `Ctrl+w` - Cut
- `Ctrl+/` - Undo
- `Ctrl+s` - Search forward
- `Ctrl+r` - Search backward

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and configs
│   │   └── pages/          # Page components
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite integration
└── shared/                 # Shared types and schemas
    └── schema.ts          # Database schema
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [CodeMirror](https://codemirror.net/) for the excellent code editor
- [Emacs](https://www.gnu.org/software/emacs/) for the keybinding inspiration
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components