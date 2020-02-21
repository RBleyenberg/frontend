import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { UserManagementUpdateComponent } from './user-management-update/user-management-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserManagementDeleteDialogComponent, UserManagementDeletePopupComponent } from './user-management-delete-dialog/user-management-delete-dialog.component';
import { UserManagementCreateDialogComponent, UserManagementCreatePopupComponent } from './user-management-create-dialog/user-management-create-dialog.component';
import { AuthenticationGuard } from './authentication.guard';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FooterModule } from '../shared/footer/footer';

@NgModule({
  imports: [
    CommonModule, 
    ReactiveFormsModule,
     UserManagementRoutingModule, 
     FormsModule,
     MatButtonModule,
     MatCheckboxModule,
     MatDatepickerModule,
     MatFormFieldModule,
     MatIconModule,
     MatInputModule,
     MatMenuModule,
     MatRippleModule,
     MatTableModule,
     MatCardModule,
     FooterModule
    ],
  declarations: [
    UserManagementComponent,
    UserManagementUpdateComponent,
    UserManagementDeleteDialogComponent,
    UserManagementDeletePopupComponent,
    UserManagementCreateDialogComponent,
    UserManagementCreatePopupComponent
  ],
  providers: [
    AuthenticationGuard
  ]
})
export class UserManagementModule {}
