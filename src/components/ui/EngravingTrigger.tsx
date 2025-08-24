import { Button } from '@/components/ui/button';
import { Edit3 } from 'lucide-react';

interface EngravingTriggerProps {
  currentText?: string;
  onClick: () => void;
}

export function EngravingTrigger({ currentText, onClick }: EngravingTriggerProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="w-full flex items-center gap-2 justify-center py-3 border-dashed border-2 hover:border-solid hover:bg-blue-50 transition-all duration-200"
    >
      <Edit3 className="w-4 h-4 text-blue-600" />
      {currentText ? (
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium">✨ Engraving Added</span>
          <span className="text-xs text-gray-600">"{currentText}"</span>
        </div>
      ) : (
        <span className="font-medium">✨ Personalize with Engraving</span>
      )}
    </Button>
  );
}