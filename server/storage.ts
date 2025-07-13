import { files, editorSettings, type File, type InsertFile, type EditorSettings, type InsertEditorSettings } from "@shared/schema";

export interface IStorage {
  // File operations
  getFiles(): Promise<File[]>;
  getFile(id: number): Promise<File | undefined>;
  getFileByPath(path: string): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: number, content: string): Promise<File | undefined>;
  deleteFile(id: number): Promise<boolean>;
  
  // Settings operations
  getSettings(): Promise<EditorSettings | undefined>;
  updateSettings(settings: InsertEditorSettings): Promise<EditorSettings>;
}

export class MemStorage implements IStorage {
  private files: Map<number, File>;
  private settings: EditorSettings | null;
  private currentFileId: number;
  private currentSettingsId: number;

  constructor() {
    this.files = new Map();
    this.settings = null;
    this.currentFileId = 1;
    this.currentSettingsId = 1;
    
    // Initialize with sample files
    this.createFile({
      name: "index.js",
      content: `// Welcome to CodeMirror Emacs Editor
function greetUser(name) {
    const message = \`Hello, \${name}!\`;
    console.log(message);
    return message;
}

// Example usage
greetUser('World');`,
      language: "javascript",
      path: "/index.js"
    });
    
    this.createFile({
      name: "styles.css",
      content: `/* Sample CSS file */
body {
    font-family: 'Inter', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f9fafb;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}`,
      language: "css",
      path: "/styles.css"
    });
    
    this.createFile({
      name: "README.md",
      content: `# CodeMirror Emacs Editor

A powerful web-based code editor with Emacs keybindings.

## Features

- CodeMirror 6 integration
- Emacs keybindings
- Multiple language support
- File management
- Customizable settings

## Usage

Use Emacs keybindings for efficient text editing:
- \`Ctrl+x Ctrl+s\` - Save file
- \`Ctrl+x Ctrl+f\` - Open file
- \`Ctrl+x k\` - Close file
- \`Ctrl+g\` - Cancel operation`,
      language: "markdown",
      path: "/README.md"
    });
  }

  async getFiles(): Promise<File[]> {
    return Array.from(this.files.values());
  }

  async getFile(id: number): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getFileByPath(path: string): Promise<File | undefined> {
    return Array.from(this.files.values()).find(file => file.path === path);
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = this.currentFileId++;
    const file: File = { 
      id,
      name: insertFile.name,
      content: insertFile.content || "",
      language: insertFile.language || "javascript",
      path: insertFile.path
    };
    this.files.set(id, file);
    return file;
  }

  async updateFile(id: number, content: string): Promise<File | undefined> {
    const file = this.files.get(id);
    if (!file) return undefined;
    
    const updatedFile = { ...file, content };
    this.files.set(id, updatedFile);
    return updatedFile;
  }

  async deleteFile(id: number): Promise<boolean> {
    return this.files.delete(id);
  }

  async getSettings(): Promise<EditorSettings | undefined> {
    if (!this.settings) {
      this.settings = {
        id: this.currentSettingsId,
        theme: "light",
        fontSize: 14,
        lineNumbers: true,
        wordWrap: false,
        emacsMode: true
      };
    }
    return this.settings;
  }

  async updateSettings(settings: InsertEditorSettings): Promise<EditorSettings> {
    this.settings = {
      id: this.currentSettingsId,
      theme: settings.theme || "light",
      fontSize: settings.fontSize || 14,
      lineNumbers: settings.lineNumbers !== undefined ? settings.lineNumbers : true,
      wordWrap: settings.wordWrap !== undefined ? settings.wordWrap : false,
      emacsMode: settings.emacsMode !== undefined ? settings.emacsMode : true
    };
    return this.settings;
  }
}

export const storage = new MemStorage();
