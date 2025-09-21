import { useState } from 'react';
import { Check, ChevronDown, Building2, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useDepartment, Department } from '@/contexts/DepartmentContext';

interface DepartmentSelectorProps {
  className?: string;
}

export function DepartmentSelector({ className }: DepartmentSelectorProps) {
  const { currentDepartment, availableDepartments, setCurrentDepartment, canSwitchDepartments, currentUser } = useDepartment();
  const [open, setOpen] = useState(false);

  // If user can't switch departments, just show current department
  if (!canSwitchDepartments) {
    return (
      <div className={className}>
        <Card className="p-3 bg-muted/30 border-primary/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">
                {currentDepartment?.name || 'No Department'}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentDepartment?.code} • {currentUser.role.replace('_', ' ').toUpperCase()}
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {currentDepartment?.staff.length} staff
            </Badge>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background/50 border-primary/20"
          >
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="font-medium">
                {currentDepartment ? currentDepartment.name : "Select Department"}
              </span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search departments..." />
            <CommandEmpty>No department found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {availableDepartments.map((department) => (
                  <CommandItem
                    key={department.id}
                    value={department.id}
                    onSelect={() => {
                      setCurrentDepartment(department);
                      setOpen(false);
                    }}
                    className="p-0"
                  >
                    <div className="w-full p-3 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{department.name}</span>
                            <Badge variant="secondary" className="text-xs">
                              {department.code}
                            </Badge>
                            {currentDepartment?.id === department.id && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">
                            {department.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{department.customerCount} customers</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-3 h-3" />
                              <span>${department.monthlyRevenue.toLocaleString()}/mo</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* CEO Notice */}
      <div className="mt-2 p-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-200/30">
        <p className="text-xs text-purple-700 font-medium">CEO Mode Active</p>
        <p className="text-xs text-muted-foreground">You can switch between departments</p>
      </div>
    </div>
  );
}