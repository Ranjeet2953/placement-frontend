import { Component } from '@angular/core';
import { Api } from '../api';
import { NavbarStudentComponent } from '../navbar-student/navbar-student'; // or correct path
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.html',
  styleUrls: ['./student-dashboard.css'],
  standalone: true,
  imports: [CommonModule, NavbarStudentComponent]
})
export class StudentDashboard {
  username = '';
  constructor(private api: Api) {
    this.api.getMe().subscribe({
      next: (me: any) => this.username = me.username
    });
  }
}
