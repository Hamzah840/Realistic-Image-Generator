import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates an image using a text prompt with the Imagen 4 model.
 * @param prompt The text prompt describing the desired image.
 * @returns A promise that resolves to the base64 encoded string of the generated image.
 */
export async function generateImageFromPrompt(
  prompt: string
): Promise<string> {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9', // Hardcode landscape aspect ratio
        outputMimeType: 'image/png',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const image = response.generatedImages[0];
      // The property is `image.image.imageBytes`, not just `image.imageBytes`
      if (image.image?.imageBytes) {
        return image.image.imageBytes;
      }
    }

    throw new Error("No image data found in the Gemini API response.");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        // Re-throw with a more user-friendly message if possible
        if (error.message.includes('SAFETY')) {
            throw new Error('The request was blocked due to safety policies. Please adjust your prompt.');
        }
        throw new Error(`API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
}