import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Package, Beaker, Calendar, Shield } from "lucide-react";
import type { Product, Batch } from "./ProductSelection";
import { useCurrency } from "@/contexts/CurrencyContext";
import { ManualPriceAdjustment } from "../ManualPriceAdjustment";

interface CostBreakdown {
  packagingCost: number;
  labourCost: number;
  flushOil: number;
  additionalCosts: number;
}

// Extend the Batch interface to include costBreakdown
interface ExtendedBatch extends Batch {
  costBreakdown?: CostBreakdown;
}

interface BatchCardProps {
  product: Product;
  batch: ExtendedBatch;
  onAddBatch: (product: Product, batch: Batch, quantity: number) => void;
}

export function BatchCard({ product, batch, onAddBatch }: BatchCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [adjustedPrice, setAdjustedPrice] = useState<number>(batch.pricePerKg);
  const { formatPrice } = useCurrency();

  const handleAdd = () => {
    if (quantity > 0 && quantity <= batch.inventory) {
      // Create a modified batch with adjusted price
      const modifiedBatch = { ...batch, pricePerKg: adjustedPrice };
      onAddBatch(product, modifiedBatch, quantity);
      setQuantity(1);
    }
  };

  const isLowStock = batch.inventory < 50;
  const estimatedTotal = quantity * adjustedPrice;

  return (
    <Card className={`transition-all ${batch.isRecommended ? 'ring-2 ring-primary/20 bg-primary/5' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {batch.id}
            </Badge>
            {batch.isRecommended && (
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Recommended
              </Badge>
            )}
            <Badge variant="secondary">{batch.qualityGrade}</Badge>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <div>
                <div className="font-semibold text-lg">{formatPrice(adjustedPrice)}</div>
                <div className="text-xs text-muted-foreground">per kg</div>
              </div>
              <ManualPriceAdjustment
                originalPrice={batch.pricePerKg}
                onPriceChange={setAdjustedPrice}
                productName={product.name}
                batchId={batch.id}
                unit={batch.unit}
              />
            </div>
            {adjustedPrice !== batch.pricePerKg && (
              <Badge variant="outline" className="text-xs mt-1">
                Adjusted
              </Badge>
            )}
          </div>
        </div>

        {batch.isRecommended && (
          <div className="mb-3 p-2 bg-primary/5 border border-primary/10 rounded-md">
            <p className="text-sm text-primary font-medium">⭐ {batch.recommendation}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{batch.origin}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className={isLowStock ? 'text-orange-600 font-medium' : ''}>
                {batch.inventory} {batch.unit} Available
              </span>
              {isLowStock && <Badge variant="destructive" className="text-xs">Low Stock</Badge>}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Beaker className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{batch.keySpec}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Harvested {new Date(batch.harvestDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Certifications:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {batch.certifications.map((cert) => (
              <Badge key={cert} variant="outline" className="text-xs">
                {cert}
              </Badge>
            ))}
          </div>
        </div>

        {/* Cost Breakdown (if available) */}
        {batch.costBreakdown && (
          <div className="mb-4 p-3 bg-muted/30 rounded-md">
            <div className="text-sm font-medium mb-2">Associated Costs (per kg):</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span>Packaging:</span>
                <span>{formatPrice(batch.costBreakdown.packagingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span>Labour:</span>
                <span>{formatPrice(batch.costBreakdown.labourCost)}</span>
              </div>
              {batch.costBreakdown.flushOil > 0 && (
                <div className="flex justify-between">
                  <span>Flush Oil:</span>
                  <span>{formatPrice(batch.costBreakdown.flushOil)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Additional:</span>
                <span>{formatPrice(batch.costBreakdown.additionalCosts)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Quantity Selection */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Qty:</label>
            <Input
              type="number"
              min="1"
              max={batch.inventory}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 text-center"
            />
            <span className="text-sm text-muted-foreground">{batch.unit}</span>
          </div>
          
          <div className="flex-1 text-right">
            <div className="text-sm text-muted-foreground">Total:</div>
            <div className="font-semibold">{formatPrice(estimatedTotal)}</div>
          </div>
          
          <Button 
            onClick={handleAdd}
            disabled={quantity > batch.inventory || quantity < 1}
            className="ml-2"
          >
            Add to Quote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}