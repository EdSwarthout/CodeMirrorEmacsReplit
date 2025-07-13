interface StatusBarProps {
  currentFile: string;
  isModified: boolean;
  cursorPosition: { line: number; column: number };
  language: string;
  emacsMode: boolean;
}

export default function StatusBar({ 
  currentFile, 
  isModified, 
  cursorPosition, 
  language, 
  emacsMode 
}: StatusBarProps) {
  return (
    <footer className="bg-primary text-white px-4 py-2 text-xs font-medium">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <span>{currentFile}</span>
          {isModified && <span className="text-amber-200">● Modified</span>}
          {emacsMode && <span className="text-green-200">Emacs</span>}
        </div>
        
        <div className="flex items-center space-x-6">
          <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
          <span>{language.charAt(0).toUpperCase() + language.slice(1)}</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
      </div>
    </footer>
  );
}
