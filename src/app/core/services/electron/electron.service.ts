import { Injectable, ChangeDetectorRef } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
    }
  }

  public createElectronListenerHelper(cd: ChangeDetectorRef): ElectronListenerHelper {
    return new ElectronListenerHelper(this, cd)
  }
}

export class ElectronListenerHelper {

  private channels: any = {}

  constructor(private electronService: ElectronService, private cd: ChangeDetectorRef) { }

  public addToChannel(name: string, listener: any) {
    let wrapper = (event: any, ...args: any[]) => {

      listener(...args)
      
      this.cd.detectChanges()
    }
    this.channels.name = wrapper
    this.electronService.ipcRenderer.on(name, wrapper)
  }

  public removeAll() {

    for (const name in this.channels) {
      this.electronService.ipcRenderer.removeListener(name, this.channels[name])
    }
    this.channels = {}
  }
}