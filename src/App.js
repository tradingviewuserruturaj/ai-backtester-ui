import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [strategy, setStrategy] = useState("");
  const [winrate, setWinrate] = useState(null);
  const [chat, setChat] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadPDF = async () => {
    const form = new FormData();
    form.append("file", file);
    form.append("strategy", strategy);
    setLoading(true);
    const res = await axios.post("http://34.100.240.160:8000/analyze-pdf/", form);
    setLoading(false);
    setWinrate(res.data.winrate);
  };

  const askModel = async () => {
    const form = new FormData();
    form.append("prompt", prompt);
    const res = await axios.post("http://34.100.240.160:8000/chat/", form);
    setChat([...chat, { q: prompt, a: res.data.response }]);
    setPrompt("");
  };

  const downloadReport = () => {
    window.open("http://34.100.240.160:8000/get-report/");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">📈 AI Backtesting Chatbot</h1>

      <div>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <input
          type="text"
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          placeholder="Enter strategy logic (e.g. ema20 > ema50)"
          className="border p-2 w-full mt-2"
        />
        <button onClick={uploadPDF} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">
          Run Backtest
        </button>
        {loading && <p>⏳ Processing...</p>}
        {winrate && <p className="mt-2">✅ Winrate: {winrate.toFixed(2)}%</p>}
        <button onClick={downloadReport} className="text-sm mt-2 underline">
          📥 Download CSV Report
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">💬 AI Strategy Chat</h2>
        <textarea
          className="w-full border p-2"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask the AI about your strategy..."
        ></textarea>
        <button onClick={askModel} className="mt-2 bg-green-600 text-white px-4 py-2 rounded">
          Ask Model
        </button>
        <div className="mt-4 space-y-3">
          {chat.map((c, i) => (
            <div key={i} className="bg-gray-100 p-3 rounded">
              <p><strong>You:</strong> {c.q}</p>
              <p><strong>AI:</strong> {c.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

