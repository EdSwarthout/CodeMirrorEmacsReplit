import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { File } from "@shared/schema";

interface TabBarProps {
  tabs: File[];
  activeTabId: number | null;
  onTabSelect: (file: File) => void;
  onTabClose: (fileId: number) => void;
}

export default function TabBar({ tabs, activeTabId, onTabSelect, onTabClose }: TabBarProps) {
  return (
    <div className="flex items-center bg-gray-100 border-b border-gray-200 px-4 overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            "flex items-center border border-gray-200 border-b-0 px-3 py-2 text-sm font-medium rounded-t-md mr-1 cursor-pointer min-w-0",
            activeTabId === tab.id
              ? "bg-white text-gray-900"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          )}
          onClick={() => onTabSelect(tab)}
        >
          <span className="truncate max-w-32">{tab.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
