# Build Guide for AI Readability Scorer

This guide provides step-by-step instructions for building the AI Readability Scorer application from source.

## Prerequisites

### Required Software

1. **Node.js** (v18.x or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git**
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

4. **Windows 10/11** (for building and testing)

### Optional Tools

- **Visual Studio Code** - Recommended code editor
- **Windows Terminal** - Better terminal experience

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-readability-scorer.git
cd ai-readability-scorer
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Electron
- React and React-DOM
- TypeScript
- Webpack and loaders
- electron-builder
- And all other dependencies

**Note:** If you encounter network issues with Electron downloads, try:

```bash
# Use a different Electron mirror
npm config set electron_mirror https://npmmirror.com/mirrors/electron/
npm install

# Or set environment variable
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
npm install
```

### 3. Add Application Icon

Before building for production, add an application icon:

1. Create or obtain a 256x256 PNG icon
2. Convert it to ICO format using an online converter or tool
3. Place it at: `build/icon.ico`

See `build/ICON_README.md` for more details.

## Development

### Start Development Server

```bash
npm run dev
```

This will:
- Start the Webpack dev server for the renderer process
- Watch and compile the main process
- Enable hot module replacement
- Open DevTools automatically

The app will be available at `http://localhost:3000` for the renderer process, and Electron will load it automatically.

### Development Mode Features

- **Hot Reload**: Changes to React components update instantly
- **DevTools**: Full Chrome DevTools available
- **Source Maps**: Debug with original TypeScript source
- **Auto Restart**: Main process restarts on changes

## Building

### Development Build

Build without packaging:

```bash
npm run build
```

This compiles TypeScript and bundles the application into the `dist/` folder.

### Production Build

Full production build with optimization:

```bash
npm run build:main
npm run build:renderer
```

Or simply:

```bash
npm run build
```

## Packaging

### Package Without Installer (Testing)

Create a packaged app without installer:

```bash
npm run package:dir
```

Output: `release/win-unpacked/`

This is useful for:
- Testing the packaged app
- Quick distribution without installer
- Verifying app works in production mode

### Create Installer

Full distribution with NSIS installer:

```bash
npm run package
```

Or:

```bash
npm run dist
```

This creates:
- **NSIS Installer** (x64): `release/AI Readability Scorer-1.0.0-x64.exe`
- **NSIS Installer** (ARM64): `release/AI Readability Scorer-1.0.0-arm64.exe`
- **Portable** (x64): `release/AI Readability Scorer-1.0.0-portable.exe`

### Installer Features

The NSIS installer includes:
- Custom installation directory selection
- Desktop shortcut creation
- Start Menu shortcut
- Uninstaller
- File associations (optional)
- Auto-start option (optional)

## Code Signing (Production)

For official releases, sign your application:

### 1. Obtain Certificate

Get a code signing certificate from a trusted CA:
- DigiCert
- Sectigo
- GlobalSign
- Others

### 2. Configure Signing

Set environment variables before building:

**Windows (CMD):**
```cmd
set CSC_LINK=C:\path\to\certificate.pfx
set CSC_KEY_PASSWORD=your_password
npm run dist
```

**Windows (PowerShell):**
```powershell
$env:CSC_LINK="C:\path\to\certificate.pfx"
$env:CSC_KEY_PASSWORD="your_password"
npm run dist
```

**Alternative: Use environment file**

Create `.env` file:
```
CSC_LINK=C:\path\to\certificate.pfx
CSC_KEY_PASSWORD=your_password
```

### 3. Verify Signature

After building, verify the signature:

```powershell
Get-AuthenticodeSignature "release\AI Readability Scorer-1.0.0-x64.exe"
```

## Testing Builds

### Test Development Build

```bash
npm start
```

### Test Production Build

```bash
npm run package:dir
cd release/win-unpacked
"AI Readability Scorer.exe"
```

### Test Installer

1. Run the installer: `release/AI Readability Scorer-1.0.0-x64.exe`
2. Install to a test directory
3. Launch the application
4. Test all features
5. Uninstall and verify cleanup

## Troubleshooting

### Build Fails

**Issue: TypeScript errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix errors and rebuild
npm run build
```

**Issue: Webpack errors**
```bash
# Clear cache and rebuild
rm -rf dist/
rm -rf node_modules/
npm install
npm run build
```

**Issue: Out of memory**
```bash
# Increase Node.js memory
set NODE_OPTIONS=--max-old-space-size=4096
npm run build
```

### Electron Install Fails

**Issue: Network timeout or 403 error**
```bash
# Use different mirror
npm config set electron_mirror https://npmmirror.com/mirrors/electron/
npm install electron --force

# Or download manually
# Visit https://github.com/electron/electron/releases
# Download the correct version
# Place in node_modules/electron/dist/
```

### Package Build Fails

**Issue: Icon not found**
- Ensure `build/icon.ico` exists
- Use proper ICO format (not PNG renamed to .ico)

**Issue: Code signing fails**
- Verify certificate path is correct
- Check password is correct
- Ensure certificate is valid and not expired

**Issue: NSIS errors**
- Install NSIS (included with electron-builder)
- Check Windows long path support
- Run as administrator

### Runtime Issues

**Issue: App won't start**
- Check Windows version (requires Win10 1809+)
- Install Visual C++ Redistributable
- Check antivirus settings

**Issue: White screen**
- Check DevTools for errors (Ctrl+Shift+I)
- Verify all files in dist/ folder
- Rebuild: `npm run build && npm start`

## Performance Optimization

### Reduce Bundle Size

1. **Analyze bundle:**
```bash
npm install --save-dev webpack-bundle-analyzer
# Add to webpack config
# Run build and check analysis
```

2. **Tree shaking:**
- Import only what you need
- Use ES6 imports, not require()

3. **Code splitting:**
- Lazy load components
- Split vendor bundles

### Build Speed

1. **Use cache:**
```bash
# webpack caches automatically
# Clear if needed: rm -rf node_modules/.cache
```

2. **Parallel builds:**
- webpack runs in parallel by default
- Use worker threads for heavy tasks

## Continuous Integration

### GitHub Actions Example

```yaml
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run package
      - uses: actions/upload-artifact@v2
        with:
          name: installer
          path: release/*.exe
```

## Release Process

### 1. Prepare Release

```bash
# Update version in package.json
npm version patch  # or minor, or major

# Update CHANGELOG.md
# Commit changes
git add .
git commit -m "chore: prepare release v1.0.1"
git tag v1.0.1
```

### 2. Build Release

```bash
# Clean build
rm -rf dist/ release/
npm run build
npm run dist
```

### 3. Test Release

- Install on clean Windows machine
- Test all features
- Verify auto-update works
- Check uninstall process

### 4. Publish

```bash
# Push to GitHub
git push && git push --tags

# Upload to GitHub Releases
# Or use electron-builder publish
npm run dist -- --publish always
```

## Additional Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder Documentation](https://www.electron.build/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Webpack Documentation](https://webpack.js.org/)

## Support

For build issues:
1. Check this guide
2. Search existing GitHub issues
3. Create a new issue with:
   - Build output/error logs
   - System information
   - Steps to reproduce

---

**Last Updated:** November 2024
