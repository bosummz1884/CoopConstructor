import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCoopContext } from "@/contexts/CoopContext";
import { ShoppingCart, Check } from "lucide-react";

interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  size: string;
  // Add any other properties that your material objects have
}

export default function MaterialsList() {
  const { blueprint } = useCoopContext();

  if (!blueprint) return null;

  const { materials, totalCost } = blueprint;

  const materialsCost = materials.reduce((sum: number, material: Material) => sum + material.cost, 0);
  const hardwareCost = 125; // Fixed hardware cost
  const tax = (materialsCost + hardwareCost) * 0.08;

  const tools = [
    "Circular saw",
    "Drill/driver", 
    "Measuring tape",
    "Level",
    "Socket wrench set"
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Required Materials</CardTitle>
            <p className="text-sm text-muted-foreground">Complete shopping list for your chicken coop</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="materials-table">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Material</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size/Specs</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Est. Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                {materials.map((material: Material, index: number) => (
                    <tr 
                      key={index} 
                      className="hover:bg-muted/30 transition-colors"
                      data-testid={`material-row-${index}`}
                    > 
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{material.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{material.quantity} {material.quantity === 1 ? 'piece' : 'pieces'}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{material.size}</td>
                      <td className="px-6 py-4 text-sm font-medium text-accent">${material.cost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        {/* Cost Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Cost Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between" data-testid="cost-materials">
              <span className="text-muted-foreground">Materials:</span>
              <span className="font-medium">${materialsCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" data-testid="cost-hardware">
              <span className="text-muted-foreground">Hardware:</span>
              <span className="font-medium">${hardwareCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" data-testid="cost-tax">
              <span className="text-muted-foreground">Tax (8%):</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-medium text-foreground">Total:</span>
              <span className="font-bold text-primary text-lg" data-testid="cost-total">
                ${totalCost.toFixed(2)}
              </span>
            </div>
            <Button 
              className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
              data-testid="button-export-shopping-list"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Export Shopping List
            </Button>
          </CardContent>
        </Card>

        {/* Tools Required */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tools Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {tools.map((tool, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-2"
                data-testid={`tool-${index}`}
              >
                <Check className="w-4 h-4 text-primary" />
                <span>{tool}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
