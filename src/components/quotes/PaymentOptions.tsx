import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Banknote, 
  Globe,
  CheckCircle,
  Clock
} from "lucide-react";
import { useState } from "react";

interface PaymentOptionsProps {
  className?: string;
}

export function PaymentOptions({ className }: PaymentOptionsProps) {
  const [selectedPayment, setSelectedPayment] = useState<string>("card");

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, American Express",
      processingTime: "Instant",
      fees: "2.9% + 30¢",
      available: true
    },
    {
      id: "wise",
      name: "Wise Transfer",
      icon: Globe,
      description: "International bank transfers with low fees",
      processingTime: "1-2 business days",
      fees: "0.5% - 1.2%",
      available: true,
      recommended: true
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: Banknote,
      description: "Direct bank to bank transfer",
      processingTime: "3-5 business days",
      fees: "No fees",
      available: true
    }
  ];

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-4">
        <h4 className="font-medium mb-2">Payment Options</h4>
        <p className="text-sm text-muted-foreground">
          Choose how you'd like to receive payment for this quote
        </p>
      </div>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <div
              key={method.id}
              className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                selectedPayment === method.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedPayment(method.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  method.id === "wise" 
                    ? "bg-green-100 text-green-600"
                    : method.id === "card"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{method.name}</span>
                    {method.recommended && (
                      <Badge variant="secondary" className="text-xs">
                        Recommended
                      </Badge>
                    )}
                    {selectedPayment === method.id && (
                      <CheckCircle className="w-4 h-4 text-primary ml-auto" />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {method.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {method.processingTime}
                    </div>
                    <div>
                      Fees: {method.fees}
                    </div>
                  </div>
                  
                  {method.id === "wise" && (
                    <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700">
                      💡 Save up to 8x on international transfer fees compared to traditional banks
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t">
        <Button 
          variant="outline" 
          className="w-full"
          disabled
        >
          Configure Payment Settings
        </Button>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Payment integration coming soon - currently for display only
        </p>
      </div>
    </Card>
  );
}