import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./../components/ui/card";
import { Button } from "./../components/ui/button";
import { useCoopContext } from "./../context/CoopContext";
import { Clock, ExternalLink, AlertTriangle } from "lucide-react";

export default function Instructions() {
  const { blueprint } = useCoopContext();

  if (!blueprint) return null;

  const { instructions } = blueprint;
  const visibleSteps = instructions.slice(0, 3); // Show first 3 steps
  const remainingSteps = instructions.length - 3;

  const safetyTips = [
    "Always wear safety glasses when cutting or drilling",
    "Use appropriate dust masks when cutting lumber", 
    "Ensure all electrical work is done by a qualified electrician",
    "Check local building codes before construction"
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Build Instructions</CardTitle>
          <p className="text-muted-foreground">Follow these detailed instructions to build your chicken coop safely and efficiently.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6" data-testid="build-steps">
            {visibleSteps.map((step, index) => (
              <div 
                key={step.step} 
                className={`border-l-4 ${index === 0 ? 'border-primary' : 'border-muted'} pl-6`}
                data-testid={`step-${step.step}`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-8 h-8 ${index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'} rounded-full flex items-center justify-center font-bold text-sm`}>
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-2">{step.title}</h4>
                    <p className="text-muted-foreground mb-3">{step.description}</p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex}>• {detail}</li>
                      ))}
                    </ul>
                    <div className="mt-3 text-sm text-accent font-medium flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Estimated time: {step.estimatedTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {remainingSteps > 0 && (
              <div className="text-center py-4">
                <Button 
                  variant="link" 
                  className="text-accent hover:text-accent/80 font-medium"
                  data-testid="button-view-all-steps"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View All {instructions.length} Steps
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Safety Tips */}
      <Card className="bg-orange-50 border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-900 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span>Safety Reminders</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-orange-800 space-y-1" data-testid="safety-tips">
            {safetyTips.map((tip, index) => (
              <li key={index}>• {tip}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
