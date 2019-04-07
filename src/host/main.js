import "@babel/polyfill";
import { fork } from 'child_process'
import { join } from "path";
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

let worker
let currentCorrelationMarker

ipcMain.on('search', (event, correlationMarker, projectPath, query, caseSensitive) => {
  console.log(`SEARCH ${query} in ${projectPath}`)

  // убиваем воркер, работающий над старой задачей
  if (worker && currentCorrelationMarker && currentCorrelationMarker !== correlationMarker) {
    worker.kill('SIGKILL')
    worker = null
  }

  if (!worker) {
    worker = fork(join(__dirname, 'worker.js'), [projectPath, query, caseSensitive]);
    currentCorrelationMarker = correlationMarker

    worker.on('message', details => {
      event.sender.send('search', details)
    })
  }
})
