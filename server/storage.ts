import { files, editorSettings, type File, type InsertFile, type EditorSettings, type InsertEditorSettings } from "@shared/schema";
import { db } from "./db";
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
  async getFiles(): Promise<File[]> {
    return await db.select().from(files);
  }

  async getFile(id: number): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file || undefined;
  }

  async getFileByPath(path: string): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.path, path));
    return file || undefined;
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const [file] = await db
      .insert(files)
      .values(insertFile)
      .returning();
    return file;
  }

  async updateFile(id: number, content: string): Promise<File | undefined> {
    const [file] = await db
      .update(files)
      .set({ content })
      .where(eq(files.id, id))
      .returning();
    return file || undefined;
  }

  async deleteFile(id: number): Promise<boolean> {
    const result = await db.delete(files).where(eq(files.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getSettings(): Promise<EditorSettings | undefined> {
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

export const storage = new DatabaseStorage();
