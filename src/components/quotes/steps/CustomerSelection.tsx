import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, CheckCircle } from "lucide-react";
import { Customer } from "../CreateQuote";
import customersData from "@/data/customers.json";

interface CustomerSelectionProps {
  onCustomerSelect: (customer: Customer) => void;
  selectedCustomer: Customer | null;
}

export function CustomerSelection({ onCustomerSelect, selectedCustomer }: CustomerSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = customersData.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
      setShowResults(true);
    } else {
      setFilteredCustomers([]);
      setShowResults(false);
    }
  }, [searchTerm]);

  const handleCustomerClick = (customer: Customer) => {
    onCustomerSelect(customer);
    setSearchTerm(customer.name);
    setShowResults(false);
  };

  const getCreditStatusIcon = (status: string) => {
    switch (status) {
      case "good":
      case "excellent":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "review":
        return <CheckCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getCreditStatusColor = (status: string) => {
    switch (status) {
      case "good":
      case "excellent":
        return "bg-green-100 text-green-800 border-green-200";
      case "review":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Step 1: Select Customer
          </h3>
          <p className="text-sm text-muted-foreground">
            Search and select a customer to start creating the quote
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Start typing customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Search Results Dropdown */}
          {showResults && filteredCustomers.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0 transition-colors"
                  onClick={() => handleCustomerClick(customer)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getCreditStatusIcon(customer.snapshot.creditStatus.status)}
                      <Badge variant="outline" className={getCreditStatusColor(customer.snapshot.creditStatus.status)}>
                        {customer.snapshot.priceTier}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {showResults && filteredCustomers.length === 0 && searchTerm.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 p-4 text-center">
              <p className="text-sm text-muted-foreground">No customers found matching "{searchTerm}"</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Building2 className="w-4 h-4 mr-2" />
                Add New Customer
              </Button>
            </div>
          )}
        </div>

        {/* Selected Customer Summary */}
        {selectedCustomer && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-green-800">Customer Selected</div>
                <div className="text-sm text-green-600">{selectedCustomer.name}</div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {!selectedCustomer && (
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Customer Database</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Customers:</span>
                <span className="ml-2 font-medium">{customersData.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Active This Month:</span>
                <span className="ml-2 font-medium">{customersData.filter(c => c.snapshot.creditStatus.status === "good" || c.snapshot.creditStatus.status === "excellent").length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}