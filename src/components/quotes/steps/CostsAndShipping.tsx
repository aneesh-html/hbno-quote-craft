import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Calculator, 
  Truck, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Package,
  MapPin
} from "lucide-react";
import { Customer } from "../CreateQuote";
import { LineItem } from "./ProductSelection";

interface CostsAndShippingProps {
  lineItems: LineItem[];
  customer: Customer | null;
}

interface ShippingOption {
  id: string;
  carrier: string;
  service: string;
  days: string;
  cost: number;
}

// Mock landed costs - in real app, this would come from NetSuite
const LANDED_COST_MULTIPLIER = 0.65; // Assumes landed cost is ~65% of selling price

export function CostsAndShipping({ lineItems, customer }: CostsAndShippingProps) {
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [customShippingCost, setCustomShippingCost] = useState<string>("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  // Calculate total weight for shipping
  const totalWeight = useMemo(() => {
    return lineItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [lineItems]);

  // Calculate subtotal
  const subtotal = useMemo(() => {
    return lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [lineItems]);

  // Calculate total landed cost
  const totalLandedCost = useMemo(() => {
    return lineItems.reduce((sum, item) => {
      return sum + (item.totalPrice * LANDED_COST_MULTIPLIER);
    }, 0);
  }, [lineItems]);

  // Mock shipping options based on customer location and weight
  const shippingOptions: ShippingOption[] = useMemo(() => {
    if (!customer || totalWeight === 0) return [];

    const baseShippingCost = Math.max(150, totalWeight * 8.5);
    
    return [
      {
        id: "ups-ground",
        carrier: "UPS",
        service: "Ground",
        days: "5-7 Days",
        cost: baseShippingCost
      },
      {
        id: "fedex-2day",
        carrier: "FedEx",
        service: "2-Day Air",
        days: "2 Days",
        cost: baseShippingCost * 1.8
      },
      {
        id: "fedex-overnight",
        carrier: "FedEx",
        service: "Overnight",
        days: "1 Day",
        cost: baseShippingCost * 3.2
      }
    ];
  }, [customer, totalWeight]);

  // Calculate shipping cost
  const shippingCost = useMemo(() => {
    if (selectedShipping === "custom") {
      return parseFloat(customShippingCost) || 0;
    }
    
    const selectedOption = shippingOptions.find(option => option.id === selectedShipping);
    return selectedOption ? selectedOption.cost : 0;
  }, [selectedShipping, customShippingCost, shippingOptions]);

  // Calculate discount amount
  const discountAmount = useMemo(() => {
    return subtotal * (appliedDiscount / 100);
  }, [subtotal, appliedDiscount]);

  // Calculate final totals
  const finalSubtotal = subtotal - discountAmount;
  const grossProfit = finalSubtotal - totalLandedCost - shippingCost;
  const grossMargin = finalSubtotal > 0 ? (grossProfit / finalSubtotal) * 100 : 0;

  // Determine deal health status
  const getDealHealthStatus = () => {
    if (grossMargin >= 35) {
      return { status: "excellent", color: "text-green-600", icon: CheckCircle, label: "Excellent" };
    } else if (grossMargin >= 25) {
      return { status: "good", color: "text-blue-600", icon: TrendingUp, label: "Good" };
    } else if (grossMargin >= 15) {
      return { status: "warning", color: "text-yellow-600", icon: AlertTriangle, label: "Review" };
    } else {
      return { status: "poor", color: "text-red-600", icon: AlertTriangle, label: "Poor" };
    }
  };

  const dealHealth = getDealHealthStatus();
  const StatusIcon = dealHealth.icon;

  if (lineItems.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No Products Selected</h3>
        <p className="text-muted-foreground">Go back to Step 2 to add products before calculating costs and shipping.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lineItems.map((item) => {
              const itemLandedCost = item.totalPrice * LANDED_COST_MULTIPLIER;
              return (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-border/50">
                  <div>
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-muted-foreground">
                      Batch: {item.batchId} • {item.quantity} {item.unit} @ ${item.pricePerUnit.toFixed(2)}/{item.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${item.totalPrice.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">
                      Cost: ${itemLandedCost.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="pt-2">
              <div className="flex justify-between text-sm">
                <span>Total Weight:</span>
                <span className="font-medium">{totalWeight} kg</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Options */}
      {customer && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Shipping Options
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              Shipping to: {customer.shipTo.city}, {customer.shipTo.state}, {customer.shipTo.country}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shippingOptions.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedShipping === option.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedShipping(option.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedShipping === option.id 
                          ? "border-primary bg-primary" 
                          : "border-muted-foreground"
                      }`} />
                      <div>
                        <div className="font-medium">{option.carrier} {option.service}</div>
                        <div className="text-sm text-muted-foreground">{option.days}</div>
                      </div>
                    </div>
                    <div className="text-lg font-semibold">${option.cost.toFixed(2)}</div>
                  </div>
                </div>
              ))}
              
              {/* Custom shipping option */}
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedShipping === "custom" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedShipping("custom")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedShipping === "custom" 
                        ? "border-primary bg-primary" 
                        : "border-muted-foreground"
                    }`} />
                    <div>
                      <div className="font-medium">Custom Rate</div>
                      <div className="text-sm text-muted-foreground">Enter custom shipping amount</div>
                    </div>
                  </div>
                  {selectedShipping === "custom" && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="custom-shipping" className="sr-only">Custom shipping cost</Label>
                      <Input
                        id="custom-shipping"
                        type="number"
                        placeholder="0.00"
                        value={customShippingCost}
                        onChange={(e) => setCustomShippingCost(e.target.value)}
                        className="w-24 text-right"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Deal Health & Profitability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Totals & Profitability
            <Badge variant="outline" className="ml-2 text-xs">Internal View Only</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time profitability analysis - this information is not shown to customers
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Breakdown */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Cost Breakdown</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>Discount</span>
                    <Input
                      type="number"
                      min="0"
                      max="50"
                      value={appliedDiscount}
                      onChange={(e) => setAppliedDiscount(parseFloat(e.target.value) || 0)}
                      className="w-16 h-6 text-xs text-center"
                    />
                    <span className="text-sm">%</span>
                  </div>
                  <span className="font-medium text-red-600">-${discountAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span className="font-medium text-red-600">-${shippingCost.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span>Customer Total</span>
                  <span className="font-semibold text-lg">${(finalSubtotal + shippingCost).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Total Product Cost (Landed)</span>
                  <span>-${totalLandedCost.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Deal Health Meter */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Deal Health</h4>
              
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <StatusIcon className={`w-6 h-6 ${dealHealth.color}`} />
                  <div>
                    <div className="font-semibold">Gross Profit</div>
                    <div className="text-2xl font-bold">${grossProfit.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Gross Margin</div>
                    <div className={`text-xl font-bold ${dealHealth.color}`}>
                      {grossMargin.toFixed(1)}%
                    </div>
                  </div>
                  <Badge 
                    variant={dealHealth.status === "excellent" ? "default" : "secondary"}
                    className={dealHealth.color}
                  >
                    {dealHealth.label}
                  </Badge>
                </div>

                <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Target Margin:</span>
                    <span>25-35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum Margin:</span>
                    <span>15%</span>
                  </div>
                </div>
              </div>

              {grossMargin < 15 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">Low Margin Warning</span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Consider reducing discount or reviewing product pricing
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}