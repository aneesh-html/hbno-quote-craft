import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { SatisfactionSurvey } from "./SatisfactionSurvey";

export function QuickSatisfactionTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 shadow-lg z-50 bg-background"
      >
        <Star className="w-4 h-4 mr-2" />
        Rate Experience
      </Button>
      
      <SatisfactionSurvey 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}