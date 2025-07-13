import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CodeEditor from "@/components/code-editor";
import FileExplorer from "@/components/file-explorer";
import TabBar from "@/components/tab-bar";
import StatusBar from "@/components/status-bar";
import SettingsModal from "@/components/settings-modal";
import ErrorModal from "@/components/error-modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, FolderOpen, Save, Settings } from "lucide-react";
import { useEditor } from "@/hooks/use-editor";
import type { File } from "@shared/schema";

export default function Editor() {
  const [showSettings, setShowSettings] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const {
    openTabs,
    activeTabId,
    currentFile,
    isModified,
    cursorPosition,
    selectedLanguage,
    handleNewFile,
    handleOpenFile,
    handleSaveFile,
    handleFileSelect,
    handleTabClose,
    handleLanguageChange,
    handleContentChange,
  } = useEditor({
    onError: (message) => {
      setErrorMessage(message);
      setShowError(true);
    }
  });

  const { data: files = [] } = useQuery<File[]>({
    queryKey: ["/api/files"],
  });

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const extension = file.name.split('.').pop() || '';
        const language = getLanguageFromExtension(extension);
        
        handleOpenFile({
          name: file.name,
          content,
          language,
          path: `/${file.name}`
        });
      };
      reader.readAsText(file);
    }
    // Reset input
    event.target.value = '';
  };

  const getLanguageFromExtension = (ext: string): string => {
    const languageMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'javascript',
      ts: 'javascript',
      tsx: 'javascript',
      py: 'python',
      html: 'html',
      htm: 'html',
      css: 'css',
      scss: 'css',
      less: 'css',
      json: 'json',
      md: 'markdown',
      xml: 'xml',
      sql: 'sql',
    };
    return languageMap[ext] || 'javascript';
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-6">
            <h1 className="text-xl font-semibold text-gray-900">CodeMirror Emacs Editor</h1>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewFile}
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                New
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('file-input')?.click()}
                className="text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                <FolderOpen className="w-4 h-4 mr-2" />
                Open
              </Button>
              
              <Button
                size="sm"
                onClick={handleSaveFile}
                disabled={!currentFile || !isModified}
                className="bg-primary text-white hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="language-select" className="text-sm font-medium text-gray-700">
                Language:
              </label>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                  <SelectItem value="sql">SQL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarVisible && (
          <FileExplorer
            files={files}
            onFileSelect={handleFileSelect}
            selectedFileId={activeTabId}
          />
        )}

        {/* Editor Area */}
        <main className="flex-1 flex flex-col">
          {openTabs.length > 0 && (
            <TabBar
              tabs={openTabs}
              activeTabId={activeTabId}
              onTabSelect={handleFileSelect}
              onTabClose={handleTabClose}
            />
          )}

          <div className="flex-1">
            {currentFile ? (
              <CodeEditor
                file={currentFile}
                language={selectedLanguage}
                onChange={handleContentChange}
                onCursorPositionChange={(line, col) => {
                  // This will be handled by the editor hook
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">No file open</p>
                  <p className="text-sm">Create a new file or open an existing one to start editing</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Status Bar */}
      <StatusBar
        currentFile={currentFile?.name || ""}
        isModified={isModified}
        cursorPosition={cursorPosition}
        language={selectedLanguage}
        emacsMode={true}
      />

      {/* Modals */}
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
      <ErrorModal 
        open={showError} 
        onClose={() => setShowError(false)}
        message={errorMessage}
      />

      {/* Hidden file input */}
      <input
        id="file-input"
        type="file"
        className="hidden"
        accept=".js,.jsx,.ts,.tsx,.py,.html,.htm,.css,.scss,.less,.json,.md,.xml,.sql,.txt"
        onChange={handleFileInput}
      />
    </div>
  );
}
