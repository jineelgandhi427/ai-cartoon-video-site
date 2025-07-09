import React, { useState } from "react";

export default function App() {
  const [script, setScript] = useState("");
  const [voice, setVoice] = useState("female");
  const [character, setCharacter] = useState("default");
  const [status, setStatus] = useState("Idle");
  const [videoURL, setVideoURL] = useState("");

  const handleGenerateVideo = async () => {
  setStatus("Generating voice...");

  try {
    const response = await fetch('/api/generateVoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: script })
    });

    if (!response.ok) {
      throw new Error('Voice generation failed');
    }

    const audioBlob = await response.blob();
    const audioURL = URL.createObjectURL(audioBlob);

    setVideoURL(audioURL); // Plays audio
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
      <div>
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
      {videoURL && <video src={videoURL} controls style={{ width: "100%" }} />}
    </div>
  );
}
