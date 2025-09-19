import { Component, OnInit } from '@angular/core';
import { Api } from '../api';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatListModule, RouterModule],
})
export class StudentDashboard implements OnInit {
  stats: any = {};
  profile: any = {};
  activities: Array<{ activity: string; time: Date | null }> = [];
  upcomingDrives: any[] = [];

  constructor(private api: Api) {}

  ngOnInit(): void {
   

    this.api.getDashboardStats().subscribe({
  next: (data) => {
    console.log('Dashboard stats response:', data);
    this.stats = data;
  },
  error: (err) => console.error('Dashboard stats error:', err)
});



    this.api.getProfile().subscribe({
      next: (data) => (this.profile = data),
      error: (err) => console.error('Error fetching profile', err),
    });

   this.api.getUpcomingUnappliedDrives().subscribe({
  next: (drives) => {
    console.log('Upcoming Unapplied Drives from API:', drives);  // Add this line
    this.upcomingDrives = drives;
  },
  error: (err) => console.error('Error fetching upcoming drives:', err)
});


    this.api.getStudentApplications().subscribe({
      next: (applications) => {
        this.activities = applications.map((app: any) => ({
          activity: `Applied to ${app.companyName} [${app.status}]`,
          time: app.appliedAt ? new Date(app.appliedAt) : null,
        }));
      },
      error: (err) => console.error('Error fetching student applications', err),
    });
  }
}