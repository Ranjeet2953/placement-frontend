import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Api } from '../api';

@Component({
  selector: 'app-admin-applications',
  templateUrl: './admin-applications.html',
  styleUrls: ['./admin-applications.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule],
})
export class AdminApplications implements OnInit {
  applicationList: any[] = [];
  displayedColumns = ['company', 'date', 'status'];

  constructor(private api: Api, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['company']) {
        this.loadApplicationsByCompany(params['company']);
      } else {
        this.loadApplications();
      }
    });
  }

  loadApplicationsByCompany(company: string) {
    this.api.getApplicationsByCompany(company).subscribe(
      data => (this.applicationList = data),
      err => console.error('Failed to load applications by company', err)
    );
  }

  loadApplications(): void {
    this.api.getApplications().subscribe(
      data => (this.applicationList = data),
      error => console.error('Failed to load applications', error)
    );
  }

  onCompanyClick(driveId: number, event: Event): void {
    event.preventDefault();
    this.router.navigate(['/admin/drives', driveId]);
  }

  onStatusClick(driveId: number, event: Event) {
    event.preventDefault();
    this.router.navigate(['/admin/drives', driveId]);
  }

  showApplicationsForCompany(companyName: string) {
    this.router.navigate(['/admin/applications'], { queryParams: { company: companyName } });
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }
}
