import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("GEMINI_API_KEY not set");
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

app.post('/generate', async (req, res) => {
    try {
        const { prompt, filter } = req.body;
        const finalPrompt = `phone wallpaper, ${filter ? `${filter} style, ` : ''}${prompt}, 9:16 aspect ratio, high detail, cinematic`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: finalPrompt,
            config: {
                numberOfImages: 4,
                aspectRatio: '9:16',
                outputMimeType: 'image/jpeg',
            },
        });

        if (!response.generatedImages || response.generatedImages.length === 0) {
            throw new Error("No images generated");
        }

        const imageUrls = response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
        res.json({ images: imageUrls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate images' });
    }
});

app.listen(3002, () => console.log('Server running on port 3002'));
