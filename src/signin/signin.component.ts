import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  signForm: FormGroup;

  private apiUserData = environment.apiUserData;

  constructor(private fb: FormBuilder, private http: HttpClient) {
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
      console.log(this.signForm.value);
      if (password === ConfirmPassword) {
        this.http.post(this.apiUserData, this.signForm.value).subscribe((response: any) => {
          this.router.navigateByUrl('dashboard');
        });
      } else {
        alert('Password does not match');
      }
    }
  }
}