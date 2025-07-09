import React, { useState } from "react";

const voices = [
  { name: "Rachel", id: "21m00Tcm4TlvDq8ikWAM" },
  { name: "Aria", id: "ZT9u07TYPVl83ejeLakq" },
  { name: "Brian", id: "pNInz6obpgDQGcFmaJgB" },
];

export default function Home() {
  const [script, setScript] = useState("");
  const [voiceId, setVoiceId] = useState(voices[0].id);
  const [character, setCharacter] = useState("default");
  const [status, setStatus] = useState("Idle");
  const [audioURL, setAudioURL] = useState("");

  const handleGenerateVoice = async () => {
    setStatus("Generating voice...");
    setAudioURL("");

    try {
      const response = await fetch("/api/generateVoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: script, voice: voiceId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to generate voice");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      setStatus("Voice ready!");
    } catch (err) {
      console.error("Voice error:", err);
      setStatus("Error generating voice");
    }
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "2rem", maxWidth: "700px", margin: "auto" }}>
      <h1>AI Cartoon Video Creator</h1>

      <textarea
        placeholder="Enter your script..."
        value={script}
        onChange={(e) => setScript(e.target.value)}
        style={{ width: "100%", height: "120px", marginBottom: "1rem" }}
      />

      <div style={{ marginBottom: "1rem" }}>
        <label>Voice: </label>
        <select value={voiceId} onChange={(e) => setVoiceId(e.target.value)}>
          {voices.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>Character: </label>
        <select value={character} onChange={(e) => setCharacter(e.target.value)}>
          <option value="default">Default</option>
          <option value="ninja">Ninja</option>
          <option value="robot">Robot</option>
        </select>
      </div>

      <button onClick={handleGenerateVoice}>Generate Voice</button>

      <p style={{ marginTop: "1rem" }}><strong>Status:</strong> {status}</p>

      {audioURL && (
        <div style={{ marginTop: "1rem" }}>
          <audio src={audioURL} controls />
        </div>
      )}
    </div>
  );
}
