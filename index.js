const { app, BrowserWindow } = require('electron');
if (require('electron-squirrel-startup')) {
	app.quit();
}

function isStandalone() {
	if (module.filename.includes("app.asar")) {
		return true;
	} else {
		return false;
	}
}

let mainWindow;
const createWindow = () => {
	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: true,
			nodeIntegrationInWorker: true,
			enableRemoteModule: true,
			v8CacheOptions: 'none',
			kiosk: true,
			sandbox:false,
			preload: ()=>{window.ipc = require('ipc')}
		},
		width: 1280,
		height: 720,
	});
	mainWindow.loadURL(`file://${__dirname}/index.html`);
	if (!isStandalone()) {
		mainWindow.webContents.openDevTools();
	}
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
};
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required") 
app.on('ready', createWindow);
app.getPath('userData');
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
