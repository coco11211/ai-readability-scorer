# Quick Start Guide

Get AI Readability Scorer up and running in minutes!

## For Users

### Installation

1. **Download** the installer from [Releases](../../releases)
2. **Run** `AI-Readability-Scorer-1.0.0-x64.exe`
3. **Follow** the installation wizard
4. **Launch** from Start Menu or Desktop shortcut

### First Use

1. **Launch** the application
2. **Type or paste** your text in the input area
3. **Click** "Analyze Text" button
4. **Review** results in the Analysis Results tab

That's it! Your text has been analyzed with 7 different readability metrics.

## For Developers

### Quick Setup

```bash
# Clone and setup
git clone https://github.com/your-username/ai-readability-scorer.git
cd ai-readability-scorer
npm install

# Start development
npm run dev
```

### Quick Build

```bash
# Build for production
npm run build

# Create installer
npm run dist
```

## Common Tasks

### Open a File

**Method 1:** File → Open Text File (Ctrl+O)
**Method 2:** Click "Open File" button in sidebar

### Save Analysis

**Method 1:** File → Save Analysis (Ctrl+S)
**Method 2:** Click "Save Analysis" button in sidebar

### Export Report

**Method 1:** File → Export as HTML
**Method 2:** Click "Export HTML" button in sidebar

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open File | Ctrl+O |
| Save Analysis | Ctrl+S |
| Run Analysis | Ctrl+R |
| Clear Results | Ctrl+K |
| Exit | Alt+F4 |

## Understanding Results

### Reading Level

- **Elementary**: Very easy to read (grades 1-5)
- **Middle School**: Fairly easy (grades 6-8)
- **High School**: Average difficulty (grades 9-12)
- **College**: Complex language (grades 13-16)
- **Graduate**: Very complex (grade 17+)
- **Professional**: Extremely complex

### Main Metrics

**Flesch Reading Ease (0-100)**
- Higher = Easier to read
- 60-70 = Standard/Easy (aim for this)
- 50-60 = Fairly difficult
- Below 30 = Very difficult

**Grade Level Scores**
- Indicate U.S. grade level needed to understand
- Lower = More accessible
- Most web content should aim for grade 8-10

## Tips for Better Readability

1. **Keep sentences short** - Aim for 15-20 words
2. **Use simple words** - Avoid jargon when possible
3. **Break up paragraphs** - 3-4 sentences each
4. **Active voice** - More engaging and clear
5. **Remove redundancy** - Every word should add value

## Need Help?

- **Documentation**: See [README.md](README.md)
- **Issues**: Report at [GitHub Issues](../../issues)
- **Build Guide**: See [BUILD_GUIDE.md](BUILD_GUIDE.md)

---

**Start analyzing text and improve your writing today!**
