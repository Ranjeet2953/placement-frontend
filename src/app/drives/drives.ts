import { Component, OnInit } from '@angular/core';
import { Api } from '../api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarStudentComponent } from '../navbar-student/navbar-student';

@Component({
  selector: 'app-drives',
  templateUrl: './drives.html',
  styleUrls: ['./drives.css'],
  standalone: true,
  imports: [CommonModule, NavbarStudentComponent]
})
export class Drives implements OnInit {
  drives: any[] = [];
  username = '';
  constructor(private api: Api, private router: Router) {}
  ngOnInit() {
    this.api.getMe().subscribe({ next: (me: any) => this.username = me.username });
    this.api.getDrives().subscribe({
      next: drives => this.drives = drives,
      error: () => this.router.navigate(['/'])
    });
  }
  applyToDrive(driveId: number) {
    this.api.applyToDrive(driveId).subscribe({
      next: () => alert('Applied!'),
      error: () => alert('Application failed!')
    });
  }
}
