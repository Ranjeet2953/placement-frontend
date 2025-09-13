import { Routes } from '@angular/router';
import { Home } from './home/home'; // login/register
import { Register } from './register/register';
import { StudentDashboard } from './student-dashboard/student-dashboard';
import { StudentProfile } from './student-profile/student-profile';
import { Drives } from './drives/drives';
import { AdminApplications } from './admin-applications/admin-applications';
import { AuthComponent } from './auth/auth';
import { AuthGuard } from './auth-guard/auth-guard';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AdminDrives } from './admin-drives/admin-drives';
import { AdminAddDrive } from './admin-add-drives/admin-add-drives';
import { AdminProfilePage } from './admin-profile-page/admin-profile-page';
import { AdminProfile } from './admin-profile/admin-profile';
import { AdminUsers } from './admin-users/admin-users';
import { AdminDriveDetails } from './admin-drive-details/admin-drive-details';

export const routes: Routes = [
  {
      path: 'admin',
      canActivate: [AuthGuard],
      children: [
        { path: 'dashboard', component: AdminDashboard },
        { path: 'drives', component: AdminDrives },
        { path: 'drives/add', component: AdminAddDrive },   // Use plural 'drives' here
        { path: 'admin-profile-page', component: AdminProfilePage },
        { path: 'applications', component: AdminApplications },
        { path: 'admin-profile', component: AdminProfile },
        { path: 'users', component: AdminUsers },
    { path: 'drives/:id', component: AdminDriveDetails },
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      ]
    },
  { path: '', component: Home },
  { path: 'login', component: AuthComponent },
  { path: 'register', component: AuthComponent },
  { path: 'dashboard', component: StudentDashboard },
  { path: 'profile', component: StudentProfile },
  { path: 'drives', component: Drives },
  { path: 'admin-application', component: AdminApplications },
  { path: '**', redirectTo: '' }
];
