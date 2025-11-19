import React, { useState, useEffect, useCallback } from 'react';
import { AnalysisResult } from './types';
import { analyzeText, exportAsHTML } from './readabilityEngine';
import './App.css';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'results'>('input');
  const [notification, setNotification] = useState<{ title: string; body: string } | null>(null);
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    // Get app version
    window.electron.getAppVersion().then(setAppVersion);

    // Setup menu event handlers
    window.electron.onMenuOpenFile(handleOpenFile);
    window.electron.onMenuSaveAnalysis(handleSaveAnalysis);
    window.electron.onMenuExportHtml(handleExportHtml);
    window.electron.onMenuRunAnalysis(handleRunAnalysis);
    window.electron.onMenuClearResults(handleClearResults);

    // Setup notification handler
    window.electron.onShowNotification((options) => {
      showNotification(options.title, options.body);
    });
  }, []);

  const showNotification = (title: string, body: string) => {
    setNotification({ title, body });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenFile = useCallback(async () => {
    const result = await window.electron.openFileDialog();
    if (result.success && result.content) {
      setText(result.content);
      setActiveTab('input');
      showNotification('File Opened', `Loaded ${result.filePath}`);
    }
  }, []);

  const handleRunAnalysis = useCallback(() => {
    if (!text.trim()) {
      showNotification('No Text', 'Please enter some text to analyze.');
      return;
    }

    const analysisResult = analyzeText(text);
    setResult(analysisResult);
    setActiveTab('results');
    showNotification('Analysis Complete', 'Text readability has been analyzed successfully.');
  }, [text]);

  const handleClearResults = useCallback(() => {
    setText('');
    setResult(null);
    setActiveTab('input');
  }, []);

  const handleSaveAnalysis = useCallback(async () => {
    if (!result) {
      showNotification('No Results', 'Please run an analysis first.');
      return;
    }

    const content = JSON.stringify(result, null, 2);
    const saveResult = await window.electron.saveFileDialog({
      content,
      defaultName: 'readability-analysis.json',
    });

    if (saveResult.success) {
      showNotification('Saved', `Analysis saved to ${saveResult.filePath}`);
    }
  }, [result]);

  const handleExportHtml = useCallback(async () => {
    if (!result) {
      showNotification('No Results', 'Please run an analysis first.');
      return;
    }

    const html = exportAsHTML(result);
    const exportResult = await window.electron.exportHtml({
      content: html,
      defaultName: 'readability-report.html',
    });

    if (exportResult.success) {
      showNotification('Exported', `Report exported to ${exportResult.filePath}`);
    }
  }, [result]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const charCount = text.length;

  return (
    <div className="app">
      {/* Title Bar */}
      <div className="title-bar">
        <div className="title-bar-title">
          <div className="title-bar-icon" />
          <span>AI Readability Scorer</span>
          {appVersion && <span style={{ marginLeft: '8px', opacity: 0.6 }}>v{appVersion}</span>}
        </div>
        <div className="title-bar-controls">
          <button
            className="title-bar-button"
            onClick={() => window.electron.windowMinimize()}
            title="Minimize"
          >
            &#xE921;
          </button>
          <button
            className="title-bar-button"
            onClick={() => window.electron.windowMaximize()}
            title="Maximize"
          >
            &#xE922;
          </button>
          <button
            className="title-bar-button close"
            onClick={() => window.electron.windowClose()}
            title="Close"
          >
            &#xE8BB;
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Actions</div>
            <button className="button" onClick={handleRunAnalysis}>
              📊 Analyze Text
            </button>
            <button className="button-secondary button" onClick={handleOpenFile}>
              📂 Open File
            </button>
            <button className="button-secondary button" onClick={handleSaveAnalysis}>
              💾 Save Analysis
            </button>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">Export</div>
            <button className="button-secondary button" onClick={handleExportHtml}>
              📄 Export HTML
            </button>
          </div>

          {result && (
            <div className="sidebar-section">
              <div className="sidebar-section-title">Quick Stats</div>
              <div className="metrics-summary">
                <div className="metric-item">
                  <span className="metric-label">Reading Level</span>
                  <span className="metric-value">{result.interpretation.level}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Flesch Score</span>
                  <span className="metric-value">{result.metrics.fleschReadingEase}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Grade Level</span>
                  <span className="metric-value">{result.metrics.fleschKincaidGrade}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Words</span>
                  <span className="metric-value">{result.statistics.wordCount}</span>
                </div>
              </div>
            </div>
          )}

          <div className="sidebar-section" style={{ marginTop: 'auto' }}>
            <button className="button-secondary button" onClick={handleClearResults}>
              🗑️ Clear All
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'input' ? 'active' : ''}`}
              onClick={() => setActiveTab('input')}
            >
              Text Input
            </button>
            <button
              className={`tab ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
              disabled={!result}
            >
              Analysis Results
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'input' ? (
              <div className="text-input-container">
                <div className="input-header">
                  <h2>Enter or Paste Your Text</h2>
                  <div className="input-stats">
                    {wordCount} words · {charCount} characters
                  </div>
                </div>
                <textarea
                  className="text-input"
                  value={text}
                  onChange={handleTextChange}
                  placeholder="Paste your text here to analyze its readability. The AI will evaluate multiple readability metrics including Flesch Reading Ease, Flesch-Kincaid Grade Level, and more..."
                />
              </div>
            ) : result ? (
              <ResultsView result={result} />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="notification">
          <div className="notification-title">{notification.title}</div>
          <div className="notification-body">{notification.body}</div>
        </div>
      )}
    </div>
  );
};

