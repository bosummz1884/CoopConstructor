import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CoopModel from "@/three/CoopModel";
import { useCoopContext } from "@/context/CoopContext";
import { Home, Eye, ArrowUp, Expand, Mouse } from "lucide-react";

export default function BlueprintViewer() {
  const { blueprint } = useCoopContext();

  if (!blueprint) return null;

  const { config, dimensions } = blueprint;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-muted/20 blueprint-3d rounded-xl h-96 relative overflow-hidden border-2 border-dashed border-border">
          <Canvas>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[15, 10, 15]} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <Environment preset="sunset" />
              <CoopModel config={config} />
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            </Suspense>
          </Canvas>
          
          {/* Legend */}
          <div className="absolute top-4 left-4 bg-card/90 rounded-lg p-3 shadow-lg" data-testid="legend-3d">
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-sm"></div>
                <span>Main Structure</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-sm"></div>
                <span>Nesting Boxes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                <span>Chicken Run</span>
              </div>
            </div>
          </div>
          
          {/* Controls hint */}
          <div className="absolute bottom-4 right-4 bg-card/90 rounded-lg p-2 shadow-lg">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Mouse className="w-3 h-3" />
              <span>Click & drag to rotate</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* View Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">View Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="secondary" 
              className="w-full justify-start"
              data-testid="button-front-view"
            >
              <Home className="w-4 h-4 mr-2" />
              Front View
            </Button>
            <Button 
              variant="secondary" 
              className="w-full justify-start"
              data-testid="button-side-view"
            >
              <Eye className="w-4 h-4 mr-2" />
              Side View
            </Button>
            <Button 
              variant="secondary" 
              className="w-full justify-start"
              data-testid="button-top-view"
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Top View
            </Button>
            <Button 
              className="w-full justify-start"
              data-testid="button-isometric"
            >
              <Expand className="w-4 h-4 mr-2" />
              Isometric
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between" data-testid="spec-dimensions">
              <span className="text-muted-foreground">Dimensions:</span>
              <span className="font-medium font-mono">
                {Math.round(dimensions.overall.length / 12)}' × {Math.round(dimensions.overall.width / 12)}' × {Math.round(dimensions.overall.height / 12)}'
              </span>
            </div>
            <div className="flex justify-between" data-testid="spec-floor-space">
              <span className="text-muted-foreground">Floor Space:</span>
              <span className="font-medium font-mono">
                {Math.round((dimensions.overall.length * dimensions.overall.width) / 144)} sq ft
              </span>
            </div>
            {config.chickenRun && (
              <div className="flex justify-between" data-testid="spec-run-size">
                <span className="text-muted-foreground">Run Size:</span>
                <span className="font-medium font-mono">
                  {Math.round(dimensions.chickenRun.length / 12)}' × {Math.round(dimensions.chickenRun.width / 12)}'
                </span>
              </div>
            )}
            {config.nestingBox && (
              <div className="flex justify-between" data-testid="spec-nesting-boxes">
                <span className="text-muted-foreground">Nesting Boxes:</span>
                <span className="font-medium font-mono">{dimensions.nestingBoxes.quantity} boxes</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
