import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  private apiUserData = environment.apiUserData;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  router = inject(Router)

  onLogin() {
    const { username, password } = this.loginForm.value;

    // Check hardcoded credentials first
    if (username === "r" && password === "r") {
      this.router.navigateByUrl('dashboard');
      return;
    }

    // Validate against API data
    this.http.get<any[]>(this.apiUserData).subscribe(
      (users) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          this.router.navigateByUrl('dashboard');
        } else {
          alert('Invalid username or password');
        }
      },
      (error) => {
        console.error('Error fetching user data', error);
        alert('Login failed. Please try again later.');
      }
    );
  }

  signin() {
    this.router.navigateByUrl('signin');
  }
}

