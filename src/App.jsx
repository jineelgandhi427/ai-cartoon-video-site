import React, { useState } from "react";

export default function App() {
  const [script, setScript] = useState("");
  const [status, setStatus] = useState("Idle");
  const [cloudURL, setCloudURL] = useState("");

  const handleGenerateVoice = async () => {
    setStatus("Generating voice...");

    try {
      // 1. Generate voice from ElevenLabs (your API route)
      const response = await fetch("/api/generateVoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: script, voice: "ZT9u07TYPVl83ejeLakq" }), // use your voice ID
      });

      if (!response.ok) {
        const err = await response.json();
        console.error("Voice error:", err);
        setStatus("Error generating voice");
        return;
      }

      const audioBlob = await response.blob();
      const file = new File([audioBlob], "voice.mp3", { type: "audio/mpeg" });

      // 2. Upload voice to Cloudinary
      setStatus("Uploading to Cloudinary...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "unsigned_preset"); // your preset
      formData.append("resource_type", "auto"); // Let Cloudinary detect type

      const uploadRes = await fetch(
        "https://api.cloudinary.com/v1_1/dteqwe3nw/auto/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();

      if (uploadData.secure_url) {
        setCloudURL(uploadData.secure_url);
        setStatus("Voice uploaded to Cloudinary!");
      } else {
        console.error("Cloudinary error:", uploadData);
        setStatus("Error uploading to Cloudinary");
      }
    } catch (err) {
      console.error(err);
      setStatus("Unexpected error");
    }
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "2rem" }}>
      <h1>AI Cartoon Video Creator</h1>
      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="Enter your script..."
        style={{ width: "100%", height: "100px" }}
      />
      <br />
      <button onClick={handleGenerateVoice} style={{ marginTop: "1rem" }}>
        Generate Voice
      </button>
      <p>Status: {status}</p>

      {cloudURL && (
        <div>
          <p>✅ Uploaded Audio:</p>
          <audio controls src={cloudURL} />
          <p>Cloudinary URL: <a href={cloudURL} target="_blank">{cloudURL}</a></p>
        </div>
      )}
    </div>
  );
}
