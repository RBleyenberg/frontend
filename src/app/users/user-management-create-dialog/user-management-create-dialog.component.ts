import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Logger } from 'src/app/shared/logger/logger';
import { IUser, User } from 'src/app/auth/user.model';
import { IRole } from 'src/app/auth/role.model';
import { UserService } from '../user.service';
import { RolesService } from '../roles.service';
import { EventManager } from '../event-manager.service';

const log = new Logger('Login');

@Component({
  selector: 'app-user-management-create-dialog',
  templateUrl: './user-management-create-dialog.html'
})
export class UserManagementCreateDialogComponent {
  user: IUser;
  isLoading = false;
  error: string;
  errorMessage: string;
  createUserForm: FormGroup;
  roles: IRole[];

  constructor(
    private user$: UserService,
    private route: Router,
    private formBuilder: FormBuilder,
    private eventManager: EventManager,
    private roles$: RolesService
  ) {
    this.createForm();
    this.roles$.query().subscribe(res => {
      this.roles = res;
    });
  }

  clear() {
    this.route.navigate(['/user-management'], { replaceUrl: true });
  }

  submit() {
    this.isLoading = true;
    this.user$
      .createUser(this.createUserForm.value)
      .pipe(
        finalize(() => {
          this.createUserForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          this.eventManager.broadcast({
            name: 'userManagementChange',
            content: 'Create user'
          });
          this.route.navigate(['/user-management'], { replaceUrl: true });
        },
        (error: any) => {
          log.debug(`Create User error: ${error}`);
          const errors = {};
          this.error = error;
          this.errorMessage = error.message;
          errors[error.message] = true;
          this.createUserForm.controls[error.path].setErrors(errors);
        }
      );
  }

  private createForm() {
    this.createUserForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      roleName: ['USER']
    });
  }
}

@Component({
  selector: 'app-user-management-create-popup',
  template: ''
})
export class UserManagementCreatePopupComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    setTimeout(() => {

    }, 0);
  }

  ngOnDestroy() {
    
  }
}
