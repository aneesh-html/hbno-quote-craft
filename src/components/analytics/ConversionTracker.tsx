import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, DollarSign, Calendar, Target } from "lucide-react";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { toast } from "sonner";

export function ConversionTracker() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState("");
  const { analytics, markQuoteConverted } = useAnalytics();

  const pendingQuotes = analytics.quotes.filter(
    q => q.status === 'completed' && !q.convertedToOrder
  );

  const handleMarkConverted = (quoteId: string) => {
    markQuoteConverted(quoteId);
    toast.success("Quote marked as converted to order!");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Quote Conversions</h3>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Target className="w-4 h-4 mr-2" />
              Mark Conversion
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mark Quote as Converted</DialogTitle>
              <DialogDescription>
                Select a quote that has been converted to an order
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="max-h-60 overflow-y-auto space-y-2">
                {pendingQuotes.map(quote => (
                  <div
                    key={quote.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedQuoteId === quote.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedQuoteId(quote.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Quote #{quote.id.slice(-8)}</div>
                        <div className="text-xs text-muted-foreground">
                          {quote.lineItemsCount} items • ${quote.totalValue || 0}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(quote.endTime || 0).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {pendingQuotes.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>All quotes have been processed!</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    if (selectedQuoteId) {
                      handleMarkConverted(selectedQuoteId);
                      setSelectedQuoteId("");
                      setIsOpen(false);
                    }
                  }}
                  disabled={!selectedQuoteId}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Converted
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {pendingQuotes.slice(0, 5).map(quote => (
          <div key={quote.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium">Quote #{quote.id.slice(-8)}</div>
                <div className="text-xs text-muted-foreground">
                  {quote.lineItemsCount} items • ${quote.totalValue || 0}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Pending
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMarkConverted(quote.id)}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Convert
              </Button>
            </div>
          </div>
        ))}
        
        {pendingQuotes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No pending quotes to convert</p>
          </div>
        )}
      </div>
    </Card>
  );
}