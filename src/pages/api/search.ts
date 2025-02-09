import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q } = req.query;
  if (!q || typeof q !== "string") {
    res.status(400).json({ error: "Missing query parameter" });
    return;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        q
      )}&countrycodes=it&viewbox=13.28539,42.39621,13.51267,42.32289&bounded=1&format=json`
    );
    const data = await response.json();
    res.status(200).json(data.slice(0, 3)); // Limit to 3 results
  } catch (error) {
    console.error("Error fetching from Nominatim:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
