import { CoopConfig, CoopBlueprint, Dimensions, CutList } from "@shared/types";
import { calculateMaterials, calculateTotalCost } from "./materialsCalculator";
import { generateBuildSteps, generatePDF } from "./instructionsGenerator";

export async function generateBlueprint(config: CoopConfig): Promise<CoopBlueprint> {
  const materials = calculateMaterials(config);
  const instructions = generateBuildSteps(config);
  const dimensions = calculateDimensions(config);
  const cutList = generateCutList(config);
  const totalCost = calculateTotalCost(materials);
  
  const blueprint: CoopBlueprint = {
    config,
    materials,
    instructions,
    dimensions,
    cutList,
    totalCost
  };
  
  // Generate PDF
  const pdfBytes = await generatePDF(blueprint);
  blueprint.pdfBase64 = Buffer.from(pdfBytes).toString("base64");
  
  return blueprint;
}

function calculateDimensions(config: CoopConfig): Dimensions {
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

function generateCutList(config: CoopConfig): CutList[] {
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
