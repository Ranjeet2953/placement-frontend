import { Routes } from '@angular/router';
import { Home } from './home/home'; // login/register
import { Register } from './register/register';
import { StudentDashboard } from './student-dashboard/student-dashboard';
import { StudentProfile } from './student-profile/student-profile';
import { Drives } from './drives/drives';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Home },
  { path: 'register', component: Register },
  { path: 'dashboard', component: StudentDashboard },
  { path: 'profile', component: StudentProfile },
  { path: 'drives', component: Drives },
  { path: '**', redirectTo: '' }
];
