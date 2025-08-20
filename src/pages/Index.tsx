import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { QuotesPlaceholder } from "@/components/quotes/QuotesPlaceholder";
import { CreateQuote } from "@/components/quotes/CreateQuote";
import { Card } from "@/components/ui/card";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showCreateQuote, setShowCreateQuote] = useState(false);

  const renderContent = () => {
    if (showCreateQuote) {
      return <CreateQuote onBack={() => setShowCreateQuote(false)} />;
    }
    
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview onNewQuote={() => setShowCreateQuote(true)} />;
      case "quotes":
        return <QuotesPlaceholder />;
      case "customers":
        return (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Customer Management</h3>
            <p className="text-muted-foreground">Customer database and relationship management coming soon.</p>
          </Card>
        );
      case "products":
        return (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Product Catalog</h3>
            <p className="text-muted-foreground">Essential oils product catalog and pricing management coming soon.</p>
          </Card>
        );
      case "reports":
        return (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Sales Reports</h3>
            <p className="text-muted-foreground">Analytics and reporting dashboard coming soon.</p>
          </Card>
        );
      case "documents":
        return (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Document Management</h3>
            <p className="text-muted-foreground">Quote templates and document generation coming soon.</p>
          </Card>
        );
      case "settings":
        return (
          <Card className="p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">System Settings</h3>
            <p className="text-muted-foreground">Configuration and user management coming soon.</p>
          </Card>
        );
      default:
        return <DashboardOverview />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Dashboard";
      case "quotes":
        return "Quotations";
      case "customers":
        return "Customer Management";
      case "products":
        return "Product Catalog";
      case "reports":
        return "Sales Reports";
      case "documents":
        return "Documents";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case "dashboard":
        return "Welcome back! Here's your business overview";
      case "quotes":
        return "Create and manage customer quotations";
      case "customers":
        return "Manage customer relationships and information";
      case "products":
        return "Essential oils catalog and pricing";
      case "reports":
        return "Sales analytics and performance metrics";
      case "documents":
        return "Templates and generated documents";
      case "settings":
        return "System configuration and preferences";
      default:
        return "Welcome back! Here's your business overview";
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header title={getPageTitle()} subtitle={getPageSubtitle()} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
