import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { Api } from '../api';
import { AdminProfile } from '../admin-profile/admin-profile';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    AdminProfile
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard implements OnInit {
  sidebarOpen = true;
  totalDrives = 0;
  totalApplications = 0;
  totalUsers = 0;
  adminUsername: string = '';

  constructor(private api: Api, private router: Router) {}

  ngOnInit(): void {
    this.api.getDrives().subscribe(drives => this.totalDrives = drives.length);
    this.api.getApplications().subscribe(apps => this.totalApplications = apps.length);
    this.api.getUsers().subscribe(users => this.totalUsers = users.length);
    this.api.getMe().subscribe(user => this.adminUsername = (user as any).username);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.api.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
