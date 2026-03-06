import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// const dotenv = require("dotenv").config();

//#region INITIAL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// initial
const app = express();

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});
//#endregion

// #region get google studio ai api
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

// test 
// app.post("/api/personal-state-init", async (req, res) => {
//     res.json({reply: `{
//                 "ambition": 0.1,
//                 "adaptability": 0.3,
//                 "self_trust": 0.5,
//                 "risk_sensitivity": -0.2,
//                 "consistency": 1,
//                 "openness": 0.6}`
//             })
// })
//#endregion

//#region HOSTING
// vercel
export default app

// run local
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log('Server running on port: ', PORT)
// })
//#endregion