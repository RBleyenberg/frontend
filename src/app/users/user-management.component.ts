import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { IUser } from '../auth/user.model';
import { UserService } from './user.service';
import { EventManager } from './event-manager.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserManagementComponent implements OnInit, OnDestroy {
  
  users: IUser[];
  eventSub: Subscription;
  userSub: Subscription;

  displayedColumns: string[] = ['firstName', 'lastName', 'username', 'email', 'role', 'actions'];


  constructor(private user$: UserService, private eventManager: EventManager) {}

  ngOnInit() {
    this.reset();
    this.listenToUserManagementChange();
  }

  ngOnDestroy(): void {
    this.eventManager.destroy(this.eventSub);
    this.userSub.unsubscribe();
  }

  reset() {
    this.userSub = this.user$.query().subscribe(res => {
      this.users = res;
    });
  }

  listenToUserManagementChange() {
    this.eventSub = this.eventManager.subscribe('userManagementChange', () => {
      setTimeout(() => {
        this.reset();
      }, 300);
    });
  }
}