const ResultsView: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const getBadgeClass = (level: string) => {
    return `interpretation-badge ${level.toLowerCase().replace(' ', '-')}`;
  };

  return (
    <div className="results-container">
      {/* Overall Assessment */}
      <div className="result-card">
        <h2 className="result-card-title">Overall Assessment</h2>
        <div className={getBadgeClass(result.interpretation.level)}>
          {result.interpretation.level}
        </div>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
          {result.interpretation.description}
        </p>
      </div>

      {/* Readability Metrics */}
      <div className="result-card">
        <h2 className="result-card-title">Readability Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-card-title">Flesch Reading Ease</div>
            <div className="metric-card-value">{result.metrics.fleschReadingEase}</div>
            <div className="metric-card-description">
              Higher scores indicate easier readability (0-100 scale)
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-card-title">Flesch-Kincaid Grade</div>
            <div className="metric-card-value">{result.metrics.fleschKincaidGrade}</div>
            <div className="metric-card-description">
              U.S. grade level required to understand the text
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-card-title">Coleman-Liau Index</div>
            <div className="metric-card-value">{result.metrics.colemanLiauIndex}</div>
            <div className="metric-card-description">
              Grade level based on characters per word
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-card-title">Automated Readability Index</div>
            <div className="metric-card-value">{result.metrics.automatedReadabilityIndex}</div>
            <div className="metric-card-description">
              Readability based on characters and words
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-card-title">SMOG Index</div>
            <div className="metric-card-value">{result.metrics.smogIndex}</div>
            <div className="metric-card-description">
              Years of education needed for comprehension
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-card-title">Gunning Fog Index</div>
            <div className="metric-card-value">{result.metrics.gunningFog}</div>
            <div className="metric-card-description">
              Years of formal education required
            </div>
          </div>
        </div>
      </div>

      {/* Text Statistics */}
      <div className="result-card">
        <h2 className="result-card-title">Text Statistics</h2>
        <table className="statistics-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Characters</td>
              <td>{result.statistics.characterCount.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Characters (no spaces)</td>
              <td>{result.statistics.characterCountNoSpaces.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Total Words</td>
              <td>{result.statistics.wordCount.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Total Sentences</td>
              <td>{result.statistics.sentenceCount.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Total Paragraphs</td>
              <td>{result.statistics.paragraphCount.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Total Syllables</td>
              <td>{result.statistics.syllableCount.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Average Words per Sentence</td>
              <td>{result.statistics.averageWordsPerSentence.toFixed(1)}</td>
            </tr>
            <tr>
              <td>Average Syllables per Word</td>
              <td>{result.statistics.averageSyllablesPerWord.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Complex Words (3+ syllables)</td>
              <td>{result.statistics.complexWordCount.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Long Words (7+ characters)</td>
              <td>{result.statistics.longWordCount.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Recommendations */}
      <div className="result-card">
        <h2 className="result-card-title">Recommendations</h2>
        <ul className="recommendations-list">
          {result.interpretation.recommendations.map((rec, index) => (
            <li key={index} className="recommendation-item">
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => (
  <div className="empty-state">
    <div className="empty-state-icon">📊</div>
    <div className="empty-state-title">No Analysis Yet</div>
    <div className="empty-state-description">
      Enter some text in the input tab and click "Analyze Text" to see readability metrics and recommendations.
    </div>
  </div>
);

export default App;
