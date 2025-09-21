import { Building2, Users, Package, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDepartment } from '@/contexts/DepartmentContext';

export function DepartmentAwareNotice() {
  const { currentDepartment, currentUser } = useDepartment();

  if (!currentDepartment) {
    return null;
  }

  // Get department-specific counts (would come from actual data in real app)
  const getDepartmentStats = (deptId: string) => {
    const stats = {
      'bulk': { customers: 34, products: 15, prefix: 'BLK' },
      'private-label': { customers: 23, products: 12, prefix: 'PL' },
      'retail': { customers: 67, products: 28, prefix: 'RT' }
    };
    return stats[deptId as keyof typeof stats] || { customers: 0, products: 0, prefix: 'GEN' };
  };

  const stats = getDepartmentStats(currentDepartment.id);

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-primary/5 border-primary/20 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-foreground">{currentDepartment.name} Department</h4>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                {currentDepartment.code}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              You are creating a quote for the {currentDepartment.name} department. 
              Only {currentDepartment.name} customers and products will be available.
            </p>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">{stats.customers}</span> customers available
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-green-600" />
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">{stats.products}</span> products available
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-purple-600" />
                <span className="text-muted-foreground">
                  Quote ID: <span className="font-medium text-foreground">{stats.prefix}-2024-XXX</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {currentUser.role === 'ceo' && (
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            CEO Override Available
          </Badge>
        )}
      </div>
    </Card>
  );
}