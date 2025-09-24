import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Crown, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle,
  Lock,
  Unlock,
  DollarSign
} from "lucide-react";
import { Customer } from "./CreateQuote";

interface CeoMarginOverrideProps {
  customer: Customer | null;
  originalMargin: number;
  originalLandedCostMultiplier: number;
  originalShippingMarkup: number;
  onOverrideChange?: (overrides: MarginOverrides) => void;
}

export interface MarginOverrides {
  enabled: boolean;
  customMargin?: number;
  landedCostMultiplier?: number;
  shippingMarkup?: number;
  reason?: string;
  applyToCustomer?: boolean;
}

export function CeoMarginOverride({ 
  customer, 
  originalMargin, 
  originalLandedCostMultiplier, 
  originalShippingMarkup,
  onOverrideChange 
}: CeoMarginOverrideProps) {
  const [overrideEnabled, setOverrideEnabled] = useState(false);
  const [customMargin, setCustomMargin] = useState<string>("");
  const [landedCostMultiplier, setLandedCostMultiplier] = useState<string>((originalLandedCostMultiplier * 100).toString());
  const [shippingMarkup, setShippingMarkup] = useState<string>(originalShippingMarkup.toString());
  const [reason, setReason] = useState<string>("");
  const [applyToCustomer, setApplyToCustomer] = useState(false);

  const handleOverrideToggle = (enabled: boolean) => {
    setOverrideEnabled(enabled);
    
    if (!enabled) {
      // Reset all values when disabling
      setCustomMargin("");
      setLandedCostMultiplier((originalLandedCostMultiplier * 100).toString());
      setShippingMarkup(originalShippingMarkup.toString());
      setReason("");
      setApplyToCustomer(false);
    }

    onOverrideChange?.({
      enabled,
      customMargin: enabled && customMargin ? parseFloat(customMargin) : undefined,
      landedCostMultiplier: enabled ? parseFloat(landedCostMultiplier) / 100 : originalLandedCostMultiplier,
      shippingMarkup: enabled ? parseFloat(shippingMarkup) : originalShippingMarkup,
      reason: enabled ? reason : undefined,
      applyToCustomer: enabled ? applyToCustomer : false
    });
  };

  const handleValueChange = (field: string, value: string) => {
    switch (field) {
      case 'margin':
        setCustomMargin(value);
        break;
      case 'landedCost':
        setLandedCostMultiplier(value);
        break;
      case 'shipping':
        setShippingMarkup(value);
        break;
      case 'reason':
        setReason(value);
        break;
    }

    if (overrideEnabled) {
      onOverrideChange?.({
        enabled: true,
        customMargin: field === 'margin' && value ? parseFloat(value) : (customMargin ? parseFloat(customMargin) : undefined),
        landedCostMultiplier: (field === 'landedCost' ? parseFloat(value) : parseFloat(landedCostMultiplier)) / 100,
        shippingMarkup: field === 'shipping' ? parseFloat(value) : parseFloat(shippingMarkup),
        reason: field === 'reason' ? value : reason,
        applyToCustomer
      });
    }
  };

  const handleApplyToCustomerChange = (checked: boolean) => {
    setApplyToCustomer(checked);
    if (overrideEnabled) {
      onOverrideChange?.({
        enabled: true,
        customMargin: customMargin ? parseFloat(customMargin) : undefined,
        landedCostMultiplier: parseFloat(landedCostMultiplier) / 100,
        shippingMarkup: parseFloat(shippingMarkup),
        reason,
        applyToCustomer: checked
      });
    }
  };

  const getMarginImpact = () => {
    const targetMargin = customMargin ? parseFloat(customMargin) : originalMargin;
    const difference = targetMargin - originalMargin;
    
    if (Math.abs(difference) < 0.1) return null;
    
    return {
      difference,
      isIncrease: difference > 0,
      percentage: Math.abs(difference)
    };
  };

  const marginImpact = getMarginImpact();

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-600" />
            <span className="text-amber-800">CEO Margin Override</span>
          </div>
          <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
            Executive Control
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Override Toggle */}
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200">
          <div className="flex items-center gap-2">
            {overrideEnabled ? (
              <Unlock className="w-4 h-4 text-green-600" />
            ) : (
              <Lock className="w-4 h-4 text-amber-600" />
            )}
            <span className="font-medium">
              {overrideEnabled ? "Override Active" : "Enable Override"}
            </span>
          </div>
          <Switch
            checked={overrideEnabled}
            onCheckedChange={handleOverrideToggle}
          />
        </div>

        {overrideEnabled && (
          <div className="space-y-4">
            {/* Current Metrics Display */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-white rounded-lg border border-amber-200">
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Current Margin</div>
                <div className="font-semibold text-amber-700">{originalMargin.toFixed(1)}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Landed Cost</div>
                <div className="font-semibold">{(originalLandedCostMultiplier * 100).toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">Ship Markup</div>
                <div className="font-semibold">{originalShippingMarkup.toFixed(0)}%</div>
              </div>
            </div>

            {/* Override Controls */}
            <div className="space-y-3">
              {/* Target Margin */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="target-margin" className="text-sm font-medium">Target Margin (%)</Label>
                  <Input
                    id="target-margin"
                    type="number"
                    placeholder={originalMargin.toFixed(1)}
                    value={customMargin}
                    onChange={(e) => handleValueChange('margin', e.target.value)}
                    className="bg-white"
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </div>
                
                {/* Landed Cost Percentage */}
                <div>
                  <Label htmlFor="landed-cost" className="text-sm font-medium">Landed Cost (%)</Label>
                  <Input
                    id="landed-cost"
                    type="number"
                    value={landedCostMultiplier}
                    onChange={(e) => handleValueChange('landedCost', e.target.value)}
                    className="bg-white"
                    step="1"
                    min="30"
                    max="90"
                  />
                </div>
              </div>

              {/* Shipping Markup */}
              <div>
                <Label htmlFor="shipping-markup" className="text-sm font-medium">Shipping Markup (%)</Label>
                <Input
                  id="shipping-markup"
                  type="number"
                  value={shippingMarkup}
                  onChange={(e) => handleValueChange('shipping', e.target.value)}
                  className="bg-white"
                  step="1"
                  min="0"
                  max="50"
                />
              </div>

              {/* Margin Impact Display */}
              {marginImpact && (
                <div className={`p-3 rounded-lg border ${
                  marginImpact.isIncrease 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {marginImpact.isIncrease ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      marginImpact.isIncrease ? 'text-green-700' : 'text-red-700'
                    }`}>
                      Margin {marginImpact.isIncrease ? 'increase' : 'decrease'} of {marginImpact.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              <Separator />

              {/* Reason for Override */}
              <div>
                <Label htmlFor="override-reason" className="text-sm font-medium">Reason for Override</Label>
                <Input
                  id="override-reason"
                  placeholder="e.g., Strategic customer acquisition, volume discount, competitive pricing"
                  value={reason}
                  onChange={(e) => handleValueChange('reason', e.target.value)}
                  className="bg-white"
                />
              </div>

              {/* Apply to Customer */}
              {customer && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <div className="font-medium text-blue-900">Apply to All Future Quotes</div>
                    <div className="text-sm text-blue-700">
                      Save these settings for {customer.name} future quotes
                    </div>
                  </div>
                  <Switch
                    checked={applyToCustomer}
                    onCheckedChange={handleApplyToCustomerChange}
                  />
                </div>
              )}

              {/* Warning for Low Margins */}
              {customMargin && parseFloat(customMargin) < 15 && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-700">
                      Low Margin Warning: Consider business impact of {parseFloat(customMargin).toFixed(1)}% margin
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}