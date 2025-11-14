// server/index.js
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GENAI_API_KEY; // server-side secret

if (!API_KEY) {
  console.error("GENAI_API_KEY not set");
  process.exit(1);
}

const ai = new GoogleGenerativeAI({ apiKey: API_KEY });

const app = express();
app.use(bodyParser.json());

// Serve frontend static (after build) from /dist
const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));

// Simple endpoint to generate a one-off response
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt required" });

    const response = await ai.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
      },
    });

    // adapt depending on sdk shape; this returns text
    const text =
      response?.response?.text?.() ?? response?.response?.text ?? response?.text ?? "";

    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "generation_failed", details: String(err) });
  }
});

// Fallback: serve index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
