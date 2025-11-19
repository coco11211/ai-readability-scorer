# Deployment Guide

This guide covers deploying AI Readability Scorer for production use.

## Pre-Deployment Checklist

### Code Quality

- [ ] All TypeScript compiles without errors
- [ ] No console errors or warnings
- [ ] ESLint passes without issues
- [ ] All features tested and working
- [ ] Documentation is up to date

### Version Management

- [ ] Version number updated in `package.json`
- [ ] CHANGELOG.md updated with changes
- [ ] Git tags created for release
- [ ] Release notes prepared

### Build Assets

- [ ] Application icon created (`build/icon.ico`)
- [ ] Icon is 256x256 with proper format
- [ ] All resources in `build/` directory
- [ ] Build tested on clean Windows machine

### Security

- [ ] Dependencies audited: `npm audit`
- [ ] No critical vulnerabilities
- [ ] Code signing certificate obtained (for official releases)
- [ ] Environment variables secured

## Building for Production

### 1. Clean Environment

```bash
# Remove old builds
rm -rf dist/
rm -rf release/
rm -rf node_modules/

# Fresh install
npm install
```

### 2. Production Build

```bash
# Build the application
npm run build

# Verify build
npm start
```

### 3. Create Distributables

**Without code signing:**
```bash
npm run dist
```

**With code signing:**
```bash
# Windows CMD
set CSC_LINK=C:\path\to\certificate.pfx
set CSC_KEY_PASSWORD=your_password
npm run dist

# Windows PowerShell
$env:CSC_LINK="C:\path\to\certificate.pfx"
$env:CSC_KEY_PASSWORD="your_password"
npm run dist
```

## Distribution Formats

### NSIS Installer

**File:** `release/AI Readability Scorer-1.0.0-x64.exe`

**Features:**
- Full installer with uninstaller
- Desktop and Start Menu shortcuts
- Custom installation directory
- Per-user or per-machine installation
- Automatic updates support

**When to use:**
- Official releases
- Enterprise deployment
- Users who want traditional installation

### Portable Version

**File:** `release/AI Readability Scorer-1.0.0-portable.exe`

**Features:**
- Single executable file
- No installation required
- Can run from USB drive
- No registry entries
- Fully self-contained

**When to use:**
- Users without admin rights
- Temporary usage
- USB/portable deployment
- Testing environments

### Unpacked Directory

**Location:** `release/win-unpacked/`

**Created by:** `npm run package:dir`

**When to use:**
- Internal testing
- Custom deployment scripts
- Manual distribution
- Development verification

## Deployment Methods

### GitHub Releases

1. **Create Release on GitHub**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Upload Distributables**
   - NSIS installer (x64)
   - NSIS installer (ARM64)
   - Portable version
   - Release notes

3. **Configure Auto-Updates**
   - electron-updater will check GitHub releases
   - Users get automatic update notifications

### Direct Download

1. Host files on web server
2. Provide download links on website
3. Include SHA256 checksums for verification

**Generate checksums:**
```bash
# Windows PowerShell
Get-FileHash "AI Readability Scorer-1.0.0-x64.exe" -Algorithm SHA256
```

### Enterprise Deployment

#### Group Policy

1. Create MSI installer (requires additional tools)
2. Deploy via Group Policy
3. Configure auto-update settings

#### SCCM/Intune

1. Package the installer
2. Create deployment
3. Configure detection rules
4. Deploy to target groups

#### Silent Installation

```cmd
"AI Readability Scorer-1.0.0-x64.exe" /S
```

Options:
- `/S` - Silent installation
- `/D=C:\Path` - Custom installation directory
- `/NCRC` - Skip CRC check (not recommended)

## Auto-Updates

### Configuration

Auto-updates are configured in `src/main/main.ts`:

```typescript
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;
```

### GitHub Releases Setup

1. **Tag Format:** `v1.0.0`
2. **Release Assets:** Upload installer files
3. **latest.yml:** Generated automatically by electron-builder

### Custom Update Server

