import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/auth/user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IRole } from 'src/app/auth/role.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { finalize } from 'rxjs/operators';
import { RolesService } from '../roles.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-management-update',
  templateUrl: './user-management-update.component.html',
  styles: []
})
export class UserManagementUpdateComponent implements OnInit {

  user: IUser;
  userForm: FormGroup;
  isLoading = false;
  roles: IRole[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private user$: UserService,
    private roles$: RolesService,
    private formBuilder: FormBuilder,
    private location: Location
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ user }) => {
      this.user = user;
      const userFormData = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        roleName: user.role.name,
        __typename: user.__typename
      };
      this.userForm.setValue({
        ...userFormData
      });
    });

    this.roles$.query().subscribe(res => {
      this.roles = res;
    });
  }

  public submit() {
    this.isLoading = true;
    console.log('this.userForm.value: ', this.userForm.value);
    const user = { id: this.user.id, ...this.userForm.value };
    this.user$
      .updateUser(user)
      .pipe(
        finalize(() => {
          this.userForm.markAsPristine();
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.previousState();
      });
  }

  public previousState() {
    this.location.back();
  }

  private createForm() {
    this.userForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      roleName: ['', Validators.required],
      __typename: ['']
    });
  }
}