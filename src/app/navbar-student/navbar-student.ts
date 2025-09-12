import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Api } from '../api';

@Component({
  selector: 'app-student-navbar',
  templateUrl: './navbar-student.html',
  styleUrls: ['./navbar-student.css'],
  standalone: true,
  imports: [RouterModule]
})
export class NavbarStudentComponent {
  @Input() username: string = '';
  constructor(private api: Api, private router: Router) {}
  logout() {
    this.api.logout().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/'])
    });
  }
}
