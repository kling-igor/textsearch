import "@babel/polyfill";
import { app, ipcMain, BrowserWindow } from "electron";
import WM from "./window-manager";

const { callRenderer, answerRenderer } = require('./ipc')(ipcMain, BrowserWindow)

const onFocus = hash => {
  const win = WM.getWindow(hash);
  win.webContents.send("window:focus", true);
};

const onBlur = hash => {
  const win = WM.getWindow(hash);
  win.webContents.send("window:focus", false);
};

app.on("ready", () => {
  const hash = WM.openWindow(
    "index.html",
    { backgroundColor: "white" },
    () => {
      // const menuTemplate = createMenuTemplate(eventEmitter);
      // const menu = Menu.buildFromTemplate(menuTemplate);
      // Menu.setApplicationMenu(menu);
    },
    () => {
      onFocus(hash);
    },
    () => {
      onBlur(hash);
    },
    false // DEV_TOOLS
  );
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on('search', (projectPath, query, options) => {
  console.log('SEARCH!!!')
})

/*
return await new Promise((resolve, reject) => {
  worker = fork(join(__dirname, 'worker.js'), [projectPath]);

  worker.once('message', ({ status, details }) => {

    setImmediate(() => {
      worker.kill('SIGKILL')
    })

    if (status === 'error') {
      reject(details)
    }
    else {
      resolve()
    }
  });
})
*/
