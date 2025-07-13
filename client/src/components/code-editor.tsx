import { useEffect, useRef, useState } from "react";
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
  const lastFileIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Only recreate if file changed or no editor exists
    const needsRecreate = !viewRef.current || lastFileIdRef.current !== file.id;

    if (needsRecreate) {
      if (viewRef.current) {
        viewRef.current.destroy();
      }

      const view = setupEditor({
        parent: editorRef.current,
        doc: file.content,
        language,
        onChange,
        onCursorChange: onCursorPositionChange,
      });

      viewRef.current = view;
      lastFileIdRef.current = file.id;
      setIsReady(true);
    }

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
        setIsReady(false);
      }
    };
  }, [file.id, language]); // Only depend on file.id and language

  // Update content only for the same file
  useEffect(() => {
    if (!viewRef.current || !isReady || lastFileIdRef.current !== file.id) return;
    
    const currentContent = viewRef.current.state.doc.toString();
    if (currentContent !== file.content) {
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
