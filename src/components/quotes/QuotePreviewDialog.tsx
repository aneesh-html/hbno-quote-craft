import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Download, Mail } from "lucide-react";
import { Customer } from "./CreateQuote";
import { LineItem } from "./steps/ProductSelection";

interface QuotePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  lineItems: LineItem[];
  selectedShipping: {
    name: string;
    cost: number;
    days: string;
  } | null;
}

export function QuotePreviewDialog({
  open,
  onOpenChange,
  customer,
  lineItems,
  selectedShipping
}: QuotePreviewDialogProps) {
  if (!customer || lineItems.length === 0) return null;

  const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingCost = selectedShipping?.cost || 0;
  const total = subtotal + shippingCost;

  const quoteNumber = `Q-${Date.now().toString().slice(-6)}`;
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quote Preview - {quoteNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Commercial Quote</h2>
              <p className="text-muted-foreground">Quote #{quoteNumber}</p>
              <p className="text-sm text-muted-foreground">
                Valid until: {validUntil.toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Your Company Name</div>
              <div className="text-sm text-muted-foreground">123 Business Street</div>
              <div className="text-sm text-muted-foreground">City, State 12345</div>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Bill To:</h3>
              <div className="space-y-1 text-sm">
                <div className="font-medium">{customer.name}</div>
                <div>{customer.billTo.company}</div>
                <div>{customer.billTo.address}</div>
                <div>{customer.billTo.city}, {customer.billTo.state} {customer.billTo.zipCode}</div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Ship To:</h3>
              <div className="space-y-1 text-sm">
                <div className="font-medium">{customer.name}</div>
                <div>{customer.shipTo.company}</div>
                <div>{customer.shipTo.address}</div>
                <div>{customer.shipTo.city}, {customer.shipTo.state} {customer.shipTo.zipCode}</div>
              </div>
            </Card>
          </div>

          {/* Line Items */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Products</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                <div>Product</div>
                <div>Batch ID</div>
                <div>Quantity</div>
                <div>Unit Price</div>
                <div className="text-right">Total</div>
              </div>
              {lineItems.map((item, index) => (
                <div key={index} className="grid grid-cols-5 gap-4 text-sm py-2">
                  <div>
                    <div className="font-medium">{item.productName}</div>
                    <div className="text-muted-foreground text-xs">
                      Grade: {item.batch.qualityGrade}
                    </div>
                  </div>
                  <div className="font-mono">{item.batchId}</div>
                  <div>{item.quantity} {item.unit}</div>
                  <div>${item.pricePerUnit.toFixed(2)}</div>
                  <div className="text-right font-medium">${item.totalPrice.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Totals */}
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({selectedShipping?.name}):</span>
                <span className="font-medium">${shippingCost.toLocaleString()}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Terms */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">Terms & Conditions</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Payment terms: Net 30 days</p>
              <p>• Prices are valid for 30 days from quote date</p>
              <p>• All products subject to availability</p>
              <p>• CoA and compliance certificates provided upon delivery</p>
              <p>• Minimum order quantities may apply</p>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button size="lg">
              <Mail className="w-4 h-4 mr-2" />
              Send to Customer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}