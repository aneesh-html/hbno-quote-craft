import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Edit3, DollarSign, AlertTriangle } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Batch } from "./steps/ProductSelection";

interface ManualPriceAdjustmentProps {
  originalPrice: number;
  onPriceChange: (newPrice: number) => void;
  productName: string;
  batchId: string;
  unit: string;
}

export function ManualPriceAdjustment({ 
  originalPrice, 
  onPriceChange, 
  productName, 
  batchId, 
  unit 
}: ManualPriceAdjustmentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [adjustedPrice, setAdjustedPrice] = useState<string>(originalPrice.toString());
  const [reason, setReason] = useState<string>("");
  const { formatPrice, convertPrice } = useCurrency();

  const handleApplyAdjustment = () => {
    const newPrice = parseFloat(adjustedPrice);
    if (newPrice > 0) {
      onPriceChange(newPrice);
      setIsOpen(false);
    }
  };

  const priceChange = parseFloat(adjustedPrice) - originalPrice;
  const priceChangePercent = originalPrice > 0 ? (priceChange / originalPrice) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Edit3 className="w-3 h-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Adjust Price Manually
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Product:</span> {productName}</div>
                <div><span className="font-medium">Batch:</span> {batchId}</div>
                <div><span className="font-medium">Original Price:</span> {formatPrice(originalPrice)}/{unit}</div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="adjusted-price">New Price per {unit}</Label>
            <Input
              id="adjusted-price"
              type="number"
              step="0.01"
              min="0"
              value={adjustedPrice}
              onChange={(e) => setAdjustedPrice(e.target.value)}
              placeholder="Enter new price"
            />
          </div>

          {priceChange !== 0 && (
            <Card className={priceChange > 0 ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className={`w-4 h-4 ${priceChange > 0 ? "text-red-600" : "text-green-600"}`} />
                  <span className="font-medium">
                    Price {priceChange > 0 ? "Increase" : "Decrease"}:
                  </span>
                  <span className={priceChange > 0 ? "text-red-600" : "text-green-600"}>
                    {formatPrice(Math.abs(priceChange))} ({Math.abs(priceChangePercent).toFixed(1)}%)
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Adjustment (Optional)</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Customer negotiation, volume discount..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyAdjustment} disabled={!adjustedPrice || parseFloat(adjustedPrice) <= 0}>
              Apply Adjustment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}