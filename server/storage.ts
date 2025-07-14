import { files, editorSettings, type File, type InsertFile, type EditorSettings, type InsertEditorSettings } from "@shared/schema";
import { db, isDatabaseAvailable } from "./db";
import { eq } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  private initialized = false;

  async getFiles(): Promise<File[]> {
    console.log("[Storage] getFiles() called");
    console.log("[Storage] Database available:", !!db);
    
    if (!db) {
      console.error("[Storage] Database not available");
      throw new Error("Database not available");
    }
    
    try {
      // Initialize sample files if database is empty
      if (!this.initialized) {
        console.log("[Storage] Initializing database...");
        await this.initializeIfEmpty();
        this.initialized = true;
      }
      
      console.log("[Storage] Querying files table...");
      const result = await db.select().from(files);
      console.log("[Storage] Query successful, found", result.length, "files");
      return result;
      
    } catch (error) {
      console.error("[Storage] Error in getFiles():", error);
      console.error("[Storage] Error type:", typeof error);
      console.error("[Storage] Error message:", error instanceof Error ? error.message : 'Unknown error');
      console.error("[Storage] Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }

  private async initializeIfEmpty(): Promise<void> {
    if (!db) return;
    
    const existingFiles = await db.select().from(files);
    if (existingFiles.length === 0) {
      // Create sample files
      await this.createFile({
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
      
      await this.createFile({
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
      
      await this.createFile({
        name: "sample.md",
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
        path: "/sample.md"
      });
      
      console.log("[Storage] Initialized database with sample files");
    }
  }

  async getFile(id: number): Promise<File | undefined> {
    if (!db) throw new Error("Database not available");
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file || undefined;
  }

  async getFileByPath(path: string): Promise<File | undefined> {
    if (!db) throw new Error("Database not available");
    const [file] = await db.select().from(files).where(eq(files.path, path));
    return file || undefined;
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    if (!db) throw new Error("Database not available");
    const [file] = await db
      .insert(files)
      .values(insertFile)
      .returning();
    return file;
  }

  async updateFile(id: number, content: string): Promise<File | undefined> {
    if (!db) throw new Error("Database not available");
    const [file] = await db
      .update(files)
      .set({ content })
      .where(eq(files.id, id))
      .returning();
    return file || undefined;
  }

  async deleteFile(id: number): Promise<boolean> {
    if (!db) throw new Error("Database not available");
    const result = await db.delete(files).where(eq(files.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getSettings(): Promise<EditorSettings | undefined> {
    if (!db) throw new Error("Database not available");
    const [settings] = await db.select().from(editorSettings).limit(1);
    
    if (!settings) {
      // Create default settings if none exist
      const [newSettings] = await db
        .insert(editorSettings)
        .values({
          theme: "light",
          fontSize: 14,
          lineNumbers: true,
          wordWrap: false,
          emacsMode: true
        })
        .returning();
      return newSettings;
    }
    
    return settings;
  }

  async updateSettings(settingsData: InsertEditorSettings): Promise<EditorSettings> {
    if (!db) throw new Error("Database not available");
    // First try to update existing settings
    const [existingSettings] = await db.select().from(editorSettings).limit(1);
    
    if (existingSettings) {
      const [updatedSettings] = await db
        .update(editorSettings)
        .set(settingsData)
        .where(eq(editorSettings.id, existingSettings.id))
        .returning();
      return updatedSettings;
    } else {
      // Create new settings if none exist
      const [newSettings] = await db
        .insert(editorSettings)
        .values(settingsData)
        .returning();
      return newSettings;
    }
  }
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
    this.initializeSampleFiles();
  }

  private async initializeSampleFiles() {
    await this.createFile({
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
    
    await this.createFile({
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
    
    await this.createFile({
      name: "sample.md",
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
      path: "/sample.md"
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

  async updateSettings(settingsData: InsertEditorSettings): Promise<EditorSettings> {
    this.settings = {
      id: this.currentSettingsId,
      theme: settingsData.theme || "light",
      fontSize: settingsData.fontSize || 14,
      lineNumbers: settingsData.lineNumbers !== undefined ? settingsData.lineNumbers : true,
      wordWrap: settingsData.wordWrap !== undefined ? settingsData.wordWrap : false,
      emacsMode: settingsData.emacsMode !== undefined ? settingsData.emacsMode : true
    };
    return this.settings;
  }
}

// Log which storage type is being used
console.log(`[Storage] Using ${isDatabaseAvailable ? 'DatabaseStorage' : 'MemStorage'} ${isDatabaseAvailable ? '(PostgreSQL)' : '(In-Memory)'}`);

export const storage = isDatabaseAvailable ? new DatabaseStorage() : new MemStorage();
