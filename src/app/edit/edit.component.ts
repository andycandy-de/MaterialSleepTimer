import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService, ElectronListenerHelper } from '../core/services';
import { milliesToMin, minToMillies } from '../../../electronApp/util';
import { Model, Config } from '../../../electronApp/types';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {

  model: Model;
  config: Config;

  value: number;

  private electronListenerHelper: ElectronListenerHelper

  constructor(
    private router: Router,
    private electronService: ElectronService,
    private cd: ChangeDetectorRef) {
      this.electronListenerHelper = this.electronService.createElectronListenerHelper(this.cd)
    }

  ngOnInit(): void {
    this.model = this.electronService.ipcRenderer.sendSync('returnModelSync');
    this.config = this.electronService.ipcRenderer.sendSync('returnConfigSync');

    this.value = milliesToMin(this.model.countdownTime);
    
    this.electronListenerHelper.addToChannel('update-config', (config: Config) => {
      this.updateConfig(config)
    })
    this.electronListenerHelper.addToChannel('update-model', (model: Model) => {
      this.updateModel(model)
    })
  }

  ngOnDestroy(): void {
    this.electronListenerHelper.removeAll()
  }

  public updateConfig(config: Config) {
    this.config = config
  }

  public updateModel(model: Model) {
    this.model = model
    this.value = milliesToMin(this.model.countdownTime);
  }

  public format(value: number) {

    const hours = Math.trunc(value / 60);
    const minutes = value - (hours * 60);

    return `${hours}h ${minutes}m`;
  }

  public onBack(event : any) {
    this.router.navigate(['main']);
  }

  public onStart(event : any) {
    let countdownTime: number = minToMillies(this.value);
    this.electronService.ipcRenderer.send('start', countdownTime);
    this.onBack(event);
  }

  public onSettings(event : any) {
    this.electronService.ipcRenderer.send('settings');
  }
}
