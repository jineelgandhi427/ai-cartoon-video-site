// pages/index.js
import { useState } from "react";

export default function Home() {
  const [script, setScript] = useState("");
  const [status, setStatus] = useState("Idle");
  const [audioURL, setAudioURL] = useState("");

  const handleGenerate = async () => {
    setStatus("Generating voice...");
    try {
      const res = await fetch("/api/generateVoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: script, voiceId: "ZT9u07TYPVl83ejeLakq" }),
      });
      if (!res.ok) throw await res.json();
      const blob = await res.blob();
      setAudioURL(URL.createObjectURL(blob));
      setStatus("Voice ready!");
    } catch (err) {
      console.error(err);
      setStatus("Error: " + (err.error || err.message));
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>AI Cartoon Video Creator</h1>
      <textarea
        rows={5}
        value={script}
        onChange={e => setScript(e.target.value)}
        placeholder="Enter your script..."
        style={{ width: "100%" }}
      />
      <br />
      <button onClick={handleGenerate} style={{ marginTop: "1rem" }}>
        Generate Voice
      </button>
      <p>Status: {status}</p>
      {audioURL && <audio src={audioURL} controls />}
    </div>
  );
}
