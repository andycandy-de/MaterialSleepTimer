import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services';
import { Config, Model } from '../../../electronApp/types';
import { minToMillies } from '../../../electronApp/util';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {

  config: Config;
  model: Model;

  countdownTime: number = 0;
  expanded: boolean = false;
  lastTimeout: any;
  plusTime: number;

  constructor(
    private electronService: ElectronService) { 
  }

  ngOnInit(): void {
    this.model = this.electronService.ipcRenderer.sendSync('returnModelSync');
    this.config = this.electronService.ipcRenderer.sendSync('returnConfigSync');

    this.countdownTime = minToMillies(this.config.overlayTime);

    this.plusTime = 0;
  }

  onClick(event: any) : void {
    this.expanded = true;
  }

  onStop(event: any) : void {
    this.electronService.ipcRenderer.send('stopFromOverlay');
  }

  onSleep(event: any) : void {
    this.electronService.ipcRenderer.send('sleep');
  }

  onPlus(min: number) : void {

    if (this.lastTimeout) {
      clearTimeout(this.lastTimeout);
    }

    let millies = minToMillies(min);

    this.plusTime += millies;
    this.model.endTime += millies;
    this.countdownTime = this.plusTime;

    this.electronService.ipcRenderer.send('stop');
    this.lastTimeout = setTimeout(() => {
      this.electronService.ipcRenderer.send('setEndTimeFromOverlay', this.plusTime, this.model.endTime);
      this.lastTimeout = undefined;
    }, 3000);
  }
}
