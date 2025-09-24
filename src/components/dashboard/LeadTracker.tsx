import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  Plus, 
  Building2, 
  Mail, 
  Calendar,
  Package,
  TrendingUp,
  Users2,
  Target
} from "lucide-react";
import leadsData from "@/data/leads.json";

const { leads, productCategories, industries, quantityTiers, clientValueTiers, statuses } = leadsData;

export function LeadTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [showNewLead, setShowNewLead] = useState(false);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || lead.status === filterStatus;
    const matchesTier = filterTier === "all" || lead.clientValueTier === filterTier;
    return matchesSearch && matchesStatus && matchesTier;
  });

  const getStatusColor = (status: string) => {
    const statusConfig = statuses.find(s => s.key === status);
    return statusConfig?.color || "gray";
  };

  const getTierColor = (tier: string) => {
    const tierConfig = clientValueTiers.find(t => t.key === tier);
    return tierConfig?.color || "gray";
  };

  const getTierBadgeClass = (color: string) => {
    switch (color) {
      case "purple": return "bg-purple-100 text-purple-800 border-purple-200";
      case "green": return "bg-green-100 text-green-800 border-green-200";
      case "blue": return "bg-blue-100 text-blue-800 border-blue-200";
      case "gray": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadgeClass = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-100 text-blue-800 border-blue-200";
      case "yellow": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "green": return "bg-green-100 text-green-800 border-green-200";
      case "orange": return "bg-orange-100 text-orange-800 border-orange-200";
      case "red": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Summary stats
  const totalLeads = leads.length;
  const inDiscussion = leads.filter(l => l.status === "In Discussion").length;
  const ultraValue = leads.filter(l => l.clientValueTier === "Ultra").length;
  const productTagged = leads.filter(l => l.specificProducts.length > 0).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Leads</p>
              <p className="text-xl font-bold">{totalLeads}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Discussion</p>
              <p className="text-xl font-bold">{inDiscussion}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ultra Value</p>
              <p className="text-xl font-bold">{ultraValue}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Product Tagged</p>
              <p className="text-xl font-bold">{productTagged}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search leads by company, contact, or industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status.key} value={status.key}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                {clientValueTiers.map(tier => (
                  <SelectItem key={tier.key} value={tier.key}>
                    {tier.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={showNewLead} onOpenChange={setShowNewLead}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Lead</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" placeholder="Company Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact Name</Label>
                    <Input id="contact" placeholder="Contact Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="email@company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map(industry => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="specifics">Specifics</Label>
                    <Textarea id="specifics" placeholder="What are they looking for?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Estimated Quantity (kg)</Label>
                    <Input id="quantity" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tier">Client Value Tier</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Tier" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientValueTiers.map(tier => (
                          <SelectItem key={tier.key} value={tier.key}>
                            {tier.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowNewLead(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowNewLead(false)}>
                    Create Lead
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Leads List */}
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{lead.companyName}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{lead.contactName}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{lead.lastActivity}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pl-13">
                    <p className="text-sm text-muted-foreground mb-2">{lead.specifics}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {lead.industry}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {lead.quantityTier}
                      </Badge>
                      {lead.productCategories.map(category => (
                        <Badge key={category} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <Badge 
                    variant="outline" 
                    className={getStatusBadgeClass(getStatusColor(lead.status))}
                  >
                    {lead.status}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={getTierBadgeClass(getTierColor(lead.clientValueTier))}
                  >
                    {lead.clientValueTier} Value
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Est. {lead.estimatedQuantity}kg
                  </p>
                </div>
              </div>
            </Card>
          ))}
          
          {filteredLeads.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg mb-2">No leads found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}