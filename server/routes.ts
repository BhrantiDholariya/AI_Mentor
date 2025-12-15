import type { Express } from "express";
import { createServer, type Server } from "http";
import { chatRequestSchema } from "@shared/schema";

const LYZR_API_URL = process.env.LYZR_API_URL || "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
const LYZR_API_KEY = process.env.LYZR_API_KEY;
const USER_ID = process.env.LYZR_USER_ID || "";
const AGENT_ID = process.env.LYZR_AGENT_ID || "";
const SESSION_ID = process.env.LYZR_SESSION_ID || "";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/chat", async (req, res) => {
    try {
      if (!LYZR_API_KEY) {
        console.error("LYZR_API_KEY is not configured");
        return res.status(500).json({ 
          error: "AI Mentor is not properly configured. Please set up the API key." 
        });
      }

      const parseResult = chatRequestSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        return res.status(400).json({ 
          error: "Invalid request", 
          details: parseResult.error.errors 
        });
      }

      const { message } = parseResult.data;

      const response = await fetch(LYZR_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": LYZR_API_KEY,
        },
        body: JSON.stringify({
          user_id: USER_ID,
          agent_id: AGENT_ID,
          session_id: SESSION_ID,
          message: message,
        }),
      });

      if (!response.ok) {
        console.error("Lyzr API error:", response.status, response.statusText);
        return res.status(502).json({ 
          error: "Failed to get response from AI Mentor" 
        });
      }

      const data = await response.json();
      
      let responseText = "";
      if (data.response) {
        responseText = data.response;
      } else if (data.message) {
        responseText = data.message;
      } else if (typeof data === "string") {
        responseText = data;
      } else {
        responseText = JSON.stringify(data);
      }

      return res.json({ response: responseText });
    } catch (error) {
      console.error("Chat API error:", error);
      return res.status(500).json({ 
        error: "An unexpected error occurred" 
      });
    }
  });

  return httpServer;
}
