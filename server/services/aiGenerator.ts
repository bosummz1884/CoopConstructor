import { CoopConfig, CoopBlueprint } from "@shared/types";
import Anthropic from '@anthropic-ai/sdk';

export class AIGenerator {
  private client: Anthropic;
  private fallbackGenerator: any; // Reference to the original blueprint generator

  constructor(apiKey: string, fallbackGenerator: any) {
    this.client = new Anthropic({ apiKey });
    this.fallbackGenerator = fallbackGenerator;
  }

  async generateBlueprint(config: CoopConfig): Promise<CoopBlueprint> {
    try {
      // Try to generate with Claude first
      const prompt = this.createPrompt(config);
      const response = await this.client.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      });

      // Parse Claude's response
      const aiBlueprint = this.parseAIResponse(response.content[0].text);
      
      // Validate and return the AI-generated blueprint
      return this.validateBlueprint(aiBlueprint, config);
    } catch (error) {
      console.error('AI generation failed, falling back to rule-based generator:', error);
      return this.fallbackGenerator.generateBlueprint(config);
    }
  }

  private createPrompt(config: CoopConfig): string {
    // Map size to approximate dimensions
    const sizeMap = {
      small: { length: 4, width: 4, height: 6 },
      medium: { length: 6, width: 4, height: 8 },
      large: { length: 8, width: 6, height: 8 }
    };
    
    const dimensions = sizeMap[config.size] || sizeMap.medium;
    
    return `Generate a detailed chicken coop blueprint with these specifications:
    - Size: ${dimensions.length}ft (L) x ${dimensions.width}ft (W) x ${dimensions.height}ft (H)
    - Number of chickens: ${config.chickens}
    - Features:
      * ${config.nestingBox ? 'Includes nesting boxes' : 'No nesting boxes'}
      * ${config.roostingBar ? 'Includes roosting bars' : 'No roosting bars'}
      * ${config.chickenRun ? 'Includes chicken run' : 'No chicken run'}
      * ${config.wheels ? 'Mobile with wheels' : 'Stationary'}
    - Roof Style: ${config.roofStyle}
    - Primary Material: ${config.material}
    
    Please provide a JSON response with:
    1. materials: Array of required materials with quantities and specifications
    2. instructions: Step-by-step building instructions
    3. dimensions: Detailed measurements
    4. cutList: List of cuts needed
    5. totalCost: Estimated total cost`;
  }

  private parseAIResponse(response: string): Partial<CoopBlueprint> {
    try {
      // Extract JSON from markdown code block if present
      const jsonMatch = response.match(/```(?:json)?\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : response;
      return JSON.parse(jsonString);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to parse AI response: ${errorMessage}`);
    }
  }

  private validateBlueprint(blueprint: Partial<CoopBlueprint>, config: CoopConfig): CoopBlueprint {
    // Basic validation of the blueprint
    if (!blueprint.materials || !Array.isArray(blueprint.materials)) {
      throw new Error('Invalid blueprint: missing or invalid materials');
    }
    if (!blueprint.instructions || !Array.isArray(blueprint.instructions)) {
      throw new Error('Invalid blueprint: missing or invalid instructions');
    }
    if (!blueprint.dimensions) {
      throw new Error('Invalid blueprint: missing dimensions');
    }
    if (!blueprint.cutList || !Array.isArray(blueprint.cutList)) {
      throw new Error('Invalid blueprint: missing or invalid cut list');
    }
    if (blueprint.totalCost === undefined || blueprint.totalCost === null) {
      throw new Error('Invalid blueprint: missing total cost');
    }

    // Create a complete blueprint with defaults
    const completeBlueprint: CoopBlueprint = {
      id: '', // Will be set by the database
      config,
      materials: blueprint.materials,
      instructions: blueprint.instructions,
      dimensions: blueprint.dimensions as any, // Casting as any since we've validated required fields
      cutList: blueprint.cutList,
      totalCost: blueprint.totalCost,
      userId: '', // Will be set by the service
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return completeBlueprint;
  }
}

export function createAIGenerator(apiKey: string, fallbackGenerator: any) {
  return new AIGenerator(apiKey, fallbackGenerator);
}
