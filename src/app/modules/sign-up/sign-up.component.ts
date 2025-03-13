import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-sign-up',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './sign-up.component.html',
  standalone: true,
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  private http = inject(HttpClient);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  isLoading = false;
  showPassword = false;
  registerError: string | null = null;


  signUpForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    phone_number: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  register() {
    if (this.signUpForm.invalid) return;
    this.isLoading = true
    this.registerError = null

    this.http.post('https://chat-backend-7t9p.onrender.com/register', this.signUpForm.value)
      .subscribe({
        next: () => {
          this.router.navigate(['/login'])
          this.isLoading = false
        },
        error: (err) => {
          console.error('Registration failed', err.error.detail)
          this.isLoading = false
          this.registerError = err.error.detail
        }
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
