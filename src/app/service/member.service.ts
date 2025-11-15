import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Registration } from '../Model/registration';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private API_URL = environment.baseUrl;
  
    constructor(private http: HttpClient) { }

    getRegistration(empNo: string, year: number): Observable<Registration> {
        return this.http
          .get<Registration>(
            `${this.API_URL}/member/registration/${empNo}/${year}`
          )
      }
}
