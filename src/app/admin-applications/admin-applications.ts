import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Api } from '../api';

import { BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartOptions, ChartData } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-admin-applications',
  templateUrl: './admin-applications.html',
  styleUrls: ['./admin-applications.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    BaseChartDirective,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule
  ],
})
export class AdminApplications implements OnInit {
  applicationList: any[] = [];
  filteredApplications: any[] = [];
  displayedColumns = ['studentName', 'studentEmail', 'company', 'date', 'status'];

  allApplications: any[] = [];

  topCompanies: any[] = [];
  companyBreakdownStats: any[] = [];
  users: any[] = [];

  filterStatus = '';
  filterCompany = '';
  filterDate = '';
  
  exportRange: string = 'thisMonth';
  customStartDate: Date | null = null;
  customEndDate: Date | null = null;
  exportFormat: string = 'excel';

  totalApplied = 0;
  totalNotApplied = 0;
  totalUsers = 0;

  pieChartLabels = ['Applied', 'Not Applied', 'Total Users'];
  pieChartData: ChartData<'pie', number[], string> = {
    labels: this.pieChartLabels,
    datasets: [{ data: [0, 0, 0], backgroundColor: ['#3f51b5', '#fbbc04', '#757575'] }],
  };
  pieChartType: ChartType = 'pie';
  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  barChartLabels: string[] = [];
  barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [{ label: 'Applications', data: [], backgroundColor: '#4f46e5' }],
  };
  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  lineChartLabels: string[] = [];
  lineChartData: ChartData<'line'> = {
    labels: this.lineChartLabels,
    datasets: [
      {
        label: 'Applications',
        data: [],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.15)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#fff',
        pointRadius: 5,
      },
    ],
  };
  lineChartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    scales: {
      x: { title: { display: true, text: 'Date' } },
      y: { beginAtZero: true, title: { display: true, text: 'Applications' } },
    },
  };

  constructor(private api: Api, private router: Router, private route: ActivatedRoute) {}

  // --- NEW: get completed drives from localStorage
  getCompletedDriveIds(): number[] {
    return JSON.parse(localStorage.getItem('completedDrives') || '[]');
  }

  // --- NEW: filter out applications of completed drives
  filterOutCompleted(apps: any[]): any[] {
    const completedIds = this.getCompletedDriveIds();
    return apps.filter(app => !completedIds.includes(app.drive?.id));
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['company']) {
        this.loadApplicationsByCompany(params['company']);
      } else {
        this.loadApplications();
      }
    });
    this.loadApplicationStatusSummary();
    this.loadCompanyStats();
  }

  dedupeApplications(apps: any[]): any[] {
    const seen = new Set<string>();
    return apps.filter(app => {
      const key = `${app.student?.email}_${app.drive?.companyName}_${app.drive?.dateOfDrive}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  getDateRange() {
    const now = new Date();
    let start: Date, end: Date;
    switch (this.exportRange) {
      case 'thisWeek': {
        const day = now.getDay();
        start = new Date(now);
        start.setDate(now.getDate() - day);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
        break;
      }
      case 'thisMonth': {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      }
      case 'previousMonth': {
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      }
      case 'nextMonth': {
        start = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        end = new Date(now.getFullYear(), now.getMonth() + 2, 0);
        break;
      }
      case 'custom': {
        start = this.customStartDate!;
        end = this.customEndDate!;
        break;
      }
      default:
        start = new Date(0);
        end = new Date();
    }
    return { start, end };
  }

  onExport() {
    const { start, end } = this.getDateRange();
    const activeApps = this.filterOutCompleted(this.allApplications);

    const filtered = activeApps.filter(app => {
      const d = new Date(app.drive?.dateOfDrive);
      return d >= start && d <= end;
    });

    if (!filtered.length) {
      alert("No applications found for selected range");
      return;
    }

    const uniqueFiltered: any[] = [];
    const seen = new Set<string>();
    filtered.forEach(app => {
      const key = `${app.student?.email}_${app.drive?.companyName}_${app.drive?.dateOfDrive}_${app.status}`;
      if (!seen.has(key)) {
        uniqueFiltered.push(app);
        seen.add(key);
      }
    });

    if (this.exportFormat === 'csv' || this.exportFormat === 'excel') {
      this.exportToExcel(uniqueFiltered, this.companyBreakdownStats, this.users, this.exportFormat);
    } else if (this.exportFormat === 'pdf') {
      this.exportToPDF(uniqueFiltered);
    }
  }

  exportToExcel(apps: any[], stats: any[], users: any[], format: 'csv' | 'excel') {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    const exportData = apps.map(app => ({
      Student: this.extractPlainText(app.studentName || app.student?.fullName || 'N/A'),
      Email: this.extractPlainText(app.studentEmail || app.student?.email || 'N/A'),
      Company: this.extractPlainText(app.drive?.companyName || 'N/A'),
      Date: this.extractPlainText(app.drive?.dateOfDrive || 'N/A'),
      Status: this.extractPlainText(app.status || 'N/A')
    }));

    const wsApps: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, wsApps, 'Applications');

    const wsStats: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      stats.map(s => ({
        Company: s.companyName,
        Applied: s.appliedCount,
        Shortlisted: s.shortlistedCount,
        Selected: s.selectedCount,
        Rejected: s.rejectedCount
      }))
    );
    XLSX.utils.book_append_sheet(wb, wsStats, 'Company Stats');

    if (users && users.length) {
      const wsUsers: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        users.map(u => ({
          UserID: u.id,
          Role: u.roles?.map((r: any) => r.name).join(', ')
        }))
      );
      XLSX.utils.book_append_sheet(wb, wsUsers, 'Users');
    }

    const fileName = `applications.${format === 'csv' ? 'csv' : 'xlsx'}`;
    XLSX.writeFile(wb, fileName, { bookType: format === 'csv' ? 'csv' : 'xlsx' });
  }

  exportToPDF(apps: any[]) {
    const doc = new jsPDF();
    doc.text("Applications Report", 14, 16);

    const exportData = apps.map(app => [
      this.extractPlainText(app.studentName || app.student?.fullName || 'N/A'),
      this.extractPlainText(app.studentEmail || app.student?.email || 'N/A'),
      this.extractPlainText(app.drive?.companyName || 'N/A'),
      this.extractPlainText(app.drive?.dateOfDrive || 'N/A'),
      this.extractPlainText(app.status || 'N/A')
    ]);

    autoTable(doc, {
      head: [['Student', 'Email', 'Company', 'Date', 'Status']],
      body: exportData
    });

    doc.addPage();
    doc.text("Top Companies", 14, 16);
    autoTable(doc, {
      head: [['Company', 'Applied', 'Shortlisted', 'Selected', 'Rejected']],
      body: this.topCompanies.map(c => [
        c.companyName,
        c.appliedCount,
        c.shortlistedCount,
        c.selectedCount,
        c.rejectedCount
      ])
    });

    doc.save("applications-report.pdf");
  }

  extractPlainText(value: string): string {
    if (!value) return '';
    const div = document.createElement('div');
    div.innerHTML = value;
    return div.textContent || div.innerText || '';
  }

  loadCompanyStats() {
    this.api.getApplications().subscribe({
      next: apps => {
        const activeApps = this.filterOutCompleted(apps);
        const deduped = this.dedupeApplications(activeApps);
        const statsMap: { [key: string]: number } = {};
        deduped.forEach(app => {
          const company = app.drive?.companyName || 'Unknown';
          statsMap[company] = (statsMap[company] || 0) + 1;
        });
        this.topCompanies = Object.entries(statsMap)
          .map(([companyName, appliedCount]) => ({ companyName, appliedCount }))
          .sort((a, b) => b.appliedCount - a.appliedCount)
          .slice(0, 5);
        this.barChartLabels = Object.keys(statsMap);
        this.barChartData = {
          labels: this.barChartLabels,
          datasets: [{
            label: 'Applications',
            data: Object.values(statsMap),
            backgroundColor: '#4f46e5'
          }]
        };
      },
      error: err => console.error('Failed to load company stats', err),
    });
  }

  applyFilters() {
    this.filteredApplications = this.applicationList.filter(app => {
      let match = true;
      if (this.filterStatus) match = match && app.status === this.filterStatus;
      if (this.filterCompany) match = match && app['drive']?.['companyName'] === this.filterCompany;
      if (this.filterDate) match = match && app['drive']?.['dateOfDrive'] === this.filterDate;
      return match;
    });
  }

  loadApplicationStatusSummary() {
    this.api.getUsers().subscribe({
      next: users => {
        this.users = users;
        const studentUsers = users.filter((r: any) =>
          r.roles?.some((role: any) => role.name === 'STUDENT')
        );
        this.totalUsers = studentUsers.length;
        this.api.getApplications().subscribe({
          next: applications => {
            const activeApps = this.filterOutCompleted(applications);
            const deduped = this.dedupeApplications(activeApps);
            const appliedStudents = new Set<number>();
            deduped.forEach(app => {
              if (app.status?.toUpperCase() === 'APPLIED' && app.student?.id) {
                appliedStudents.add(app.student.id);
              }
            });
            this.totalApplied = deduped.filter(app => app.status?.toUpperCase() === 'APPLIED').length;
            this.totalNotApplied = this.totalUsers - appliedStudents.size;
            this.pieChartData = {
              labels: ['Applied', 'Not Applied', 'Total Users'],
              datasets: [
                {
                  data: [this.totalApplied, this.totalNotApplied, this.totalUsers],
                  backgroundColor: ['#3f51b5', '#fbbc04', '#757575'],
                },
              ],
            };
          },
          error: err => console.error('Failed to load applications', err),
        });
      },
      error: err => console.error('Failed to load users', err),
    });
  }

  loadApplicationsByCompany(company: string) {
    this.api.getApplicationsByCompany(company).subscribe({
      next: data => {
        const activeApps = this.filterOutCompleted(data);
        const apps = activeApps.map(app => ({
          ...app,
          studentName: app.student?.fullName || 'N/A',
          studentEmail: app.student?.email || 'N/A'
        }));
        this.applicationList = apps;
        this.filteredApplications = [...apps];
        this.updateLineChart();
      },
      error: err => console.error('Failed to load applications by company', err),
    });
  }

  loadApplications() {
    this.api.getApplications().subscribe({
      next: data => {
        this.allApplications = data; // store full raw data here for export
        const activeApps = this.filterOutCompleted(data);
        const deduped = this.dedupeApplications(activeApps).map(app => ({
          ...app,
          studentName: app.student?.fullName || 'N/A',
          studentEmail: app.student?.email || 'N/A'
        }));
        this.applicationList = deduped;
        this.filteredApplications = [...deduped];
        this.updateLineChart();
      },
      error: err => console.error('Failed to load applications', err),
    });
  }

  updateLineChart() {
    const appsOverTime: { [date: string]: number } = {};
    this.applicationList.forEach(app => {
      const rawDate = app['drive']?.['dateOfDrive'];
      if (!rawDate) return;
      const date = new Date(rawDate).toLocaleDateString();
      if (!appsOverTime[date]) appsOverTime[date] = 0;
      appsOverTime[date]++;
    });
    this.lineChartLabels = Object.keys(appsOverTime);
    const data = Object.values(appsOverTime);
    this.lineChartData = {
      labels: this.lineChartLabels,
      datasets: [
        {
          label: 'Applications',
          data,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37,99,235,0.15)',
          fill: true,
          tension: 0.3,
          pointBackgroundColor: '#2563eb',
          pointBorderColor: '#fff',
          pointRadius: 5,
        },
      ],
    };
  }

  onCompanyClick(driveId: number, event: Event) {
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
