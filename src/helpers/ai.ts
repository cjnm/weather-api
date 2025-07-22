/**
 * Generate an interesting fact about a location using Cloudflare AI
 * @param location - The location to generate a fact about
 * @param ai - Cloudflare AI binding
 * @returns Location fact string or null if AI is unavailable/fails
 */
export async function generateLocationFact(
  location: string,
  ai: any
): Promise<string | null> {
  try {
    if (!ai) {
      console.log("AI binding not available");
      return null;
    }

    const { response: fact } = await ai.run(
      "@cf/meta/llama-3-8b-instruct-awq",
      {
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that provides brief, interesting facts about locations.",
          },
          {
            role: "user",
            content: `Share one interesting fact about ${location} in 1-2 sentences.`,
          },
        ],
        max_tokens: 100,
      }
    );

    return fact?.trim() || null;
  } catch (error) {
    console.error("AI fact generation failed:", error);
    // Don't fail the request if AI fact generation fails
    return null;
  }
}
