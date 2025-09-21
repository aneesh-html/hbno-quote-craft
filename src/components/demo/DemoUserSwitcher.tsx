import { useState } from 'react';
import { User, Shield, Building2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDepartment } from '@/contexts/DepartmentContext';

export function DemoUserSwitcher() {
  const { currentUser, switchToUser, availableUsers } = useDepartment();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200 hover:from-purple-500/20 hover:to-pink-500/20"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Demo Mode
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
              Switch Demo User
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              See how different roles experience the department system
            </p>
          </div>
          
          <div className="space-y-2">
            {availableUsers.map((user) => (
              <Card 
                key={user.id}
                className={`p-3 cursor-pointer transition-colors ${
                  currentUser.id === user.id 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  switchToUser(user.id);
                  setOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      user.role === 'ceo' 
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' 
                        : 'bg-muted'
                    }`}>
                      {user.role === 'ceo' ? (
                        <Shield className="w-4 h-4 text-purple-600" />
                      ) : (
                        <User className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.role === 'ceo' ? 'CEO - All Departments' : 
                         user.role === 'cs_staff' ? 'CS Staff' : 'Manager'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1">
                    {user.department && (
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {user.department.toUpperCase()}
                        </span>
                      </div>
                    )}
                    {currentUser.id === user.id && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>Try switching users:</strong><br/>
              • John Smith: Limited to Bulk department<br/>
              • Josef (CEO): Can switch between all departments
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}