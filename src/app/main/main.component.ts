import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService, ElectronListenerHelper } from '../core/services';
import { Model } from '../../../electronApp/types';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  model: Model;
  private electronListenerHelper: ElectronListenerHelper

  constructor(
    private router: Router,
    private electronService: ElectronService,
    private cd: ChangeDetectorRef) {
      this.electronListenerHelper = this.electronService.createElectronListenerHelper(this.cd)
    }

  ngOnInit(): void {
    this.electronListenerHelper.addToChannel('update-model', (model: Model) => {
      this.updateModel(model)
    })
    this.model = this.electronService.ipcRenderer.sendSync('returnModelSync');
  }

  ngOnDestroy(): void {
    this.electronListenerHelper.removeAll()
  }

  public updateModel(model: Model) {
    this.model = model;
  }

  public onEdit(event: any) {
    this.router.navigate(['edit']);
  }

  public onStartPause(event: any) {
    if (this.model.active) {
      this.electronService.ipcRenderer.send('pause');
    }
    else {
      this.electronService.ipcRenderer.send('start');
    }
  }

  public onStop(event: any) {
    this.electronService.ipcRenderer.send('stop');
  }
}
