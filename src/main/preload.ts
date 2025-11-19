import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Window controls
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowMaximize: () => ipcRenderer.invoke('window-maximize'),
  windowClose: () => ipcRenderer.invoke('window-close'),

  // File operations
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  saveFileDialog: (data: { content: string; defaultName?: string }) =>
    ipcRenderer.invoke('save-file-dialog', data),
  exportHtml: (data: { content: string; defaultName?: string }) =>
    ipcRenderer.invoke('export-html', data),

  // Settings
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getSettings: (key?: string) => ipcRenderer.invoke('get-settings', key),
  setSettings: (key: string, value: any) => ipcRenderer.invoke('set-settings', key, value),

  // Notifications
  showNotification: (options: { title: string; body: string }) =>
    ipcRenderer.invoke('show-notification', options),

  // Menu events
  onMenuOpenFile: (callback: () => void) => ipcRenderer.on('menu-open-file', callback),
  onMenuSaveAnalysis: (callback: () => void) => ipcRenderer.on('menu-save-analysis', callback),
  onMenuExportPdf: (callback: () => void) => ipcRenderer.on('menu-export-pdf', callback),
  onMenuExportHtml: (callback: () => void) => ipcRenderer.on('menu-export-html', callback),
  onMenuRunAnalysis: (callback: () => void) => ipcRenderer.on('menu-run-analysis', callback),
  onMenuClearResults: (callback: () => void) => ipcRenderer.on('menu-clear-results', callback),

  // Auto-updater events
  onUpdateAvailable: (callback: (info: any) => void) =>
    ipcRenderer.on('update-available', (event, info) => callback(info)),
  onDownloadProgress: (callback: (progress: any) => void) =>
    ipcRenderer.on('download-progress', (event, progress) => callback(progress)),
  onUpdateDownloaded: (callback: (info: any) => void) =>
    ipcRenderer.on('update-downloaded', (event, info) => callback(info)),

  // Notification display
  onShowNotification: (callback: (options: { title: string; body: string }) => void) =>
    ipcRenderer.on('show-notification', (event, options) => callback(options)),
});
