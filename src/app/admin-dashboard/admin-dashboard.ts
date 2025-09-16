import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { trigger, transition, style, animate } from '@angular/animations';
import { Api } from '../api';
import { AdminProfile } from '../admin-profile/admin-profile';
import { MatChipsModule } from '@angular/material/chips';
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
    AdminProfile,
   
    MatChipsModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AdminDashboard implements OnInit {
  sidebarOpen = true;
  totalDrives = 0;
  totalApplications = 0;
  totalUsers = 0;
  adminUsername: string = '';
  companyLabels: string[] = [];
  appliedData: number[] = [];
  notAppliedData: number[] = [];
  companyBarData: any[] = [];
  upcomingDrives: any[] = [];
  companyBarChartType = 'bar' as const;
  companyStats: any[] = [];
  totalApplied = 0;
  totalNotApplied = 0;
  companyBarChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' as const }
    },
    scales: {
      x: {
        ticks: { font: { size: 14 } },
        grid: { display: false },
        stacked: true
      },
      y: {
        beginAtZero: true,
        ticks: { font: { size: 14 } },
        stacked: true
      }
    }
  };
  constructor(private api: Api, private router: Router) {}
  parseDateFromDDMMYYYY(dateStr: string): Date {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const day = +parts[0];
      const month = +parts[1] - 1;
      const year = +parts[2];
      return new Date(year, month, day);
    }
    return new Date(dateStr);
  }
  ngOnInit(): void {
    this.api.getDrives().subscribe(drives => {
      this.totalDrives = drives.length;
      const today = new Date();
      this.upcomingDrives = drives
        .filter(d => new Date(d.dateOfDrive) >= today)
        .sort((a, b) => new Date(a.dateOfDrive).getTime() - new Date(b.dateOfDrive).getTime())
        .map(drive => ({
          ...drive,
          countdown: this.getCountdownDays(drive.dateOfDrive),
          isUrgent: this.isUrgent(drive.dateOfDrive),
          initials: drive.companyName ? drive.companyName[0].toUpperCase() : 'C',
          companyShort: drive.companyShort || drive.companyName
        }));
    });
    this.api.getApplications().subscribe(apps => this.totalApplications = apps.length);
    this.api.getUsers().subscribe(users => {
  const studentUsers = users.filter((u: any) => u.roles?.some((r: any) => r.name === 'STUDENT'));
  this.totalUsers = studentUsers.length;
});

    this.api.getMe().subscribe(user => this.adminUsername = (user as any).username);
    this.loadCompanyApplicationStats();
  }
  loadCompanyApplicationStats() {
    this.api.getCompanyApplicationStats().subscribe(data => {
      this.companyLabels = data.map(c => c.companyName);
      this.appliedData = data.map(c => c.appliedCount);
      this.notAppliedData = data.map(c => c.notAppliedCount);
      this.companyBarData = [
        { data: this.appliedData, label: 'Applied', backgroundColor: '#00bcd4' },
        { data: this.notAppliedData, label: 'Not Applied', backgroundColor: '#ff4081' }
      ];
      let totalAppliedSum = 0;
      let totalNotAppliedSum = 0;
      this.companyStats = data.map(c => {
        totalAppliedSum += c.appliedCount;
        totalNotAppliedSum += c.notAppliedCount;
        const total = (c.appliedCount + c.notAppliedCount) || 1;
        return {
          ...c,
          appliedPercent: (c.appliedCount / total) * 100,
          notAppliedPercent: (c.notAppliedCount / total) * 100
        };
      });
      this.totalApplied = totalAppliedSum;
      this.totalNotApplied = totalNotAppliedSum;
    }, error => {
      console.error('Failed to load company application stats', error);
    });
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
  isUrgent(dateStr: string): boolean {
    const driveDate = new Date(dateStr);
    const today = new Date();
    const diffTime = driveDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 5;
  }
  getCountdownDays(dateStr: string): number {
    const driveDate = new Date(dateStr);
    const today = new Date();
    const diffTime = driveDate.getTime() - today.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }
  goToDrives() {
    this.router.navigate(['/admin/drives']);
  }
  showApplicationsForCompany(companyName: string) {
    // Example: route to list filtered by the company
    this.router.navigate(['/admin/drives'], { queryParams: { company: companyName } });
  }
}