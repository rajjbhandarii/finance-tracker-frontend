import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  signForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.signForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required]
    });
  }

  router = inject(Router)

  onLogin() {
    if (this.signForm.valid) {
      const { password, ConfirmPassword } = this.signForm.value;
      if (password === ConfirmPassword) {
        this.router.navigateByUrl('dashboard');
      } else {
        alert('Password does not match');
      }
    }
  }
}