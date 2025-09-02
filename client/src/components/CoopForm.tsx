import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useCoopContext } from "@/contexts/CoopContext";
import { generateCoopBlueprint } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Save } from "lucide-react";

const formSchema = z.object({
  description: z.string().min(10, "Please provide a more detailed description"),
  chickens: z.number().min(1).max(50),
  size: z.enum(["small", "medium", "large"]),
  material: z.enum(["wood", "metal", "mixed"])
});

type FormData = z.infer<typeof formSchema>;

export default function CoopForm() {
  const { setBlueprint, isLoading, setIsLoading } = useCoopContext();
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      chickens: 8,
      size: "medium",
      material: "wood"
    }
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const response = await generateCoopBlueprint(data.description);
      
      if (response.success && response.data) {
        setBlueprint(response.data);
        toast({
          title: "Blueprint Generated Successfully!",
          description: "Your custom chicken coop design is ready for review."
        });
        
        // Scroll to results section
        setTimeout(() => {
          const resultsSection = document.getElementById("results-section");
          if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        throw new Error(response.error || "Failed to generate blueprint");
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Please try again with a different description.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="form-container p-8 rounded-xl shadow-xl border border-white/20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">Design Your Perfect Chicken Coop</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Describe your chicken coop in natural language and get a complete blueprint with 3D visualization, materials list, and step-by-step instructions.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="coop-form">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">Describe your chicken coop</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    data-testid="input-description"
                    placeholder="I need a coop for 8 chickens with a gable roof, nesting boxes, roosting bars, wheels for mobility, and a chicken run. Make it medium size with wood construction and weatherproof coating."
                    className="w-full h-32 p-4 border border-input bg-card text-foreground rounded-lg resize-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="chickens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">Number of Chickens</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      data-testid="input-chickens"
                      type="number"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      className="w-full p-3 border border-input bg-card text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">Size Preference</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-size" className="w-full p-3 border border-input bg-card text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="small">Small (2-4 chickens)</SelectItem>
                      <SelectItem value="medium">Medium (5-8 chickens)</SelectItem>
                      <SelectItem value="large">Large (9+ chickens)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground">Material</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-material" className="w-full p-3 border border-input bg-card text-foreground rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="wood">Wood</SelectItem>
                      <SelectItem value="metal">Metal</SelectItem>
                      <SelectItem value="mixed">Mixed Materials</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              type="submit"
              data-testid="button-generate"
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-medium transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Blueprint</span>
                </>
              )}
            </Button>
            <Button 
              type="button"
              variant="secondary"
              data-testid="button-save-draft"
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-4 rounded-lg font-medium transition-all flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save Draft</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
