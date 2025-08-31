import { CoopConfig, CoopBlueprint, Dimensions, CutList } from "@shared/types";
import { calculateMaterials, calculateTotalCost } from "./materialsCalculator";
import { generateBuildSteps } from "./instructionsGenerator";
import { createAIGenerator } from "./aiGenerator";

class BlueprintGenerator {
  private aiGenerator: any;

  constructor(anthropicApiKey?: string) {
    if (anthropicApiKey) {
      this.aiGenerator = createAIGenerator(anthropicApiKey, this);
    }
  }

  async generateBlueprint(config: CoopConfig, useAI: boolean = true): Promise<CoopBlueprint> {
    let baseBlueprint: Omit<CoopBlueprint, 'id' | 'createdAt' | 'updatedAt'>;

    // Try AI generation first if enabled
    if (useAI && this.aiGenerator) {
      try {
        return await this.aiGenerator.generateBlueprint(config);
      } catch (error) {
        console.error('AI generation failed, falling back to rule-based generation:', error);
        // Continue to rule-based generation
      }
    }
    
    // Generate rule-based blueprint
    baseBlueprint = await this.generateRuleBasedBlueprint(config);
    
    // Generate PDF asynchronously if needed
    let pdfBase64 = '';
    try {
      pdfBase64 = await this.generatePDF(baseBlueprint);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      // Continue without PDF if generation fails
    }

    return {
      ...baseBlueprint,
      id: '', // Will be set by the database
      pdfBase64,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  private async generateRuleBasedBlueprint(config: CoopConfig): Promise<Omit<CoopBlueprint, 'id' | 'createdAt' | 'updatedAt'>> {
    const materials = calculateMaterials(config);
    const instructions = generateBuildSteps(config);
    const dimensions = this.calculateDimensions(config);
    const cutList = this.generateCutList(config);
    const totalCost = calculateTotalCost(materials);
    
    return {
      config,
      materials,
      instructions,
      dimensions,
      cutList,
      totalCost,
      userId: '', // Will be set by the service
      pdfBase64: '' // Will be generated when needed
    };
  }

  private async generatePDF(_blueprint: Omit<CoopBlueprint, 'id' | 'createdAt' | 'updatedAt' | 'pdfBase64'>): Promise<string> {
    // TODO: Implement PDF generation logic
    // This is a placeholder - you'll need to implement actual PDF generation
    return Promise.resolve('');
  }

  private calculateDimensions(config: CoopConfig): Dimensions {
    const sizeMultipliers = {
      small: { length: 72, width: 48 }, // 6' x 4'
      medium: { length: 96, width: 72 }, // 8' x 6' 
      large: { length: 120, width: 96 }  // 10' x 8'
    };
    
    const baseDimensions = sizeMultipliers[config.size];
    
    return {
      overall: {
        length: baseDimensions.length,
        width: baseDimensions.width,
        height: 84, // 7 feet
        ridgeHeight: config.roofStyle === "flat" ? 84 : 96
      },
      nestingBoxes: {
        size: "12\" × 12\" × 12\"",
        quantity: config.nestingBox ? Math.ceil(config.chickens / 3) : 0,
        heightFromFloor: 18
      },
      chickenRun: {
        length: config.chickenRun ? baseDimensions.length * 1.5 : 0,
        width: config.chickenRun ? baseDimensions.width : 0,
        fenceHeight: 72
      }
    };
  }

  private generateCutList(config: CoopConfig): CutList[] {
    const sizeMultiplier = config.size === "small" ? 0.7 : config.size === "large" ? 1.4 : 1.0;
    
    return [
      {
        description: "2x4 × 96\" (studs)",
        pieces: Math.ceil(16 * sizeMultiplier)
      },
      {
        description: "2x4 × 72\" (plates)", 
        pieces: Math.ceil(8 * sizeMultiplier)
      },
      {
        description: "2x4 × 69\" (wall studs)",
        pieces: Math.ceil(24 * sizeMultiplier)
      },
      {
        description: "Plywood ½\" × 48\" × 96\"",
        pieces: config.size === "small" ? 3 : config.size === "large" ? 6 : 4
      }
    ];
  }
}

// Export a singleton instance
export const blueprintGenerator = new BlueprintGenerator(process.env.ANTHROPIC_API_KEY);
