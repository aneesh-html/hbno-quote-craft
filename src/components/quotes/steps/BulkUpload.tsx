import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Download,
  Plus
} from "lucide-react";
import { LineItem, Product } from "./ProductSelection";
import productsData from "@/data/products.json";

interface BulkUploadProps {
  onAddBulkItems: (items: LineItem[]) => void;
  onCancel: () => void;
}

interface ParsedRow {
  sku: string;
  description: string;
  quantity: number;
  requiredDate?: string;
  matchedProduct?: Product;
  error?: string;
}

export function BulkUpload({ onAddBulkItems, onCancel }: BulkUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const products = productsData.products as Product[];

  // Create a mapping of SKUs to products for quick lookup
  const skuToProductMap = new Map<string, Product>();
  products.forEach(product => {
    if (product.sku) {
      skuToProductMap.set(product.sku.toLowerCase(), product);
    }
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
      alert("Please upload a CSV file only.");
      return;
    }
    
    setFile(selectedFile);
  };

  const parseQuantity = (quantityStr: string): number => {
    // Remove commas and parse as number
    const cleaned = quantityStr.replace(/,/g, "");
    return parseFloat(cleaned) || 0;
  };

  const processFile = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setProcessingProgress(0);
    
    const text = await file.text();
    const lines = text.split("\n").filter(line => line.trim());
    
    if (lines.length < 2) {
      alert("CSV file must have at least a header and one data row.");
      setIsProcessing(false);
      return;
    }
    
    // Skip header row
    const dataLines = lines.slice(1);
    const parsed: ParsedRow[] = [];
    
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      const columns = line.split(",").map(col => col.trim().replace(/^"|"$/g, ""));
      
      if (columns.length >= 3) {
        const sku = columns[0];
        const description = columns[1];
        const quantity = parseQuantity(columns[2]);
        const requiredDate = columns[3] || "";
        
        // Find matching product
        const matchedProduct = skuToProductMap.get(sku.toLowerCase());
        
        const row: ParsedRow = {
          sku,
          description,
          quantity,
          requiredDate,
          matchedProduct,
          error: !matchedProduct ? `SKU "${sku}" not found in inventory` : quantity <= 0 ? "Invalid quantity" : undefined
        };
        
        parsed.push(row);
      }
      
      // Update progress
      setProcessingProgress((i + 1) / dataLines.length * 100);
      
      // Add small delay to show progress
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    setParsedData(parsed);
    setShowPreview(true);
    setIsProcessing(false);
  };

  const handleAddToQuote = () => {
    const validRows = parsedData.filter(row => row.matchedProduct && !row.error);
    const lineItems: LineItem[] = [];
    
    validRows.forEach(row => {
      const product = row.matchedProduct!;
      // Use first available batch for simplicity
      const batch = product.batches.find(b => !b.isFuture && b.inventory > 0) || product.batches[0];
      
      if (batch) {
        const lineItem: LineItem = {
          id: `${product.id}-${batch.id}-${Date.now()}-${Math.random()}`,
          productName: product.name,
          batchId: batch.id,
          quantity: row.quantity,
          unit: batch.unit,
          pricePerUnit: batch.pricePerKg,
          totalPrice: row.quantity * batch.pricePerKg,
          batch
        };
        lineItems.push(lineItem);
      }
    });
    
    onAddBulkItems(lineItems);
  };

  const downloadTemplate = () => {
    const csvContent = `SKU Number,SKU Description,Order Quantity,FRD
LV-001,Lavender Oil (LV-001),100,12/31/2024
PM-002,Peppermint Oil (PM-002),50,01/15/2025`;
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bulk_upload_template.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const validCount = parsedData.filter(row => row.matchedProduct && !row.error).length;
  const errorCount = parsedData.filter(row => row.error).length;

  if (showPreview) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Upload Preview - {file?.name}
              </span>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                <X className="w-4 h-4 mr-2" />
                Back to Upload
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{parsedData.length}</div>
                <div className="text-sm text-blue-600">Total Items</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{validCount}</div>
                <div className="text-sm text-green-600">Valid Items</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                <div className="text-sm text-red-600">Issues</div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <div className="grid grid-cols-5 gap-2 p-3 bg-muted font-semibold text-xs border-b">
                <div>SKU</div>
                <div>Description</div>
                <div>Quantity</div>
                <div>Required Date</div>
                <div>Status</div>
              </div>
              {parsedData.map((row, index) => (
                <div key={index} className="grid grid-cols-5 gap-2 p-3 border-b text-sm hover:bg-accent/50">
                  <div className="font-mono">{row.sku}</div>
                  <div className="truncate" title={row.description}>{row.description}</div>
                  <div>{row.quantity.toLocaleString()}</div>
                  <div className="text-xs">{row.requiredDate}</div>
                  <div>
                    {row.error ? (
                      <Badge variant="destructive" className="text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Error
                      </Badge>
                    ) : (
                      <Badge variant="default" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Ready
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {errorCount > 0 && (
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {errorCount} items have issues and will be skipped. Common issues: SKU not found in inventory, invalid quantities.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between items-center mt-6">
              <Button variant="outline" onClick={onCancel}>
                Cancel Upload
              </Button>
              <Button 
                onClick={handleAddToQuote}
                disabled={validCount === 0}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add {validCount} Items to Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Product Upload
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload a CSV file with your customer's product list to quickly add multiple items to the quote.
          </p>
        </CardHeader>
        <CardContent>
          {/* Template Download */}
          <div className="mb-6">
            <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download CSV Template
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Download a template to see the expected CSV format: SKU Number, SKU Description, Order Quantity, Required Date
            </p>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {dragActive ? "Drop your CSV file here" : "Drag & drop your CSV file here"}
              </p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="max-w-xs mx-auto"
              />
            </div>
          </div>

          {file && (
            <div className="mt-6 p-4 bg-accent/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <div className="font-medium">{file.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setFile(null)}>
                    Remove
                  </Button>
                  <Button onClick={processFile} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Process File"}
                  </Button>
                </div>
              </div>
              
              {isProcessing && (
                <div className="mt-4">
                  <Progress value={processingProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Processing... {Math.round(processingProgress)}%
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              Back to Manual Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}