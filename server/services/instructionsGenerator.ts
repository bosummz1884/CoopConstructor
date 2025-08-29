import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { CoopConfig, BuildStep, CoopBlueprint } from "@shared/types";

export function generateBuildSteps(config: CoopConfig): BuildStep[] {
  const steps: BuildStep[] = [
    {
      step: 1,
      title: "Prepare the Foundation",
      description: "Level the ground and create a solid base for your chicken coop. This ensures stability and prevents moisture issues.",
      details: [
        "Clear and level area based on coop size",
        "Lay gravel base 2\" thick",
        "Install pressure-treated skids"
      ],
      estimatedTime: "2-3 hours"
    },
    {
      step: 2,
      title: "Build the Floor Frame",
      description: "Construct a sturdy floor frame using pressure-treated lumber to support the entire structure.",
      details: [
        "Cut 2x4 lumber to size",
        "Assemble rectangular frame with joists",
        "Attach plywood flooring"
      ],
      estimatedTime: "3-4 hours"
    },
    {
      step: 3,
      title: "Construct Wall Frames",
      description: "Build four wall frames, including openings for doors, windows, and nesting box access.",
      details: [
        "Frame all four walls with 2x4 studs",
        "Cut openings for door and windows",
        config.nestingBox ? "Install nesting box frame cutouts" : "Skip nesting box openings"
      ],
      estimatedTime: "4-5 hours"
    },
    {
      step: 4,
      title: "Install Roof Structure",
      description: `Build the ${config.roofStyle} roof frame and prepare for roofing material installation.`,
      details: [
        "Cut rafters to proper angle",
        "Install ridge beam",
        "Secure roof sheathing"
      ],
      estimatedTime: "3-4 hours"
    },
    {
      step: 5,
      title: "Add Siding and Roofing",
      description: `Install ${config.material} siding and metal roofing to weatherproof the structure.`,
      details: [
        "Install siding panels",
        "Add roofing material",
        "Install gutters if desired"
      ],
      estimatedTime: "4-6 hours"
    }
  ];
  
  if (config.nestingBox) {
    steps.push({
      step: 6,
      title: "Build Nesting Boxes",
      description: "Construct and install nesting boxes for egg laying.",
      details: [
        "Build individual nesting compartments",
        "Install hinged lids for easy cleaning",
        "Add perch in front of boxes"
      ],
      estimatedTime: "2-3 hours"
    });
  }
  
  if (config.roostingBar) {
    steps.push({
      step: config.nestingBox ? 7 : 6,
      title: "Install Roosting Bars",
      description: "Add roosting bars for chickens to sleep comfortably.",
      details: [
        "Cut roosting bars to width",
        "Install at appropriate height",
        "Ensure proper spacing between bars"
      ],
      estimatedTime: "1-2 hours"
    });
  }
  
  if (config.chickenRun) {
    const stepNum = steps.length + 1;
    steps.push({
      step: stepNum,
      title: "Construct Chicken Run",
      description: "Build an enclosed outdoor area for chickens to exercise safely.",
      details: [
        "Install fence posts",
        "Attach hardware cloth fencing",
        "Add gate for access"
      ],
      estimatedTime: "3-4 hours"
    });
  }
  
  if (config.wheels) {
    const stepNum = steps.length + 1;
    steps.push({
      step: stepNum,
      title: "Install Mobility Wheels",
      description: "Add heavy-duty casters to make the coop mobile.",
      details: [
        "Attach wheel brackets to frame",
        "Install caster wheels",
        "Test mobility and stability"
      ],
      estimatedTime: "1-2 hours"
    });
  }
  
  return steps;
}

export async function generatePDF(blueprint: CoopBlueprint): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  
  // Add cover page
  await addCoverPage(pdfDoc, blueprint);
  
  // Add materials list page
  await addMaterialsPage(pdfDoc, blueprint);
  
  // Add instructions pages
  await addInstructionsPages(pdfDoc, blueprint);
  
  return await pdfDoc.save();
}

