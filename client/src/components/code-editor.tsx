import { useEffect, useRef, useState, useCallback } from "react";
import { EditorView } from "codemirror";
import { setupEditor } from "@/lib/codemirror-config";
import type { File } from "@shared/schema";

interface CodeEditorProps {
  file: File;
  language: string;
  onChange: (content: string) => void;
  onCursorPositionChange: (line: number, col: number) => void;
}

export default function CodeEditor({ 
  file, 
  language, 
  onChange, 
  onCursorPositionChange 
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isReady, setIsReady] = useState(false);
  const currentFileIdRef = useRef<number | null>(null);
  const currentLanguageRef = useRef<string>("");

  // Stable onChange callback to prevent unnecessary re-renders
  const stableOnChange = useCallback((content: string) => {
    onChange(content);
  }, [onChange]);

  const stableOnCursorChange = useCallback((line: number, col: number) => {
    onCursorPositionChange(line, col);
  }, [onCursorPositionChange]);

  // Initialize or recreate editor only when file or language changes
  useEffect(() => {
    if (!editorRef.current) return;
    
    const isFileChange = currentFileIdRef.current !== file.id;
    const isLanguageChange = currentLanguageRef.current !== language;
    const needsRecreate = !viewRef.current || isFileChange || isLanguageChange;

    if (needsRecreate) {
      // Store current cursor position if editor exists
      let cursorPos = 0;
      let hasFocus = false;
      if (viewRef.current) {
        cursorPos = viewRef.current.state.selection.main.head;
        hasFocus = viewRef.current.hasFocus;
        viewRef.current.destroy();
      }

      const view = setupEditor({
        parent: editorRef.current,
        doc: file.content,
        language,
        onChange: stableOnChange,
        onCursorChange: stableOnCursorChange,
      });

      viewRef.current = view;
      currentFileIdRef.current = file.id;
      currentLanguageRef.current = language;
      setIsReady(true);

      // Only restore cursor position if this was a language change for the same file
      if (isLanguageChange && !isFileChange && hasFocus && cursorPos > 0) {
        setTimeout(() => {
          if (viewRef.current) {
            const pos = Math.min(cursorPos, view.state.doc.length);
            view.dispatch({
              selection: { anchor: pos, head: pos },
            });
            view.focus();
          }
        }, 0);
      }
    }

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
        setIsReady(false);
      }
    };
  }, [file.id, file.content, language, stableOnChange, stableOnCursorChange]);

  // Update content when file content changes (but same file)
  useEffect(() => {
    if (!viewRef.current || !isReady || currentFileIdRef.current !== file.id) return;
    
    const currentContent = viewRef.current.state.doc.toString();
    if (currentContent !== file.content) {
      // Only update content without cursor changes - let CodeMirror handle cursor naturally
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: file.content,
        },
      });
    }
  }, [file.content, isReady]);

  return (
    <div className="h-full w-full">
      <div ref={editorRef} className="h-full w-full" />
    </div>
  );
}
