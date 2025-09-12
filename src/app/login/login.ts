import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Login {
  username = '';
  password = '';
  error = '';

  constructor(private api: Api, private router: Router) {}

  login() {
    this.error = '';
    this.api.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.api.getMe().subscribe({
          next: (user: any) => {
            if (user && user.roles && user.roles.includes('ADMIN')) {
              this.router.navigate(['/applications']);
            } else if (user && user.roles && user.roles.includes('STUDENT')) {
              this.router.navigate(['/dashboard']); // or '/drives'
            }
             else {
              this.error = "Unknown role";
            }
          },
          error: () => {
            this.error = "Failed to load user info";
          }
        });
      },
      error: err => {
        if (err.status === 401) {
          this.error = 'Invalid username or password';
        } else if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Login failed';
        }
      }
    });
  }
  
}