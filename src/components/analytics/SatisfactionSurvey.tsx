import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Star, Send, MessageSquare } from "lucide-react";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { toast } from "sonner";

interface SatisfactionSurveyProps {
  isOpen: boolean;
  onClose: () => void;
  category?: 'quote_creation' | 'overall_experience' | 'feature_request';
  userId?: string;
}

export function SatisfactionSurvey({ 
  isOpen, 
  onClose, 
  category = 'overall_experience',
  userId = 'current_user' 
}: SatisfactionSurveyProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitSatisfactionScore } = useAnalytics();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      submitSatisfactionScore(userId, rating, feedback, category);
      toast.success("Thank you for your feedback!");
      
      // Reset form
      setRating(0);
      setHoveredRating(0);
      setFeedback("");
      onClose();
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryTitle = () => {
    switch (category) {
      case 'quote_creation':
        return 'Quote Creation Experience';
      case 'feature_request':
        return 'Feature Feedback';
      default:
        return 'Overall Experience';
    }
  };

  const getCategoryDescription = () => {
    switch (category) {
      case 'quote_creation':
        return 'How was your experience creating this quote?';
      case 'feature_request':
        return 'How can we improve QuoteHub for you?';
      default:
        return 'How would you rate your overall experience with QuoteHub?';
    }
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 1: return "Very Poor";
      case 2: return "Poor";
      case 3: return "Average";
      case 4: return "Good";
      case 5: return "Excellent";
      default: return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span>{getCategoryTitle()}</span>
          </DialogTitle>
          <DialogDescription>
            {getCategoryDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Rating *
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 rounded-md hover:bg-muted transition-colors"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            {(hoveredRating || rating) > 0 && (
              <Badge variant="outline" className="text-xs">
                {getRatingLabel(hoveredRating || rating)}
              </Badge>
            )}
          </div>

          {/* Feedback Text */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Additional Feedback (Optional)
            </label>
            <Textarea
              placeholder="Tell us more about your experience or suggest improvements..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Skip
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0}>
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Quick satisfaction trigger component
export function QuickSatisfactionTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 shadow-lg z-50"
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