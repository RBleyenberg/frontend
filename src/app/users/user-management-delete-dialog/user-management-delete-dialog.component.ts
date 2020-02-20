import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'src/app/auth/user.model';
import { UserService } from '../user.service';
import { EventManager } from '../event-manager.service';

@Component({
  selector: 'app-user-management-delete-dialog',
  templateUrl: './user-management-delete-dialog.html'
})
export class UserManagementDeleteDialogComponent {
  user: IUser;

  constructor(
    private user$: UserService,
    private route: Router,
    private eventManager: EventManager
  ) {}

  clear() {
    this.route.navigate(['/user-management'], { replaceUrl: true });
  }

  confirmDelete(id: number) {
    this.user$.deleteUser(id).subscribe(res => {
      console.log('res: ', res);
      this.eventManager.broadcast({
        name: 'userManagementChange',
        content: 'Deleted user'
      });
      this.route.navigate(['/user-management'], { replaceUrl: true });
    });
  }
}

@Component({
  selector: 'app-user-management-delete-popup',
  template: ''
})
export class UserManagementDeletePopupComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.data.subscribe(({ user }) => {
      setTimeout(() => {

      }, 0);
    }

    )}

  ngOnDestroy() {

  }
}
