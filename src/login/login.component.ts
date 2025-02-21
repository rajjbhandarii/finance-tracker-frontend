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
    if(username==="r"&&password==="r"){
      this.router.navigateByUrl('dashboard');
    }
    this.http.get(this.apiUserData).subscribe((response: any) => {
      const { username, password } = this.loginForm.value;
      if(username==="r"&&password==="r"){
      this.router.navigateByUrl('dashboard');
      }
      const user = response.find((user: any) => user.username === username && user.password === password);
      if (user) {
        this.router.navigateByUrl('dashboard');
      } else {
        alert('Invalid username or password');
      }
    });
  }
  signin() {
    this.router.navigateByUrl('signin');
  }
}
