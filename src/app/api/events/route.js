export async function POST(req) {
  try {
    const { input } = await req.json();
    const result = await fetchEvents(input);

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

async function fetchEvents(city = "Austin") {
//   const apiKey = "7289132e408159a52f798972c0a000a797b3fab6d82bde9e406bbf040a8081d6";
//   const url = `https://serpapi.com/search.json?engine=google_events&q=Events in ${city}&hl=en&gl=us&api_key=${apiKey}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     console.log(data);
//     return data;
//   } catch (err) {
//     console.error("Error fetching SerpApi events:", err);
//   }
}