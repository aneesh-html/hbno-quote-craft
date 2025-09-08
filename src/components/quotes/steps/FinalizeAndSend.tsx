import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Award, 
  FlaskConical, 
  Camera, 
  CheckCircle, 
  AlertTriangle,
  Send,
  Clock
} from "lucide-react";
import { Customer } from "../CreateQuote";
import { LineItem } from "./ProductSelection";
import { QuotePreviewDialog } from "../QuotePreviewDialog";
import { QuoteLinkGenerator } from "../QuoteLinkGenerator";
import { PaymentOptions } from "../PaymentOptions";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useState } from "react";

interface FinalizeAndSendProps {
  customer: Customer | null;
  lineItems: LineItem[];
  selectedShipping: {
    name: string;
    cost: number;
    days: string;
  } | null;
}

export function FinalizeAndSend({ customer, lineItems, selectedShipping }: FinalizeAndSendProps) {
  const [showPreview, setShowPreview] = useState(false);
  const { formatPrice } = useCurrency();
  
  if (!customer || lineItems.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Complete Previous Steps</h3>
        <p className="text-muted-foreground">Please complete customer selection and product selection to continue.</p>
      </Card>
    );
  }

  // Calculate totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalProductCost = lineItems.reduce((sum, item) => sum + (item.totalPrice * 0.65), 0); // Using same 65% multiplier as CostsAndShipping
  const shippingCost = selectedShipping?.cost || 0;
  const grossProfit = subtotal - totalProductCost - shippingCost;
  const grossMargin = subtotal > 0 ? (grossProfit / subtotal) * 100 : 0;

  // Determine if approval is needed (margin below 25%)
  const needsApproval = grossMargin < 25;
  
  // Get unique compliance certifications from line items
  const allCompliance = lineItems.flatMap(item => item.batch.certifications || []);
  const uniqueCompliance = [...new Set(allCompliance)];

  return (
    <div className="space-y-6">
      {/* Quote Summary Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold">Quote Summary</h3>
            <p className="text-muted-foreground">Review all details before generating the deal packet</p>
          </div>
          <Badge variant={grossMargin >= 25 ? "default" : "destructive"}>
            Margin: {grossMargin.toFixed(1)}%
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Info */}
          <div>
            <h4 className="font-medium mb-3">Customer Details</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">{customer.name}</span>
              </div>
              <div className="text-muted-foreground">
                {customer.billTo.company}<br/>
                {customer.billTo.address}<br/>
                {customer.billTo.city}, {customer.billTo.state} {customer.billTo.zipCode}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{customer.snapshot.priceTier}</Badge>
                <Badge 
                  variant="outline"
                  style={{ 
                    backgroundColor: `${customer.snapshot.creditStatus.color}20`,
                    borderColor: customer.snapshot.creditStatus.color,
                    color: customer.snapshot.creditStatus.color 
                  }}
                >
                  {customer.snapshot.creditStatus.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Order Totals */}
          <div>
            <h4 className="font-medium mb-3">Order Totals</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Product Cost:</span>
                <span>-{formatPrice(totalProductCost)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping ({selectedShipping?.name}):</span>
                <span>-{formatPrice(shippingCost)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-semibold">
                <span>Gross Profit:</span>
                <span className={grossProfit > 0 ? "text-green-600" : "text-red-600"}>
                  {formatPrice(grossProfit)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Products Summary */}
      <Card className="p-6">
        <h4 className="font-medium mb-4">Products ({lineItems.length} items)</h4>
        <div className="space-y-3">
          {lineItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <div className="font-medium">{item.productName}</div>
                <div className="text-sm text-muted-foreground">
                  Batch: {item.batchId} • {item.quantity} {item.unit} • Grade: {item.batch.qualityGrade}
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatPrice(item.totalPrice)}</div>
                <div className="text-sm text-muted-foreground">{formatPrice(item.pricePerUnit)}/{item.unit}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Deal Packet Contents */}
      <Card className="p-6">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Deal Packet Contents
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <div className="font-medium">Commercial Quote</div>
              <div className="text-sm text-muted-foreground">Professional quote with pricing and terms</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Camera className="w-5 h-5 text-blue-500" />
            <div>
              <div className="font-medium">Product Story Pages</div>
              <div className="text-sm text-muted-foreground">Marketing descriptions and imagery</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <FlaskConical className="w-5 h-5 text-purple-500" />
            <div>
              <div className="font-medium">CoA/GC-MS Reports</div>
              <div className="text-sm text-muted-foreground">Lab reports for batches: {lineItems.map(item => item.batchId).join(", ")}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Award className="w-5 h-5 text-amber-500" />
            <div>
              <div className="font-medium">Compliance Certificates</div>
              <div className="text-sm text-muted-foreground">
                {uniqueCompliance.length > 0 ? uniqueCompliance.join(", ") : "Standard compliance"}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment Options */}
      <PaymentOptions />

      {/* Margin Warning */}
      {needsApproval && (
        <Card className="p-4 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div>
              <div className="font-medium text-amber-800">Manager Approval Required</div>
              <div className="text-sm text-amber-700">
                Gross margin ({grossMargin.toFixed(1)}%) is below the 25% threshold and requires approval.
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="p-6">
        <div className="flex justify-center gap-4">
          <Button 
            size="lg" 
            className="px-8"
            onClick={() => setShowPreview(true)}
          >
            <Send className="w-5 h-5 mr-2" />
            Generate Deal Packet
          </Button>
          <Button 
            size="lg" 
            variant="secondary"
            className="px-8"
          >
            <Clock className="w-5 h-5 mr-2" />
            Send for Review
          </Button>
          <QuoteLinkGenerator 
            customer={customer}
            lineItems={lineItems}
            selectedShipping={selectedShipping}
          />
        </div>
        <div className="text-center mt-3">
          <p className="text-sm text-muted-foreground">
            Generate a PDF packet, send for review, or create a shareable quote link.
          </p>
        </div>
      </Card>

      {/* Quote Preview Dialog */}
      <QuotePreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        customer={customer}
        lineItems={lineItems}
        selectedShipping={selectedShipping}
      />
    </div>
  );
}