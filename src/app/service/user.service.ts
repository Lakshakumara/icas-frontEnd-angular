import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, firstValueFrom, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AuthServiceService } from './auth-service.service';
import { MessageResponse } from '../Model/messageResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = environment.baseUrl;

  constructor(private http: HttpClient, private auth: AuthServiceService) { }

  

  updateRoles(empNo: string, roles: string[]): Observable<MessageResponse> {
  return this.http
    .post<MessageResponse>(
      `${this.API_URL}/users/${empNo}/roles/update`,
      { roles }
    )
    .pipe(catchError(this.handleError));
}

private handleError(error: HttpErrorResponse): Observable<never> {
  let message = 'Unknown error';
  if (error.error instanceof ErrorEvent) {
    message = `Client error: ${error.error.message}`;
  } else if (error.error?.message) {
    message = error.error.message;
  } else {
    message = `Server error: ${error.status}`;
  }
  return throwError(() => new Error(message));
}

}
/*
async updateRolePromise(empNo: string, roles: string[]): Promise<MessageResponse> {
  return await firstValueFrom(this.updateRoles(empNo, roles));
}


private getHttpHeaders(): HttpHeaders {
  return new HttpHeaders({
    Authorization: `Bearer ${this.auth.getToken()}`,
    'Content-Type': 'application/json',
  });
}*/