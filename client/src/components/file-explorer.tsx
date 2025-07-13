import { FileText, FileCode, FileImage, File as FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { File } from "@shared/schema";

interface FileExplorerProps {
  files: File[];
  onFileSelect: (file: File) => void;
  selectedFileId?: number;
}

export default function FileExplorer({ files, onFileSelect, selectedFileId }: FileExplorerProps) {
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <FileCode className="w-4 h-4 file-icon-js" />;
      case 'css':
      case 'scss':
      case 'less':
        return <FileCode className="w-4 h-4 file-icon-css" />;
      case 'html':
      case 'htm':
        return <FileCode className="w-4 h-4 file-icon-html" />;
      case 'md':
      case 'markdown':
        return <FileText className="w-4 h-4 file-icon-md" />;
      case 'py':
        return <FileCode className="w-4 h-4 file-icon-py" />;
      case 'json':
        return <FileCode className="w-4 h-4 file-icon-json" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <FileImage className="w-4 h-4 file-icon-default" />;
      default:
        return <FileIcon className="w-4 h-4 file-icon-default" />;
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Explorer
        </h3>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-2">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => onFileSelect(file)}
              className={cn(
                "flex items-center px-2 py-1.5 text-sm text-gray-700 rounded hover:bg-gray-100 cursor-pointer transition-colors",
                selectedFileId === file.id && "bg-blue-50 text-blue-700"
              )}
            >
              {getFileIcon(file.name)}
              <span className="ml-2 truncate">{file.name}</span>
            </div>
          ))}
          
          {files.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <FileIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No files yet</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
