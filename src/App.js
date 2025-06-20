import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [strategy, setStrategy] = useState("");
  const [winrate, setWinrate] = useState(null);
  const [chat, setChat] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://35.200.164.130:8000"; // ✅ Use correct backend IP here

  const uploadPDF = async () => {
    const form = new FormData();
    form.append("file", file);
    form.append("strategy", strategy);
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/upload-to-backblaze`, form);
      setWinrate(res.data.winrate);
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const askModel = async () => {
    const form = new FormData();
    form.append("prompt", prompt);
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/chat`, form);
      setChat([...chat, { role: "user", content: prompt }, res.data]);
      setPrompt("");
    } catch (err) {
      alert("AI chat failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📈 AI Backtesting Chatbot</h1>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input
        type="text"
        placeholder="Enter strategy (e.g., ema20 > ema50)"
        value={strategy}
        onChange={(e) => setStrategy(e.target.value)}
        style={{ marginLeft: "1rem" }}
      />
      <button onClick={uploadPDF} disabled={loading}>
        Run Backtest
      </button>
      <button
        onClick={() => {
          const a = document.createElement("a");
          a.href = `data:text/csv;charset=utf-8,Winrate: ${winrate}`;
          a.download = "result.csv";
          a.click();
        }}
        disabled={!winrate}
      >
        Download CSV Report
      </button>

      {winrate && <p>📊 Estimated Winrate: <b>{winrate}%</b></p>}

      <h2>🧠 AI Strategy Chat</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        placeholder="Ask the AI about your strategy..."
        style={{ width: "100%", marginBottom: "1rem" }}
      />
      <button onClick={askModel} disabled={loading}>
        Ask Model
      </button>

      <div style={{ marginTop: "2rem" }}>
        {chat.map((msg, i) => (
          <p key={i}>
            <b>{msg.role}:</b> {msg.content}
          </p>
        ))}
      </div>
    </div>
  );
}


