import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';
import { TimerCircleComponent } from './components/timer-circle/timer-circle.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, TimerCircleComponent],
  imports: [CommonModule, TranslateModule, FormsModule, MaterialModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, TimerCircleComponent]
})
export class SharedModule {}
