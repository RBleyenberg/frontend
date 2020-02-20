import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlMessagesComponent } from './validators/control-messages/control-messages.component';
import { ValidationService } from '.';

@NgModule({
  imports: [CommonModule],
  declarations: [ControlMessagesComponent],
  providers: [ValidationService],
  exports: [ControlMessagesComponent]
})
export class SharedModule {}