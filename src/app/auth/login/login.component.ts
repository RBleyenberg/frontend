import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'dare-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void
  {
      this.loginForm = this._formBuilder.group({
          email   : ['', [Validators.required, Validators.email]],
          password: ['', Validators.required]
      });
  }

  submit() {
      
  }


}