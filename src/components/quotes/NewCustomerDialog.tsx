import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, ExternalLink, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCustomerCreated: (customer: any) => void;
}

export function NewCustomerDialog({ open, onOpenChange, onCustomerCreated }: NewCustomerDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    priceTier: "Standard",
    paymentTerms: "Net 30"
  });
  const [isCreating, setIsCreating] = useState(false);
  const [netSuiteSync, setNetSuiteSync] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    // Simulate NetSuite sync
    setTimeout(() => {
      setNetSuiteSync(true);
      
      // Simulate customer creation
      setTimeout(() => {
        const newCustomer = {
          id: `customer-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          billTo: {
            company: formData.company,
            address1: "123 Business St",
            city: "Business City",
            state: "BC",
            zipCode: "12345",
            country: "USA"
          },
          snapshot: {
            creditStatus: { status: "good" },
            priceTier: formData.priceTier,
            paymentTerms: formData.paymentTerms,
            totalOrdersYTD: 0
          },
          netSuiteId: `NS-${Date.now()}`
        };
        
        onCustomerCreated(newCustomer);
        setIsCreating(false);
        setNetSuiteSync(false);
        onOpenChange(false);
        
        toast({
          title: "Customer Created Successfully",
          description: `${formData.name} has been added and synced with NetSuite.`,
        });
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          priceTier: "Standard",
          paymentTerms: "Net 30"
        });
      }, 1500);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Create New Customer
          </DialogTitle>
          <DialogDescription>
            Add a new customer to your database. This will automatically sync with NetSuite.
          </DialogDescription>
        </DialogHeader>

        {/* NetSuite Integration Status */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-blue-800">NetSuite Integration</div>
                  <div className="text-sm text-blue-600">
                    {netSuiteSync ? "Syncing customer data..." : "Ready to sync with NetSuite"}
                  </div>
                </div>
              </div>
              {netSuiteSync ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                    Syncing...
                  </Badge>
                </div>
              ) : (
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                disabled={isCreating}
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                disabled={isCreating}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={isCreating}
              />
            </div>
            <div>
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                required
                disabled={isCreating}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priceTier">Price Tier</Label>
              <Select 
                value={formData.priceTier} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priceTier: value }))}
                disabled={isCreating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Wholesale">Wholesale</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select 
                value={formData.paymentTerms} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, paymentTerms: value }))}
                disabled={isCreating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Net 30">Net 30</SelectItem>
                  <SelectItem value="Net 15">Net 15</SelectItem>
                  <SelectItem value="Net 60">Net 60</SelectItem>
                  <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !formData.name || !formData.email || !formData.company}>
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Customer...
                </div>
              ) : (
                "Create Customer"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}