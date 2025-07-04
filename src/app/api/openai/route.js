import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API,
});


export async function POST(req) {
  try {
    const { input } = await req.json();
    const result = await generateItinerary(input);

    if (!result) {
      return new Response(
        JSON.stringify({ error: "Itinerary generation failed" }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("POST error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

// system prompt to generate daily itenary plan
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

//function to generate itenary prompting openai model
async function generateItinerary(input) {
  try {
    const userPrompt =  `I am planning a trip from ${input.from} to ${input.to}.
The travel dates are from ${input.startDate} to ${input.endDate}.
And the flight details are ${JSON.stringify(input.flight)}
Generate the full itinerary including:
- Daily plans with activities, local attractions, and recommended food or cultural spots.
Be creative, but keep it realistic and travel-efficient.
Return ONLY valid JSON.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: SYSTEM_PROMPT.trim() },
        { role: "user", content: userPrompt.trim() },
      ],
    });

    const content = response.choices[0]?.message?.content;
    // console.log(content)
    if (!content) throw new Error("No content returned");
    
    return JSON.parse(content);
  } catch (error) {
    console.error("Itinerary generation failed:", error);
    return null;
  }
}



