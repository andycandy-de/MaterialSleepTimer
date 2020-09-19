import { app, BrowserWindow, screen, ipcMain, ipcRenderer, webContents } from 'electron'
import * as path from 'path'
import * as url from 'url'
import { exec } from "child_process"
import { Model, Config } from './types'
import { ForceFocus } from './forcefocus'
import { minToMillies } from './util'
import * as fs from 'fs'

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve')

export class ElectronApp {

  private readonly forceFocus = new ForceFocus()
  private readonly enableDevTools = false

  private mainWindow: BrowserWindow
  private overlayWindow: BrowserWindow
  private settingsWindow: BrowserWindow
  private model: Model
  private config: Config

  private interval: any

  public startApp () {
      try {

          app.allowRendererProcessReuse = true
        
          // This method will be called when Electron has finished
          // initialization and is ready to create browser windows.
          // Some APIs can only be used after this event occurs.
          // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
          app.on('ready', () => setTimeout(() => {
              this.createMainWindow()
          }, 400))
        
          // Quit when all windows are closed.
          app.on('window-all-closed', () => {
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
              app.quit()
            }
          })
        
          app.on('activate', () => {
            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (this.mainWindow === null) {
              this.createMainWindow()
            }
          })
        
        } catch (e) {
          // Catch Error
          // throw e
        }

