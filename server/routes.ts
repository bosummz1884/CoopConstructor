import type { Express } from "express";
import { createServer, type Server } from "http";
import { parseInput } from "./utils/parseInput";
import { blueprintGenerator } from "./services/blueprintGenerator";
import { CoopConfig, ApiResponse } from "@shared/types";
import authRoutes from "./routes/auth.routes";
import { authenticate } from "./middleware/auth";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // API Routes
  const apiRouter = express.Router();
  
  // Authentication routes
  apiRouter.use('/auth', authRoutes);
  
  // Protected routes
  apiRouter.use(authenticate);
  
  // Coop blueprint generation endpoint (now protected)
  apiRouter.post("/coop", async (req, res) => {
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
        description: description.trim(),
        userId: req.user?.userId // Add user ID to the config
      };

      // Generate complete blueprint using the blueprintGenerator instance
      const blueprint = await blueprintGenerator.generateBlueprint(config);

      // TODO: Save blueprint to database with user association
      
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

  // Error handling middleware
  apiRouter.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ success: false, error: message });
  });

  // Health check endpoint (public)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mount API routes under /api
  app.use('/api', apiRouter);

  // Create HTTP server
  const server = createServer(app);
  return server;
}
