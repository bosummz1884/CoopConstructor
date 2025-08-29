import { CoopConfig, Material } from "@shared/types";

export function calculateMaterials(config: CoopConfig): Material[] {
  const { size, material, chickenRun, wheels, nestingBox } = config;
  
  const materials: Material[] = [];
  
  // Base lumber requirements
  const lumberMultiplier = size === "small" ? 0.7 : size === "large" ? 1.4 : 1.0;
  
  materials.push({
    name: "Pressure Treated Lumber",
    quantity: Math.ceil(12 * lumberMultiplier),
    size: "2x4x8ft",
    cost: 8 * Math.ceil(12 * lumberMultiplier)
  });
  
  // Siding material
  const sidingSheets = size === "small" ? 3 : size === "large" ? 6 : 4;
  const sidingMaterial = material === "metal" ? "Metal Siding" : "Plywood Siding";
  const sidingCost = material === "metal" ? 45 : 30;
  
  materials.push({
    name: sidingMaterial,
    quantity: sidingSheets,
    size: material === "metal" ? "4x8ft panels" : "4x8ft 1/2\"",
    cost: sidingCost * sidingSheets
  });
  
  // Hardware cloth for ventilation and run
  const meshSquareFeet = chickenRun ? 80 : 50;
  materials.push({
    name: "Hardware Cloth",
    quantity: meshSquareFeet,
    size: "1/2\" mesh",
    cost: 1.5 * meshSquareFeet
  });
  
  // Roofing
  const roofingSquareFeet = size === "small" ? 40 : size === "large" ? 80 : 60;
  materials.push({
    name: "Metal Roofing",
    quantity: roofingSquareFeet,
    size: "Corrugated steel",
    cost: 3 * roofingSquareFeet
  });
  
  // Hardware
  materials.push({
    name: "Hinges & Hardware",
    quantity: 1,
    size: "Heavy duty set",
    cost: 45
  });
  
  // Wheels if requested
  if (wheels) {
    materials.push({
      name: "Wheels (Caster)",
      quantity: 4,
      size: "6\" heavy duty",
      cost: 20 * 4
    });
  }
  
  // Nesting box materials
  if (nestingBox) {
    materials.push({
      name: "Nesting Box Lumber",
      quantity: 1,
      size: "Additional 2x4 & plywood",
      cost: 35
    });
  }
  
  return materials;
}

export function calculateTotalCost(materials: Material[]): number {
  const materialsCost = materials.reduce((sum, material) => sum + material.cost, 0);
  const tax = materialsCost * 0.08; // 8% tax
  return Math.round((materialsCost + tax) * 100) / 100;
}
