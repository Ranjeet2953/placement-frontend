import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class Api {
  baseUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(this.baseUrl + '/auth/register', data, { withCredentials: true });
  }
  login(data: any) {
    return this.http.post(this.baseUrl + '/auth/login', data, { withCredentials: true });
  }
  logout() {
    return this.http.post(this.baseUrl + '/auth/logout', {}, { withCredentials: true });
  }
  getMe() {
    return this.http.get(this.baseUrl + '/auth/me', { withCredentials: true });
  }
  getProfile() {
    return this.http.get(this.baseUrl + '/student/profile', { withCredentials: true });
  }
  updateProfile(data: any) {
    return this.http.put(this.baseUrl + '/student/profile', data, { withCredentials: true });
  }
  uploadResume(data: FormData) {
    return this.http.post(this.baseUrl + '/student/profile/resume', data, { withCredentials: true });
  }
  getDrives() {
    return this.http.get<any[]>(this.baseUrl + '/drives', { withCredentials: true });
  }
  applyToDrive(driveId: number) {
    return this.http.post(this.baseUrl + `/drives/${driveId}/apply`, {}, { withCredentials: true });
  }
  getStudentApplications() {
    return this.http.get<any[]>(this.baseUrl + '/student/applications', { withCredentials: true });
  }
}
