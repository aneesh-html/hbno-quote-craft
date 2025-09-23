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
  MapPin,
  Trash2
} from "lucide-react";
import { Customer } from "../CreateQuote";
import { LineItem } from "./ProductSelection";

interface CostsAndShippingProps {
  lineItems: LineItem[];
  customer: Customer | null;
  onShippingSelect?: (shipping: { name: string; cost: number; days: string } | null) => void;
  selectedShipping?: { name: string; cost: number; days: string } | null;
  onRemoveLineItem?: (itemId: string) => void;
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

export function CostsAndShipping({ lineItems, customer, onShippingSelect, selectedShipping, onRemoveLineItem }: CostsAndShippingProps) {
  const [internalSelectedShipping, setInternalSelectedShipping] = useState<string | null>(null);
  const [customShippingCost, setCustomShippingCost] = useState<string>("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [shippingMarkup, setShippingMarkup] = useState<number>(15); // Default 15% markup
  const [netSuitePricing, setNetSuitePricing] = useState<boolean>(false);

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
    const shippingMarkupMultiplier = 1 + (shippingMarkup / 100);
    const adjustedShippingCost = baseShippingCost * shippingMarkupMultiplier;
    const isOnlineWebsitePricing = customer.snapshot?.priceTier === 'Website';
    
    const options = [
      {
        id: "will-call",
        carrier: "Will Call",
        service: "Pickup",
        days: "Same Day",
        cost: 0
      },
      {
        id: "ups-ground",
        carrier: "UPS",
        service: "Ground",
        days: "5-7 Days",
        cost: isOnlineWebsitePricing ? 0 : adjustedShippingCost
      },
      {
        id: "fedex-2day",
        carrier: "FedEx",
        service: "2-Day Air",
        days: "2 Days",
        cost: adjustedShippingCost * 1.8
      },
      {
        id: "fedex-overnight",
        carrier: "FedEx",
        service: "Overnight",
        days: "1 Day",
        cost: adjustedShippingCost * 3.2
      }
    ];

    // Add freight option for heavy shipments (over 150kg)
    if (totalWeight > 150) {
      options.push({
        id: "xpo-freight",
        carrier: "XPO Logistics",
        service: "Freight",
        days: "7-10 Days",
        cost: Math.max(300, totalWeight * 3.5) * shippingMarkupMultiplier
      });
      
      options.push({
        id: "xpo-freight-liftgate",
        carrier: "XPO Logistics",
        service: "Freight + Lift Gate",
        days: "7-10 Days",
        cost: Math.max(350, totalWeight * 3.5 + 75) * shippingMarkupMultiplier
      });
    }
    
    return options;
  }, [customer, totalWeight, shippingMarkup]);

  // Mock NetSuite pricing integration
  const fetchNetSuitePricing = async () => {
    setNetSuitePricing(true);
    // Mock API call delay
    setTimeout(() => {
      setNetSuitePricing(false);
      alert("Pricing updated from NetSuite! In a real implementation, this would pull live pricing data from NetSuite.");
    }, 2000);
  };

  // Calculate shipping cost
  const shippingCost = useMemo(() => {
    if (internalSelectedShipping === "custom") {
      return parseFloat(customShippingCost) || 0;
    }
    
    const selectedOption = shippingOptions.find(option => option.id === internalSelectedShipping);
    return selectedOption ? selectedOption.cost : 0;
  }, [internalSelectedShipping, customShippingCost, shippingOptions]);

  // Handle custom shipping cost change
  const handleCustomShippingChange = (value: string) => {
    setCustomShippingCost(value);
    if (internalSelectedShipping === "custom") {
      onShippingSelect?.({
        name: "Custom Rate",
        cost: parseFloat(value) || 0,
        days: "Custom"
      });
    }
  };
  const handleShippingSelect = (optionId: string) => {
    setInternalSelectedShipping(optionId);
    
    if (optionId === "custom") {
      onShippingSelect?.({
        name: "Custom Rate",
        cost: parseFloat(customShippingCost) || 0,
        days: "Custom"
      });
    } else {
      const option = shippingOptions.find(opt => opt.id === optionId);
      if (option) {
        onShippingSelect?.({
          name: `${option.carrier} ${option.service}`,
          cost: option.cost,
          days: option.days
        });
      }
    }
  };

