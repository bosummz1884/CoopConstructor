import { apiRequest } from "@/lib/queryClient";
import { ApiResponse } from "@shared/types";

export async function generateCoopBlueprint(description: string): Promise<ApiResponse> {
  const response = await apiRequest("POST", "/api/coop", { description });
  return await response.json();
}

export async function downloadPDF(pdfBase64: string, filename: string = "coop-blueprint.pdf") {
  const pdfBlob = new Blob(
    [Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0))],
    { type: "application/pdf" }
  );
  
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
