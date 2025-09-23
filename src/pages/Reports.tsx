import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  FileText, 
  Mail, 
  Filter, 
  Calendar, 
  DollarSign, 
  User, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Eye
} from "lucide-react";
import quotesData from "@/data/quotes.json";
import { useDepartment } from "@/contexts/DepartmentContext";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  status: 'open' | 'expired' | 'converted';
  createdDate: string;
  expirationDate: string;
  totalValue: number;
  currency: string;
  department: string;
  salesRep: string;
  lineItems: Array<{
    productName: string;
    batchId: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
  }>;
  lastFollowUp: string | null;
  followUpCount: number;
  notes: string;
  convertedToSO?: string;
  conversionDate?: string;
}

export function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [salesRepFilter, setSalesRepFilter] = useState<string>("all");
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [sendingFollowUp, setSendingFollowUp] = useState<string | null>(null);
  const [reviewingExpired, setReviewingExpired] = useState<string | null>(null);
  
  const { currentDepartment, currentUser } = useDepartment();
  const { formatPrice } = useCurrency();

  const quotes = quotesData.quotes as Quote[];

  // Filter quotes based on department access
  const accessibleQuotes = useMemo(() => {
    if (currentUser.role === 'ceo') {
      return quotes;
    }
    return quotes.filter(quote => quote.department === currentDepartment.id);
  }, [quotes, currentUser.role, currentDepartment.id]);

  // Apply filters
  const filteredQuotes = useMemo(() => {
    return accessibleQuotes.filter(quote => {
      const matchesSearch = quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quote.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
      const matchesDepartment = departmentFilter === "all" || quote.department === departmentFilter;
      const matchesSalesRep = salesRepFilter === "all" || quote.salesRep === salesRepFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment && matchesSalesRep;
    });
  }, [accessibleQuotes, searchTerm, statusFilter, departmentFilter, salesRepFilter]);

  // Get unique departments and sales reps for filters
  const uniqueDepartments = [...new Set(accessibleQuotes.map(quote => quote.department))];
  const uniqueSalesReps = [...new Set(accessibleQuotes.map(quote => quote.salesRep))];

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const openQuotes = filteredQuotes.filter(q => q.status === 'open');
    const expiredQuotes = filteredQuotes.filter(q => q.status === 'expired');
    const convertedQuotes = filteredQuotes.filter(q => q.status === 'converted');
    
    return {
      totalQuotes: filteredQuotes.length,
      openQuotes: openQuotes.length,
      expiredQuotes: expiredQuotes.length,
      convertedQuotes: convertedQuotes.length,
      totalValue: filteredQuotes.reduce((sum, quote) => sum + quote.totalValue, 0),
      avgQuoteValue: filteredQuotes.length > 0 ? filteredQuotes.reduce((sum, quote) => sum + quote.totalValue, 0) / filteredQuotes.length : 0
    };
  }, [filteredQuotes]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Open</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Expired</Badge>;
      case 'converted':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Converted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const isQuoteExpired = (expirationDate: string) => {
    return new Date(expirationDate) < new Date();
  };

  const getDaysUntilExpiration = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSendFollowUp = async (quoteId: string) => {
    setSendingFollowUp(quoteId);
    // Mock sending follow-up email
    setTimeout(() => {
      setSendingFollowUp(null);
      alert(`Follow-up email sent successfully for quote ${quoteId}!`);
    }, 2000);
  };

  const handleReviewExpiredQuote = async (quoteId: string) => {
    setReviewingExpired(quoteId);
    // Mock review process
    setTimeout(() => {
      setReviewingExpired(null);
      alert(`Expired quote ${quoteId} has been reviewed and approved for follow-up. You can now send follow-up emails.`);
    }, 1500);
  };

  const handleBulkFollowUp = async () => {
    if (selectedQuotes.length === 0) return;
    
    alert(`Sending follow-up emails for ${selectedQuotes.length} selected quotes...`);
    setSelectedQuotes([]);
  };

  const toggleQuoteSelection = (quoteId: string) => {
    setSelectedQuotes(prev => 
      prev.includes(quoteId) 
        ? prev.filter(id => id !== quoteId)
        : [...prev, quoteId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Quote Reports & Follow-up</h2>
          <p className="text-muted-foreground">Monitor open quotes and manage follow-up communications</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedQuotes.length > 0 && (
            <Button onClick={handleBulkFollowUp} className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Send Follow-up ({selectedQuotes.length})
            </Button>
          )}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Quotes</p>
                <p className="text-2xl font-bold">{summaryStats.totalQuotes}</p>
              </div>
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Quotes</p>
                <p className="text-2xl font-bold text-blue-600">{summaryStats.openQuotes}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expired Quotes</p>
                <p className="text-2xl font-bold text-red-600">{summaryStats.expiredQuotes}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(summaryStats.totalValue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Input
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>

            {currentUser.role === 'ceo' && (
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {uniqueDepartments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept.charAt(0).toUpperCase() + dept.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={salesRepFilter} onValueChange={setSalesRepFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Sales Rep" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sales Reps</SelectItem>
                {uniqueSalesReps.map(rep => (
                  <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDepartmentFilter("all");
                setSalesRepFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quotes ({filteredQuotes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedQuotes(filteredQuotes.map(q => q.id));
                        } else {
                          setSelectedQuotes([]);
                        }
                      }}
                      checked={selectedQuotes.length === filteredQuotes.length && filteredQuotes.length > 0}
                    />
                  </TableHead>
                  <TableHead>Quote ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Sales Rep</TableHead>
                  <TableHead>Follow-ups</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => {
                  const daysUntilExpiration = getDaysUntilExpiration(quote.expirationDate);
                  const isExpired = isQuoteExpired(quote.expirationDate);
                  
                  return (
                    <TableRow key={quote.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedQuotes.includes(quote.id)}
                          onChange={() => toggleQuoteSelection(quote.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{quote.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{quote.customerName}</div>
                          <div className="text-sm text-muted-foreground">{quote.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(quote.status)}</TableCell>
                      <TableCell>{new Date(quote.createdDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{new Date(quote.expirationDate).toLocaleDateString()}</span>
                          {!isExpired && daysUntilExpiration <= 3 && (
                            <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                              {daysUntilExpiration}d left
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatPrice(quote.totalValue)}</TableCell>
                      <TableCell>{quote.salesRep}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{quote.followUpCount}</span>
                          {quote.lastFollowUp && (
                            <span className="text-xs text-muted-foreground">
                              Last: {new Date(quote.lastFollowUp).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {quote.status === 'expired' ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  Review
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Review Expired Quote</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This quote expired on {new Date(quote.expirationDate).toLocaleDateString()}. 
                                    Please review the quote details and customer situation before approving follow-up communications.
                                    <br/><br/>
                                    <strong>Customer:</strong> {quote.customerName}<br/>
                                    <strong>Value:</strong> {formatPrice(quote.totalValue)}<br/>
                                    <strong>Notes:</strong> {quote.notes}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleReviewExpiredQuote(quote.id)}>
                                    {reviewingExpired === quote.id ? "Reviewing..." : "Approve Follow-up"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : quote.status === 'open' ? (
                            <Button
                              size="sm"
                              onClick={() => handleSendFollowUp(quote.id)}
                              disabled={sendingFollowUp === quote.id}
                              className="flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              {sendingFollowUp === quote.id ? "Sending..." : "Follow-up"}
                            </Button>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredQuotes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No quotes found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}