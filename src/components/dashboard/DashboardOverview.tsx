import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Quotes</p>
              <p className="text-2xl font-bold text-foreground">24</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Revenue</p>
              <p className="text-2xl font-bold text-foreground">$187.5K</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Customers</p>
              <p className="text-2xl font-bold text-foreground">156</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold text-foreground">68%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-20 flex flex-col space-y-2">
            <Calculator className="w-6 h-6" />
            <span>New Quote</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col space-y-2">
            <Users className="w-6 h-6" />
            <span>Add Customer</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col space-y-2">
            <Package className="w-6 h-6" />
            <span>Manage Products</span>
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Quotes</h3>
          <div className="space-y-4">
            {[
              { id: "Q-2024-001", customer: "Aromatherapy Plus", amount: "$12,450", status: "pending" },
              { id: "Q-2024-002", customer: "Natural Wellness Co", amount: "$8,750", status: "approved" },
              { id: "Q-2024-003", customer: "Essential Brands Ltd", amount: "$15,200", status: "draft" },
              { id: "Q-2024-004", customer: "Holistic Health Inc", amount: "$9,800", status: "pending" },
            ].map((quote) => (
              <div key={quote.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{quote.id}</p>
                  <p className="text-sm text-muted-foreground">{quote.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{quote.amount}</p>
                  <Badge 
                    variant={quote.status === "approved" ? "default" : "secondary"}
                    className={
                      quote.status === "approved" ? "bg-green-500 text-white" :
                      quote.status === "pending" ? "bg-yellow-500 text-white" :
                      "bg-gray-500 text-white"
                    }
                  >
                    {quote.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Notifications</h3>
          <div className="space-y-4">
            {[
              { type: "urgent", message: "Quote Q-2024-001 expires in 2 days", time: "2 hours ago" },
              { type: "success", message: "New customer registration: Natural Wellness Co", time: "4 hours ago" },
              { type: "info", message: "Product pricing updated for Lavender Essential Oil", time: "6 hours ago" },
              { type: "warning", message: "Low stock alert: Eucalyptus Oil (50ml)", time: "1 day ago" },
            ].map((notification, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                {notification.type === "urgent" && <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />}
                {notification.type === "success" && <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />}
                {notification.type === "info" && <Clock className="w-5 h-5 text-blue-500 mt-0.5" />}
                {notification.type === "warning" && <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />}
                <div className="flex-1">
                  <p className="text-sm text-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}