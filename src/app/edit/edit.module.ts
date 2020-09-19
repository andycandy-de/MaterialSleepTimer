import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { EditComponent } from './edit.component';
import { EditRoutingModule } from './edit-routing.module';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [EditComponent],
  imports: [CommonModule, SharedModule, EditRoutingModule, MaterialModule]
})
export class EditModule { }
