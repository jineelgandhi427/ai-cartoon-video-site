import React, { useState } from "react";

// Map voice name to ElevenLabs voice ID
const voiceMap = {
  female: "21m00Tcm4TlvDq8ikWAM", // Rachel
  male: "TxGEqnHWrfWFTfGW9XjX",    // Joe
};

export default function App() {
  const [script, setScript] = useState("");
  const [voice, setVoice] = useState("female");
  const [character, setCharacter] = useState("default");
  const [status, setStatus] = useState("Idle");
  const [audioURL, setAudioURL] = useState("");

  const handleGenerateVideo = async () => {
    setStatus("Generating voice...");
    setAudioURL("");

    try {
      const response = await fetch("/api/generateVoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: script,
          voice: voiceMap[voice], // use voice ID
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err?.error || "Voice generation failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      setStatus("Voice generated!");
    } catch (err) {
      console.error("Voice error:", err);
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
      <div style={{ marginTop: "1rem" }}>
        <label>Voice: </label>
        <select value={voice} onChange={(e) => setVoice(e.target.value)}>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </div>
      <div>
        <label>Character: </label>
        <select value={character} onChange={(e) => setCharacter(e.target.value)}>
          <option value="default">Default</option>
          <option value="ninja">Ninja</option>
        </select>
      </div>
      <button onClick={handleGenerateVideo} style={{ marginTop: "1rem" }}>
        Generate Video
      </button>
      <p>Status: {status}</p>
      {audioURL && <audio controls src={audioURL} />}
    </div>
  );
}
