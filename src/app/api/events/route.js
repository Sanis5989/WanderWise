import { parse, isBefore, isAfter, isWithinInterval, areIntervalsOverlapping } from "date-fns";

export async function POST(req) {
  try {
    const { data } = await req.json();
    const result = await fetchEvents(data?.city,data?.startDate,data?.endDate);

    if (!result) {
      return new Response(
        JSON.stringify({ error: "Searching Events Failed." }),
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

// async function fetchEvents(city) {
//   const apiKey = process.env.EVENTS_SERPS_API;
//   const url = `https://serpapi.com/search.json?engine=google_events&q=Events in ${city}&hl=en&gl=us&api_key=${apiKey}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     console.log(data);
//     return data;
//   } catch (err) {
//     console.error("Error fetching SerpApi events:", err);
//   }
// }

const cache = new Map();

async function fetchEvents(city,startDate, endDate ) {
  console.log(city,startDate, endDate)
  const cacheKey = `events-${city.toLowerCase()}-${startDate}-${endDate}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);

  // TTL = 10 minutes
  if (cached && now - cached.timestamp < 10 * 60 * 1000) {
    console.log("Returning cached data");
    return cached.filtered;
  }

  const apiKey = process.env.EVENTS_SERPS_API;
  const url = `https://serpapi.com/search.json?engine=google_events&q=Events in ${city}&hl=en&gl=us&api_key=${apiKey}`;

   try {
    const response = await fetch(url);
    const data = await response.json();

    const events = data.events_results || [];

    const filtered = events.filter(event => {
  const when = event?.date?.when;
  if (!when) return false;

  const eventRange = extractDateRange(when);
  if (!eventRange) return false;

  const stayRange = {
    start: new Date(startDate), // e.g., "2025-07-05"
    end: new Date(endDate),  // e.g., "2025-07-10"
  };

  return areIntervalsOverlapping(eventRange, stayRange, { inclusive: true });
});

    cache.set(cacheKey, { filtered, timestamp: now });

    return events;
  }
  catch (err) {
  console.error("Error fetching SerpApi events:", err);
  return null;
  }
}


//function to match day from events api to filter
function extractDateRange(when) {
  const now = new Date();

  // Match cases like: "Sat, Jul 5, 10 AM – Sun, Jul 6, 5 PM GMT+10"
  const multiDayMatch = when.match(/(?:\w{3}, )?([A-Za-z]+ \d{1,2})(.*?)–(?: \w{3}, )? ([A-Za-z]+ \d{1,2})/);

  if (multiDayMatch) {
    const startStr = `${multiDayMatch[1]}, ${now.getFullYear()}`;
    const endStr = `${multiDayMatch[3]}, ${now.getFullYear()}`;
    try {
      const start = parse(startStr, "MMM d, yyyy", now);
      const end = parse(endStr, "MMM d, yyyy", now);
      return { start, end };
    } catch {
      return null;
    }
  }

  // Match single-day events like: "Sat, Jul 5, 10 AM – 5 PM GMT+10"
  const singleDayMatch = when.match(/(?:\w{3}, )?([A-Za-z]+ \d{1,2})/);
  if (singleDayMatch) {
    const dateStr = `${singleDayMatch[1]}, ${now.getFullYear()}`;
    try {
      const parsed = parse(dateStr, "MMM d, yyyy", now);
      return { start: parsed, end: parsed };
    } catch {
      return null;
    }
  }

  return null;
}