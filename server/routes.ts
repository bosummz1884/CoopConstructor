import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { parseInput } from "./utils/parseInput";
import { generateBlueprint } from "./services/blueprintGenerator";
import { CoopConfig, ApiResponse } from "@shared/types";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Coop blueprint generation endpoint
  app.post("/api/coop", async (req, res) => {
    try {
      const { description } = req.body as { description: string };
      
      if (!description || description.trim().length === 0) {
        const response: ApiResponse = {
          success: false,
          error: "Description is required"
        };
        return res.status(400).json(response);
      }

      // Parse the natural language input
      const parsedConfig = parseInput(description);
      const config: CoopConfig = {
        ...parsedConfig,
        description: description.trim()
      };

      // Generate complete blueprint
      const blueprint = await generateBlueprint(config);

      const response: ApiResponse = {
        success: true,
        data: blueprint
      };

      res.json(response);
    } catch (error) {
      console.error("Error generating blueprint:", error);
      const response: ApiResponse = {
        success: false,
        error: "Failed to generate blueprint. Please try again."
      };
      res.status(500).json(response);
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
