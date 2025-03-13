import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  showPassword = false;
  public isLogin: boolean = false;
  loginError: string | null = null;

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  login() {
    if (this.loginForm.invalid) return;
    this.isLogin = true;
    this.loginError = null;

    const { username, password } = this.loginForm.value;
    const url = `https://chat-backend-7t9p.onrender.com/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    this.http.post(url, {})
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('auth_token', res['access_token']);
          this.router.navigate(['/home']);
          this.isLogin = false;
        },
        error: (err) => {
          this.isLogin = false;
          this.loginError = 'Invalid username or password';
          console.error('Login failed', err)
        }
      });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
