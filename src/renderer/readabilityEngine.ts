import { ReadabilityMetrics, TextStatistics, AnalysisResult } from './types';

/**
 * Count syllables in a word using a heuristic approach
 */
function countSyllables(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');

  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

/**
 * Calculate text statistics
 */
export function calculateStatistics(text: string): TextStatistics {
  if (!text || text.trim().length === 0) {
    return {
      characterCount: 0,
      characterCountNoSpaces: 0,
      wordCount: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      syllableCount: 0,
      averageWordsPerSentence: 0,
      averageSyllablesPerWord: 0,
      complexWordCount: 0,
      longWordCount: 0,
    };
  }

  const characterCount = text.length;
  const characterCountNoSpaces = text.replace(/\s/g, '').length;

  // Count words
  const words = text.match(/\b[a-zA-Z]+\b/g) || [];
  const wordCount = words.length;

  // Count sentences
  const sentences = text.match(/[.!?]+/g) || [];
  const sentenceCount = Math.max(sentences.length, 1);

  // Count paragraphs
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const paragraphCount = Math.max(paragraphs.length, 1);

  // Count syllables
  let syllableCount = 0;
  let complexWordCount = 0; // Words with 3+ syllables
  let longWordCount = 0; // Words with 7+ characters

  words.forEach(word => {
    const syllables = countSyllables(word);
    syllableCount += syllables;

    if (syllables >= 3) {
      complexWordCount++;
    }

    if (word.length >= 7) {
      longWordCount++;
    }
  });

  const averageWordsPerSentence = wordCount / sentenceCount;
  const averageSyllablesPerWord = syllableCount / Math.max(wordCount, 1);

  return {
    characterCount,
    characterCountNoSpaces,
    wordCount,
    sentenceCount,
    paragraphCount,
    syllableCount,
    averageWordsPerSentence,
    averageSyllablesPerWord,
    complexWordCount,
    longWordCount,
  };
}

/**
 * Calculate Flesch Reading Ease Score
 * Range: 0-100 (higher is easier)
 */
function calculateFleschReadingEase(stats: TextStatistics): number {
  if (stats.wordCount === 0) return 0;

  const score = 206.835
    - (1.015 * stats.averageWordsPerSentence)
    - (84.6 * stats.averageSyllablesPerWord);

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate Flesch-Kincaid Grade Level
 */
function calculateFleschKincaidGrade(stats: TextStatistics): number {
  if (stats.wordCount === 0) return 0;

  const grade = (0.39 * stats.averageWordsPerSentence)
    + (11.8 * stats.averageSyllablesPerWord)
    - 15.59;

  return Math.max(0, grade);
}

/**
 * Calculate Coleman-Liau Index
 */
function calculateColemanLiauIndex(stats: TextStatistics): number {
  if (stats.wordCount === 0) return 0;

  const L = (stats.characterCountNoSpaces / stats.wordCount) * 100;
  const S = (stats.sentenceCount / stats.wordCount) * 100;

  const index = (0.0588 * L) - (0.296 * S) - 15.8;

  return Math.max(0, index);
}

/**
 * Calculate Automated Readability Index (ARI)
 */
function calculateAutomatedReadabilityIndex(stats: TextStatistics): number {
  if (stats.wordCount === 0) return 0;

  const ari = (4.71 * (stats.characterCountNoSpaces / stats.wordCount))
    + (0.5 * stats.averageWordsPerSentence)
    - 21.43;

  return Math.max(0, ari);
}

/**
 * Calculate SMOG Index
 */
function calculateSmogIndex(stats: TextStatistics): number {
  if (stats.sentenceCount === 0) return 0;

  const smog = 1.0430 * Math.sqrt(stats.complexWordCount * (30 / stats.sentenceCount)) + 3.1291;

  return Math.max(0, smog);
}

/**
 * Calculate Gunning Fog Index
 */
function calculateGunningFog(stats: TextStatistics): number {
  if (stats.wordCount === 0) return 0;

  const fog = 0.4 * (stats.averageWordsPerSentence + (100 * (stats.complexWordCount / stats.wordCount)));

  return Math.max(0, fog);
}

/**
 * Calculate LIX Readability Index
 */
function calculateLixIndex(stats: TextStatistics): number {
  if (stats.wordCount === 0 || stats.sentenceCount === 0) return 0;

  const lix = (stats.wordCount / stats.sentenceCount)
    + ((stats.longWordCount * 100) / stats.wordCount);

  return Math.max(0, lix);
}

/**
 * Calculate all readability metrics
 */
export function calculateReadabilityMetrics(stats: TextStatistics): ReadabilityMetrics {
  return {
    fleschReadingEase: Math.round(calculateFleschReadingEase(stats) * 10) / 10,
    fleschKincaidGrade: Math.round(calculateFleschKincaidGrade(stats) * 10) / 10,
    colemanLiauIndex: Math.round(calculateColemanLiauIndex(stats) * 10) / 10,
    automatedReadabilityIndex: Math.round(calculateAutomatedReadabilityIndex(stats) * 10) / 10,
    smogIndex: Math.round(calculateSmogIndex(stats) * 10) / 10,
    gunningFog: Math.round(calculateGunningFog(stats) * 10) / 10,
    lixIndex: Math.round(calculateLixIndex(stats) * 10) / 10,
  };
}

/**
 * Interpret the readability level
 */
function interpretReadability(metrics: ReadabilityMetrics): AnalysisResult['interpretation'] {
  const avgGrade = (
    metrics.fleschKincaidGrade +
    metrics.colemanLiauIndex +
    metrics.automatedReadabilityIndex +
    metrics.smogIndex +
    metrics.gunningFog
  ) / 5;

  let level: AnalysisResult['interpretation']['level'];
  let description: string;
  let recommendations: string[];

  if (avgGrade <= 5) {
    level = 'Elementary';
    description = 'This text is very easy to read and suitable for elementary school students (grades 1-5). The language is simple and straightforward.';
    recommendations = [
      'Consider adding more complex vocabulary if targeting older audiences.',
      'The simple language makes this accessible to a broad audience.',
      'Great for general public communication and instructions.',
    ];
  } else if (avgGrade <= 8) {
    level = 'Middle School';
    description = 'This text is fairly easy to read and appropriate for middle school students (grades 6-8). The language is clear with some complexity.';
    recommendations = [
      'Well-balanced for general audiences.',
      'Consider simplifying if targeting younger readers.',
      'Good readability for most web content and casual writing.',
    ];
  } else if (avgGrade <= 12) {
    level = 'High School';
    description = 'This text requires a high school reading level (grades 9-12). It contains moderately complex language and sentence structures.';
    recommendations = [
      'Appropriate for educated general audiences.',
      'May need simplification for broader accessibility.',
      'Good for blogs, articles, and standard business communication.',
    ];
  } else if (avgGrade <= 16) {
    level = 'College';
    description = 'This text requires a college reading level. It contains complex vocabulary and sentence structures typical of academic writing.';
    recommendations = [
      'Best suited for educated audiences.',
      'Consider simplifying for wider reach.',
      'Appropriate for academic papers and professional publications.',
    ];
  } else if (avgGrade <= 18) {
    level = 'Graduate';
    description = 'This text requires a graduate-level education to fully comprehend. It contains very complex language and dense information.';
    recommendations = [
      'Highly specialized content.',
      'May be too complex for general audiences.',
      'Consider breaking down complex sentences for better clarity.',
    ];
  } else {
    level = 'Professional';
    description = 'This text is extremely difficult to read and requires professional or specialized knowledge. The language is very dense and technical.';
    recommendations = [
      'Extremely specialized content.',
      'Consider significant simplification for broader accessibility.',
      'Ensure your target audience has the necessary expertise.',
    ];
  }

  return { level, description, recommendations };
}

/**
 * Perform complete text analysis
 */
export function analyzeText(text: string): AnalysisResult {
  const statistics = calculateStatistics(text);
  const metrics = calculateReadabilityMetrics(statistics);
  const interpretation = interpretReadability(metrics);

  return {
    text,
    metrics,
    statistics,
    interpretation,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Export analysis as HTML report
 */
export function exportAsHTML(result: AnalysisResult): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Readability Analysis Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
            background-color: #f5f5f5;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        h1 {
            color: #0078d4;
            margin-bottom: 10px;
        }
        .timestamp {
            color: #666;
            font-size: 14px;
        }
        .section {
            background-color: white;
            border-radius: 8px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h2 {
            color: #0078d4;
            margin-bottom: 20px;
            border-bottom: 2px solid #0078d4;
            padding-bottom: 10px;
        }
        .badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            margin-bottom: 15px;
        }
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .metric-card {
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #0078d4;
        }
        .metric-title {
            font-size: 13px;
            color: #666;
            margin-bottom: 8px;
        }
        .metric-value {
            font-size: 32px;
            font-weight: 700;
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
        }
        th {
            background-color: #f9f9f9;
            font-weight: 600;
        }
        ul {
            list-style: none;
            padding: 0;
        }
        li {
            padding: 12px 16px;
            background-color: #f9f9f9;
            border-radius: 6px;
            margin-bottom: 10px;
            border-left: 4px solid #0078d4;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Readability Analysis Report</h1>
        <p class="timestamp">Generated: ${new Date(result.timestamp).toLocaleString()}</p>
    </div>

    <div class="section">
        <h2>Overall Assessment</h2>
        <div class="badge" style="background-color: #e6f4ea; color: #1e8e3e;">
            ${result.interpretation.level}
        </div>
        <p>${result.interpretation.description}</p>
    </div>

    <div class="section">
        <h2>Readability Metrics</h2>
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-title">Flesch Reading Ease</div>
                <div class="metric-value">${result.metrics.fleschReadingEase}</div>
            </div>
            <div class="metric-card">
                <div class="metric-title">Flesch-Kincaid Grade</div>
                <div class="metric-value">${result.metrics.fleschKincaidGrade}</div>
            </div>
            <div class="metric-card">
                <div class="metric-title">Coleman-Liau Index</div>
                <div class="metric-value">${result.metrics.colemanLiauIndex}</div>
            </div>
            <div class="metric-card">
                <div class="metric-title">Automated Readability Index</div>
                <div class="metric-value">${result.metrics.automatedReadabilityIndex}</div>
            </div>
            <div class="metric-card">
                <div class="metric-title">SMOG Index</div>
                <div class="metric-value">${result.metrics.smogIndex}</div>
            </div>
            <div class="metric-card">
                <div class="metric-title">Gunning Fog Index</div>
                <div class="metric-value">${result.metrics.gunningFog}</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Text Statistics</h2>
        <table>
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Total Characters</td><td>${result.statistics.characterCount}</td></tr>
            <tr><td>Characters (no spaces)</td><td>${result.statistics.characterCountNoSpaces}</td></tr>
            <tr><td>Total Words</td><td>${result.statistics.wordCount}</td></tr>
            <tr><td>Total Sentences</td><td>${result.statistics.sentenceCount}</td></tr>
            <tr><td>Total Paragraphs</td><td>${result.statistics.paragraphCount}</td></tr>
            <tr><td>Total Syllables</td><td>${result.statistics.syllableCount}</td></tr>
            <tr><td>Average Words per Sentence</td><td>${result.statistics.averageWordsPerSentence.toFixed(1)}</td></tr>
            <tr><td>Average Syllables per Word</td><td>${result.statistics.averageSyllablesPerWord.toFixed(2)}</td></tr>
            <tr><td>Complex Words (3+ syllables)</td><td>${result.statistics.complexWordCount}</td></tr>
            <tr><td>Long Words (7+ characters)</td><td>${result.statistics.longWordCount}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Recommendations</h2>
        <ul>
            ${result.interpretation.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
    </div>
</body>
</html>`;
}
