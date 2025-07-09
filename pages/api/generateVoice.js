export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  // Fake voice data for testing
  const audioContent = "This is a fake voice response.";
  const buffer = Buffer.from(audioContent, "utf-8");

  res.setHeader("Content-Type", "audio/mpeg");
  res.status(200).send(buffer);
}