Update `package.json`:

```json
{
  "build": {
    "publish": {
      "provider": "generic",
      "url": "https://your-server.com/updates"
    }
  }
}
```

### Testing Updates

1. Build version 1.0.0
2. Install it
3. Build version 1.0.1
4. Publish to release server
5. Launch 1.0.0 and verify update notification

## Post-Deployment

### Verification

- [ ] Download and install from distribution source
- [ ] Test on clean Windows 10 machine
- [ ] Test on clean Windows 11 machine
- [ ] Verify all features work
- [ ] Check auto-update functionality
- [ ] Test uninstallation

### Monitoring

**Crash Reporting:**
- electron-log captures crashes
- Consider adding Sentry or similar

**Usage Analytics:**
- Implement if desired (with user consent)
- Track popular features
- Monitor error rates

**Update Adoption:**
- Track update download rates
- Monitor version distribution
- Identify update issues

### User Communication

**Release Announcement:**
- Publish release notes
- Update website
- Notify users via email/social media

**Documentation:**
- Update user guide
- Create video tutorials
- Answer FAQ

**Support:**
- Monitor GitHub issues
- Respond to user questions
- Collect feedback

## Security Considerations

### Code Signing

**Why it's important:**
- Prevents "Unknown Publisher" warnings
- Verifies software authenticity
- Required for some enterprises
- Builds user trust

**Process:**
1. Purchase certificate from trusted CA
2. Sign all distributable files
3. Verify signature before release

### Update Security

- Use HTTPS for update server
- Verify update signatures
- Don't skip signature verification

### Distribution Security

- Host on HTTPS only
- Provide SHA256 checksums
- Use official channels only
- Monitor for fake/malicious copies

## Rollback Plan

If critical issues are found:

1. **Immediate:**
   - Remove download links
   - Post warning on website
   - Notify users

2. **Fix:**
   - Identify and fix issue
   - Test thoroughly
   - Build new version

3. **Re-deploy:**
   - Upload fixed version
   - Increment version number
   - Push automatic update

## Performance Monitoring

### Metrics to Track

- Application start time
- Analysis speed
- Memory usage
- Crash rate
- Update success rate

### Optimization

If performance issues arise:
- Profile with DevTools
- Optimize bundle size
- Lazy load components
- Cache expensive operations

## Legal and Compliance

### License Compliance

- [ ] All dependencies have compatible licenses
- [ ] License file included
- [ ] Third-party notices included
- [ ] Open source obligations met

### Privacy

- [ ] Privacy policy (if collecting data)
- [ ] GDPR compliance (if applicable)
- [ ] User data handling documented
- [ ] Opt-in for analytics

## Troubleshooting Deployment

### Installer Won't Run

**Solution:**
- Check Windows version compatibility
- Verify file isn't corrupted (check SHA256)
- Try running as administrator
- Check antivirus isn't blocking

### Auto-Update Fails

**Solution:**
- Verify update server is accessible
- Check latest.yml is properly formatted
- Ensure app has internet access
- Verify code signatures match

### Slow Downloads

**Solution:**
- Use CDN for distribution
- Compress installers (already done by electron-builder)
- Provide regional mirrors
- Consider torrent distribution for large files

## Continuous Deployment

### GitHub Actions Workflow

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - run: npm run dist
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          CSC_LINK: ${{ secrets.CSC_LINK }}
          CSC_KEY_PASSWORD: ${{ secrets.CSC_KEY_PASSWORD }}
      - uses: actions/upload-artifact@v3
        with:
          name: installers
          path: release/*.exe
```

## Support After Deployment

### User Support

- Monitor GitHub issues
- Respond to questions quickly
- Create knowledge base
- Update FAQ regularly

### Bug Fixes

- Prioritize critical bugs
- Release patches quickly
- Communicate fixes to users
- Track fix effectiveness

### Feature Requests

- Collect user feedback
- Prioritize features
- Plan roadmap
- Communicate timeline

---

**Remember:** Always test thoroughly before deploying to production!
