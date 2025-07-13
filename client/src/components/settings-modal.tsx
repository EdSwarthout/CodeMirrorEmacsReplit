import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { EditorSettings, InsertEditorSettings } from "@shared/schema";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { toast } = useToast();
  
  const { data: settings } = useQuery<EditorSettings>({
    queryKey: ["/api/settings"],
    enabled: open,
  });

  const [localSettings, setLocalSettings] = useState<InsertEditorSettings>({
    theme: "light",
    fontSize: 14,
    lineNumbers: true,
    wordWrap: false,
    emacsMode: true,
  });

  // Update local settings when data loads
  useState(() => {
    if (settings) {
      setLocalSettings({
        theme: settings.theme,
        fontSize: settings.fontSize,
        lineNumbers: settings.lineNumbers,
        wordWrap: settings.wordWrap,
        emacsMode: settings.emacsMode,
      });
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: InsertEditorSettings) => {
      const response = await apiRequest("POST", "/api/settings", newSettings);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: "Settings saved",
        description: "Your editor settings have been updated.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateSettingsMutation.mutate(localSettings);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Editor Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="theme" className="text-sm font-medium">
              Theme
            </Label>
            <Select
              value={localSettings.theme}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, theme: value })
              }
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="high-contrast">High Contrast</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="fontSize" className="text-sm font-medium">
              Font Size
            </Label>
            <Select
              value={localSettings.fontSize.toString()}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, fontSize: parseInt(value) })
              }
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12px</SelectItem>
                <SelectItem value="14">14px</SelectItem>
                <SelectItem value="16">16px</SelectItem>
                <SelectItem value="18">18px</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lineNumbers"
              checked={localSettings.lineNumbers}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, lineNumbers: !!checked })
              }
            />
            <Label htmlFor="lineNumbers" className="text-sm">
              Show line numbers
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wordWrap"
              checked={localSettings.wordWrap}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, wordWrap: !!checked })
              }
            />
            <Label htmlFor="wordWrap" className="text-sm">
              Word wrap
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emacsMode"
              checked={localSettings.emacsMode}
              onCheckedChange={(checked) =>
                setLocalSettings({ ...localSettings, emacsMode: !!checked })
              }
            />
            <Label htmlFor="emacsMode" className="text-sm">
              Enable Emacs keybindings
            </Label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={updateSettingsMutation.isPending}
          >
            {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
