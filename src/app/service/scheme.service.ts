import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Scheme, SchemeTitles } from '../Model/scheme';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SchemeService {
  private serviceUrl = environment.baseUrl + '/admin/scheme';

  constructor(private http: HttpClient) {}

  getSchemeTitle(category: string): Observable<SchemeTitles[]> {
    return this.http
      .get<{ token: string }>(`${this.serviceUrl}/titles/${category}`)
      .pipe<SchemeTitles[]>(map((data: any) => data));
  }
  getScheme(category: string): Observable<Scheme[]> {
    return this.http
      .get<{ token: string }>(`${this.serviceUrl}/${category}`)
      .pipe<Scheme[]>(map((data: any) => data));
  }

  updateScheme(scheme: Scheme): Observable<Scheme> {
    return this.http.patch<Scheme>(`${this.serviceUrl}/${scheme.id}`, scheme);
  }

  addScheme(scheme: Scheme): Observable<Scheme> {
    return this.http.post<Scheme>(`${this.serviceUrl}/add`, scheme);
  }

  deleteScheme(id: number): Observable<Scheme> {
    return this.http.delete<Scheme>(`${this.serviceUrl}/${id}`);
  }
}