  // Calculate discount amount
  const discountAmount = useMemo(() => {
    return subtotal * (appliedDiscount / 100);
  }, [subtotal, appliedDiscount]);

  // Auto-calculate tax based on NetSuite resale permit validation
  const resalePermitData = customer?.snapshot?.resaleCertificate || false;
  const resalePermitValidated = customer?.snapshot?.resalePermitValidated || false;
  const resalePermitExpiry = customer?.snapshot?.resalePermitExpiry;
  
  // Check if resale permit is valid and not expired
  const hasValidResaleCert = resalePermitData && resalePermitValidated && 
    (!resalePermitExpiry || new Date(resalePermitExpiry) > new Date());
  
  // Get tax rate based on customer state (auto-fed from NetSuite)
  const getStateTaxRate = (state: string) => {
    const stateTaxRates: { [key: string]: number } = {
      'CA': 0.085,  // California 8.5%
      'TX': 0.0625, // Texas 6.25%
      'NY': 0.08,   // New York 8%
      'FL': 0.06,   // Florida 6%
      'WA': 0.065,  // Washington 6.5%
      // Add more states as needed
    };
    return stateTaxRates[state] || 0.085; // Default to 8.5% if state not found
  };
  
  const taxRate = hasValidResaleCert ? 0 : getStateTaxRate(customer?.shipTo?.state || 'CA');
  const taxAmount = (subtotal - discountAmount) * taxRate;

  // Calculate final totals
  const finalSubtotal = subtotal - discountAmount;
  const customerTotal = finalSubtotal + taxAmount + shippingCost;
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
                  <div className="flex-1">
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-sm text-muted-foreground">
                      Batch: {item.batchId} • {item.quantity} {item.unit} @ ${item.pricePerUnit.toFixed(2)}/{item.unit}
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <div className="font-medium">${item.totalPrice.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">
                        Cost: ${itemLandedCost.toFixed(2)}
                      </div>
                    </div>
                    {onRemoveLineItem && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveLineItem(item.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
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
                    internalSelectedShipping === option.id 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleShippingSelect(option.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        internalSelectedShipping === option.id 
                          ? "border-primary bg-primary" 
                          : "border-muted-foreground"
                      }`} />
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {option.carrier} {option.service}
                          {option.cost === 0 && option.id !== "will-call" && (
                            <Badge variant="secondary" className="text-xs">FREE</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{option.days}</div>
                      </div>
                    </div>
                    <div className="text-lg font-semibold">
                      {option.cost === 0 ? "FREE" : `$${option.cost.toFixed(2)}`}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Custom shipping option */}
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  internalSelectedShipping === "custom" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => handleShippingSelect("custom")}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      internalSelectedShipping === "custom" 
                        ? "border-primary bg-primary" 
                        : "border-muted-foreground"
                    }`} />
                    <div>
                      <div className="font-medium">Custom Rate</div>
                      <div className="text-sm text-muted-foreground">Enter custom shipping amount</div>
                    </div>
                  </div>
                  {internalSelectedShipping === "custom" && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor="custom-shipping" className="sr-only">Custom shipping cost</Label>
                      <Input
                        id="custom-shipping"
                        type="number"
                        placeholder="0.00"
                        value={customShippingCost}
                        onChange={(e) => handleCustomShippingChange(e.target.value)}
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
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>Subtotal</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={fetchNetSuitePricing}
                      disabled={netSuitePricing}
                      className="h-6 px-2 text-xs"
                    >
                      {netSuitePricing ? "Updating..." : "Update from NetSuite"}
                    </Button>
                  </div>
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

                {!hasValidResaleCert && (
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span>Tax ({(taxRate * 100).toFixed(1)}%)</span>
                      <Badge variant="outline" className="text-xs">
                        {resalePermitData ? 
                          (resalePermitValidated ? "Expired Permit" : "Unvalidated Permit") : 
                          "No Resale Cert"
                        }
                      </Badge>
                    </div>
                    <span className="font-medium">${taxAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>Shipping Cost</span>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        value={shippingMarkup}
                        onChange={(e) => setShippingMarkup(parseFloat(e.target.value) || 0)}
                        className="w-12 h-6 text-xs text-center"
                      />
                      <span className="text-xs">% markup</span>
                    </div>
                  </div>
                  <span className="font-medium">${shippingCost.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span>Customer Total</span>
                  <span className="font-semibold text-lg">${customerTotal.toFixed(2)}</span>
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