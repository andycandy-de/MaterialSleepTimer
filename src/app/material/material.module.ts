import { NgModule } from '@angular/core';
import { MatButtonModule }  from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider'; 
import {MatGridListModule} from '@angular/material/grid-list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input'; 

const materialComponents = [
  MatButtonModule,
  MatSliderModule,
  MatGridListModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatInputModule
]

@NgModule({
  imports: [materialComponents],
  exports: [materialComponents]
})

export class MaterialModule { }
