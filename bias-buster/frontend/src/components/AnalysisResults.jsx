import React from 'react';
import './AnalysisResults.css';

function AnalysisResults({ biasScore, biasLabel, biasBreakdown, suggestion, sentiment, summary, relatedArticles }) {
  return (
    <div className="analysis-results-container">
      <h2 className="analysis-results-title">Bias Analysis Results</h2>
      <div className="bias-score-container">
        <span className="bias-score-label">{biasLabel}</span>
        <span className="bias-score">{biasScore}/100</span>
      </div>
      <p className="analysis-results-item">Sentiment: {sentiment}</p>
      <p className="analysis-results-item">Summary: {summary}</p>
      <ul className="analysis-results-list">
        {biasBreakdown && biasBreakdown.map((item, idx) => (
          <li className="analysis-results-list-item" key={idx}>
            <div className="bias-breakdown-item">
              <span className="bias-breakdown-label" style={{ color: item.color }}>{item.label}</span>
              <div className="bias-breakdown-bar-container">
                <div className="bias-breakdown-bar" style={{ width: `${item.score}%`, backgroundColor: item.color }}></div>
              </div>
              <span className="bias-breakdown-score">{item.score}</span>
            </div>
          </li>
        ))}
      </ul>
      <h4>Related Articles:</h4>
      {relatedArticles && relatedArticles.length > 0 ? (
        <div className="related-articles-container">
          {relatedArticles.map((article, idx) => (
            <div key={idx} className="related-article-card">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="related-article-title">{article.title}</a>
              <p className="related-article-source">Source: {article.source}</p>
              <span className="related-article-bias-score">Bias: {article.biasScore}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No related articles found.</p>
      )}
      <p className="analysis-results-suggestion">Suggestion: {suggestion}</p>
    </div>
  );
}

export default AnalysisResults;
