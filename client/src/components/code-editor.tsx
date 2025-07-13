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

  useEffect(() => {
    if (!editorRef.current) return;

    const view = setupEditor({
      parent: editorRef.current,
      doc: file.content,
      language,
      onChange,
      onCursorChange: onCursorPositionChange,
    });

    viewRef.current = view;
    setIsReady(true);

    return () => {
      view.destroy();
      viewRef.current = null;
      setIsReady(false);
    };
  }, [file.id, language, onChange, onCursorPositionChange]); // Add file.id to force re-mount on file change

  // Update content when file changes
  useEffect(() => {
    if (!viewRef.current || !isReady) return;
    
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

  // No need for separate language effect since we recreate editor on file change

  return (
    <div className="h-full w-full">
      <div ref={editorRef} className="h-full w-full" />
    </div>
  );
}
