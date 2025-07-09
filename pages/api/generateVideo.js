export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  const { audioUrl } = req.body;
  const D_ID_API_KEY = process.env.DID_API_KEY;

  try {
    const response = await fetch("https://api.d-id.com/talks", {
      method: "POST",
      headers: {
        Authorization: `Basic ${D_ID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        script: {
          type: "audio",
          audio_url: audioUrl,
        },
        source_url: "https://create-images-results.d-id.com/Default/avatar.jpeg", // You can customize this
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("D-ID error:", err);
    res.status(500).json({ error: "D-ID API failed" });
  }
}
