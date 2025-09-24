import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bell, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  TrendingDown, 
  Package, 
  FileText,
  MessageSquare,
  Archive
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import dummy data
import notificationsData from "@/data/notifications.json";

interface QuoteFollowUpDialogProps {
  quote: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function QuoteFollowUpDialog({ quote, open, onOpenChange }: QuoteFollowUpDialogProps) {
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleStatusUpdate = () => {
    toast({
      title: "Quote Status Updated",
      description: `Quote ${quote.id} marked as ${status}`,
    });
    onOpenChange(false);
  };

  const lostReasons = [
    "Lost because of price",
    "Lost because of project fall through, customer no longer needed",
    "Lost because we don't carry the product",
    "Lost because specification not correct",
    "Lost because not in stock",
    "Won",
    "Further follow up, clarification required"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Quote Status - {quote?.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Status Update</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {lostReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">Follow-up Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any additional notes about this follow-up..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={!status}>
              Update Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function NotificationCenter() {
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const { toast } = useToast();

  const notifications = notificationsData.notifications;
  const quoteFollowUps = notifications.filter(n => n.type === "quote_followup");
  const stockAlerts = notifications.filter(n => n.type === "stock_alert");
  const systemNotifications = notifications.filter(n => n.type === "system" || n.type === "news");

  const handleQuoteFollowUp = (quote: any) => {
    setSelectedQuote(quote);
    setFollowUpDialogOpen(true);
  };

  const markAsRead = (notificationId: string) => {
    toast({
      title: "Notification Marked as Read",
      description: "Notification has been archived.",
    });
  };

  const snoozeNotification = (notificationId: string) => {
    toast({
      title: "Notification Snoozed",
      description: "You'll be reminded again in 4 hours.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center space-x-2">
          <Bell className="w-6 h-6" />
          <span>Notification Center</span>
        </h2>
        <Badge variant="secondary" className="px-3 py-1">
          {notifications.length} Active
        </Badge>
      </div>

      <Tabs defaultValue="followups" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="followups" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Quote Follow-ups</span>
            <Badge variant="destructive" className="ml-1">{quoteFollowUps.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="stock" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Stock Alerts</span>
            <Badge variant="outline" className="ml-1">{stockAlerts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>System & News</span>
            <Badge variant="outline" className="ml-1">{systemNotifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <Archive className="w-4 h-4" />
            <span>All</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="followups" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quote Follow-up Required</h3>
            <div className="space-y-3">
              {quoteFollowUps.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start justify-between p-4 bg-muted/50 rounded-lg border-l-4 border-red-500"
                >
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {notification.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {notification.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleQuoteFollowUp(notification.relatedData)}
                    >
                      Follow Up
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => snoozeNotification(notification.id)}
                    >
                      Snooze 4h
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Stock Level Alerts</h3>
            <div className="space-y-3">
              {stockAlerts.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start justify-between p-4 bg-muted/50 rounded-lg border-l-4 border-yellow-500"
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge 
                          variant={notification.priority === "Critical" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {notification.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {notification.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      View Product
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-foreground">System & News Updates</h3>
            <div className="space-y-3">
              {systemNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start justify-between p-4 bg-muted/50 rounded-lg border-l-4 border-blue-500"
                >
                  <div className="flex items-start space-x-3">
                    {notification.type === "news" ? (
                      <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5" />
                    ) : (
                      <Bell className="w-5 h-5 text-blue-500 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {notification.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {notification.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4 text-foreground">All Notifications</h3>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-start space-x-3">
                    {notification.type === "quote_followup" && <Clock className="w-5 h-5 text-red-500 mt-0.5" />}
                    {notification.type === "stock_alert" && <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />}
                    {notification.type === "system" && <Bell className="w-5 h-5 text-blue-500 mt-0.5" />}
                    {notification.type === "news" && <MessageSquare className="w-5 h-5 text-green-500 mt-0.5" />}
                    <div>
                      <p className="font-medium text-foreground">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {notification.type.replace('_', ' ')}
                        </Badge>
                        <Badge 
                          variant={notification.priority === "Critical" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {notification.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {notification.createdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <QuoteFollowUpDialog
        quote={selectedQuote}
        open={followUpDialogOpen}
        onOpenChange={setFollowUpDialogOpen}
      />
    </div>
  );
}