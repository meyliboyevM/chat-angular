import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: any
  private tokenKey = 'auth_token';

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey); // Check if token exists
    // return true;
  }

  login(token: string): void {
    this.token = token;
    localStorage.setItem(this.tokenKey, token); // Save token
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey); // Remove token on logout
  }
}
