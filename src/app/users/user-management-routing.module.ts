import { Injectable, NgModule } from '@angular/core';
import { RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { first } from 'rxjs/internal/operators';
import { UserService } from './user.service';
import { IUser, User } from '../auth/user.model';
import { UserManagementComponent } from './user-management.component';
import { UserManagementUpdateComponent } from './user-management-update/user-management-update.component';
import { UserManagementDeletePopupComponent } from './user-management-delete-dialog/user-management-delete-dialog.component';
import { UserManagementCreatePopupComponent } from './user-management-create-dialog/user-management-create-dialog.component';
import { AuthenticationGuard } from './authentication.guard';

@Injectable({ providedIn: 'root' })
export class UserMgmtResolve implements Resolve<any> {
  
  constructor(private service: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IUser> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      // Close observable after first value is emitted with first operator
      return this.service.findById(id).pipe(
        map(res => res),
        first()
      );
    }
    return of(new User());
  }
}

const routes: Routes = [
  // Module is lazy loaded, see app-routing.module.ts
  {
    path: '',
    component: UserManagementComponent,
    data: {
      authorities: ['ADMIN']
    },
    canActivate: [AuthenticationGuard]
  },
  {
    path: ':id/edit',
    component: UserManagementUpdateComponent,
    resolve: {
      user: UserMgmtResolve
    },
    data: {
      authorities: ['ADMIN']
    }
  },
  {
    path: ':id/delete',
    component: UserManagementDeletePopupComponent,
    resolve: {
      user: UserMgmtResolve
    },
    data: {
      authorities: ['ADMIN']
    },
    outlet: 'popup'
  },
  {
    path: 'create',
    component: UserManagementCreatePopupComponent,
    data: {
      authorities: ['ADMIN']
    },
    outlet: 'popup'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UserManagementRoutingModule {}
