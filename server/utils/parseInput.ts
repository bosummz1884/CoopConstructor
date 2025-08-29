import { CoopConfig } from "@shared/types";

export function parseInput(input: string): Omit<CoopConfig, 'description'> {
  const lowered = input.toLowerCase();

  return {
    chickens: extractChickenCount(lowered),
    nestingBox: lowered.includes("nest"),
    roostingBar: lowered.includes("roost"),
    chickenRun: lowered.includes("run"),
    wheels: lowered.includes("wheel") || lowered.includes("mobile") || lowered.includes("movable"),
    roofStyle: extractRoofStyle(lowered),
    size: extractSize(lowered),
    material: extractMaterial(lowered)
  };
}

function extractChickenCount(input: string): number {
  const matches = input.match(/(\d+)\s*chicken/);
  if (matches) {
    return parseInt(matches[1], 10);
  }
  
  // Look for written numbers
  const numberWords = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
  };
  
  for (const [word, num] of Object.entries(numberWords)) {
    if (input.includes(word)) {
      return num;
    }
  }
  
  return 4; // default
}

function extractRoofStyle(input: string): "gable" | "flat" | "slanted" {
  if (input.includes("gable")) return "gable";
  if (input.includes("flat")) return "flat";
  return "slanted"; // default
}

function extractSize(input: string): "small" | "medium" | "large" {
  if (input.includes("large")) return "large";
  if (input.includes("medium")) return "medium";
  if (input.includes("small")) return "small";
  
  // Infer from chicken count
  const chickenCount = extractChickenCount(input);
  if (chickenCount <= 4) return "small";
  if (chickenCount <= 8) return "medium";
  return "large";
}

function extractMaterial(input: string): "wood" | "metal" | "mixed" {
  if (input.includes("metal") || input.includes("steel")) return "metal";
  if (input.includes("mixed")) return "mixed";
  return "wood"; // default
}
