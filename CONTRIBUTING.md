# Contributing to AI Readability Scorer

Thank you for your interest in contributing to AI Readability Scorer! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs. actual behavior
- **Screenshots** if applicable
- **Environment details** (Windows version, app version)
- **Error logs** if available

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Clear use case** for the enhancement
- **Expected behavior** and user experience
- **Mockups or examples** if applicable
- **Alternative solutions** you've considered

### Pull Requests

1. **Fork** the repository
2. **Create a branch** from `main`: `git checkout -b feature/my-feature`
3. **Make your changes** with clear, descriptive commits
4. **Test thoroughly** - ensure the app builds and runs
5. **Update documentation** if needed
6. **Submit a pull request** with a clear description

## Development Setup

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Git
- Windows 10/11 for testing

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ai-readability-scorer.git
cd ai-readability-scorer

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/ai-readability-scorer.git

# Install dependencies
npm install

# Start development
npm run dev
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define proper types and interfaces
- Avoid `any` type when possible

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add comments for complex logic
- Follow existing code patterns

### React Components

- Use functional components with hooks
- Keep components focused and small
- Use proper prop types
- Handle errors gracefully

### Naming Conventions

- **Files**: camelCase for utilities, PascalCase for components
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Classes**: PascalCase
- **Functions**: camelCase, descriptive names

## Testing

### Before Submitting

- [ ] Application builds without errors: `npm run build`
- [ ] No TypeScript errors
- [ ] All features work as expected
- [ ] No console errors or warnings
- [ ] Tested on Windows 11

### Manual Testing Checklist

- [ ] Text input and analysis works
- [ ] File operations (open, save, export) work
- [ ] All metrics calculate correctly
- [ ] UI is responsive and bug-free
- [ ] Window controls work properly
- [ ] Keyboard shortcuts function correctly

## Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(analysis): add support for Spanish text
fix(export): correct HTML export formatting
docs(readme): update installation instructions
```

## Project Structure

```
src/
├── main/           # Electron main process
│   ├── main.ts     # Application entry, window management
│   └── preload.ts  # Secure IPC bridge
└── renderer/       # React application
    ├── App.tsx     # Main component
    ├── App.css     # Styles
    ├── types.ts    # Type definitions
    └── readabilityEngine.ts  # Analysis logic
```

## Adding New Features

### New Readability Metric

1. Add the metric to `ReadabilityMetrics` interface in `types.ts`
2. Implement the calculation in `readabilityEngine.ts`
3. Add it to `calculateReadabilityMetrics()` function
4. Update the UI in `App.tsx` to display it
5. Update documentation and tests

### New UI Component

1. Create component in `src/renderer/components/` (if complex)
2. Add TypeScript types
3. Implement with accessibility in mind
4. Add to parent component
5. Style consistently with existing design

## Windows 11 Design Guidelines

- Follow Fluent Design principles
- Use system colors and fonts (Segoe UI)
- Maintain consistent spacing (8px grid)
- Ensure high contrast mode compatibility
- Support light theme (dark theme is roadmap item)

## Performance Considerations

- Avoid unnecessary re-renders
- Use React.memo for expensive components
- Debounce expensive operations
- Keep bundle size minimal
- Lazy load when appropriate

## Security

- Never expose sensitive data
- Validate all user inputs
- Use contextIsolation for Electron
- Keep dependencies updated
- Follow Electron security guidelines

## Documentation

Update documentation when:
- Adding new features
- Changing existing behavior
- Fixing bugs with user impact
- Adding keyboard shortcuts
- Changing UI significantly

## Questions?

- Open an issue for discussion
- Check existing issues and PRs
- Review the documentation
- Ask in discussions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AI Readability Scorer!
