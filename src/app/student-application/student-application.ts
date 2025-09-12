import { Component, OnInit } from '@angular/core';
import { Api } from '../api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-applications',
  templateUrl: './student-application.html',
  styleUrl: './student-application.css',
  standalone: true,
  imports: [CommonModule]
})
export class StudentApplications implements OnInit {
  applications: any[] = [];
  constructor(private api: Api, private router: Router) {}

  ngOnInit() {
    this.api.getStudentApplications().subscribe({
      next: (data: any) => this.applications = data as any[],
      error: () => this.router.navigate(['/'])
    });
  }
  
}
