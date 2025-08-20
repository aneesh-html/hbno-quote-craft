import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, CreditCard } from "lucide-react";
import { CustomerSelection } from "./steps/CustomerSelection";
import { CustomerDetails } from "./steps/CustomerDetails";
import { ProductSelection, type LineItem } from "./steps/ProductSelection";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  billTo: {
    company: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shipTo: {
    company: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  snapshot: {
    creditStatus: {
      status: string;
      label: string;
      color: string;
    };
    priceTier: string;
    complianceNeeds: string[];
    paymentTerms: string;
    lastOrderDate: string;
    totalOrdersYTD: string;
  };
}

const steps = [
  { id: 1, title: "Select Customer", description: "Choose customer and verify details" },
  { id: 2, title: "Add Products", description: "Select essential oils and quantities" },
  { id: 3, title: "Logistics & Totals", description: "Confirm shipping and calculate totals" },
  { id: 4, title: "Review & Send", description: "Final review and quote generation" },
];

export function CreateQuote() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleAddLineItem = (lineItem: LineItem) => {
    setLineItems(prev => [...prev, lineItem]);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedCustomer !== null;
      case 2:
        return lineItems.length > 0;
      case 3:
        return true; // Will be implemented in next step
      case 4:
        return true; // Will be implemented in next step
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomerSelection 
              onCustomerSelect={handleCustomerSelect}
              selectedCustomer={selectedCustomer}
            />
            {selectedCustomer && (
              <CustomerDetails customer={selectedCustomer} />
            )}
          </div>
        );
      case 2:
        return (
          <ProductSelection 
            onAddLineItem={handleAddLineItem}
            lineItems={lineItems}
            customer={selectedCustomer}
          />
        );
      case 3:
        return (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Logistics & Totals</h3>
            <p className="text-muted-foreground">Shipping and pricing calculation coming next...</p>
          </Card>
        );
      case 4:
        return (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Review & Send</h3>
            <p className="text-muted-foreground">Final review and quote generation coming next...</p>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Create New Quote</h2>
          <p className="text-muted-foreground">Follow the guided process to create a professional quote</p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Quotes
        </Button>
      </div>

      {/* Progress Steps */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep > step.id
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="mt-2 text-center">
                  <div
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground max-w-24">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-px w-24 mx-4 transition-colors ${
                    currentStep > step.id ? "bg-green-500" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Step Content */}
      <div className="min-h-96">
        {renderStepContent()}
      </div>

      {/* Navigation */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentStep === 4 || !canProceed()}
          >
            {currentStep === 4 ? "Generate Quote" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}