import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Star, MapPin, Package, Beaker } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products = productsData.products as Product[];

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, products]);

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
    setSelectedProduct(null);
    setSearchTerm("");
  };

  const getCrossSellSuggestions = () => {
    if (!selectedProduct) return [];
    
    const suggestions = productsData.crossSellSuggestions[selectedProduct.id as keyof typeof productsData.crossSellSuggestions];
    if (!suggestions) return [];
    
    return products.filter(p => suggestions.includes(p.id));
  };

  const crossSellSuggestions = getCrossSellSuggestions();

  return (
    <div className="space-y-6">
      {/* Add Product Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Products
          </CardTitle>
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

          {/* Product Search Results */}
          {filteredProducts.length > 0 && (
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handleProductSelect(product)}
                >
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <div className="flex gap-2 mt-1">
                      {product.endUse.slice(0, 2).map((use) => (
                        <Badge key={use} variant="secondary" className="text-xs">
                          {use}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    Select
                  </Button>
                </div>
              ))}
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