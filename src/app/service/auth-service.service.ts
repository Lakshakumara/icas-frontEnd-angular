import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, lastValueFrom, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Member } from '../Model/member';
import { catchError, map } from 'rxjs/operators';
import { Dependant } from '../Model/dependant';
import { Claim } from '../Model/claim';
import { ClaimData } from '../Model/claimData';
import { Utils } from '../util/utils';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {

  private API_URL = environment.baseUrl;

  constructor(private http: HttpClient) { }

  checkMember(empNo: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.API_URL}/auth/check-member/${empNo}`);
  }

  validateToken(): Observable<boolean> {
    console.log("validate")
    const token = this.getToken();
    if (!token) return of(false);

    return this.http.get<{ valid: boolean }>(`${this.API_URL}/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    }).pipe(
      map(response => response.valid),
      catchError(() => of(false))
    );
  }

  saveToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  isDefaultPassword(): boolean {
    const decodedToken1 = this.decodeToken();
    if (decodedToken1) return decodedToken1.defaultPassword;
    else return false;
  }
  getRoles(): string[] {
    const decodedToken1 = this.decodeToken();
    if (decodedToken1?.roles) return decodedToken1.roles.map((r: any) => r.authority);
    else return [];
  }

  decodeToken(): any {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken;
    } else return null; // or undefined
  }

  // Check if the user has a specific role
  hasRole(role: string): boolean {
    const roles = this.getRoles();
    return roles.includes(role);
  }
  public hasAnyRole(...checkRoles: string[]): boolean {
    const roles = this.getRoles();
    return checkRoles.some((role) => roles.includes(role));
  }
  // Remove JWT token from localStorage (logout)
  logout() {
    localStorage.removeItem('jwtToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.http.post<{ token: string }>(
      `${this.API_URL}/auth/change-default-password`,
      {
        oldPassword,
        newPassword,
      }
    );
  }

  forgotPassword(email: any) {
    console.log("reset ", email)
    return this.http.post(
      `${this.API_URL}/auth/forgot-password`,
      {
        email,
      }
    );
  }

  resetPassword(token: string, newPassword: string) {
    return this.http.post<{ token: string }>(
      `${this.API_URL}/auth/reset-password`,
      {
        token,
        newPassword,
      }
    );
  }
  getMemberNew(empNo: any): Observable<Member> {
    return this.http
      .get<Member>(
        `${this.API_URL}/member/${empNo}`
      )
  }

  login(empNo: string, password: string): any {
    return this.http.post(`${this.API_URL}/auth/login`, {
      empNo,
      password,
    });
  }

  getMembers(
    searchFor: string,
    searchText: any,
    filter: string,
    sortDirection: string = 'asc',
    pageIndex: number = 0,
    pageSize: number = 10,
    sortField: string = ''
  ) {
    return this.http
      .get<{ token: string }>(`${this.API_URL}/member/get`, {
        params: new HttpParams()
          .set('searchFor', searchFor)
          .set('searchText', searchText)
          .set('filter', filter)
          .set('sortOrder', sortDirection)
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
          .set('sortField', sortField),
      })
      .pipe<any[]>(map((res: any) => res));
  }

  getRelationShip(rs: string): Observable<string[]> {
    return this.http
      .get<{ token: string }>(`${this.API_URL}/member/relationship/${rs}`)
      .pipe<string[]>(map((data: any) => data));
  }

  update(criteria: string, data: any): Observable<number> {
    const x = this.http
      .put<{ token: string }>(`${this.API_URL}/member/update/${criteria}`, data)
      .pipe<number>(map((data: any) => data));
    return x;
  }
  //updateMember revised woking code remove above segment
  async updateMember(criteria: string, data: any): Promise<any> {
    const response = await fetch(`${this.API_URL}/member/update/${criteria}`, {
      method: 'put',
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Attach JWT token
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  }

  async registerNew(data: any): Promise<any> {
    const response = await fetch(`${this.API_URL}/member/signup`, {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Attach JWT token
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  }

  getDependant(name: any): Observable<any> {
    return this.http
      .get<{ token: string }>(`${this.API_URL}/dependant/${name}`)
      .pipe<Dependant>(map((data: any) => data));
  }

  async getMemberDependants(
    empNo: string,
    year: number = Utils.currentYear,
    depName: string | null = ''
  ): Promise<any> {
    const response = await fetch(
      `${this.API_URL}/member/dependant/${year}/${empNo}/${depName}`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Attach JWT token
        'Content-Type': 'application/json',
      },
    }
    );
    return await response.json();
  }

  async getMemberBeneficiaries(
    empNo: string,
    year: number = Utils.currentYear,
    benName: string | null = ''
  ): Promise<any> {
    const response = await fetch(
      `${this.API_URL}/member/beneficiaries/${year}/${empNo}/${benName}`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Attach JWT token
        'Content-Type': 'application/json',
      },
    }
    );
    return await response.json();
  }

  async getHRDetailsNew(empNo: any): Promise<any> {
    const response = await fetch(`${this.API_URL}/hr/${empNo}`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Attach JWT token
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  }

  /**
   *
   * @param claimType '' for any
   * @param year
   * @param empNo '' for any
   * @param claimStatus '' for any
   * @param filter
   * @param sortDirection
   * @param pageIndex
   * @param pageSize
   * @returns
   */
  getAllClaims(
    claimType: string = '',
    year: number = 0,
    empNo: string = '',
    claimStatus: string = '',
    filter: string = '',
    sortDirection: string = 'asc',
    pageIndex: number = 0,
    pageSize: number = 10,
    sortField: string = '',
    department: string = ''
  ): Observable<any> {
    return this.http
      .get<{ token: string }>(`${this.API_URL}/claim/getAll`, {
        params: new HttpParams()
          .set('claimType', claimType)
          .set('year', year)
          .set('empNo', empNo)
          .set('claimStatus', claimStatus)
          .set('filter', filter)
          .set('sortOrder', sortDirection)
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
          .set('sortField', sortField)
          .set('department', department),
      })
      .pipe<any>(map((res: any) => res));
  }

  getDepHeadClaims(
    department: string,
    filter: string = '',
    sortDirection: string = 'asc',
    pageIndex: number = 0,
    pageSize: number = 10,
    sortField: string = ''
  ): Observable<any> {
    return this.getAllClaims(
      '',
      0,
      '',
      'pending',
      filter,
      sortDirection,
      pageIndex,
      pageSize,
      sortField,
      department
    );
  }

  getHistoryMain(empNo: string): Observable<any> {
    return this.http
      .get<{ token: string }>(`${this.API_URL}/claim/history/summary`, {
        params: new HttpParams().set('empNo', empNo),
      })
      .pipe<any[]>(map((res: any) => res));
  }

  /**
   *
   * @param empNo
   * @param idText
   * @param sortDirection
   * @param pageIndex
   * @param pageSize
   * @param sortField
   * @returns Pageable Object
   */
  getClaimHistory(
    empNo: string,
    idText: any = null,
    sortDirection: string = 'asc',
    pageIndex: number = 0,
    pageSize: number = 50,
    sortField: string = ''
  ): Observable<any> {
    return this.http
      .get<{ token: string }>(`${this.API_URL}/claim/history`, {
        params: new HttpParams()
          .set('empNo', empNo)
          .set('idText', idText)
          .set('sortOrder', sortDirection)
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
          .set('sortField', sortField),
      })
      .pipe<any[]>(map((res: any) => res));
  }
  getClaimHistoryAll(
    empNo: string,
    idText: any = null,
    sortDirection: string = 'asc',
    pageIndex: number = 0,
    pageSize: number = 50,
    sortField: string = ''
  ): Observable<any> {
    return this.http
      .get<{ token: string }>(`${this.API_URL}/claim/history/all`, {
        params: new HttpParams()
          .set('empNo', empNo)
          .set('idText', idText)
          .set('sortOrder', sortDirection)
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
          .set('sortField', sortField),
      })
      .pipe<any[]>(map((res: any) => res));
  }

  getClaimData(
    claimId: number,
    pageIndex: number = 0,
    pageSize: number = 10,
    sortDirection: string = 'asc',
    sortField: string = ''
  ): Observable<ClaimData[]> {
    return this.http
      .get<{ token: string }>(`${this.API_URL}/claim/claimData`, {
        params: new HttpParams()
          .set('claimId', claimId)
          .set('sortOrder', sortDirection)
          .set('pageIndex', pageIndex.toString())
          .set('pageSize', pageSize.toString())
          .set('sortField', sortField),
      })
      .pipe<ClaimData[]>(map((res: any) => res));
  }

  /**
   *
   * @param claimType
   * @param year 0 for neglect year
   * @param empNo '' for neglect Members
   * @param claimStatus
   * @param filter
   * @param sortDirection
   * @param pageIndex
   * @param pageSize
   * @returns
   */

  async getClaim(claimId: number): Promise<Observable<Claim>> {
    return await fetch(`${this.API_URL}/claim/get/${claimId}`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Attach JWT token
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((responseJson: any) => {
        /*responseJson
        .pipe(
          tap((receivedData: Claim) => console.log(receivedData)),
          map((receivedData: Claim) => {
            console.log(receivedData.claimData)
            return receivedData;
          }));*/
        //console.log('auth getClaims ', responseJson);
        return responseJson;
      })
      .catch((error) => {
        return null; //new Error(error);
      });
  }

  async getClaimNew(claimId: number): Promise<any> {
    const response = await fetch(`${this.API_URL}/claim/get/${claimId}`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Attach JWT token
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  }

  async addClaim(claim: any): Promise<Observable<any>> {
    return await fetch(`${this.API_URL}/claim/add`, {
      method: 'post',
      body: JSON.stringify(claim), // data can be `string` or {object}!
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Attach JWT token
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((responseJson) => {
        //console.log('auth res ', responseJson);
        return responseJson;
      })
      .catch((error) => {
        return new Error(error);
      });
  }

  async updateClaim_new(claim: any) {
    const response = await fetch(`${this.API_URL}/claim/update`, {
      method: 'put',
      body: JSON.stringify(claim),
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Attach JWT token
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }

  async deleteClaimData(id: number): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.API_URL}/claim/claimData/delete/${id}`,
        {
          method: 'delete',
          headers: {
            Authorization: `Bearer ${this.getToken()}`, // Attach JWT token
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.ok) return response.json();
      else throw Error('Error deleting Item');
    } catch (error) {
      throw Error('Failed to communicate');
    }
  }

  getDashboardData(year: number, empNo: string): any {
    return this.http
      .get<{ token: string }>(`${this.API_URL}/claim/dashboard/${year}/${empNo}`)
      .pipe<Claim[]>(map((data: any) => data));
  }

  async getVouchers(): Promise<number[]> {
    try {
      const response = await fetch(`${this.API_URL}/claim/voucherIds`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.getToken()}`, // Attach JWT token
            'Content-Type': 'application/json',
          },
        });
      if (response.ok) return response.json();
      else throw Error('Error getting Voucher');
    } catch (error) {
      throw Error('Failed to Fetch data');
    }
  }

  async saveHR(data: any): Promise<any> {
    const response = await fetch(`${this.API_URL}/hr/add`, {
      method: 'post',
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Attach JWT token
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  }

  download(type: number, year: any, empNo: string): Observable<any> {
    const token = this.getToken(); // Retrieve token
    return this.http
      .get(`${this.API_URL}/download/application/${year}/${empNo}`, {
        responseType: 'blob',
        observe: 'response',
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`, // Add token
        }),
      })
      .pipe(
        map((response) => {
          //console.log("response ", response)
          if (response.status !== 200) {
            throw new HttpErrorResponse({
              error: response.body,
              status: response.status,
            });
          }
          return response.body!;
        }),
        catchError(this.handleError)
      );
  }

  async downloadNew(type: number, year: any, empNo: string): Promise<any> {
    const response = await fetch(
      `${this.API_URL}/download/application/${year}/${empNo}`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Attach JWT token
        'Content-Type': 'application/json',
      },
    }
    );
    return await response.blob();
  }

  directDownload(url: string, version: string): Observable<any> {
    return this.http.get(`${this.API_URL}/download/${url}/${version}`, {
      responseType: 'blob',
    });
  }
  directDownloadx(url: string, version: string): Promise<any> {
    return lastValueFrom(
      this.http.get(`${this.API_URL}/download/${url}/${version}`, {
        responseType: 'blob',
      })
    );
  }

  async downloadClaim(claimId: number) {
    try {
      const response = await fetch(
        `${this.API_URL}/download/application/opd/${claimId}`, {
        method: 'get',
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      }
      );
      if (response.ok) return response.blob();
      else throw Error('Error generating pdf');
    } catch (error) {
      throw Error('Failed to Fetch data');
    }
  }

  async downloadVoucher(voucherId: number) {
    try {
      const response = await fetch(
        `${this.API_URL}/download/voucher/${voucherId}`, {
        method: 'get',
        headers: {
          Authorization: `Bearer ${this.getToken()}`, // Attach JWT token
          'Content-Type': 'application/json',
        },
      }
      );
      if (response.ok) return response.blob();
      else throw Error('Error generating pdf');
    } catch (error) {
      throw Error('Failed to Fetch data');
    }
  }

  async findRoles(empNo: string): Promise<any> {
    const response = await fetch(`${this.API_URL}/users/${empNo}/roles/get`, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.getToken()}`, // Attach JWT token
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof Blob) {
      return new Observable<string>((observer) => {
        const reader = new FileReader();
        reader.onload = () => {
          observer.error(reader.result as string);
          observer.complete();
        };
        reader.onerror = () => {
          observer.error('Unknown error!');
          observer.complete();
        };
        reader.readAsText(error.error);
      });
    } else {
      return throwError(() => new Error(error.message || 'Unknown error!'));
    }
  }
}