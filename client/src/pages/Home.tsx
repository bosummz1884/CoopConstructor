import React from "react";
import { Home as HomeIcon, Settings, HelpCircle } from "lucide-react";
import CoopForm from "@/components/CoopForm";
import { useCoopContext } from "@/context/CoopContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Box, List, Wrench, Ruler } from "lucide-react";
import { downloadPDF } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import BlueprintViewer from "@/components/BlueprintViewer";
import MaterialsList from "@/components/MaterialsList";
import Instructions from "@/components/Instructions";
import Dimensions from "@/components/Dimensions";

export default function Home() {
  const { blueprint } = useCoopContext();
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3" data-testid="header-brand">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <HomeIcon className="text-primary-foreground text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Chicken Coop Blueprint Generator</h1>
                <p className="text-sm text-muted-foreground">AI-powered coop design & planning</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-help"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="button-settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-bg py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <CoopForm />
        </div>
      </section>

      {/* Results Section */}
      {blueprint && (
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
                    <span className="font-medium text-foreground ml-2">{blueprint.config.chickens}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium text-foreground ml-2">{blueprint.config.size}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Roof:</span>
                    <span className="font-medium text-foreground ml-2">{blueprint.config.roofStyle}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Material:</span>
                    <span className="font-medium text-foreground ml-2">{blueprint.config.material}</span>
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
      )}

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <HomeIcon className="text-primary-foreground text-sm" />
                </div>
                <span className="font-semibold text-foreground">Coop Blueprint Generator</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                AI-powered chicken coop design tool that creates custom blueprints, materials lists, and step-by-step instructions for your backyard poultry housing needs.
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-muted-foreground">© 2024 Blueprint Generator</span>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
                <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Design Gallery</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Building Tips</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Material Guide</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Feedback</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
