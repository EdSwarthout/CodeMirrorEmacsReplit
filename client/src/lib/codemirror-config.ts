import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { xml } from "@codemirror/lang-xml";
import { sql } from "@codemirror/lang-sql";
import { keymap } from "@codemirror/view";
import { emacsStyleKeymap } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";

const languageExtensions = {
  javascript: javascript(),
  python: python(),
  html: html(),
  css: css(),
  json: json(),
  markdown: markdown(),
  xml: xml(),
  sql: sql(),
};

interface SetupEditorOptions {
  parent: HTMLElement;
  doc: string;
  language: string;
  onChange: (content: string) => void;
  onCursorChange: (line: number, col: number) => void;
}

export function setupEditor({ 
  parent, 
  doc, 
  language, 
  onChange, 
  onCursorChange 
}: SetupEditorOptions): EditorView {
  const languageExtension = languageExtensions[language as keyof typeof languageExtensions] || javascript();
  
  const state = EditorState.create({
    doc,
    extensions: [
      basicSetup,
      languageExtension,
      keymap.of(emacsStyleKeymap),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          onChange(update.state.doc.toString());
        }
        if (update.selectionSet) {
          const cursor = update.state.selection.main.head;
          const line = update.state.doc.lineAt(cursor);
          const lineNumber = line.number;
          const column = cursor - line.from + 1;
          onCursorChange(lineNumber, column);
        }
      }),
      EditorView.theme({
        "&": {
          height: "100%",
          fontSize: "14px",
        },
        ".cm-content": {
          padding: "16px",
          minHeight: "100%",
        },
        ".cm-focused": {
          outline: "none",
        },
        ".cm-editor": {
          height: "100%",
        },
        ".cm-scroller": {
          fontFamily: "'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
        },
        ".cm-cursor": {
          borderLeftColor: "var(--primary)",
          borderLeftWidth: "2px",
        },
        ".cm-dropCursor": {
          borderLeftColor: "var(--primary)",
        },
      }),
      // Auto-focus extension
      EditorView.domEventHandlers({
        focus: (event, view) => {
          // Ensure cursor is visible when editor gains focus
          return false;
        },
      }),
    ],
  });

  return new EditorView({
    state,
    parent,
  });
}
