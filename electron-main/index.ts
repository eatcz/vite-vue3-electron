/*
 * @Author: Javan 864479410@qq.com
 * @Date: 2022-05-11 14:37:44
 * @LastEditors: Javan 864479410@qq.com
 * @LastEditTime: 2022-05-11 15:09:11
 * @FilePath: \todolist\electron-main\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// electron-main/index.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

let mainWindow : any;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, '../electron-preload/index.js'),
    },
    frame: true, // 标题栏和边框一并隐藏
  });
  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../index.html'));
  } else {
    // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
    const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`;

    mainWindow.loadURL(url);
  }
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = ''
  })

  mainWindow.on('resize', () => {
    mainWindow.webContents.send('resizeEvent')
  })
};


app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('min', e => mainWindow.minimize())
ipcMain.on('max', e => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
})
ipcMain.on('close', e => mainWindow.close())
