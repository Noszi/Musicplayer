const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

let isDev = process.env.NODE_ENV !== 'production';
let win;

function createWindow() {
	win = new BrowserWindow({
		height: 600,
		width: 600,
		minWidth: 875,
		minHeight: 600,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false
		}
	});

	if (!fs.existsSync('savedlist')) fs.mkdirSync('savedlist');

	win.loadURL(isDev ? 'http://localhost:9080' : `file://${__dirname}/index.html`);
	if (isDev) win.webContents.openDevTools();

	ipcMain.on('closeWindow', () => {
		app.quit();
	});
	ipcMain.on('resizeWindow', () => {
		if (win.isMaximized()) win.unmaximize();
		else win.maximize();
	});
	ipcMain.on('minimizeWindow', () => {
		win.minimize();
	});
	ipcMain.on('openDialog', () => {
		var config = {
			properties: [ 'openDirectory' ]
		};
		dialog.showOpenDialog(win, config).then((result) => {
			if (result.filePaths) {
				fs.writeFile('path.txt', result.filePaths, function(err, data) {
					if (err) console.log(err);
				});
				scanDir(result.filePaths);
			}
		});
	});
	ipcMain.on('save', (event, args) => {
		if (!fs.existsSync('savedlist')) fs.mkdirSync('savedlist');
		fs.writeFile(`savedlist\\${args.name}.json`, args.data, function(err, data) {
			if (err) console.log(err);
			win.webContents.send('playlist', getList());
		});
	})
	ipcMain.on('deletepl', (event, args) => {
		fs.unlink(`savedlist\\${args}.json`, (err, data) => {
			if (err) throw err;
			win.webContents.send('playlist', getList());
		});
	});
	ipcMain.on('getPlaylist', () => {
		win.webContents.send('playlist', getList());
	})
	
	win.on('closed', () => {
		win = null;
	});
}

app.on('ready', createWindow);
app.on('activate', () => {
	if (win === null) createWindow();
});
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

function getList() {
	files = fs.readdirSync('savedlist');
	return files.map(v => { return v.substr(0, v.indexOf('.'))});
}

function openFolderDialog() {
	dialog.showOpenDialog(win, { properties: [ 'openDirectory' ] }, function(filePath) {
		if (filePath) {
			fs.writeFile('path.txt', filePath, function(err, data) {
				if (err) console.log(err);
			});
			scanDir(filePath);
		}
	});
}

var walkSync = function(dir, filelist) {
	files = fs.readdirSync(dir);
	filelist = filelist || [];
	files.forEach(function(file) {
		if (fs.statSync(path.join(dir, file)).isDirectory()) {
			filelist = walkSync(path.join(dir, file), filelist);
		} else {
			if (
				file.substr(-4) === '.mp3' ||
				file.substr(-4) === '.m4a' ||
				file.substr(-5) === '.webm' ||
				file.substr(-4) === '.wav' ||
				file.substr(-4) === '.aac' ||
				file.substr(-4) === '.ogg' ||
				file.substr(-5) === '.opus'
			) {
				filelist.push(path.join(dir, file));
			}
		}
	});
	return filelist;
};

function scanDir(filePath) {
	if (!filePath || filePath[0] == 'undefined') return;
	var arr = walkSync(filePath[0]);
	var objToSend = {};
	objToSend.files = arr;
	objToSend.path = filePath;
	win.webContents.send('selected-files', objToSend);
}
