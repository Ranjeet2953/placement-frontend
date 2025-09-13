
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Api } from '../api'; // Adjust path as needed

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule]
})
export class AdminUsers implements OnInit {
  users: any[] = [];

  constructor(private api: Api) {}

  ngOnInit() {
  this.api.getUsers().subscribe(users => {
    // Filter users who have a role named "STUDENT"
    this.users = users
      .filter((u: any) => u.roles?.some((r: any) => r.name === 'STUDENT'))
      .map((u: any) => ({
        ...u,
        rolesText: u.roles ? u.roles.map((r: any) => r.name).join(', ') : ''
      }));
  });
}

  
}