import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementComponent } from './user-management.component';
import { UserManagementUpdateComponent } from './user-management-update/user-management-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserManagementDeleteDialogComponent, UserManagementDeletePopupComponent } from './user-management-delete-dialog/user-management-delete-dialog.component';
import { UserManagementCreateDialogComponent, UserManagementCreatePopupComponent } from './user-management-create-dialog/user-management-create-dialog.component';
import { AuthenticationGuard } from './authentication.guard';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, UserManagementRoutingModule, FormsModule],
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
