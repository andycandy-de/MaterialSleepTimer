import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OverlayComponent } from './overlay.component';

const routes: Routes = [
  {
    path: 'overlay',
    component: OverlayComponent
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverlayRoutingModule {}
