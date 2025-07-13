import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  content: text("content").notNull().default(""),
  language: text("language").notNull().default("javascript"),
  path: text("path").notNull(),
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
});

export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;

export const editorSettings = pgTable("editor_settings", {
  id: serial("id").primaryKey(),
  theme: text("theme").notNull().default("light"),
  fontSize: integer("font_size").notNull().default(14),
  lineNumbers: boolean("line_numbers").notNull().default(true),
  wordWrap: boolean("word_wrap").notNull().default(false),
  emacsMode: boolean("emacs_mode").notNull().default(true),
});

export const insertEditorSettingsSchema = createInsertSchema(editorSettings).omit({
  id: true,
});

export type InsertEditorSettings = z.infer<typeof insertEditorSettingsSchema>;
export type EditorSettings = typeof editorSettings.$inferSelect;
