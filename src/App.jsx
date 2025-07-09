import React, { useState } from "react";

export default function App() {
  const [script, setScript] = useState("");
  const [status, setStatus] = useState("Idle");
  const [audioURL, setAudioURL] = useState("");
  const [videoURL, setVideoURL] = useState("");

  const handleGenerateVoice = async () => {
    setStatus("Generating voice...");

    try {
      const voiceResponse = await fetch("/api/generateVoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: script }),
      });

      if (!voiceResponse.ok) {
        const error = await voiceResponse.json();
        console.error("Voice generation failed:", error);
        setStatus("Error generating voice");
        return;
      }

      const audioBlob = await voiceResponse.blob();
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioURL(audioURL);
      setStatus("Voice ready! Uploading audio...");

      // TODO: Upload audioBlob to a public file host
      // For now, this next step won't work unless the audioURL is publicly accessible
      const uploadURL = await uploadAudio(audioBlob); // <- implement this function to upload audio

      if (!uploadURL) {
        setStatus("Error uploading audio");
        return;
      }

      setStatus("Creating video...");

      const videoResponse = await fetch("/api/generateVideo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioUrl: uploadURL }),
      });

      const videoData = await videoResponse.json();
      if (!videoResponse.ok) {
        console.error("Video generation failed:", videoData);
        setStatus("Error generating video");
        return;
      }

      setVideoURL(videoData.result_url);
      setStatus("Video ready!");
    } catch (err) {
      console.error("Unexpected error:", err);
      setStatus("Something went wrong");
    }
  };

  // Dummy upload function (replace with real implementation)
  async function uploadAudio(blob) {
    // Example: upload to Cloudinary, Firebase, or your own server
    return null; // this must return a valid public audio URL
  }

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
        Generate Video
      </button>
      <p>Status: {status}</p>
      {audioURL && (
        <>
          <p>Voice Preview:</p>
          <audio controls src={audioURL} />
        </>
      )}
      {videoURL && (
        <>
          <p>Video Preview:</p>
          <video controls src={videoURL} style={{ width: "100%", marginTop: "1rem" }} />
        </>
      )}
    </div>
  );
}
