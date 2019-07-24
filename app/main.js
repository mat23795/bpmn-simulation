const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

const prompt = require('electron-prompt');

// const vex = require('vex-js')
// vex.registerPlugin(require('vex-dialog'))
// vex.defaultOptions.className = 'vex-theme-os'

//init win
let win;

function createWindow() {

    //create browser windo
    win = new BrowserWindow({
        width: 800,
        heigth: 600,
        icon: __dirname + '/../img/icon.png'
        ,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.maximize();

    win.loadURL(url.format({
        pathname: path.join(__dirname, '/../dist/index.html'),
        protocol: 'file',
        slashes: true
    }));

    //open up devtools
    // win.webContents.openDevTools();


    // prompt({
    //     title: 'Prompt example',
    //     label: 'URL:',
    //     value: 'http://example.org',
    //     inputAttrs: {
    //         type: 'url'
    //     }
    // })
    //     .then((r) => {
    //         if (r === null) {
    //             console.log('user cancelled');
    //         } else {
    //             console.log('result', r);
    //         }
    //     })
    //     .catch(console.error);


    // vex.dialog.confirm({
    //     message: 'Are you absolutely sure you want to destroy the alien planet?',
    //     callback: function (value) {
    //         if (value) {
    //             console.log('Successfully destroyed the planet.')
    //         } else {
    //             console.log('Chicken.')
    //         }
    //     }
    // })

    win.on('closed', () => {
        win = null;
    });
}

//run create window function
app.on('ready', createWindow);

// quit when all eindows are closed
app.on('window-all-closed', () => {
    if (process.platfoem !== 'darwin') {
        app.quit();
    }
});

