# AI Readability Scorer

A professional, production-ready Windows 11 desktop application for analyzing text readability using multiple AI-powered metrics and algorithms.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-Windows%2011-blue.svg)

## Overview

AI Readability Scorer is an Electron-based desktop application that analyzes text and provides comprehensive readability metrics. It helps writers, editors, educators, and content creators ensure their content is appropriate for their target audience.

## Features

### Core Functionality
- **Multiple Readability Metrics**
  - Flesch Reading Ease Score
  - Flesch-Kincaid Grade Level
  - Coleman-Liau Index
  - Automated Readability Index (ARI)
  - SMOG Index
  - Gunning Fog Index
  - LIX Readability Index

- **Comprehensive Text Statistics**
  - Character count (with and without spaces)
  - Word count
  - Sentence count
  - Paragraph count
  - Syllable count
  - Average words per sentence
  - Average syllables per word
  - Complex word analysis
  - Long word analysis

- **Intelligent Analysis**
  - Reading level classification (Elementary to Professional)
  - Detailed interpretation of results
  - Actionable recommendations for improvement

### User Interface
- **Modern Windows 11 Design**
  - Native Acrylic background material
  - Custom title bar with window controls
  - Fluent Design principles
  - Responsive and intuitive layout

- **Professional Features**
  - Tabbed interface for input and results
  - Real-time word and character counting
  - Clean, distraction-free text editor
  - Visual metrics dashboard

### File Operations
- **Import & Export**
  - Open text files (.txt, .md, .doc, .docx)
  - Save analysis results as JSON
  - Export professional HTML reports
  - Support for multiple file formats

### Additional Features
- Application menu with keyboard shortcuts
- In-app notifications
- Auto-update support
- Settings persistence
- Error logging and crash reporting
- Portable and installer versions

## Technology Stack

- **Framework**: Electron 28
- **Frontend**: React 18 with TypeScript
- **Build System**: Webpack 5
- **Installer**: electron-builder with NSIS
- **Language**: TypeScript 5
- **Styling**: Modern CSS with Fluent Design

## Installation

### For Users

1. **Download the installer** from the [Releases](../../releases) page
2. Run the installer (`AI-Readability-Scorer-1.0.0-x64.exe`)
3. Follow the installation wizard
4. Launch the application from the Start Menu or Desktop

### For Developers

#### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Windows 10/11 (for building Windows applications)
- Git

#### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/ai-readability-scorer.git

# Navigate to the project directory
cd ai-readability-scorer

# Install dependencies
npm install

# Start development mode
npm run dev
```

## Development

### Available Scripts

```bash
# Development mode with hot reload
npm run dev

# Build the application
npm run build

# Package for distribution
npm run package

# Create distributable installer
npm run dist

# Package without installer (for testing)
npm run package:dir

# Start the built application
npm start
```

### Project Structure

```
ai-readability-scorer/
├── src/
│   ├── main/              # Electron main process
│   │   ├── main.ts        # Main entry point
│   │   └── preload.ts     # Preload script
│   └── renderer/          # React frontend
│       ├── App.tsx        # Main React component
│       ├── App.css        # Application styles
│       ├── types.ts       # TypeScript definitions
│       ├── readabilityEngine.ts  # Analysis algorithms
│       ├── index.tsx      # React entry point
│       └── index.html     # HTML template
├── build/                 # Build resources (icons, etc.)
├── dist/                  # Compiled output
├── release/               # Distribution packages
├── webpack.main.config.js    # Main process webpack config
├── webpack.renderer.config.js # Renderer webpack config
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project metadata
```

## Building for Production

### Windows Build

```bash
# Build for Windows (64-bit and ARM64)
npm run dist
```

This will create:
- NSIS installer: `release/AI Readability Scorer-1.0.0-x64.exe`
- Portable version: `release/AI Readability Scorer-1.0.0-portable.exe`
- ARM64 installer: `release/AI Readability Scorer-1.0.0-arm64.exe`

### Code Signing (Optional)

For production releases, you should sign your application:

1. Obtain a code signing certificate
2. Set environment variables:
   ```
   CSC_LINK=path/to/certificate.pfx
   CSC_KEY_PASSWORD=your_password
   ```
3. Run the build: `npm run dist`

## Usage Guide

### Basic Workflow

1. **Enter Text**
   - Type or paste your text into the input area
   - Or use File → Open Text File (Ctrl+O)

2. **Analyze**
   - Click the "Analyze Text" button
   - Or use Analysis → Run Analysis (Ctrl+R)

3. **Review Results**
   - Switch to the "Analysis Results" tab
   - Review readability metrics
   - Read the interpretation and recommendations

4. **Export**
   - Save analysis as JSON (Ctrl+S)
   - Export as HTML report for sharing

### Keyboard Shortcuts

- `Ctrl+O` - Open text file
- `Ctrl+S` - Save analysis
- `Ctrl+R` - Run analysis
- `Ctrl+K` - Clear results
- `Alt+F4` - Exit application
- `Ctrl+Z/Y` - Undo/Redo
- `Ctrl+C/V/X` - Copy/Paste/Cut
- `Ctrl+A` - Select all

## Understanding the Metrics

### Flesch Reading Ease (0-100)
- 90-100: Very Easy (5th grade)
- 80-89: Easy (6th grade)
- 70-79: Fairly Easy (7th grade)
- 60-69: Standard (8th-9th grade)
- 50-59: Fairly Difficult (10th-12th grade)
- 30-49: Difficult (College)
- 0-29: Very Difficult (College graduate)

### Grade Level Metrics
Flesch-Kincaid, Coleman-Liau, ARI, SMOG, and Gunning Fog all indicate the U.S. grade level required to understand the text:
- 5 or below: Elementary
- 6-8: Middle School
- 9-12: High School
- 13-16: College
- 17+: Graduate/Professional

### LIX Index
- <25: Very Easy
- 25-34: Easy
- 35-44: Average
- 45-54: Difficult
- 55+: Very Difficult

## Troubleshooting

### Application Won't Start
- Ensure you're running Windows 10 or 11
- Check if antivirus is blocking the application
- Try running as administrator

### Build Fails
- Delete `node_modules` and run `npm install` again
- Clear webpack cache: delete `dist` folder
- Ensure you have the latest Node.js version

### Analysis Issues
- Ensure text contains complete sentences
- Very short texts may produce unreliable metrics
- Non-English text may not be analyzed accurately

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code formatting
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Readability algorithms based on established linguistic research
- UI design inspired by Microsoft Fluent Design System
- Built with Electron, React, and TypeScript
- Icons from Windows 11 design language

## Support

- **Issues**: Report bugs on [GitHub Issues](../../issues)
- **Discussions**: Join the conversation on [GitHub Discussions](../../discussions)
- **Documentation**: Full docs available in the [Wiki](../../wiki)

## Roadmap

### Upcoming Features
- [ ] Support for additional languages
- [ ] PDF import support
- [ ] Advanced sentiment analysis
- [ ] Batch file processing
- [ ] Cloud sync for analysis history
- [ ] Custom readability formulas
- [ ] Dark mode theme
- [ ] Plugin system for extensibility

## Version History

### v1.0.0 (2024)
- Initial release
- Core readability metrics
- Windows 11 native UI
- File import/export
- HTML report generation
- Auto-update support

---

**Made with ❤️ for writers, editors, and content creators**
