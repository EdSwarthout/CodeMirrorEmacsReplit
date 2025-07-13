import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { File, InsertFile } from "@shared/schema";

interface UseEditorOptions {
  onError: (message: string) => void;
}

export function useEditor({ onError }: UseEditorOptions) {
  const [openTabs, setOpenTabs] = useState<File[]>([]);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [modifiedFiles, setModifiedFiles] = useState<Set<number>>(new Set());
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  const currentFile = openTabs.find(tab => tab.id === activeTabId);
  const isModified = activeTabId ? modifiedFiles.has(activeTabId) : false;

  const createFileMutation = useMutation({
    mutationFn: async (fileData: InsertFile) => {
      const response = await apiRequest("POST", "/api/files", fileData);
      return response.json();
    },
    onSuccess: (newFile: File) => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      handleFileSelect(newFile);
    },
    onError: () => {
      onError("Failed to create new file. Please try again.");
    },
  });

  const updateFileMutation = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const response = await apiRequest("PATCH", `/api/files/${id}`, { content });
      return response.json();
    },
    onSuccess: (updatedFile: File) => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      // Remove from modified files after successful save
      setModifiedFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(updatedFile.id);
        return newSet;
      });
      
      // Update the tab content
      setOpenTabs(prev => 
        prev.map(tab => 
          tab.id === updatedFile.id ? updatedFile : tab
        )
      );
    },
    onError: () => {
      onError("Failed to save file. Please check file permissions and try again.");
    },
  });

  const handleNewFile = useCallback(() => {
    let counter = 1;
    let fileName = `untitled-${counter}.js`;
    
    // Find a unique filename
    while (openTabs.some(tab => tab.name === fileName)) {
      counter++;
      fileName = `untitled-${counter}.js`;
    }
    
    const newFileData: InsertFile = {
      name: fileName,
      content: "",
      language: "javascript",
      path: `/${fileName}`,
    };
    
    createFileMutation.mutate(newFileData);
  }, [openTabs, createFileMutation]);

  const handleOpenFile = useCallback((fileData: InsertFile) => {
    createFileMutation.mutate(fileData);
  }, [createFileMutation]);

  const handleSaveFile = useCallback(() => {
    if (!currentFile) return;
    
    updateFileMutation.mutate({
      id: currentFile.id,
      content: currentFile.content,
    });
  }, [currentFile, updateFileMutation]);

  const handleFileSelect = useCallback((file: File) => {
    // Add to open tabs if not already open
    setOpenTabs(prev => {
      const isAlreadyOpen = prev.some(tab => tab.id === file.id);
      if (!isAlreadyOpen) {
        return [...prev, file];
      }
      return prev;
    });
    
    // Set as active tab
    setActiveTabId(file.id);
    setSelectedLanguage(file.language);
  }, []);

  const handleTabClose = useCallback((fileId: number) => {
    setOpenTabs(prev => prev.filter(tab => tab.id !== fileId));
    setModifiedFiles(prev => {
      const newSet = new Set(prev);
      newSet.delete(fileId);
      return newSet;
    });
    
    // If closing active tab, switch to another tab or none
    if (activeTabId === fileId) {
      const remainingTabs = openTabs.filter(tab => tab.id !== fileId);
      if (remainingTabs.length > 0) {
        const newActiveTab = remainingTabs[remainingTabs.length - 1];
        setActiveTabId(newActiveTab.id);
        setSelectedLanguage(newActiveTab.language);
      } else {
        setActiveTabId(null);
      }
    }
  }, [openTabs, activeTabId]);

  const handleLanguageChange = useCallback((language: string) => {
    setSelectedLanguage(language);
  }, []);

  const handleContentChange = useCallback((content: string) => {
    if (!currentFile) return;
    
    // Update the content in the current tab
    setOpenTabs(prev =>
      prev.map(tab =>
        tab.id === currentFile.id ? { ...tab, content } : tab
      )
    );
    
    // Mark as modified if content changed
    if (content !== currentFile.content) {
      setModifiedFiles(prev => new Set([...prev, currentFile.id]));
    } else {
      setModifiedFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentFile.id);
        return newSet;
      });
    }
  }, [currentFile]);

  return {
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
    setCursorPosition,
  };
}
