import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Send, 
  Paperclip, 
  Mail, 
  User,
  Building,
  DollarSign,
  Package,
  Clock,
  FlaskConical
} from "lucide-react";
import { Customer } from "./CreateQuote";
import { LineItem } from "./steps/ProductSelection";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useToast } from "@/hooks/use-toast";

interface DealPacketEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer;
  lineItems: LineItem[];
  selectedShipping: {
    name: string;
    cost: number;
    days: string;
  } | null;
}

export function DealPacketEmailDialog({ 
  open, 
  onOpenChange, 
  customer, 
  lineItems, 
  selectedShipping 
}: DealPacketEmailDialogProps) {
  const { formatPrice } = useCurrency();
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [emailData, setEmailData] = useState({
    to: customer.email || "",
    cc: "",
    subject: `Quote for ${customer.name} - ${lineItems.length} Items`,
    body: generateEmailTemplate(customer, lineItems, selectedShipping, formatPrice),
    includeSample: false,
    includeFollowUp: false,
    followUpDays: 3
  });

  const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalWithShipping = subtotal + (selectedShipping?.cost || 0);

  const handleSend = async () => {
    setIsSending(true);
    
    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Deal Packet Sent Successfully!",
      description: `Email sent to ${emailData.to} with deal packet attached.`,
    });
    
    setIsSending(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send Deal Packet Email
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Email Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="to">To *</Label>
                <Input
                  id="to"
                  value={emailData.to}
                  onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                  placeholder="customer@email.com"
                />
              </div>
              <div>
                <Label htmlFor="cc">CC</Label>
                <Input
                  id="cc"
                  value={emailData.cc}
                  onChange={(e) => setEmailData({...emailData, cc: e.target.value})}
                  placeholder="manager@company.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="body">Email Message</Label>
              <Textarea
                id="body"
                value={emailData.body}
                onChange={(e) => setEmailData({...emailData, body: e.target.value})}
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            {/* Additional Options */}
            <Card className="p-4">
              <h4 className="font-medium mb-3">Additional Options</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sample"
                    checked={emailData.includeSample}
                    onCheckedChange={(checked) => 
                      setEmailData({...emailData, includeSample: checked as boolean})
                    }
                  />
                  <Label htmlFor="sample">Include sample request note</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="followUp"
                    checked={emailData.includeFollowUp}
                    onCheckedChange={(checked) => 
                      setEmailData({...emailData, includeFollowUp: checked as boolean})
                    }
                  />
                  <Label htmlFor="followUp">Schedule follow-up reminder</Label>
                  {emailData.includeFollowUp && (
                    <Input
                      type="number"
                      value={emailData.followUpDays}
                      onChange={(e) => setEmailData({...emailData, followUpDays: parseInt(e.target.value)})}
                      className="w-16 ml-2"
                      min="1"
                      max="30"
                    />
                  )}
                  {emailData.includeFollowUp && <span className="text-sm text-muted-foreground">days</span>}
                </div>
              </div>
            </Card>
          </div>

          {/* Quote Summary */}
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer
              </h4>
              <div className="text-sm space-y-1">
                <div className="font-medium">{customer.name}</div>
                <div className="text-muted-foreground">{customer.billTo.company}</div>
                <div className="text-muted-foreground">{emailData.to}</div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Items ({lineItems.length})
              </h4>
              <div className="space-y-2 text-sm">
                {lineItems.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="truncate">{item.productName}</span>
                    <span>{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
                {lineItems.length > 3 && (
                  <div className="text-muted-foreground">
                    +{lineItems.length - 3} more items
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total
              </h4>
              <div className="text-lg font-semibold">
                {formatPrice(totalWithShipping)}
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Paperclip className="w-4 h-4" />
                Attachments
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">PDF</Badge>
                  <span>Commercial Quote</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">PDF</Badge>
                  <span>Product Story Pages</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">PDF</Badge>
                  <span>CoA/GC-MS Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">PDF</Badge>
                  <span>Compliance Certificates</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending || !emailData.to}>
            {isSending ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Deal Packet
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generateEmailTemplate(
  customer: Customer, 
  lineItems: LineItem[], 
  selectedShipping: any,
  formatPrice: (amount: number) => string
): string {
  const subtotal = lineItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalWithShipping = subtotal + (selectedShipping?.cost || 0);

  return `Dear ${customer.name},

Thank you for your interest in our products. Please find attached your comprehensive deal packet containing:

• Commercial Quote with detailed pricing
• Product Story Pages with descriptions and imagery  
• Certificate of Analysis (CoA) and GC-MS Reports
• Compliance Certificates and documentation

QUOTE SUMMARY:
Customer: ${customer.billTo.company}
Items: ${lineItems.length} products
Total Value: ${formatPrice(totalWithShipping)}
Payment Terms: ${customer.snapshot.paymentTerms}
Shipping: ${selectedShipping?.name || "Standard"} (${selectedShipping?.days || "5-7 business days"})

KEY HIGHLIGHTS:
${lineItems.map(item => `• ${item.productName} - ${item.quantity} ${item.unit} (Grade: ${item.batch.qualityGrade})`).join('\n')}

All products meet your specified compliance requirements and come with our quality guarantee. We're committed to providing you with the highest quality ingredients for your business.

Please review the attached documents and let me know if you have any questions or would like to discuss any aspects of this quote. I'm here to ensure this meets all your needs.

Looking forward to working with you!

Best regards,
Sales Team
[Your Company Name]
[Phone] | [Email]

---
This quote is valid for 30 days from the date of issue.
All prices are subject to our standard terms and conditions.`;
}