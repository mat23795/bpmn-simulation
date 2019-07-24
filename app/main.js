const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

const prompt = require('electron-prompt');

//init win
let win;

function createWindow(){

    //create browser windo
    win = new BrowserWindow({
        width:800, 
        heigth:600,
        icon: __dirname+'/../img/icon.png'
        ,
        webPreferences: {
            nodeIntegration: true
        }    
    });

    win.maximize();

    win.loadURL(url.format({
        pathname: path.join(__dirname, '/../dist/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    //open up devtools
    win.webContents.openDevTools();

    


    win.on('closed', () => {
        win = null;
    });
}

//run create window function
app.on('ready', createWindow);

// quit when all eindows are closed
app.on('window-all-closed', ()=>{
    if(process.platfoem !== 'darwin'){
        app.quit();
    }
});

