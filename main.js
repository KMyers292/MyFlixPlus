
// Import parts of electron to use
const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const url = require('url');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let proc;
let userDataPath = app.getPath('userData');

// Keep a reference for dev mode
let isDev = false;

if (process.env.NODE_ENV !== undefined && process.env.NODE_ENV === 'development') {
  isDev = true
}

const parseDataFile = (filePath, defaults) => {
  try {
      return JSON.parse(fs.readFileSync(filePath));
  } 
  catch (error) {   
      return defaults;
  }
};

class Store {
  constructor(options) {
      this.path = path.join(userDataPath, options.configName + '.json');
      this.data = parseDataFile(this.path, options.defaults);
  }

  get(key) {
      return this.data[key];
  }

  set(key, value) {
      this.data[key] = value;
      fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
};

// Init store & defaults
const store = new Store({
	configName: 'user-settings',
	defaults: {
	  settings: {
		  directoryPath: null,
      region: null
	  },
    watchlist: []
	}
});

// Temporary fix broken high-dpi scale factor on Windows (125% scaling)
// info: https://github.com/electron/electron/issues/9691
if (process.platform === 'win32') {
  app.commandLine.appendSwitch('high-dpi-support', 'true')
  app.commandLine.appendSwitch('force-device-scale-factor', '1')
}

function createMainWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  })

  // and load the index.html of the app.
  let indexPath;

  if (isDev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    })
  }

  mainWindow.loadURL(indexPath);

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    // Open the DevTools automatically if developing
    if (isDev) {
      mainWindow.webContents.openDevTools();
      const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

      installExtension(REACT_DEVELOPER_TOOLS)
        .catch(err => console.log('Error loading React DevTools: ', err))
    }
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

const launchVLC = (file) => {
  const path = 'D:/Projects/Electron/MyFlix_javascript/VLC/vlc.exe';
  proc = spawn(`"${path}"`, [`"${file}"`], { shell: true });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
	createMainWindow();

	mainWindow.webContents.on('dom-ready', () => {
		mainWindow.webContents.send('settings:get', store.get('settings'));
	});
});

// Set settings
ipcMain.on('settings:set', (event, settings) => {
	store.set('settings', settings);
	mainWindow.webContents.send('settings:get', store.get('settings'));
});

// Set watchlist
ipcMain.on('watchlist:set', (event, watchlist) => {
  store.set('watchlist', watchlist);
  mainWindow.webContents.send('watchlist:get', store.get('watchlist'));
});

ipcMain.handle('getPath', () => app.getPath('userData'));

ipcMain.on('vlc:open', (event, file) => {
	launchVLC(file);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createMainWindow();
  }
});
