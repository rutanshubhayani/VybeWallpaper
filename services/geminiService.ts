// Removed server-side code, now using backend API

export async function generateWallpapers(prompt: string, filter: string | null): Promise<string[]> {
    try {
        const response = await fetch('http://localhost:3002/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt, filter }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate images');
        }

        const data = await response.json();
        return data.images;
    } catch (error) {
        console.error("Error generating images:", error);
        throw new Error("Failed to communicate with the image generation service.");
    }
}
