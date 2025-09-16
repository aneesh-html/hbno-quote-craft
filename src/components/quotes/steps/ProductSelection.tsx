import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Star, MapPin, Package, Beaker, ArrowRight, ArrowLeft, CheckCircle, Target, Award, Clock } from "lucide-react";
import productsData from "@/data/products.json";
import { BatchCard } from "./BatchCard";

export interface Batch {
  id: string;
  origin: string;
  inventory: number;
  unit: string;
  keySpec: string;
  recommendation: string;
  isRecommended: boolean;
  pricePerKg: number;
  qualityGrade: string;
  harvestDate: string;
  certifications: string[];
  isFuture?: boolean;
  expectedDelivery?: string;
  availableForPreOrder?: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  endUse: string[];
  compliance: string[];
  batches: Batch[];
}

export interface LineItem {
  id: string;
  productName: string;
  batchId: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalPrice: number;
  batch: Batch;
}

interface ProductSelectionProps {
  onAddLineItem: (lineItem: LineItem) => void;
  lineItems: LineItem[];
  customer?: any;
}

export function ProductSelection({ onAddLineItem, lineItems, customer }: ProductSelectionProps) {
  // Guided workflow state
  const [workflowStep, setWorkflowStep] = useState<'end-use' | 'compliance' | 'products'>('end-use');
  const [selectedEndUses, setSelectedEndUses] = useState<string[]>([]);
  const [requiredCompliance, setRequiredCompliance] = useState<string[]>([]);
  
  // Product selection state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products = productsData.products as Product[];

  // Available options
  const endUseOptions = ['Cosmetic', 'Food/Beverage', 'Aromatherapy', 'Personal Care', 'All Products (General Type)'];
  const complianceOptions = ['FDA cGMP', 'USDA Organic', 'FEMA GRAS', 'Ecocert Organic', 'TGA Listed'];

  // Filter products based on guided selections
  const guidedFilteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filter by end use - if "All Products" is selected, show all products
      const matchesEndUse = selectedEndUses.length === 0 || 
        selectedEndUses.includes('All Products (General Type)') ||
        selectedEndUses.some(use => product.endUse.includes(use));
      
      // Filter by compliance
      const matchesCompliance = requiredCompliance.length === 0 || 
        requiredCompliance.every(req => product.compliance.includes(req));
      
      return matchesEndUse && matchesCompliance;
    });
  }, [selectedEndUses, requiredCompliance, products]);

  // Search within guided filtered products
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    return guidedFilteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, guidedFilteredProducts]);

  const handleEndUseToggle = (endUse: string) => {
    setSelectedEndUses(prev => 
      prev.includes(endUse) 
        ? prev.filter(use => use !== endUse)
        : [...prev, endUse]
    );
  };

  const handleComplianceToggle = (compliance: string) => {
    setRequiredCompliance(prev => 
      prev.includes(compliance) 
        ? prev.filter(comp => comp !== compliance)
        : [...prev, compliance]
    );
  };

  const handleNextStep = () => {
    if (workflowStep === 'end-use') {
      setWorkflowStep('compliance');
    } else if (workflowStep === 'compliance') {
      setWorkflowStep('products');
    }
  };

  const handlePreviousStep = () => {
    if (workflowStep === 'compliance') {
      setWorkflowStep('end-use');
    } else if (workflowStep === 'products') {
      setWorkflowStep('compliance');
    }
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddBatch = (product: Product, batch: Batch, quantity: number) => {
    const lineItem: LineItem = {
      id: `${product.id}-${batch.id}-${Date.now()}`,
      productName: product.name,
      batchId: batch.id,
      quantity,
      unit: batch.unit,
      pricePerUnit: batch.pricePerKg,
      totalPrice: quantity * batch.pricePerKg,
      batch
    };
    
    onAddLineItem(lineItem);
    // Keep product selected to allow adding more batches
  };

  const getCrossSellSuggestions = () => {
    if (!selectedProduct) return [];
    
    const suggestions = productsData.crossSellSuggestions[selectedProduct.id as keyof typeof productsData.crossSellSuggestions];
    if (!suggestions) return [];
    
    return guidedFilteredProducts.filter(p => suggestions.includes(p.id));
  };

  const crossSellSuggestions = getCrossSellSuggestions();

  // Render End Use Selection Step
  if (workflowStep === 'end-use') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Guided Product Selection - Step 1 of 2
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              What is the customer's intended end-use? This helps us show only compliant products.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {endUseOptions.map((endUse) => (
                <Button
                  key={endUse}
                  variant={selectedEndUses.includes(endUse) ? "default" : "outline"}
                  className="justify-start h-auto p-4"
                  onClick={() => handleEndUseToggle(endUse)}
                >
                  <div className="flex items-center gap-2">
                    {selectedEndUses.includes(endUse) && <CheckCircle className="w-4 h-4" />}
                    <div className="text-left">
                      <div className="font-medium">{endUse}</div>
                      <div className="text-xs text-muted-foreground">
                        {endUse === 'Cosmetic' && 'Personal care & beauty products'}
                        {endUse === 'Food/Beverage' && 'Food flavoring & beverages'}
                        {endUse === 'Aromatherapy' && 'Therapeutic & wellness'}
                        {endUse === 'Personal Care' && 'Soaps, lotions & hygiene'}
                        {endUse === 'All Products (General Type)' && 'Fragrances, blends, PL, custom blends, etc.'}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-muted-foreground">
                {selectedEndUses.length} end-use(s) selected
              </p>
              <Button 
                onClick={handleNextStep}
                disabled={selectedEndUses.length === 0}
                className="flex items-center gap-2"
              >
                Next: Compliance Requirements
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render Compliance Requirements Step
  if (workflowStep === 'compliance') {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Guided Product Selection - Step 2 of 2
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Select any required certifications or compliance standards for this order.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {complianceOptions.map((compliance) => (
                <Button
                  key={compliance}
                  variant={requiredCompliance.includes(compliance) ? "default" : "outline"}
                  className="justify-start h-auto p-4"
                  onClick={() => handleComplianceToggle(compliance)}
                >
                  <div className="flex items-center gap-2">
                    {requiredCompliance.includes(compliance) && <CheckCircle className="w-4 h-4" />}
                    <div className="text-left">
                      <div className="font-medium">{compliance}</div>
                      <div className="text-xs text-muted-foreground">
                        {compliance === 'FDA cGMP' && 'US FDA Good Manufacturing Practice'}
                        {compliance === 'USDA Organic' && 'USDA Certified Organic'}
                        {compliance === 'FEMA GRAS' && 'Generally Recognized as Safe'}
                        {compliance === 'Ecocert Organic' && 'European Organic Certification'}
                        {compliance === 'TGA Listed' && 'Australian Therapeutic Goods'}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <Button 
                variant="outline" 
                onClick={handlePreviousStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  {guidedFilteredProducts.length} matching products found
                </p>
                <Button 
                  onClick={handleNextStep}
                  className="flex items-center gap-2"
                >
                  Show Products
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Criteria Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Selection Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">End Uses: </span>
                <div className="flex gap-1 mt-1">
                  {selectedEndUses.map(use => (
                    <Badge key={use} variant="secondary" className="text-xs">{use}</Badge>
                  ))}
                </div>
              </div>
              {requiredCompliance.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Required Compliance: </span>
                  <div className="flex gap-1 mt-1">
                    {requiredCompliance.map(comp => (
                      <Badge key={comp} variant="outline" className="text-xs">{comp}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Guided Selection Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Smart Filtered Products
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePreviousStep}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Edit Criteria
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="font-medium">End Uses: </span>
              {selectedEndUses.map(use => (
                <Badge key={use} variant="secondary" className="text-xs mr-1">{use}</Badge>
              ))}
            </div>
            {requiredCompliance.length > 0 && (
              <div>
                <span className="font-medium">Compliance: </span>
                {requiredCompliance.map(comp => (
                  <Badge key={comp} variant="outline" className="text-xs mr-1">{comp}</Badge>
                ))}
              </div>
            )}
            <div className="ml-auto">
              <Badge variant="default" className="bg-green-100 text-green-800">
                {guidedFilteredProducts.length} products match your criteria
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Products
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Search within products that match your selected criteria
          </p>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search for essential oils (e.g., Lavender Oil, Peppermint Oil...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Show available products hint when no search */}
          {!searchTerm.trim() && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                📝 Start typing to search from {guidedFilteredProducts.length} available products that match your criteria
              </p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {guidedFilteredProducts.slice(0, 3).map((product) => (
                  <Button
                    key={product.id}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => setSearchTerm(product.name.split(' ')[0])}
                  >
                    {product.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Product Search Results */}
          {filteredProducts.length > 0 && (
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
              {filteredProducts.map((product) => {
                const totalBatches = product.batches.length;
                const totalStock = product.batches.reduce((sum, batch) => 
                  sum + (batch.isFuture ? (batch.availableForPreOrder || 0) : batch.inventory), 0
                );
                const availableBatches = product.batches.filter(batch => !batch.isFuture || batch.availableForPreOrder! > 0).length;
                
                return (
                  <div
                    key={product.id}
                    className={`flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-all ${
                      selectedProduct?.id === product.id ? 'ring-2 ring-primary/20 bg-primary/5' : ''
                    }`}
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <div className="flex gap-2 mt-1 mb-2">
                        {product.endUse.slice(0, 2).map((use) => (
                          <Badge key={use} variant="secondary" className="text-xs">
                            {use}
                          </Badge>
                        ))}
                        {product.compliance.slice(0, 2).map((comp) => (
                          <Badge key={comp} variant="outline" className="text-xs">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {totalBatches} batch{totalBatches !== 1 ? 'es' : ''} ({availableBatches} available)
                        </span>
                        <span>Total stock: {totalStock} {product.batches[0]?.unit || 'units'}</span>
                      </div>
                    </div>
                    <Button size="sm" variant={selectedProduct?.id === product.id ? "default" : "ghost"}>
                      {selectedProduct?.id === product.id ? "Selected" : "Select"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {searchTerm.trim() && filteredProducts.length === 0 && (
            <div className="mt-4 p-4 text-center text-muted-foreground">
              No products found matching "{searchTerm}" within your selected criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Product Batches */}
      {selectedProduct && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Available Batches for {selectedProduct.name}
              {customer && (
                <Badge variant="outline" className="ml-auto">
                  Filtered for {customer.name}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {selectedProduct.batches.map((batch) => (
                <BatchCard
                  key={batch.id}
                  product={selectedProduct}
                  batch={batch}
                  onAddBatch={handleAddBatch}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cross-sell Suggestions */}
      {crossSellSuggestions.length > 0 && lineItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Customers Also Purchase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {crossSellSuggestions.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handleProductSelect(product)}
                >
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      65% of customers add this to their order
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Add Sample
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          {/* Recent Purchase Suggestions */}
          {customer?.snapshot?.recentPurchases && customer.snapshot.recentPurchases.length > 0 && (
            <Card className="p-4 bg-green-50 border-green-200">
              <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recently Purchased (Last 6 Months)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {customer.snapshot.recentPurchases.map((purchase, index) => (
                  <div key={index} className="bg-white p-3 rounded-md border border-green-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-green-900">{purchase.productName}</div>
                        <div className="text-xs text-green-700">
                          Last: {new Date(purchase.lastPurchaseDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-green-600">
                          Frequency: {purchase.frequency}x in 6 months
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-900">
                          ${purchase.lastPricePerKg}/kg
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Cross-sell suggestions */}
          {selectedProduct && crossSellSuggestions.length > 0 && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Customers Also Purchase</h4>
              <div className="flex flex-wrap gap-2">
                {crossSellSuggestions.map(suggestedProduct => (
                  <Button
                    key={suggestedProduct.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleProductSelect(suggestedProduct)}
                    className="h-auto p-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <div className="text-left">
                      <div className="text-xs font-medium">{suggestedProduct.name}</div>
                      <div className="text-xs text-blue-600">
                        {suggestedProduct.batches.length} batch{suggestedProduct.batches.length !== 1 ? 'es' : ''}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </Card>
          )}

        </Card>
      )}

      {/* Current Line Items */}
      {lineItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quote Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lineItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{item.productName}</h4>
                      <Badge variant="outline">{item.batchId}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.batch.origin}
                      </span>
                      <span className="flex items-center gap-1">
                        <Beaker className="w-3 h-3" />
                        {item.batch.keySpec}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {item.quantity} {item.unit} × ${item.pricePerUnit.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total: ${item.totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center font-semibold">
                  <span>Subtotal:</span>
                  <span>${lineItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}