import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCoopContext } from "@/context/CoopContext";
import { downloadPDF } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import BlueprintViewer from "@/components/BlueprintViewer";
import MaterialsList from "@/components/MaterialsList";
import Instructions from "@/components/Instructions";
import Dimensions from "@/components/Dimensions";
import { CheckCircle, Download, RefreshCw, Box, List, Wrench, Ruler } from "lucide-react";

export default function Results() {
  const { blueprint, setBlueprint } = useCoopContext();
  const { toast } = useToast();

  if (!blueprint) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No blueprint data available</p>
          <Button 
            variant="link" 
            onClick={() => window.location.href = "/"}
            className="mt-2"
          >
            Go back to create a design
          </Button>
        </div>
      </div>
    );
  }

  const { config } = blueprint;

  async function handleDownloadPDF() {
    try {
      if (blueprint?.pdfBase64) {
        await downloadPDF(blueprint.pdfBase64, "chicken-coop-blueprint.pdf");
        toast({
          title: "PDF Downloaded",
          description: "Your blueprint has been downloaded successfully."
        });
      }
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive"
      });
    }
  }

  function handleCreateNew() {
    setBlueprint(null);
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="flex-1">
        <section id="results-section" className="py-16 px-4 bg-card">
          <div className="max-w-7xl mx-auto">
            {/* Status Banner */}
            <Card className="bg-primary/10 border-primary/20 mb-8">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <CheckCircle className="text-primary-foreground text-sm" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">Blueprint Generated Successfully</h3>
                    <p className="text-sm text-muted-foreground">Your custom chicken coop design is ready for review</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      onClick={handleDownloadPDF}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      data-testid="button-download-pdf"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configuration Summary */}
            <Card className="bg-muted/30 mb-8">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Coop Configuration</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm" data-testid="config-summary">
                  <div>
                    <span className="text-muted-foreground">Chickens:</span>
                    <span className="font-medium text-foreground ml-2">{config.chickens}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium text-foreground ml-2">{config.size}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Roof:</span>
                    <span className="font-medium text-foreground ml-2">{config.roofStyle}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Material:</span>
                    <span className="font-medium text-foreground ml-2">{config.material}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="3d-view" className="w-full">
              <TabsList className="grid w-full grid-cols-4" data-testid="results-tabs">
                <TabsTrigger value="3d-view" className="flex items-center space-x-2">
                  <Box className="w-4 h-4" />
                  <span className="hidden sm:inline">3D Visualization</span>
                  <span className="sm:hidden">3D</span>
                </TabsTrigger>
                <TabsTrigger value="materials" className="flex items-center space-x-2">
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">Materials List</span>
                  <span className="sm:hidden">Materials</span>
                </TabsTrigger>
                <TabsTrigger value="instructions" className="flex items-center space-x-2">
                  <Wrench className="w-4 h-4" />
                  <span className="hidden sm:inline">Instructions</span>
                  <span className="sm:hidden">Steps</span>
                </TabsTrigger>
                <TabsTrigger value="dimensions" className="flex items-center space-x-2">
                  <Ruler className="w-4 h-4" />
                  <span className="hidden sm:inline">Dimensions</span>
                  <span className="sm:hidden">Dims</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="3d-view" className="mt-8">
                <BlueprintViewer />
              </TabsContent>

              <TabsContent value="materials" className="mt-8">
                <MaterialsList />
              </TabsContent>

              <TabsContent value="instructions" className="mt-8">
                <Instructions />
              </TabsContent>

              <TabsContent value="dimensions" className="mt-8">
                <Dimensions />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Footer Actions */}
        <section className="bg-muted/30 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Start Building?</h3>
            <p className="text-muted-foreground mb-8">Download your complete blueprint package and get started on your chicken coop project today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button 
                onClick={handleDownloadPDF}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                data-testid="button-download-complete-pdf"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Complete PDF
              </Button>
              <Button 
                variant="outline"
                onClick={handleCreateNew}
                data-testid="button-create-new-design"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Create New Design
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
