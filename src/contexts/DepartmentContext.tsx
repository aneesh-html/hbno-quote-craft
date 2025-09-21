import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  manager: string;
  staff: string[];
  permissions: string[];
  customerCount: number;
  avgOrderValue: number;
  monthlyRevenue: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ceo' | 'department_manager' | 'cs_staff';
  department: string | null;
  permissions: string[];
}

interface DepartmentContextType {
  currentUser: User;
  currentDepartment: Department | null;
  availableDepartments: Department[];
  setCurrentDepartment: (department: Department | null) => void;
  canSwitchDepartments: boolean;
  // Demo functions
  switchToUser: (userId: string) => void;
  availableUsers: User[];
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

interface DepartmentProviderProps {
  children: ReactNode;
}

export function DepartmentProvider({ children }: DepartmentProviderProps) {
  // For demo purposes, we'll allow switching between users
  const [currentUserId, setCurrentUserId] = useState("john-smith");
  
  const users: User[] = [
    {
      id: "john-smith",
      name: "John Smith",
      email: "john@company.com",
      role: "cs_staff",
      department: "bulk",
      permissions: ["quotes", "customers", "products"]
    },
    {
      id: "josef-ceo",
      name: "Josef (CEO)", 
      email: "josef@company.com",
      role: "ceo",
      department: null,
      permissions: ["all_departments", "quotes", "customers", "products", "reports", "settings", "analytics"]
    }
  ];

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

  // Sample departments data
  const availableDepartments: Department[] = [
    {
      id: "bulk",
      name: "Bulk Essential Oils", 
      code: "BULK",
      description: "Wholesale essential oils for manufacturing and industrial use",
      manager: "Sarah Williams",
      staff: ["John Smith", "Mary Johnson", "David Brown"],
      permissions: ["quotes", "customers", "products", "reports"],
      customerCount: 156,
      avgOrderValue: 15420,
      monthlyRevenue: 425000
    },
    {
      id: "private-label",
      name: "Private Label",
      code: "PL", 
      description: "Custom branded essential oil products for retailers",
      manager: "Michael Chen",
      staff: ["Lisa Anderson", "Robert Taylor", "Jennifer Wilson"],
      permissions: ["quotes", "customers", "products", "reports", "branding"],
      customerCount: 89,
      avgOrderValue: 8750,
      monthlyRevenue: 280000
    },
    {
      id: "retail",
      name: "Retail & Direct Sales",
      code: "RETAIL",
      description: "Direct-to-consumer and small retail operations", 
      manager: "Emma Thompson",
      staff: ["Alex Martinez", "Sophie Davis", "James White"],
      permissions: ["quotes", "customers", "products", "inventory"],
      customerCount: 342,
      avgOrderValue: 125,
      monthlyRevenue: 185000
    }
  ];

  // Set initial department based on user's assigned department
  const initialDepartment = availableDepartments.find(dept => dept.id === currentUser.department) || null;
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(initialDepartment);

  // Only CEO can switch departments, others are locked to their assigned department
  const canSwitchDepartments = currentUser.role === 'ceo';

  return (
    <DepartmentContext.Provider value={{
      currentUser,
      currentDepartment,
      availableDepartments,
      setCurrentDepartment,
      canSwitchDepartments,
      switchToUser: setCurrentUserId,
      availableUsers: users
    }}>
      {children}
    </DepartmentContext.Provider>
  );
}

export function useDepartment() {
  const context = useContext(DepartmentContext);
  if (context === undefined) {
    throw new Error('useDepartment must be used within a DepartmentProvider');
  }
  return context;
}