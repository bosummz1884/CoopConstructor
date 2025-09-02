import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCoopContext } from "@/contexts/CoopContext";
import { Ruler } from "lucide-react";
import type { CutList } from "@shared/types";

export default function Dimensions() {
  const { blueprint } = useCoopContext();

  if (!blueprint) return null;

  const { dimensions, cutList } = blueprint;

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        {/* Technical Drawings */}
        <Card>
          <CardHeader>
            <CardTitle>Technical Drawings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div 
                className="bg-muted/20 h-64 rounded-lg border-2 border-dashed border-border flex items-center justify-center"
                data-testid="technical-drawing"
              >
                <div className="text-center">
                  <Ruler className="w-12 h-12 text-muted-foreground mb-2 mx-auto" />
                  <p className="text-muted-foreground">Front Elevation View</p>
                  <p className="text-xs text-muted-foreground mt-1">Scale: 1/4" = 1'</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="secondary" 
                  className="w-full"
                  data-testid="button-side-view"
                >
                  Side View
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  data-testid="button-floor-plan"
                >
                  Floor Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        {/* Dimensions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Dimensions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2" data-testid="main-structure-dimensions">
              <h4 className="font-medium text-foreground text-sm">Main Coop Structure</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overall Length:</span>
                  <span className="font-mono">{dimensions.overall.length}" ({Math.round(dimensions.overall.length / 12)} ft)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overall Width:</span>
                  <span className="font-mono">{dimensions.overall.width}" ({Math.round(dimensions.overall.width / 12)} ft)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wall Height:</span>
                  <span className="font-mono">{dimensions.overall.height}" ({Math.round(dimensions.overall.height / 12)} ft)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ridge Height:</span>
                  <span className="font-mono">{dimensions.overall.ridgeHeight}" ({Math.round(dimensions.overall.ridgeHeight / 12)} ft)</span>
                </div>
              </div>
            </div>
            
            {dimensions.nestingBoxes.quantity > 0 && (
              <div className="border-t border-border pt-4" data-testid="nesting-boxes-dimensions">
                <h4 className="font-medium text-foreground text-sm">Nesting Boxes</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Box Size:</span>
                    <span className="font-mono">{dimensions.nestingBoxes.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-mono">{dimensions.nestingBoxes.quantity} boxes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Height from Floor:</span>
                    <span className="font-mono">{dimensions.nestingBoxes.heightFromFloor}"</span>
                  </div>
                </div>
              </div>
            )}
            
            {dimensions.chickenRun.length > 0 && (
              <div className="border-t border-border pt-4" data-testid="chicken-run-dimensions">
                <h4 className="font-medium text-foreground text-sm">Chicken Run</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Run Length:</span>
                    <span className="font-mono">{dimensions.chickenRun.length}" ({Math.round(dimensions.chickenRun.length / 12)} ft)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Run Width:</span>
                    <span className="font-mono">{dimensions.chickenRun.width}" ({Math.round(dimensions.chickenRun.width / 12)} ft)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fence Height:</span>
                    <span className="font-mono">{dimensions.chickenRun.fenceHeight}" ({Math.round(dimensions.chickenRun.fenceHeight / 12)} ft)</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cut List */}
        <Card>
          <CardHeader>
            <CardTitle>Lumber Cut List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs space-y-2 font-mono" data-testid="cut-list">
              {cutList.map((cut: CutList, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>{cut.description}</span>
                  <span>{cut.pieces} pieces</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
