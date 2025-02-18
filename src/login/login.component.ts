import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  router = inject(Router)

  onLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      if (username === 'a' && password === 'a') {
        // alert('Login successful');
        this.router.navigateByUrl('dashboard');
      } else {
        alert('Invalid credentials');
      }

    }
  }
  signin() {
    this.router.navigateByUrl('signin');
  }
}
