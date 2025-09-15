import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Api } from '../api'; // Adjust path as needed

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule]
})
export class AdminUsers implements OnInit {
  users: any[] = [];

  constructor(private api: Api) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.api.getUsers().subscribe(users => {
      this.users = users
        .filter((u: any) => u.roles?.some((r: any) => r.name === 'STUDENT'))
        .map((u: any) => ({
          ...u,
          rolesText: u.roles ? u.roles.map((r: any) => r.name).join(', ') : ''
        }));
    });
  }

  removeUser(id: number) {
    if (confirm('Are you sure you want to remove this user?')) {
      this.api.deleteUser(id).subscribe(() => {
        this.users = this.users.filter(u => u.id !== id);
      }, error => {
        alert('Failed to remove user. Please try again.');
      });
    }
  }
}
