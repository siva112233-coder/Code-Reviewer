import { useState, useEffect } from 'react';
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css';

function App() {
  const [code, setCode] = useState(`function sum() {\n  return 1 + 1;\n}`);
  const [review, setReview] = useState('');
  const [language, setLanguage] = useState("javascript");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedReview, setCopiedReview] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const languageKeywords = {
    javascript: ['function', 'const', 'let', '=>'],
    python: ['def', 'print', 'import'],
    cpp: ['#include', 'int main', 'std::', 'cout']
  };

  const validateLanguageMatch = () => {
    const keywords = languageKeywords[language];
    return keywords.some(keyword => code.includes(keyword));
  };

  useEffect(() => {
    const savedCode = localStorage.getItem("lastCode");
    if (savedCode) setCode(savedCode);
  }, []);

  useEffect(() => {
    prism.highlightAll();
  }, [code, language]);

  async function reviewCode() {
    if (!validateLanguageMatch()) {
      alert(`⚠️ Your code doesn't appear to be written in ${language.toUpperCase()}. Please check.`);
      return;
    }

    setIsLoading(true);
    setReview("🔁 Reviewing...");
    const startTime = Date.now();

    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code, language });
      setReview(response.data);
      setResponseTime(Date.now() - startTime);
    } catch (error) {
      if (error.response?.data?.message) {
        setReview(`❌ ${error.response.data.message}`);
      } else {
        setReview("❌ Error fetching review. Try again.");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCodeChange(newCode) {
    setCode(newCode);
    localStorage.setItem("lastCode", newCode);
  }

  return (
    <main>
      <div className="left">
        <div style={{ marginBottom: '10px' }}>
          <label>Select Language: </label>
          <select onChange={e => setLanguage(e.target.value)} value={language}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
        </div>

        <div className="code">
          <Editor
            value={code}
            onValueChange={handleCodeChange}
            highlight={code => prism.highlight(code, prism.languages[language] || prism.languages.javascript, language)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              border: "1px solid #ddd",
              borderRadius: "5px",
              minHeight: "200px",
              width: "100%"
            }}
          />
        </div>

        <div style={{ marginTop: '10px' }}>
          <button onClick={reviewCode} className="review">Review</button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(code);
              setCopiedCode(true);
              setTimeout(() => setCopiedCode(false), 2000);
            }}
            className="copy-btn"
          >
            {copiedCode ? "✅ Copied!" : "📋 Copy Code"}
          </button>
          <button onClick={() => { setCode(''); setReview(''); setResponseTime(null); }} style={{ marginLeft: '10px' }}>
            🧹 Clear
          </button>
        </div>
      </div>

      <div className="right">
        <Markdown rehypePlugins={[rehypeHighlight]}>
          {review || "🧠 AI feedback will appear here..."}
        </Markdown>
        {responseTime && <p style={{ color: '#ccc', marginTop: '8px' }}>⚡ Response Time: {responseTime} ms</p>}
        <button
          onClick={() => {
            navigator.clipboard.writeText(review);
            setCopiedReview(true);
            setTimeout(() => setCopiedReview(false), 2000);
          }}
          className="copy-btn right-copy"
        >
          {copiedReview ? "✅ Copied!" : "📋 Copy Review"}
        </button>
      </div>
    </main>
  );
}

export default App;
