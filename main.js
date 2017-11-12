const {app, BrowserWindow, ipcMain} = require("electron");
const abc = require("electron");
const path = require("path");
const url = require("url");
const lib = require("./index.js");
const explorer = require("./explorer").fromServer.async;

// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function listenAsyncMessageFromRendererProcess(){
  ipcMain.on("async", (event, arg) => {
    console.log(arg);
    event.sender.send("async-reply", 2);
  });
};

function listenSyncMessageFromRendererProcess(){
  ipcMain.on("sync", (event, arg) => {
    console.log(arg);
    event.returnValue = 4;
    mainWindow.webContents.send("ping", 5);
  });
};

// Make method externaly visible
function makeMethodExternal(){
  exports.pong = arg => {
    console.log(arg);
  };
};

listenAsyncMessageFromRendererProcess();
listenSyncMessageFromRendererProcess();
makeMethodExternal();

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, "index.html"),
    protocol: "file:",
    slashes: true
  }))

  // Open the DevTools.
  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  // On macOS it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

setTimeout(()=>{
  win.webContents.send("updatePhoto", {hey: "good"});
}, 5000);

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

async function dirContentService(sender, msg){
    try {
        const dirContent = await explorer.getContentDir(sender, msg);
        const flatten = dirContent.reduce((cumulator, file, origin)=> {
            const stat = file.stat;
            const funcResults = {
                isFile: stat.isFile(),
                isDirectory: stat.isDirectory(),
                isCharacterDevice: stat.isCharacterDevice(),
                isFIFO: stat.isFIFO(),
                isSocket: stat.isSocket()
            };
            Object.assign(stat, funcResults);
            cumulator.push(file);
            return cumulator;
        }, []);
        win.webContents.send(msg.id, { dirContent });
    } catch(err){
        debugger;
        win.webContents.send(msg.id, { err });
    }
};

ipcMain.on("dirContent",dirContentService);