// utils/ai.ts

const SYSTEM_PROMPT = `
You are a smart travel assistant. 
Generate a realistic, full travel itinerary including:
1. Daily itinerary with up to 4 activities per day
2. Cultural/local recommendations (attractions, food, etc.)
Return ONLY valid JSON following this structure:

{
  "dailyPlan": [
    {
      "date": "YYYY-MM-DD",
      "summary": "Day overview",
      "activities": [
        {
          "time": "HH:MM",
          "title": "Activity title",
          "description": "What it involves",
          "location": "Optional location"
        }
      ]
    }
  ]
}
`;

export async function generateItinerary(input) {
  try {
    const userPrompt = `
I am planning a trip from ${input.from} to ${input.to}.
The travel dates are from ${input.startDate} to ${input.endDate}.
And the flight details are ${input.flight}
Generate the full itinerary including:
- Daily plans with activities, local attractions, and recommended food or cultural spots.
Be creative, but keep it realistic and travel-efficient.
Return ONLY valid JSON.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      response_format: "json",
      messages: [
        { role: "system", content: SYSTEM_PROMPT.trim() },
        { role: "user", content: userPrompt.trim() },
      ],
    });

    const content = response.choices[0]?.message?.content;

    if (!content) throw new Error("No content returned from model");

    return JSON.parse(content);
  } catch (error) {
    console.error("Itinerary generation failed:", error);
    return null;
  }
}

