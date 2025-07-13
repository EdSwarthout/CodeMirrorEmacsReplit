import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

export default function ErrorModal({ open, onClose, message }: ErrorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <DialogTitle className="text-lg font-medium text-gray-900">
                Error
              </DialogTitle>
              <p className="mt-2 text-sm text-gray-500">{message}</p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
