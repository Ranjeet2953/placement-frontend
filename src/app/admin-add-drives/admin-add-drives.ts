import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Api } from '../api';

@Component({
  selector: 'app-admin-add-drive',
  templateUrl: './admin-add-drives.html',
  styleUrls: ['./admin-add-drives.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class AdminAddDrive {
  companyName = '';
  jd = '';
  dateOfDrive = '';
  location = '';
  error = '';
  success = '';

  constructor(private api: Api, private router: Router) {}

  addDrive() {
    this.error = this.success = '';
    if (!this.companyName || !this.jd || !this.dateOfDrive || !this.location) {
      this.error = 'Please fill all fields';
      return;
    }

    const drive = {
      companyName: this.companyName,
      jd: this.jd,
      dateOfDrive: this.dateOfDrive,
      location: this.location
    };

    this.api.createDrive(drive).subscribe({
      next: () => {
        this.success = 'Drive added successfully!';
        setTimeout(() => this.router.navigate(['/admin/drives']), 1500);
      },
      error: err => this.error = err.error?.message || 'Failed to add drive'
    });
  }
}