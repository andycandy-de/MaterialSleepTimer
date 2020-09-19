import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayComponent } from './overlay.component';
import { SharedModule } from '../shared/shared.module';
import { OverlayRoutingModule } from './overlay-routing.module';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [OverlayComponent],
  imports: [
    CommonModule,
    SharedModule,
    OverlayRoutingModule,
    MaterialModule
  ]
})

export class OverlayModule { }