        this.configure()
        this.createModel(this.getDefaultConfig())
        this.initListeners()
        this.updateCheckStatusInterval()
  }

  private createMainWindow() : void {

      const electronScreen = screen
      const width = 400
      const height = 200
    
      // Create the browser window.
      this.mainWindow = new BrowserWindow({
        width: width,
        height: height,
        resizable: this.enableDevTools,
        center: true,
        maximizable : false,
        webPreferences: {
          nodeIntegration: true,
          allowRunningInsecureContent: (serve) ? true : false,
        },
      })
    
      if (serve) {
    
        require('devtron').install()
        this.mainWindow.webContents.openDevTools()
    
        require('electron-reload')(__dirname, {
          electron: require(`${__dirname}../node_modules/electron`)
        })
        this.mainWindow.loadURL('http://localhost:4200')
    
      } else {
        this.mainWindow.setMenuBarVisibility(false)
    
        if (this.enableDevTools) {
          this.mainWindow.webContents.openDevTools()
        }
        
        this.mainWindow.loadURL(url.format({
          pathname: path.join(__dirname, '../dist/index.html'),
          protocol: 'file:',
          slashes: true
        }))
      }
    
      // Emitted when the window is closed.
      this.mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        this.mainWindow = null
      })
  }

  private createOverlay() : void {

    this.overlayWindow = new BrowserWindow({
      alwaysOnTop: true,
      transparent: true,
      frame: false,
      fullscreen: true,
      show: false,
      parent: this.mainWindow,
      modal: true,
      webPreferences: {
        nodeIntegration: true,
        allowRunningInsecureContent: (serve) ? true : false,
      },
    })
  
    this.overlayWindow.once('ready-to-show', () => {
      this.overlayWindow.show()
      this.forceFocus.forceFocus(this.overlayWindow)
    })
  
    this.overlayWindow.on('closed', () => {
      this.overlayWindow = null
    })
  
    this.overlayWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../dist/index.html'),
      protocol: 'file:',
      slashes: true
    }) + '#/overlay')
  }

  private createSettings() : void {

    let width = 580
    let height = 660

    this.settingsWindow = new BrowserWindow({
      width: width,
      height: height,
      center: true,
      parent: this.mainWindow,
      modal: true,
      resizable: this.enableDevTools,
      minWidth: width,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        allowRunningInsecureContent: (serve) ? true : false,
      },
    })
    
    this.settingsWindow.setMenuBarVisibility(false)

    if (this.enableDevTools) {
      this.settingsWindow.webContents.openDevTools()
    }

    this.settingsWindow.once('ready-to-show', () => {
      this.settingsWindow.show()
    })
  
    this.settingsWindow.on('closed', () => {
      this.settingsWindow = null
    })
  
    this.settingsWindow.loadURL(url.format({
      pathname: path.join(__dirname, '../dist/index.html'),
      protocol: 'file:',
      slashes: true
    }) + '#/settings')
  }

  private execute(command : string) : void {

    exec(command, (error, stdout, stderr) => {
  
      if (error) {
          console.log("error: " + error.message)
          return
      }
      if (stderr) {
          console.log("error: " + stderr)
      }
    })
  }

  private removeOverlay(minimize? : boolean) {
    if (this.overlayWindow) {
      this.overlayWindow.close()
      this.overlayWindow = undefined
    }
  
    if (minimize) {
      this.mainWindow.minimize()
    }
  }

  private sleep(): void {

    this.stop()

    this.removeOverlay(true)
  
    setTimeout(() => {
      this.execute(this.config.shutdownCommand)
    }, 300)
  }

  private start(time: number): void {

    if (time) {
      this.model.countdownTime = time
      this.model.endTime = Date.now() + this.model.countdownTime
    }
    else if (this.model.remainingTime) {
      this.model.endTime = Date.now() + this.model.remainingTime
    } else {
      this.model.endTime = Date.now() + this.model.countdownTime
    }
  
    this.model.active = true
    this.model.remainingTime = undefined
  
    this.sendUpdateModel()
  }

  private pause(): void {

    if (!this.model.active) {
      return
    }
  
    this.model.active = false
    this.model.remainingTime = this.model.endTime - Date.now()
    this.model.endTime = undefined
  
    this.sendUpdateModel()
  }

  private stop():void {

    this.model.active = false
    this.model.remainingTime = this.model.countdownTime
    this.model.endTime = undefined
  
    this.sendUpdateModel()
  }

  private stopFromOverlay():void {

    this.stop()
  
    this.removeOverlay(true)
  }

  private setEndTimeFromOverlay(plusTime: number, endTime: number): void {

    this.model.countdownTime = this.model.countdownTime + plusTime
    this.model.endTime = endTime
    this.model.active = true
    this.model.remainingTime = undefined
    
    this.removeOverlay(true)
  
    this.sendUpdateModel()
  }

  private settings(): void {
    
    if (this.settingsWindow == null) {
      this.createSettings()
    }
  }

  private initListeners(): void {
    ipcMain.on('start', (event, arg) => {
      this.start(arg)
    })
    
    ipcMain.on('stop', () => {
      this.stop()
    })
    
    ipcMain.on('pause', () => {
      this.pause()
    })
    
    ipcMain.on('sleep', () => {
      this.sleep()
    })
    
    ipcMain.on('settings', () => {
      this.settings()
    })
    
    ipcMain.on('setEndTimeFromOverlay', (event, plusTime, endTime) => {
      this.setEndTimeFromOverlay(plusTime, endTime)
    })
    
    ipcMain.on('stopFromOverlay', () => {
      this.stopFromOverlay()
    })

    ipcMain.on('returnModelSync', (event) => {
      this.returnModelSync(event)
    })
    
    ipcMain.on('returnConfigSync', (event) => {
      this.returnConfigSync(event)
    })
    
    ipcMain.on('resetConfig', () => {
      this.resetConfig()
    })
    
    ipcMain.on('saveConfigAndExit', () => {
      this.resetConfig()
    })
    
    ipcMain.on('settingsClose', (event, config) => {
      this.settingsClose(config)
    })
  }

  private settingsClose(config : Config) {

    if (config) {
      this.config = { ...config }
      this.writeConfig()
      this.sendUpdateConfig()
    }

    this.settingsWindow.close()
    this.settingsWindow = null
  }

  private resetConfig() {

    fs.rmdir(this.getAppDataDir(), { recursive: true }, (err) => {
      if (err) {
        console.log(err.message);
      }
    });

    this.config = this.getDefaultConfig()
    this.createModel(this.config)
    this.sendUpdateConfig()
  }

  private configure(): void {
    
    this.tryReadConfig().then((config) => {
      this.config = config
      this.createModel(config)
      this.sendUpdateConfig()
    }).catch((message : string) => {
      console.log(message)
      this.config = this.getDefaultConfig()
      this.createModel(this.config)
      this.sendUpdateConfig()
    })
  }

  private tryReadConfig(): Promise<Config> {

    return new Promise((resolve, reject) => {
      fs.stat(this.getConfigPath(), (err, stats) => {

        if (err) {
          reject(`Cannot read file: ${err.message}`)
          return
        }
        if (!stats.isFile()) {
          reject(`${this.getConfigPath()} is not a file!`)
          return
        }
  
        fs.readFile(this.getConfigPath(), 'utf8', (err, data) => {
  
          if (err) {
            reject(`Cannot read file: ${err.message}`)
            return
          }
  
          resolve(JSON.parse(data))
        })
      })
    })
  }
  
  private writeConfig(): void {

    let data = JSON.stringify(this.config, undefined, 2)

    this.createAppDataDir().then(() => {

      fs.writeFile(this.getConfigPath(), data, (err) => {
        if(err) console.log(err.message)
      })
    }).catch((err) => {
      console.log(err.message)
    })
  }

  private createAppDataDir(): Promise<boolean> {

    return new Promise((resolve, reject) => {

      fs.stat(this.getAppDataDir(), (err, stats) => {

        if (stats && stats.isDirectory()) {
          resolve(true)
          return
        }

        fs.mkdir(this.getAppDataDir(), { recursive: true }, (err) => {
          if (err) {
            reject(err)
            return
          }

          resolve(true)
        })
      })
    })
  }

  private getDefaultConfig(): Config {
    return {
      shutdownCommand: 'shutdown /s /t 3',
      defaultCountdownTime: 90,
      overlayTime: 2,
      overlayPlusTimes: [20, 30],
      editCountdownTimes: [60, 90, 120, 180],
      editSliderMaxCountdownTime: 360,
      editSliderMinCountdownTime: 5,
      editSliderStepTime: 5
    }
  }

  private getConfigPath(): string {
    return `${this.getAppDataDir()}/config.json`
  }

  private getAppDataDir(): string {
    const usersHomeDir = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE
    const appDataParentDir = usersHomeDir || '.tmp'
    return `${appDataParentDir}/.materialSleepTimer`
  }

  private createModel(config : Config): void {

    if (this.model != null && this.model.active) {
      return
    }

    let countdownTime = minToMillies(config.defaultCountdownTime)

    this.model = {
      active: false,
      countdownTime: countdownTime,
      remainingTime: countdownTime
    }

    this.sendUpdateModel()
  }

  private sendUpdateConfig(): void {
    webContents.getAllWebContents().forEach((webContent) => {
      let config: Config = { ...this.config }
      webContent.send('update-config', config)
    })
  }
  
  private sendUpdateModel(): void {
    webContents.getAllWebContents().forEach((webContent) => {
      let model: Model = { ...this.model }
      webContent.send('update-model', model)
    })

    this.updateCheckStatusInterval()
  }

  private returnModelSync(event: any): void {
    event.returnValue = { ...this.model }
  }
  
  private returnConfigSync(event: any): void {
    event.returnValue = { ...this.config }
  }

  private updateCheckStatusInterval(): void {

    if (!this.interval && this.model.active) {
      this.interval = setInterval(() => {
        if (this.model.active) {
          let now = Date.now()
          if (now > this.model.endTime - minToMillies(this.config.overlayTime)) {
            if (!this.overlayWindow) {
              this.createOverlay()
            }
            else if (!this.overlayWindow.isFocused() || !this.overlayWindow.isVisible()) {
              this.forceFocus.forceFocus(this.overlayWindow)
            }
          }
          
          if (now > this.model.endTime) {
            this.sleep()
          }
        }
      }, 150)
    }
    else if (this.interval && !this.model.active) {
      clearInterval(this.interval)
      this.interval = undefined
    }
  }
}