import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Initialize Gemini API client on server
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Health Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "PDFStore API" });
  });

  // AI Assistant Route: Enhance Product Description or Summarize PDF
  app.post("/api/ai/generate-description", async (req, res) => {
    try {
      const { title, category, keywords } = req.body;
      const ai = getAiClient();

      if (!ai) {
        return res.json({
          description: `An essential, high-value PDF digital resource on ${title || "your topic"}. Packed with actionable insights, step-by-step guides, cheat sheets, and practical frameworks to master ${category || "this skill"}. Includes lifetime updates and instant download access.`,
          keyTakeaways: [
            "Complete step-by-step master guidance with actionable formulas",
            "Included copy-paste templates and customizable PDF worksheets",
            "High-resolution printable layout optimized for desktop, tablet, and mobile",
            "Instant secure download right after payment completion",
          ],
        });
      }

      const prompt = `Write a compelling, high-converting product sales description and 4 key bullet points for a digital PDF product titled "${title}". Category: ${category}. Keywords/Focus: ${keywords || "comprehensive guide"}.
      Return JSON with fields: "description" (string, ~2-3 paragraphs) and "keyTakeaways" (array of 4 strings).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({
        description: parsed.description || "Comprehensive PDF digital guide.",
        keyTakeaways: parsed.keyTakeaways || [
          "Actionable strategies and templates",
          "Step-by-step tutorials",
          "Print-ready high quality layout",
          "Instant access after checkout",
        ],
      });
    } catch (error) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: "Failed to generate AI content" });
    }
  });

  // AI Reader Assistant: Ask AI questions about a PDF product
  app.post("/api/ai/ask-about-pdf", async (req, res) => {
    try {
      const { pdfTitle, pdfDescription, question } = req.body;
      const ai = getAiClient();

      if (!ai) {
        return res.json({
          answer: `Regarding "${pdfTitle}": Yes! This PDF document includes comprehensive step-by-step instructions, templates, and downloadable resources tailored to help you succeed immediately upon purchase.`,
        });
      }

      const prompt = `You are an AI sales assistant for the digital PDF product "${pdfTitle}".
Description: ${pdfDescription}
Customer Question: "${question}"
Answer helpful, accurately, concise, and encourage the buyer to purchase the instant PDF download. Keep under 100 words.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({ answer: response.text });
    } catch (error) {
      console.error("AI Ask Error:", error);
      res.status(500).json({ error: "Failed to answer question" });
    }
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const templatePath = path.resolve(__dirname, "index.html");
        let template = fs.readFileSync(templatePath, "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
