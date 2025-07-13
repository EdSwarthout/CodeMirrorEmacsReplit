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
  }, []);

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

  // Update language when it changes
  useEffect(() => {
    if (!viewRef.current || !isReady) return;
    
    // Language changes require a full re-setup
    const currentContent = viewRef.current.state.doc.toString();
    viewRef.current.destroy();
    
    const view = setupEditor({
      parent: editorRef.current!,
      doc: currentContent,
      language,
      onChange,
      onCursorChange: onCursorPositionChange,
    });
    
    viewRef.current = view;
  }, [language, onChange, onCursorPositionChange, isReady]);

  return (
    <div className="h-full w-full">
      <div ref={editorRef} className="h-full w-full" />
    </div>
  );
}
