import React, { useState } from "react";

export default function App() {
  const [script, setScript] = useState("");
  const [status, setStatus] = useState("Idle");
  const [audioURL, setAudioURL] = useState("");

  const handleGenerateVoice = async () => {
    setStatus("Generating voice...");

    try {
      const response = await fetch("/api/generateVoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: script }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Voice error:", error);
        setStatus("Error generating voice");
        return;
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      setStatus("Voice ready!");
    } catch (err) {
      console.error(err);
      setStatus("Error generating voice");
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
      {audioURL && <audio controls src={audioURL} />}
    </div>
  );
}
