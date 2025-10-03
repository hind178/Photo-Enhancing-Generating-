import { GoogleGenAI, Modality } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROFESSIONAL_PROMPT = `
You are a specialized AI image generator with the capabilities of a world-class advertising photographer. Your mission is to analyze the user-submitted product photo and then **generate a brand new, hyper-realistic, studio-quality photograph** of that exact product.

The generated image should not look like an edit or a retouch of the original photo. It must look like a completely fresh photograph taken under perfect studio conditions.

**EXECUTION STEPS:**

1.  **Generate a New Image:** Create a new, pristine, high-resolution image of the product.
2.  **Perfect Background:** Place the newly generated product on a flawless, pure white background (#FFFFFF).
3.  **Studio Quality:** Render the product with perfect commercial lighting, realistic textures, sharp focus, and vibrant, accurate colors.
4.  **Realistic Shadow:** Generate a subtle, soft, and realistic drop shadow to ground the product on the white surface, making it look three-dimensional.

**THE GOLDEN RULE: ABSOLUTE FIDELITY TO ORIGINAL DESIGN (NON-NEGOTIABLE)**

This is the most important instruction. You MUST perfectly and exactly replicate every single detail from the original product image. This includes:

*   **All text, typography, and writing (including Arabic script).** There can be NO spelling errors, NO font changes, and NO misplaced characters.
*   **All logos, brand marks, and symbols.** They must be IDENTICAL in shape, color, and placement.
*   **All design elements, patterns, and graphics on the product.**

ZERO deviation from the original design elements is permitted. The original photo is the absolute source of truth for all text and graphics. Your task is to regenerate the *photograph*, not the *product's design*.

**FINAL OUTPUT:**
Your final output must be ONLY the newly generated image. Do not include any text, explanations, or commentary in your response.
`;

export const professionalizeProductImage = async (
  imageFile: File
): Promise<{ enhancedImageUrl: string | null; textResponse: string | null; }> => {
  try {
    const mainBase64 = (await fileToBase64(imageFile)).split(',')[1];
    if (!mainBase64) {
      throw new Error("Could not extract base64 data from the image file.");
    }
    
    const parts = [
      {
        inlineData: {
          data: mainBase64,
          mimeType: imageFile.type,
        },
      },
      { text: PROFESSIONAL_PROMPT },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT], 
      },
    });

    let enhancedImageUrl: string | null = null;
    let textResponse: string | null = null;

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes = part.inlineData.data;
          enhancedImageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        } else if (part.text) {
          textResponse = part.text;
        }
      }
    }

    if (!enhancedImageUrl) {
        throw new Error(textResponse || "The model did not return an image. It may have refused the request.");
    }

    return { enhancedImageUrl, textResponse };
  } catch (error) {
    console.error("Error professionalizing image with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};