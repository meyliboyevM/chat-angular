import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  login() {
    if (this.loginForm.invalid) return;

    const { username, password } = this.loginForm.value;
    const url = `https://chat-backend-7t9p.onrender.com/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

    this.http.post(url, {})
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('auth_token', res['access_token']);
          this.router.navigate(['/']);
        },
        error: (err) => console.error('Login failed', err)
      });
  }
}
