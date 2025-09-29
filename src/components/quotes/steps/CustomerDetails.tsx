import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { 
  MapPin, 
  Building2, 
  CreditCard, 
  Shield, 
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  Globe,
  User,
  AlertTriangle,
  ShoppingCart,
  FileText,
  Lock
} from "lucide-react";
import { Customer } from "../CreateQuote";
import CustomerOrderHistory from "../CustomerOrderHistory";

interface CustomerDetailsProps {
  customer: Customer;
}

export function CustomerDetails({ customer }: CustomerDetailsProps) {
  const [selectedShipTo, setSelectedShipTo] = useState(
    customer.shipToAddresses?.find(addr => addr.isDefault)?.id || customer.shipToAddresses?.[0]?.id || ""
  );

  const getCreditStatusIcon = (status: string) => {
    switch (status) {
      case "good":
      case "excellent":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "review":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
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

  const getSelectedShipToAddress = () => {
    return customer.shipToAddresses?.find(addr => addr.id === selectedShipTo) || customer.shipTo;
  };

  return (
    <div className="space-y-6">
      {/* Customer Snapshot Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Customer Snapshot</h3>
          <div className="flex items-center space-x-2">
            {getCreditStatusIcon(customer.snapshot.creditStatus.status)}
            <Badge className={getCreditStatusColor(customer.snapshot.creditStatus.status)}>
              {customer.snapshot.creditStatus.label}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Price Tier */}
          <div className="flex items-center space-x-3 p-3 bg-primary/5 rounded-lg">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Price Tier</div>
              <div className="font-medium text-foreground">{customer.snapshot.priceTier}</div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Payment Terms</div>
              <div className="font-medium text-foreground">{customer.snapshot.paymentTerms}</div>
            </div>
          </div>

          {/* YTD Orders */}
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">YTD Orders</div>
              <div className="font-medium text-foreground">{customer.snapshot.totalOrdersYTD}</div>
            </div>
          </div>

          {/* Pending Credits */}
          {customer.snapshot.pendingCredits && (
            <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Pending Credits</div>
                <div className="font-medium text-foreground">{customer.snapshot.pendingCredits}</div>
              </div>
            </div>
          )}

          {/* Last Order */}
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Last Order</div>
              <div className="font-medium text-foreground">
                {new Date(customer.snapshot.lastOrderDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Industry Type */}
          {customer.industryType && (
            <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <Building2 className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Industry</div>
                <div className="font-medium text-foreground">{customer.industryType}</div>
              </div>
            </div>
          )}
        </div>

        {/* Business Description */}
        {customer.businessDescription && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-semibold text-foreground">Business Overview</span>
            </div>
            <p className="text-sm text-slate-700">{customer.businessDescription}</p>
            {customer.website && (
              <a 
                href={customer.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
              >
                {customer.website}
              </a>
            )}
          </div>
        )}

        {/* Last Purchased Product */}
        {customer.snapshot.lastPurchasedProduct && (
          <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-foreground">Last Purchased Product</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{customer.snapshot.lastPurchasedProduct.name}</span>
              <span className="text-sm font-semibold text-orange-700">${customer.snapshot.lastPurchasedProduct.pricePerKg}/kg</span>
            </div>
          </div>
        )}

        {/* Customer Requirements */}
        {customer.snapshot.customerRequirements && (
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-foreground">Customer Requirements</span>
            </div>
            <p className="text-sm text-yellow-800">{customer.snapshot.customerRequirements}</p>
          </div>
        )}

        {/* Marketing Opt-out Notice */}
        {customer.snapshot.marketingOptOut && customer.snapshot.marketingNote && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-800">Marketing Notice</span>
            </div>
            <p className="text-sm text-red-700">{customer.snapshot.marketingNote}</p>
          </div>
        )}

        {/* Last Sales Order */}
        {customer.snapshot.lastSalesOrder && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-600" />
                Last Sales Order
              </h4>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-slate-100 text-slate-700">
                  {customer.snapshot.lastSalesOrder.id}
                </Badge>
                {customer.snapshot.lastSalesOrder.isSample && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    Sample Order
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <div className="text-xs text-muted-foreground">Created Date</div>
                <div className="text-sm font-medium">
                  {new Date(customer.snapshot.lastSalesOrder.createdDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Total Amount</div>
                <div className="text-sm font-medium">{customer.snapshot.lastSalesOrder.totalAmount}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Delivery Method</div>
                <div className="text-sm font-medium">{customer.snapshot.lastSalesOrder.deliveryMethod}</div>
              </div>
            </div>
            
            {customer.snapshot.lastSalesOrder.specialInstructions && (
              <div className="mb-3">
                <div className="text-xs text-muted-foreground">Special Instructions</div>
                <div className="text-sm text-slate-700 italic">
                  "{customer.snapshot.lastSalesOrder.specialInstructions}"
                </div>
              </div>
            )}
            
            <div>
              <div className="text-xs text-muted-foreground mb-2">Last Pricing</div>
              <div className="space-y-1">
                {customer.snapshot.lastSalesOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.productName} ({item.quantity})</span>
                    <span className="font-medium">${item.pricePerKg}/kg</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Compliance Needs */}
        <div className="mt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-foreground">Compliance Requirements</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {customer.snapshot.complianceNeeds.map((requirement, index) => (
              <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {requirement}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Contact & Address Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Contact & Address Details</h3>
        
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Multiple Email Addresses */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Email Addresses</span>
            </div>
            {customer.emails ? (
              <div className="space-y-2">
                {customer.emails.map((emailData, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded text-sm">
                    <div>
                      <div className="font-medium">{emailData.email}</div>
                      <div className="text-xs text-muted-foreground">{emailData.type}</div>
                    </div>
                    {emailData.isPrimary && (
                      <Badge variant="outline" className="text-xs">Primary</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="font-medium text-foreground">{customer.email}</div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm text-muted-foreground">Phone</div>
              <div className="font-medium text-foreground">{customer.phone}</div>
            </div>
          </div>

          {/* Sales Contact */}
          {customer.salesContact && (
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Sales Contact</div>
                <div className="font-medium text-foreground">{customer.salesContact}</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bill To Address */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-foreground">Bill To Address</span>
              </div>
              {customer.billTo.requiresApproval && (
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-amber-600">Requires Approval</span>
                </div>
              )}
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <div className="font-medium">{customer.billTo.company}</div>
              <div>{customer.billTo.address}</div>
              <div>{customer.billTo.city}, {customer.billTo.state} {customer.billTo.zipCode}</div>
              <div>{customer.billTo.country}</div>
            </div>
            {customer.billTo.requiresApproval && (
              <p className="text-xs text-amber-600 mt-1">
                Changes to billing address require management approval
              </p>
            )}
          </div>

          {/* Ship To Address */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-green-500" />
                <span className="font-medium text-foreground">Ship To Address</span>
              </div>
              {customer.shipToAddresses && customer.shipToAddresses.length > 1 && (
                <Select value={selectedShipTo} onValueChange={setSelectedShipTo}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select address" />
                  </SelectTrigger>
                  <SelectContent>
                    {customer.shipToAddresses.map((address) => (
                      <SelectItem key={address.id} value={address.id}>
                        {address.company} - {address.city}, {address.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            {(() => {
              const selectedAddress = getSelectedShipToAddress();
              return (
                <>
                  <div className="bg-green-50 p-3 rounded-lg text-sm">
                    <div className="font-medium">{selectedAddress.company}</div>
                    <div>{selectedAddress.address}</div>
                    <div>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</div>
                    <div>{selectedAddress.country}</div>
                  </div>
                  
                  {/* Map Placeholder */}
                  <div className="bg-muted rounded-lg h-32 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-sm">Map View</div>
                      <div className="text-xs">
                        Lat: {selectedAddress.coordinates?.lat || 'N/A'}, Lng: {selectedAddress.coordinates?.lng || 'N/A'}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </Card>

      {/* Customer Order History Search */}
      <CustomerOrderHistory customerId={customer.id} />
    </div>
  );
}