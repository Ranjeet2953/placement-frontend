import { Routes } from '@angular/router';
import { Home } from './home/home'; // login/register
import { Register } from './register/register';
import { StudentDashboard } from './student-dashboard/student-dashboard';
import { StudentProfile } from './student-profile/student-profile';
import { Drives } from './drives/drives';
import { AuthComponent } from './auth/auth';
import { AuthGuard } from './auth-guard/auth-guard';

import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AdminDrives } from './admin-drives/admin-drives';
import { AdminAddDrive } from './admin-add-drives/admin-add-drives';
import { AdminProfilePage } from './admin-profile-page/admin-profile-page';
import { AdminProfile } from './admin-profile/admin-profile';
import { AdminUsers } from './admin-users/admin-users';
import { AdminApplications } from './admin-applications/admin-applications';
import { AdminDriveDetails } from './admin-drive-details/admin-drive-details';
import { AdminEditDrive } from './admin-edit-drive/admin-edit-drive';


export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'drives', component: AdminDrives },
      { path: 'drives/add', component: AdminAddDrive },
      { path: 'admin-profile-page', component: AdminProfilePage },
      { path: 'applications', component: AdminApplications },
      { path: 'admin-profile', component: AdminProfile },
      { path: 'users', component: AdminUsers },
      

      { path: 'drives/:id', component: AdminDriveDetails },
      { path: 'drives/edit/:id', component: AdminEditDrive },
 // Drive details route
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  },
  { path: '', component: Home },
  { path: 'login', component: AuthComponent },
  { path: 'register', component: AuthComponent },

  { path: 'dashboard', component: StudentDashboard, canActivate: [AuthGuard] },
  { path: 'profile', component: StudentProfile, canActivate: [AuthGuard] },
  { path: 'drives', component: Drives, canActivate: [AuthGuard] },
  { path: 'admin-application', component: AdminApplications, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
