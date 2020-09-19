import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-timer-circle',
  templateUrl: './timer-circle.component.html',
  styleUrls: ['./timer-circle.component.scss']
})
export class TimerCircleComponent implements OnInit, OnDestroy {

  @Input() size: number = 100;
  @Input() color: string = 'primary';
  @Input() active: boolean = false;

  @Input() endTime: number;
  @Input() countdownTime: number;
  @Input() currentTime: number = this.countdownTime;

  progress: number = 100;
  offset: number = this.size / 10 * 0.15;
  border_size: number = this.size / 10 * 0.25;

  refresher: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.updateTimeAndProgress();
    this.refresher = timer(0, 150).subscribe((s) => {
      this.updateTimeAndProgress();
    });
  }

  ngOnDestroy(): void {
    this.refresher.unsubscribe();
  }

  isPrimary(): boolean {
    return this.color === 'primary';
  }

  isAccent(): boolean {
    return this.color === 'accent';
  }

  public updateTimeAndProgress() : void {

    if (!this.countdownTime || this.countdownTime <= 0) {
      return;
    }

    if (this.active && this.endTime) {

      this.currentTime = this.endTime - Date.now();
    }

    this.progress = this.currentTime * 100 / this.countdownTime;

    if (this.currentTime < 0) {
      this.currentTime = 0;
    }
    if (this.progress < 0) {
      this.progress = 0;
    }
    if (this.progress > 100) {
      this.progress = 100;
    }
  }

  public formatTime(millies: number): string {

    if (!millies) {
      return '--:--';
    }

    const h: number = Math.trunc(millies / (1000 * 60 * 60));
    const m: number = Math.trunc(millies / (1000 * 60)) % 60;
    const s: number = Math.trunc(millies / 1000) % 60;

    const mString: string = this.toStringAddZero(m);
    const sString: string = this.toStringAddZero(s);

    if (h === 0) {
      return `${mString}:${sString}`;
    }

    return `${h}:${mString}:${sString}`;
  }

  private toStringAddZero(value: number): string {

    let s: string = value.toString();
    if (s.length == 1) {
      return '0' + s;
    }

    return s;
  }

}
