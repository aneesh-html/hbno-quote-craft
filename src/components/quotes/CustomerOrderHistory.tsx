import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Calendar, DollarSign } from 'lucide-react';
import salesOrdersData from '@/data/sales-orders.json';

interface CustomerOrderHistoryProps {
  customerId?: string;
}

interface SalesOrderItem {
  productName: string;
  sku: string;
  quantity: number;
  unit: string;
  pricePerKg: number;
  totalPrice: number;
}

interface SalesOrder {
  id: string;
  customerId: string;
  customerName: string;
  createdDate: string;
  totalAmount: number;
  currency: string;
  status: string;
  deliveryMethod: string;
  items: SalesOrderItem[];
}

const CustomerOrderHistory: React.FC<CustomerOrderHistoryProps> = ({ customerId }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const orders = salesOrdersData.salesOrders as SalesOrder[];
    
    // Filter orders by customer if customerId is provided
    const customerOrders = customerId 
      ? orders.filter(order => order.customerId === customerId)
      : orders;

    // Find orders containing products that match the search query
    const matchingOrders = customerOrders.filter(order =>
      order.items.some(item => 
        item.productName.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query)
      )
    ).map(order => ({
      ...order,
      // Only include items that match the search
      items: order.items.filter(item =>
        item.productName.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query)
      )
    }));

    return matchingOrders.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
  }, [searchQuery, customerId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Customer Order History Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for products (e.g., peppermint, lavender, tea tree...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {searchQuery && (
            <div className="mt-2 text-sm text-muted-foreground">
              {filteredOrders.length > 0 
                ? `Found ${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''} containing "${searchQuery}"`
                : `No orders found containing "${searchQuery}"`
              }
            </div>
          )}
        </CardContent>
      </Card>

      {searchQuery && filteredOrders.length > 0 && (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="font-mono text-primary">{order.id}</span>
                      <Badge variant="secondary">{order.status}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.customerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(order.createdDate)}
                    </div>
                    <div className="flex items-center gap-1 font-semibold">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <strong>Delivery:</strong> {order.deliveryMethod}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Matching Products:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="bg-muted/50 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                            <p className="text-sm">
                              {item.quantity} {item.unit} × {formatCurrency(item.pricePerKg)}/{item.unit}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {searchQuery && filteredOrders.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No orders found for "{searchQuery}"</p>
            <p className="text-sm mt-1">
              Try searching for products like "peppermint", "lavender", "tea tree", or "eucalyptus"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomerOrderHistory;