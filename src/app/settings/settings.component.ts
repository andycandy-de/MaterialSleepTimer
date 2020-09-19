import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ElectronService, ElectronListenerHelper } from '../core/services';
import { Config } from '../../../electronApp/types';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

  private electronListenerHelper: ElectronListenerHelper

  shutdownCommand : string
  defaultCountdownTime : number
  overlayTime : number
  overlayPlusTime1 : number
  overlayPlusTime2 : number
  editCountdownTime1 : number
  editCountdownTime2 : number
  editCountdownTime3 : number
  editCountdownTime4 : number
  editSliderMinCountdownTime : number
  editSliderMaxCountdownTime : number
  editSliderStepTime : number

  constructor(
    private electronService: ElectronService,
    private cd: ChangeDetectorRef) {
      this.electronListenerHelper = this.electronService.createElectronListenerHelper(this.cd)
    }

  ngOnInit(): void {

    let config : Config = this.electronService.ipcRenderer.sendSync('returnConfigSync');
    this.updateConfig(config)

    this.electronListenerHelper = this.electronService.createElectronListenerHelper(this.cd)
    this.electronListenerHelper.addToChannel('update-config', (config: Config) => {
      this.updateConfig(config)
    })
  }

  ngOnDestroy(): void {
    this.electronService.ipcRenderer.removeListener('update-config', this.updateConfig);
    this.electronListenerHelper.removeAll()
  }

  public updateConfig(config: Config) {

    this.shutdownCommand = config.shutdownCommand
    this.defaultCountdownTime = config.defaultCountdownTime
    this.overlayTime = config.overlayTime
    this.overlayPlusTime1 = config.overlayPlusTimes[0]
    this.overlayPlusTime2 = config.overlayPlusTimes[1]
    this.editCountdownTime1 = config.editCountdownTimes[0]
    this.editCountdownTime2 = config.editCountdownTimes[1]
    this.editCountdownTime3 = config.editCountdownTimes[2]
    this.editCountdownTime4 = config.editCountdownTimes[3]
    this.editSliderMinCountdownTime = config.editSliderMinCountdownTime
    this.editSliderMaxCountdownTime = config.editSliderMaxCountdownTime
    this.editSliderStepTime = config.editSliderStepTime
  }

  public onReset(event : any) {
    this.electronService.ipcRenderer.send('resetConfig');
  }

  public onCloseWithoutSave(event : any) {
    this.electronService.ipcRenderer.send('settingsClose');
  }
  
  public onCloseWithSave(event : any) {

    let config : Config = {
      shutdownCommand: this.shutdownCommand,
      defaultCountdownTime: this.defaultCountdownTime,
      overlayTime: this.overlayTime,
      overlayPlusTimes: [this.overlayPlusTime1, this.overlayPlusTime2],
      editCountdownTimes: [this.editCountdownTime1, this.editCountdownTime2, this.editCountdownTime3, this.editCountdownTime4],
      editSliderMinCountdownTime: this.editSliderMinCountdownTime,
      editSliderMaxCountdownTime: this.editSliderMaxCountdownTime,
      editSliderStepTime: this.editSliderStepTime
    }
    
    this.electronService.ipcRenderer.send('settingsClose', config);
  }
}
