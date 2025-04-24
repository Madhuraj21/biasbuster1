import React, { useState } from 'react';
import axios from 'axios';
import AnalysisResults from '../components/AnalysisResults';
import './ArticleAnalysisPage.css';

function ArticleAnalysisPage() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);
  const [rewrittenArticle, setRewrittenArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rerender, setRerender] = useState(0);
  const [isUrl, setIsUrl] = useState(false);

  const handleAnalyze = async () => {
    console.log('Analyze button clicked!');
    setLoading(true);
    setResults(null);
    setRewrittenArticle(null);
    setRelatedArticles(null);
    setError(null);

    const isUrlValue = input.startsWith('http://') || input.startsWith('https://');
    setIsUrl(isUrlValue);
    console.log('Input:', input, 'Is URL:', isUrlValue);

    try {
      console.log('Making API call to https://bias-buster-backend.onrender.com/api/analyze');
      const response = await axios.post('https://bias-buster-backend.onrender.com/api/analyze', {
        content: input,
        isUrl: isUrlValue
      });
      console.log('API call successful. Response:', response.data);
      console.log('Response data:', response.data); // Add this line
      setResults(response.data);
      setRewrittenArticle(response.data.rewrittenArticle);
      setRelatedArticles(response.data.relatedArticles);
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Error analyzing article. Please try again.');
    } finally {
      console.log('Analysis process finished.');
      setLoading(false);
    }
  };

  return (
    <div className="analysis-page-container">
      <div className="analysis-card">
        <h1 className="analysis-title">Analyze a News Article</h1>
        <div className="input-area">
          <textarea
            key="textarea"
            className="analysis-input"
            placeholder="Paste article text or URL here..."
            value={input}
            onChange={e => {
              setInput(e.target.value);
              console.log('Textarea changed');
              setRerender(rerender + 1); // Force re-render
            }}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault() } }}
            rows={6}
            cols={60}
          />
          <br />
          <button
            key="analyze-button"
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={loading || input.trim() === ''}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>
      <div className="analysis-card">
        <h2 className="output-title">Analysis Results</h2>
        {loading && <div className="loading-indicator">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {results && (
          <div>
            <h3>Analysis Results:</h3>
            <AnalysisResults
              biasScore={results.biasScore}
              biasLabel={results.biasLabel}
              biasBreakdown={results.biasBreakdown}
              suggestion={results.suggestion}
              sentiment={results.sentiment}
              summary={results.summary}
              relatedArticles={results.relatedArticles}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ width: '48%' }}>
                <h4>Original Article:</h4>
                {results && results.originalArticle ? (
                  <p>{results.originalArticle}</p>
                ) : (
                  <p>{input}</p>
                )}
              </div>
              <div style={{ width: '48%' }}>
                <h4>Rewritten Article:</h4>
                <p>{results.rewrittenArticle}</p>
              </div>
            </div>
          </div>
        )}
        {!loading && !results && !error && (
          <div className="empty-message">Analysis results will be displayed here after submission.</div>
        )}
      </div>
    </div>
  );
}

export default ArticleAnalysisPage;
