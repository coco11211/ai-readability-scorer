import { app, BrowserWindow, ipcMain, dialog, Menu, shell } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import log from 'electron-log';
import Store from 'electron-store';
import { autoUpdater } from 'electron-updater';

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;

// Initialize electron store for settings
const store = new Store();

let mainWindow: BrowserWindow | null = null;

// Configure auto-updater
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow(): void {
  // Get saved window bounds or use defaults
  const windowBounds = store.get('windowBounds', {
    width: 1200,
    height: 800,
  }) as { width: number; height: number; x?: number; y?: number };

  mainWindow = new BrowserWindow({
    ...windowBounds,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#f3f3f3',
    show: false,
    frame: false, // Custom title bar for Windows 11
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      devTools: !app.isPackaged,
    },
    icon: path.join(__dirname, '../../build/icon.ico'),
  });

  // Windows 11 specific optimizations
  if (process.platform === 'win32') {
    mainWindow.setBackgroundMaterial('acrylic');
  }

  // Load the app
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  } else {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();

    // Check for updates in production
    if (app.isPackaged) {
      autoUpdater.checkForUpdates();
    }
  });

  // Save window bounds on close
  mainWindow.on('close', () => {
    if (mainWindow) {
      store.set('windowBounds', mainWindow.getBounds());
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  createApplicationMenu();
}

function createApplicationMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Text File',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow?.webContents.send('menu-open-file');
          },
        },
        {
          label: 'Save Analysis',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow?.webContents.send('menu-save-analysis');
          },
        },
        { type: 'separator' },
        {
          label: 'Export as PDF',
          click: () => {
            mainWindow?.webContents.send('menu-export-pdf');
          },
        },
        {
          label: 'Export as HTML',
          click: () => {
            mainWindow?.webContents.send('menu-export-html');
          },
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'Alt+F4',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Analysis',
      submenu: [
        {
          label: 'Run Analysis',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow?.webContents.send('menu-run-analysis');
          },
        },
        {
          label: 'Clear Results',
          accelerator: 'CmdOrCtrl+K',
          click: () => {
            mainWindow?.webContents.send('menu-clear-results');
          },
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://github.com/ai-readability-scorer');
          },
        },
        {
          label: 'Report Issue',
          click: () => {
            shell.openExternal('https://github.com/ai-readability-scorer/issues');
          },
        },
        { type: 'separator' },
        {
          label: 'Check for Updates',
          click: () => {
            autoUpdater.checkForUpdates();
          },
        },
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox({
              type: 'info',
              title: 'About AI Readability Scorer',
              message: 'AI Readability Scorer',
              detail: `Version: ${app.getVersion()}\n\nAn AI-powered text readability analyzer for Windows 11.`,
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('window-minimize', () => {
  mainWindow?.minimize();
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.handle('window-close', () => {
  mainWindow?.close();
});

ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile'],
    filters: [
      { name: 'Text Files', extensions: ['txt', 'md', 'doc', 'docx'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    try {
      const content = fs.readFileSync(result.filePaths[0], 'utf-8');
      return { success: true, content, filePath: result.filePaths[0] };
    } catch (error) {
      log.error('Error reading file:', error);
      return { success: false, error: 'Failed to read file' };
    }
  }

  return { success: false, error: 'No file selected' };
});

ipcMain.handle('save-file-dialog', async (event, data: { content: string; defaultName?: string }) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    defaultPath: data.defaultName || 'analysis-result.json',
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (!result.canceled && result.filePath) {
    try {
      fs.writeFileSync(result.filePath, data.content, 'utf-8');
      return { success: true, filePath: result.filePath };
    } catch (error) {
      log.error('Error saving file:', error);
      return { success: false, error: 'Failed to save file' };
    }
  }

  return { success: false, error: 'Save canceled' };
});

ipcMain.handle('export-html', async (event, data: { content: string; defaultName?: string }) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    defaultPath: data.defaultName || 'analysis-report.html',
    filters: [
      { name: 'HTML Files', extensions: ['html'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (!result.canceled && result.filePath) {
    try {
      fs.writeFileSync(result.filePath, data.content, 'utf-8');
      return { success: true, filePath: result.filePath };
    } catch (error) {
      log.error('Error exporting HTML:', error);
      return { success: false, error: 'Failed to export HTML' };
    }
  }

  return { success: false, error: 'Export canceled' };
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-settings', (event, key?: string) => {
  if (key) {
    return store.get(key);
  }
  return store.store;
});

ipcMain.handle('set-settings', (event, key: string, value: any) => {
  store.set(key, value);
  return { success: true };
});

ipcMain.handle('show-notification', (event, options: { title: string; body: string }) => {
  mainWindow?.webContents.send('show-notification', options);
});

// Auto-updater events
autoUpdater.on('update-available', (info) => {
  log.info('Update available:', info);
  mainWindow?.webContents.send('update-available', info);
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available:', info);
});

autoUpdater.on('error', (err) => {
  log.error('Error in auto-updater:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  mainWindow?.webContents.send('download-progress', progressObj);
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded:', info);
  mainWindow?.webContents.send('update-downloaded', info);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled rejection at:', promise, 'reason:', reason);
});
