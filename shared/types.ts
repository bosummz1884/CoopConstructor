export interface CoopConfig {
  chickens: number;
  nestingBox: boolean;
  roostingBar: boolean;
  chickenRun: boolean;
  wheels: boolean;
  roofStyle: "gable" | "flat" | "slanted";
  size: "small" | "medium" | "large";
  material: "wood" | "metal" | "mixed";
  description: string;
}

export interface Material {
  name: string;
  quantity: number;
  size: string;
  cost: number;
}

export interface BuildStep {
  step: number;
  title: string;
  description: string;
  details: string[];
  estimatedTime: string;
  isActive?: boolean;
}

export interface Dimensions {
  overall: {
    length: number;
    width: number;
    height: number;
    ridgeHeight: number;
  };
  nestingBoxes: {
    size: string;
    quantity: number;
    heightFromFloor: number;
  };
  chickenRun: {
    length: number;
    width: number;
    fenceHeight: number;
  };
}

export interface CutList {
  description: string;
  pieces: number;
}

export interface CoopBlueprint {
  config: CoopConfig;
  materials: Material[];
  instructions: BuildStep[];
  dimensions: Dimensions;
  cutList: CutList[];
  totalCost: number;
  pdfBase64?: string;
}

export interface ApiResponse {
  success: boolean;
  data?: CoopBlueprint;
  error?: string;
}
