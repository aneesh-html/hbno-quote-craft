import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Share, Copy, Link, Calendar, Eye, Download } from "lucide-react";
import { Customer } from "./CreateQuote";
import { LineItem } from "./steps/ProductSelection";

interface QuoteLinkGeneratorProps {
  customer: Customer | null;
  lineItems: LineItem[];
  selectedShipping: {
    name: string;
    cost: number;
    days: string;
  } | null;
}

export function QuoteLinkGenerator({ customer, lineItems, selectedShipping }: QuoteLinkGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expiryDays, setExpiryDays] = useState<number>(30);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateUniqueLink = async () => {
    setIsGenerating(true);
    
    // Simulate API call to generate unique quote link
    const quoteId = `Q-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    
    // In a real app, this would save the quote data to a database and return the link
    const link = `${window.location.origin}/quote/${quoteId}`;
    
    setTimeout(() => {
      setGeneratedLink(link);
      setIsGenerating(false);
      
      toast({
        title: "Quote Link Generated",
        description: "Your unique quote link has been created successfully.",
      });
    }, 1500);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      toast({
        title: "Link Copied",
        description: "Quote link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy link. Please select and copy manually.",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const shippingCost = selectedShipping?.cost || 0;
    return subtotal + shippingCost;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="px-8">
          <Link className="w-5 h-5 mr-2" />
          Generate Quote Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="w-5 h-5" />
            Generate Shareable Quote Link
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Quote Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Customer:</span>
                  <span>{customer?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Items:</span>
                  <span>{lineItems.length} products</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Value:</span>
                  <span className="font-semibold">${calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Link Settings */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expiry-days" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Link Expiry (Days)
              </Label>
              <Input
                id="expiry-days"
                type="number"
                min="1"
                max="365"
                value={expiryDays}
                onChange={(e) => setExpiryDays(parseInt(e.target.value) || 30)}
                placeholder="30"
              />
              <p className="text-xs text-muted-foreground">
                Link will expire on {new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>

            {/* Generate Button */}
            {!generatedLink && (
              <Button 
                onClick={generateUniqueLink} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Unique Link"}
              </Button>
            )}

            {/* Generated Link */}
            {generatedLink && (
              <div className="space-y-3">
                <Label className="text-sm font-medium">Generated Quote Link:</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={generatedLink}
                    className="font-mono text-sm"
                  />
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={copyToClipboard}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <Badge variant="outline" className="justify-center p-2">
                    <Eye className="w-3 h-3 mr-1" />
                    View Only
                  </Badge>
                  <Badge variant="outline" className="justify-center p-2">
                    <Download className="w-3 h-3 mr-1" />
                    PDF Download
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Recipients can view the quote and download a PDF copy. No account required.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}