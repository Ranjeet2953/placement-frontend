import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Api } from '../api'; // Adjust path as needed

@Component({
  selector: 'app-admin-application',
  templateUrl: './admin-applications.html',
  styleUrls: ['./admin-applications.css'],
  standalone: true,
  imports: [CommonModule, MatTableModule]
})
export class AdminApplications implements OnInit {
  applicationList: any[] = [];

  constructor(private api: Api) {}

  ngOnInit() {
    this.api.getApplications().subscribe(
      data => this.applicationList = data,
      error => console.error('Failed to load applications', error)
    );
  }
}