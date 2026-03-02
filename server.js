const express = require('express');
const path = require("path");
const fs = require("fs");
import { fileURLToPath } from 'url';
import path from 'path';
// const dotenv = require("dotenv").config();

// initial
const app = express()
app.use(express.json())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// get google studio ai api
const botConfig = JSON.parse(fs.readFileSync(path.join(__dirname, "bot-instruction.json"), "utf8"));
const model = "gemini-2.5-flash";

const personalStateInstruction = `
${botConfig.personal_state.instruction}

ROLE:
You are a strict JSON generator.
You are a state evaluation engine.

OUTPUT RULES:
- Return ONLY a valid JSON object.
- If you cannot complete the full JSON, return {} exactly.

STRUCTURE:
- Follow EXACTLY this JSON structure:
${JSON.stringify(botConfig.personal_state.form)}

SCALE:
- Use this scale definition:
${JSON.stringify(botConfig.personal_state.scale_definition)}
- Also don't let the values too low.

CONSTRAINTS:
- Do NOT add or remove any keys.
- Do NOT rename keys.
- Each value must be a FLOATING POINT NUMBER.
- Each value represents a DELTA adjustment, not an absolute state.
`.trim();

app.post("/api/personal-state-init", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) 
            return res.status(400).json({ error: "Missing prompt" });

        const r = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=` +
            process.env.GG_AI_STUDIO_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: personalStateInstruction }]
                    },
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: prompt }]
                        }
                    ],
                    generationConfig: {
                        temperature: 0,
                        maxOutputTokens: 200
                    }
                })
            }
        );

        const data = await r.json();
        console.log(data);
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;

        res.json({ reply: text });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.use(express.static(path.join(__dirname, "public")));

// vercel
module.exports = app;

// run local
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log('Server running on port: ', PORT)
// })