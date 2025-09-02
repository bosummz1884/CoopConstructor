import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCoopContext } from "@/contexts/CoopContext";
import { Clock, ExternalLink } from "lucide-react";
import type { BuildStep } from "@shared/types";

export default function Instructions() {
  const { blueprint } = useCoopContext();

  if (!blueprint?.instructions) return null;

  const { instructions } = blueprint;
  const visibleSteps = instructions.slice(0, 3); // Show first 3 steps
  const remainingSteps = instructions.length - 3;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Build Instructions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {visibleSteps.map((step: BuildStep) => (
            <div key={step.step} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{step.title}</h3>
                <span className="text-sm text-muted-foreground">{step.estimatedTime}</span>
              </div>
              <p className="text-sm">{step.description}</p>
              {step.details && step.details.length > 0 && (
                <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
                  {step.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {remainingSteps > 0 && (
            <div className="text-center">
              <Button variant="link" className="mt-4 text-accent hover:text-accent/80 font-medium">
                <ExternalLink className="w-4 h-4 mr-1" />
                View All {instructions.length} Steps
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
