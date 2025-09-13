import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Api } from '../api';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-drives',
  templateUrl: './admin-drives.html',
  styleUrls: ['./admin-drives.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule]
})
export class AdminDrives implements OnInit {
  drives: any[] = [];

  constructor(private api: Api, private router: Router) {}

  ngOnInit() {
    this.api.getDrives().subscribe(drives => {
      this.drives = drives;
      // Optionally initialize applicationCount as zero here if not provided by backend
      this.drives.forEach(drive => {
        if (drive.applicationCount === undefined) {
          drive.applicationCount = 0;
        }
      });
    });
  }

  navigateAddDrive() {
    this.router.navigate(['/admin/drives/add']);
  }

  goBack() {
    this.router.navigate(['/admin/dashboard']);
  }

  openDriveDetails(drive: any) {
    this.router.navigate(['/admin/drives', drive.id]);
  }
}