async function addCoverPage(pdfDoc: PDFDocument, blueprint: CoopBlueprint) {
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Title
  page.drawText("Chicken Coop Blueprint", {
    x: 50,
    y: 740,
    size: 24,
    font: boldFont,
    color: rgb(0.133, 0.773, 0.337) // Primary green
  });
  
  // Configuration summary
  const { config } = blueprint;
  page.drawText("Configuration Summary", {
    x: 50,
    y: 700,
    size: 16,
    font: boldFont
  });
  
  const configText = [
    `Chickens: ${config.chickens}`,
    `Size: ${config.size}`,
    `Roof Style: ${config.roofStyle}`,
    `Material: ${config.material}`,
    `Features: ${[
      config.nestingBox && "Nesting Boxes",
      config.roostingBar && "Roosting Bars", 
      config.chickenRun && "Chicken Run",
      config.wheels && "Mobile Wheels"
    ].filter(Boolean).join(", ") || "Basic structure"}`
  ];
  
  configText.forEach((text, index) => {
    page.drawText(text, {
      x: 50,
      y: 670 - (index * 20),
      size: 12,
      font
    });
  });
  
  // Total cost
  page.drawText(`Total Estimated Cost: $${blueprint.totalCost.toFixed(2)}`, {
    x: 50,
    y: 580,
    size: 14,
    font: boldFont,
    color: rgb(0.231, 0.514, 0.969) // Accent blue
  });
}

async function addMaterialsPage(pdfDoc: PDFDocument, blueprint: CoopBlueprint) {
  const page = pdfDoc.addPage([612, 792]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  page.drawText("Materials List", {
    x: 50,
    y: 740,
    size: 20,
    font: boldFont
  });
  
  // Table headers
  page.drawText("Material", { x: 50, y: 710, size: 12, font: boldFont });
  page.drawText("Quantity", { x: 250, y: 710, size: 12, font: boldFont });
  page.drawText("Size/Specs", { x: 350, y: 710, size: 12, font: boldFont });
  page.drawText("Cost", { x: 500, y: 710, size: 12, font: boldFont });
  
  // Materials
  blueprint.materials.forEach((material, index) => {
    const y = 690 - (index * 20);
    page.drawText(material.name, { x: 50, y, size: 10, font });
    page.drawText(material.quantity.toString(), { x: 250, y, size: 10, font });
    page.drawText(material.size, { x: 350, y, size: 10, font });
    page.drawText(`$${material.cost.toFixed(2)}`, { x: 500, y, size: 10, font });
  });
  
  // Total
  const totalY = 690 - (blueprint.materials.length * 20) - 20;
  page.drawText(`Total Cost: $${blueprint.totalCost.toFixed(2)}`, {
    x: 400,
    y: totalY,
    size: 12,
    font: boldFont
  });
}

async function addInstructionsPages(pdfDoc: PDFDocument, blueprint: CoopBlueprint) {
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  let currentPage = pdfDoc.addPage([612, 792]);
  let currentY = 740;
  
  currentPage.drawText("Build Instructions", {
    x: 50,
    y: currentY,
    size: 20,
    font: boldFont
  });
  currentY -= 40;
  
  blueprint.instructions.forEach((step) => {
    // Check if we need a new page
    if (currentY < 150) {
      currentPage = pdfDoc.addPage([612, 792]);
      currentY = 740;
    }
    
    // Step title
    currentPage.drawText(`Step ${step.step}: ${step.title}`, {
      x: 50,
      y: currentY,
      size: 14,
      font: boldFont
    });
    currentY -= 20;
    
    // Description
    currentPage.drawText(step.description, {
      x: 50,
      y: currentY,
      size: 10,
      font,
      maxWidth: 500
    });
    currentY -= 25;
    
    // Details
    step.details.forEach((detail) => {
      currentPage.drawText(`• ${detail}`, {
        x: 70,
        y: currentY,
        size: 9,
        font
      });
      currentY -= 15;
    });
    
    // Time estimate
    currentPage.drawText(`Estimated time: ${step.estimatedTime}`, {
      x: 70,
      y: currentY,
      size: 9,
      font,
      color: rgb(0.231, 0.514, 0.969)
    });
    currentY -= 30;
  });
}
