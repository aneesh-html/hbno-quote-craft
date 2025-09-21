import { Bell, User, Search, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DepartmentSelector } from "@/components/layout/DepartmentSelector";
import { DemoUserSwitcher } from "@/components/demo/DemoUserSwitcher";
import { useDepartment } from "@/contexts/DepartmentContext";
import { useEffect } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { currentUser, currentDepartment, setCurrentDepartment, availableDepartments } = useDepartment();
  
  // Auto-set department when user changes
  useEffect(() => {
    if (currentUser.department && !currentDepartment) {
      const userDept = availableDepartments.find(dept => dept.id === currentUser.department);
      if (userDept) {
        setCurrentDepartment(userDept);
      }
    } else if (!currentUser.department && currentUser.role === 'ceo') {
      // CEO starts with no department selected
      setCurrentDepartment(null);
    }
  }, [currentUser, currentDepartment, setCurrentDepartment, availableDepartments]);
  
  return (
    <div className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
      {/* Page Title & Department Info */}
      <div className="flex items-center space-x-6">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
            {currentDepartment && (
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-primary" />
                <Badge variant="outline" className="text-xs font-medium">
                  {currentDepartment.code}
                </Badge>
              </div>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        {/* Department Selector for CEO */}
        {currentUser.role === 'ceo' && (
          <div className="w-72">
            <DepartmentSelector />
          </div>
        )}
      </div>

      {/* Header Actions */}
      <div className="flex items-center space-x-4">
        {/* Demo User Switcher */}
        <DemoUserSwitcher />
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search quotes, customers..."
            className="pl-10 w-64"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-primary">
            3
          </Badge>
        </Button>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">{currentUser.name}</div>
            <div className="text-xs text-muted-foreground">
              {currentUser.role === 'ceo' ? 'Chief Executive Officer' :
               currentUser.role === 'department_manager' ? 'Department Manager' :
               'Sales Representative'}
            </div>
          </div>
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}